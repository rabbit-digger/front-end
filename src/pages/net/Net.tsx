import { Box, Grid } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useRdp } from '../../rdp'
import { RabbitDiggerProConfig } from '../../rdp/types'
import { useTitle } from '../index/Index'

export const Net: React.FC = () => {
  const [config, setConfig] = useState<RabbitDiggerProConfig | undefined>(undefined)
  useTitle('Net')
  const rdp = useRdp()
  useEffect(() => { rdp.getConfig().then(setConfig) }, [rdp])
  const netList = config?.net ? Object.entries(config.net) : undefined


  return <>
    <Box>I'm Net page</Box>
    <Grid>
      {netList?.map(([k, v]) => <Box key={k}>{k} {v?.type}</Box>)}
    </Grid>
  </>
}
