import React from 'react'
import { Box, Center, IconButton, Text, Flex } from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'

interface Props {
  title?: React.ReactNode
  left?: React.ReactNode
  right?: React.ReactNode
  onShowSidebar: () => void
  showSidebarButton?: boolean
}

export const Header = ({ showSidebarButton = true, onShowSidebar, left, right, title }: Props) => {
  return (
    <Flex p={2} justifyContent="center">
      <Box flex="1" h={8}>
        {showSidebarButton && (
          <IconButton
            aria-label='Toggle Sidebar'
            icon={<HamburgerIcon w={8} h={8} />}
            colorScheme="white"
            onClick={onShowSidebar}
            size='sm'
          />
        )}
        {left}
      </Box>
      <Center flex="1" h={8}>
        <Text fontSize="xl">{title}</Text>
      </Center>
      <Box flex="1" h={8}>{right}</Box>
    </Flex>
  )
}
