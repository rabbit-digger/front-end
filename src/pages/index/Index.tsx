import { useDisclosure, useBreakpointValue, Box, Flex } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import { Header } from '../../components/Header'
import { Sidebar } from '../../components/Sidebar'
import { useRdpState } from '../../rdp'

const TitleCtx = React.createContext<(title: string) => void>(() => void 0)
export const useTitle = (title: string) => {
  const setTitle = useContext(TitleCtx)
  useEffect(() => {
    setTitle(title)
  }, [setTitle, title])
}

const smVariant = { navigation: 'drawer', navigationButton: true } as const
const mdVariant = { navigation: 'sidebar', navigationButton: false } as const

export const Index: React.FC = ({ children }) => {
  const { isOpen, onToggle } = useDisclosure()
  const [title, setTitle] = useState('Rabbit digger')
  const variants = useBreakpointValue({ base: smVariant, md: mdVariant })
  const { data } = useRdpState()

  return <Box
    bg='teal.500'
    h='100vh'
    color='white'
  >
    <Flex w='100%' h='100%'>
      <Sidebar
        variant={variants?.navigation ?? 'drawer'}
        isOpen={isOpen}
        onClose={onToggle}
        banner={<>{data}</>}
      />
      <Flex flexDirection='column' w='0' flex='auto'>
        <Box>
          <Header
            title={title}
            showSidebarButton={variants?.navigationButton}
            onShowSidebar={onToggle}
          />
        </Box>
        <Box bg='white' p={2} color='black' h='100%' borderRadius='5' overflowY='auto'>
          <TitleCtx.Provider value={setTitle}>
            {children}
          </TitleCtx.Provider>
        </Box>
      </Flex>
    </Flex>
  </Box>
}
