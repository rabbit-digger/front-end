import { useDisclosure, useBreakpointValue, Box, Flex } from '@chakra-ui/react'
import React from 'react'
import { Header } from '../../components/Header'
import { Sidebar } from '../../components/Sidebar'

const smVariant = { navigation: 'drawer', navigationButton: true } as const
const mdVariant = { navigation: 'sidebar', navigationButton: false } as const

export const Index: React.FC = ({ children }) => {
  const { isOpen, onToggle } = useDisclosure()
  const variants = useBreakpointValue({ base: smVariant, md: mdVariant })

  return <Box
    bg='teal.600'
    h='100vh'
    color='white'
  >
    <Flex w='100%' h='100%'>
      <Sidebar
        variant={variants?.navigation ?? 'drawer'}
        isOpen={isOpen}
        onClose={onToggle}
      />
      <Flex flexDirection='column' w='0' flex='auto'>
        <Box>
          <Header
            showSidebarButton={variants?.navigationButton}
            onShowSidebar={onToggle}
          />
        </Box>
        <Box bg='white' h='100%' borderRadius='5'>
          {children}
        </Box>
      </Flex>
    </Flex>
  </Box>
}
