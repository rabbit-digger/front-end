import { useEffect } from 'react'
import { useCallback } from 'react'
import { FetchError, useDeleteUserdata, useFetchUserdata, usePostConfig, usePutUserdata, useUserdata } from '../../rdp'
import { RabbitDiggerConfig } from '../../rdp/types'
import * as YAML from 'yaml'

export const Index = 'index.json'
export type ProfileType = {
  filename: string
  createdAt: string
  updatedAt: string
}
export type IndexType = {
  profile?: ProfileType[]
}
export const DefaultIndex: IndexType = {
  profile: []
}

export const useProfile = () => {
  const { data, error, mutate } = useUserdata(Index)
  const put = usePutUserdata()
  const del = useDeleteUserdata()
  const fetchUserdata = useFetchUserdata()
  const postConfig = usePostConfig()
  const index = (typeof data?.body === 'string') ? (JSON.parse(data.body) as IndexType) : undefined

  const newProfile = useCallback(async () => {
    if (!index) return

    let filename = `Profile.yaml`
    for (let newFilenameId = 1; newFilenameId < Infinity; newFilenameId++) {
      if (index.profile?.find(i => i.filename === `Profile-${newFilenameId}.yaml`) === undefined) {
        filename = `Profile-${newFilenameId}.yaml`
        break
      }
    }
    await put(filename, '')
    await put(Index, JSON.stringify({
      ...index,
      profile: [
        ...index.profile ?? [],
        {
          filename,
          createdAt: new Date().toDateString(),
          updatedAt: new Date().toDateString(),
        }
      ]
    } as IndexType))
    mutate()
  }, [index, put, mutate])

  const deleteProfile = useCallback(async (filename: string) => {
    if (!index) return

    await del(filename)
    await put(Index, JSON.stringify({
      ...index,
      profile: index.profile?.filter(i => i.filename !== filename) ?? [],
    } as IndexType))
    mutate()
  }, [index, del, put, mutate])

  const selectProfile = useCallback(async (filename: string) => {
    const config = YAML.parse(await fetchUserdata(filename)) as RabbitDiggerConfig
    await postConfig({
      id: filename,
      config,
    })
    mutate()
  }, [mutate, postConfig, fetchUserdata])

  const editProfile = useCallback(() => { }, [])

  useEffect(() => {
    if (error instanceof FetchError && error.res.status === 404) {
      put(Index, JSON.stringify(DefaultIndex)).then(() => mutate())
    }
  }, [error, put, mutate])

  return {
    newProfile,
    deleteProfile,
    selectProfile,
    editProfile,
    profile: index?.profile ?? [],
    error,
    index,
  } as const
}
