import React, { useEffect } from 'react'
import { FetchError, usePutUserdata, useUserdata } from '../../rdp'
import { useTitle } from '../index/Index'

const Index = 'index.json'
type IndexType = {
  profile?: string[]
}
const DefaultIndex: IndexType = {
  profile: []
}

export const Profile: React.FC = () => {
  useTitle('Profile')
  const { data, error, isValidating, mutate } = useUserdata(Index)
  const put = usePutUserdata()
  console.log('index', data, error, isValidating)
  useEffect(() => {
    if (error instanceof FetchError && error.res.status === 404) {
      put(Index, JSON.stringify(DefaultIndex)).then(() => mutate())
    }
  }, [error, put, mutate])
  return <>
    I'm Profile page
  </>
}
