import { Box, Grid } from '@chakra-ui/react'
import React, { useCallback, useEffect } from 'react'
import { mutate } from 'swr'
import { useConfig, useEvent, usePost } from '../../rdp'
import { useTitle } from '../index/Index'

export const Net: React.FC = () => {
  useTitle('Net')
  const { data, error } = useConfig()
  const post = usePost()
  useEvent(useCallback(e => console.log('event', e), []))
  const netList = data?.net ? Object.entries(data.net) : undefined
  useEffect(() => {
    post('/api/config', {
      server: {
        "shit": {
          type: 'http+socks5',
          bind: '0.0.0.0:11221'
        }
      }
    })
  }, [post])

  return <>
    <Box>I'm Net page {String(error)}</Box>
    <Grid>
      {netList?.map(([k, v]) => <Box key={k}>{k} {v?.type}</Box>)}
    </Grid>
  </>
}
