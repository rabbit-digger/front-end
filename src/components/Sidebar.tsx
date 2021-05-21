import React from 'react'
import {
  Box,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerContent,
  VStack,
  Link as ChakraLink,
  LinkProps,
} from '@chakra-ui/react'
import { Link as RRLink, LinkProps as RRLinkProps } from 'react-router-dom'

const Link: React.FC<LinkProps & RRLinkProps> = ({ children, ...props }) => {
  return <ChakraLink
    {...props}
    p={3}
    mb={5}
    as={RRLink}
    w='100%'
    textAlign='center'
  >{children}</ChakraLink>
}

interface Props {
  onClose: () => void
  isOpen: boolean
  variant: 'drawer' | 'sidebar'
}

const SidebarContent = ({ onClick }: { onClick: () => void }) => (
  <VStack>
    <Box h='40px'>
      Realtime
    </Box>
    <Link to='/net'>Net</Link>
    <Link to='/profile'>Profile</Link>
    <Link to='/settings'>Settings</Link>
  </VStack>
)

export const Sidebar = ({ isOpen, variant, onClose }: Props) => {
  return variant === 'sidebar' ? (
    <Box
      p={5}
      w="200px"
      h="100%"
    >
      <SidebarContent onClick={onClose} />
    </Box>
  ) : (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent
          bg='teal.600'
          color='white'
        >
          <DrawerCloseButton />
          <DrawerBody>
            <SidebarContent onClick={onClose} />
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  )
}
