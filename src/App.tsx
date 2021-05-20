import React, { useState, useEffect } from "react"
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Grid,
  theme,
  Button,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { getProxy, setProxy } from "./command"

export const App = () => {
  const [result, setResult] = useState('pending...')

  useEffect(() => {
    getProxy().then(r => setResult(JSON.stringify(r)))
  }, [])
  return <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <VStack spacing={8}>
          <Button onClick={() => setProxy('Disabled')}>Disable proxy</Button>
          <Button onClick={() => setProxy({ Enabled: { address: '127.0.0.1:12345' } })}>Enable proxy</Button>
          <Button onClick={() => getProxy().then(r => setResult(JSON.stringify(r)))}>Get Proxy</Button>
          <Text>
            Command result: {result}.
          </Text>
          <Link
            color="teal.500"
            href="https://github.com/rabbit-digger/"
            fontSize="2xl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </Link>
        </VStack>
      </Grid>
    </Box>
  </ChakraProvider>
}
