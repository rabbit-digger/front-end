import { DeleteIcon, EditIcon, CheckIcon } from '@chakra-ui/icons'
import { VStack, HStack, Box, Button, Divider, IconButton, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter, Spinner } from '@chakra-ui/react'
import React from 'react'
import { useConfig, usePutUserdata, useUserdata } from '../../rdp'
import { useTitle } from '../index/Index'
import { ProfileType, useProfile } from './useProfile'
import { YamlEditor } from '../../components/YamlEditor'
import { useState } from 'react'
import { useEffect } from 'react'

const EditorDrawer: React.FC<{ filename: string, onClose: () => void }> = ({ filename, onClose }) => {
  const { data, mutate } = useUserdata(filename)
  const put = usePutUserdata()
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
        await put(filename, value)
        mutate()
        onClose()
      }}>Save</Button>
    </DrawerFooter>
  </>
}

const ProfileItem: React.FC<{ profile: ProfileType }> = ({ profile: { filename } }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { deleteProfile, selectProfile } = useProfile()
  const { data } = useConfig()

  return <HStack
    justify='space-between'
    w='100%'
    p={2}
    _hover={{
      cursor: 'pointer',
      bg: 'blackAlpha.200',
    }}
    onClick={() => selectProfile(filename)}
  >
    <Drawer
      isOpen={isOpen}
      placement="right"
      size="full"
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Edit {filename}</DrawerHeader>

        <EditorDrawer filename={filename} onClose={onClose} />
      </DrawerContent>
    </Drawer>
    <HStack>
      <Box>{filename}</Box>
      {data?.id === filename && <CheckIcon color='green' />}
    </HStack>
    <HStack>
      <IconButton
        aria-label="Edit profile"
        size='sm'
        icon={<EditIcon />}
        onClick={(e) => {
          e.stopPropagation()
          onOpen()
        }}
      />
      <IconButton
        aria-label="Delete profile"
        size='sm'
        icon={<DeleteIcon />}
        onClick={(e) => {
          e.stopPropagation()
          deleteProfile(filename)
        }}
      />
    </HStack>
  </HStack>
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
