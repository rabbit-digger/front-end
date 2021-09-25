import { useEffect } from 'react'
import { useCallback } from 'react'
import { FetchError, useDeleteUserdata, usePostConfig, usePutUserdata, useUserdata } from '../../rdp'
import { v4 } from 'uuid'

export const Index = 'index.json'
export type ProfileType = {
  filename: string
  displayName: string
  createdAt: string
  updatedAt: string
}
export type IndexType = {
  profile?: ProfileType[]
}
export const DefaultIndex: IndexType = {
  profile: []
}

const now = () => new Date().toISOString()

export const useProfile = () => {
  const { data, error, mutate } = useUserdata(Index)
  const put = usePutUserdata()
  const del = useDeleteUserdata()
  const postConfig = usePostConfig()
  const index = (typeof data?.content === 'string') ? (JSON.parse(data.content) as IndexType) : undefined

  const newProfile = useCallback(async () => {
    if (!index) return

    let displayName = `Profile`
    for (let newDisplayNameId = 1; newDisplayNameId < Infinity; newDisplayNameId++) {
      if (index.profile?.find(i => i.displayName === `Profile-${newDisplayNameId}`) === undefined) {
        displayName = `Profile-${newDisplayNameId}`
        break
      }
    }
    const filename = `${v4()}.yaml`
    await put(filename, '')
    await put(Index, JSON.stringify({
      ...index,
      profile: [
        ...index.profile ?? [],
        {
          filename,
          displayName,
          createdAt: now(),
          updatedAt: now(),
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
    await postConfig(filename)
    mutate()
  }, [mutate, postConfig])

  const editByFilename = useCallback(async (filename: string, value: Partial<ProfileType>) => {
    if (!index) return
    const profile = index.profile ?? []
    let id = profile.findIndex(i => i.filename === filename)
    if (id !== -1) {
      const newProfile = [...profile.slice(0, id), {
        ...profile[id],
        ...value,
        updatedAt: now()
      }, ...profile.slice(id + 1)]
      const newIndex = {
        ...index,
        profile: newProfile,
      }
      await put(Index, JSON.stringify(newIndex))
      mutate()
    }
  }, [index, put, mutate])

  const editProfile = useCallback(async (filename: string, content: string) => {
    await put(filename, content)
    await editByFilename(filename, {})
  }, [put, editByFilename])

  const renameProfile = useCallback((filename: string, displayName: string) => editByFilename(filename, {
    displayName,
  }), [editByFilename])

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
    renameProfile,
    profile: index?.profile ?? [],
    error,
    index,
  } as const
}
