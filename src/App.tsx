import React, { useState, useEffect } from "react"
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Grid,
  Button,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { getProxy, setProxy } from "./command"
import { Sidebar } from "./components/Sidebar"
import { Header } from "./components/Header"


const smVariant = { navigation: 'drawer', navigationButton: true } as const
const mdVariant = { navigation: 'sidebar', navigationButton: false } as const


export const App = () => {
  const [result, setResult] = useState('pending...')
  const { isOpen, onToggle } = useDisclosure()
  const variants = useBreakpointValue({ base: smVariant, md: mdVariant })

  useEffect(() => {
    getProxy().then(r => setResult(JSON.stringify(r)))
  }, [])
  return <>
    <Sidebar
      variant={variants?.navigation ?? 'drawer'}
      isOpen={isOpen}
      onClose={onToggle}
    />
    <Box ml={!variants?.navigationButton ? 200 : undefined}>
      <Header
        showSidebarButton={variants?.navigationButton}
        onShowSidebar={onToggle}
      />
    </Box>
  </>
}
