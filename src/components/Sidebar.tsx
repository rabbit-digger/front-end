import React from 'react'
import {
  Box,
  Drawer,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerBody,
  DrawerContent,
  VStack,
  Link as ChakraLink,
  LinkProps,
} from '@chakra-ui/react'
import { Link as RRLink, LinkProps as RRLinkProps, matchPath, useLocation } from 'react-router-dom'

const Link: React.FC<Omit<LinkProps, 'to'> & RRLinkProps & { to: string }> = ({ children, to, ...props }) => {
  const { pathname } = useLocation()
  const selected = matchPath(pathname, to)
  return <ChakraLink
    {...props}
    to={to}
    p={3}
    as={RRLink}
    w='100%'
    textAlign='center'
    bg={selected ? 'blackAlpha.100' : undefined}
    _hover={{ textDecoration: 'none', bg: 'blackAlpha.200' }}
  >{children}</ChakraLink>
}

interface Props {
  onClose: () => void
  isOpen: boolean
  variant: 'drawer' | 'sidebar'
  banner?: React.ReactNode
}

const SidebarContent = ({ onClick, banner }: { onClick: () => void, banner?: React.ReactNode }) => (
  <VStack spacing={0}>
    <Box
      width='100%'
      h='62px'
    >
      {banner}
    </Box>
    <Link to='/net' onClick={onClick}>Net</Link>
    <Link to='/profile' onClick={onClick}>Profile</Link>
    <Link to='/settings' onClick={onClick}>Settings</Link>
  </VStack>
)

export const Sidebar = ({ isOpen, variant, onClose, banner }: Props) => {
  return variant === 'sidebar' ? (
    <Box
      w="200px"
      h="100%"
      bg='blackAlpha.100'
    >
      <SidebarContent onClick={onClose} banner={banner} />
    </Box>
  ) : (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size='xs'>
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
