import { DeleteIcon, EditIcon, CheckIcon } from '@chakra-ui/icons'
import { VStack, HStack, Box, Button, Divider, IconButton } from '@chakra-ui/react'
import React from 'react'
import { useTitle } from '../index/Index'
import { ProfileType, useProfile } from './useProfile'

const ProfileItem: React.FC<{ profile: ProfileType }> = ({ profile: { filename } }) => {
  const { deleteProfile } = useProfile()

  return <HStack
    justify='space-between'
    w='100%'
    p={2}
    _hover={{
      cursor: 'pointer',
      bg: 'blackAlpha.200',
    }}
  >
    <HStack>
      <Box>{filename}</Box>
      <CheckIcon color='green' />
    </HStack>
    <HStack>
      <IconButton aria-label="Delete profile" size='sm' icon={<EditIcon />} />
      <IconButton aria-label="Delete profile" size='sm' icon={<DeleteIcon />} onClick={() => deleteProfile(filename)} />
    </HStack>
  </HStack>
}

export const Profile: React.FC = () => {
  useTitle('Profile')
  const { error, index, newProfile } = useProfile()
  return <>
    {error && String(error)}
    <VStack align='start' divider={<Divider />} spacing={0}>
      <HStack width='100%' justify='space-between' p={2}><Box /><Box>
        <Button variant='solid' onClick={newProfile} disabled={!index}>New</Button>
      </Box></HStack>
      {(index?.profile ?? []).map((i, id) => <ProfileItem key={id} profile={i} />)}
    </VStack>
  </>
}
