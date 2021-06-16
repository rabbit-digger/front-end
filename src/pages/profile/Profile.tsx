import { DeleteIcon } from '@chakra-ui/icons'
import { VStack, HStack, Box, Button, Divider, IconButton } from '@chakra-ui/react'
import React from 'react'
import { useTitle } from '../index/Index'
import { ProfileType, useProfile } from './useProfile'

const ProfileItem: React.FC<{ profile: ProfileType }> = ({ profile: { filename } }) => {
  const { deleteProfile } = useProfile()

  return <HStack justify='space-between' w='100%'>
    <Box>{filename}</Box>
    <IconButton aria-label="Delete profile" icon={<DeleteIcon />} onClick={() => deleteProfile(filename)} />
  </HStack>
}

export const Profile: React.FC = () => {
  useTitle('Profile')
  const { error, index, newProfile } = useProfile()
  return <>
    {error && String(error)}
    <VStack align='start'>
      <HStack width='100%' justify='space-between'><Box /><Box>
        <Button variant='solid' onClick={newProfile} disabled={!index}>New</Button>
      </Box></HStack>
      <Divider />
      {(index?.profile ?? []).map((i, id) => <ProfileItem key={id} profile={i} />)}
    </VStack>
  </>
}
