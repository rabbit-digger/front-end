import { Box, Grid } from '@chakra-ui/react'
import React from 'react'
import { useConfig } from '../../rdp'
import { useTitle } from '../index/Index'

export const Select: React.FC = () => {
  useTitle('Select')
  const { data, error } = useConfig()
  const netList = data?.net ? Object.entries(data.net) : undefined

  return <>
    <Box>I'm Net page {String(error)}</Box>
    <Grid>
      {netList?.map(([k, v]) => <Box key={k}>{k} {v?.type}</Box>)}
    </Grid>
  </>
}
