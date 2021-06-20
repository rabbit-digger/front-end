import { useCallback, useEffect, useState } from 'react'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

export const useTimeAgo = () => {
  const [, refresh] = useState(false)
  useEffect(() => {
    // refresh the page every 10s
    const id = setInterval(() => refresh(i => !i), 10 * 1000)
    return () => clearInterval(id)
  }, [])

  // ISO string
  return useCallback((date: string) => {
    return timeAgo.format(new Date(date))
  }, [])
}
