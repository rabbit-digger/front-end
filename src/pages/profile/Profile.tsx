import { DeleteIcon, EditIcon, CheckIcon } from '@chakra-ui/icons'
import { VStack, HStack, Box, Button, Divider, IconButton, Text, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter, Spinner, Editable, EditablePreview, EditableInput } from '@chakra-ui/react'
import React from 'react'
import { useConfig, useUserdata } from '../../rdp'
import { useTitle } from '../index/Index'
import { ProfileType, useProfile } from './useProfile'
import { YamlEditor } from '../../components/YamlEditor'
import { useState } from 'react'
import { useEffect } from 'react'
import { useTimeAgo } from '../../hooks/useTimeAgo'

const EditorDrawer: React.FC<{ filename: string, onClose: () => void }> = ({ filename, onClose }) => {
  const { data, mutate } = useUserdata(filename)
  const { editProfile } = useProfile()
  const [value, setValue] = useState('')

  useEffect(() => {
    if (data) {
      setValue(data.body)
    }
  }, [data, setValue])

  return <>
    <DrawerBody>
      {data ? <YamlEditor filename={filename} value={value} onChange={setValue} /> : <Spinner />}
    </DrawerBody>

    <DrawerFooter>
      <Button variant="outline" mr={3} onClick={onClose}>
        Cancel
      </Button>
      <Button colorScheme="blue" disabled={!data} onClick={async () => {
        await editProfile(filename, value)
        mutate()
        onClose()
      }}>Save</Button>
    </DrawerFooter>
  </>
}

const ProfileItem: React.FC<{ profile: ProfileType }> = ({ profile: { filename, displayName, updatedAt } }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { deleteProfile, selectProfile, renameProfile } = useProfile()
  const { data } = useConfig()
  const display = displayName ?? filename
  const timeAgo = useTimeAgo()

  return <>
    <HStack
      justify='space-between'
      w='100%'
      p={2}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          selectProfile(filename)
        }
      }}
      _hover={{
        cursor: 'pointer',
        bg: 'blackAlpha.200',
      }}
    >
      <VStack alignItems='flex-start' spacing={0}>
        <HStack>
          <Editable defaultValue={display} flex='auto' onSubmit={(v) => renameProfile(filename, v)}>
            <EditablePreview />
            <EditableInput />
          </Editable>
          {data?.id === filename && <CheckIcon color='green' />}
        </HStack>
        <Text pointerEvents='none' userSelect='none' fontSize='sm'>
          Updated at {timeAgo(updatedAt)}
        </Text>
      </VStack>
      <HStack>
        <IconButton
          aria-label="Edit profile"
          icon={<EditIcon />}
          onClick={() => onOpen()}
        />
        <IconButton
          aria-label="Delete profile"
          icon={<DeleteIcon />}
          onClick={() => deleteProfile(filename)}
        />
      </HStack>
    </HStack>
    <Drawer
      isOpen={isOpen}
      placement="right"
      size="full"
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Edit {display}</DrawerHeader>

        <EditorDrawer filename={filename} onClose={onClose} />
      </DrawerContent>
    </Drawer>
  </>
}

export const Profile: React.FC = () => {
  useTitle('Profile')
  const { error, index, profile, newProfile } = useProfile()
  return <>
    {error && String(error)}
    <VStack align='start' divider={<Divider />} spacing={0}>
      <HStack width='100%' justify='space-between' p={2}><Box /><Box>
        <Button variant='solid' onClick={newProfile} disabled={!index}>New</Button>
      </Box></HStack>
      {profile.map((i, id) => <ProfileItem key={id} profile={i} />)}
    </VStack>
  </>
}
