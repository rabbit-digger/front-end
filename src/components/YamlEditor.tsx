import React, { useState } from 'react'
import { useEffect } from 'react'
import MonacoEditor from 'react-monaco-editor'

const Style: React.CSSProperties = {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
}

export const YamlEditor: React.FC<{ filename: string, value: string }> = () => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [div, setDiv] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!div) return
    const reset = () => {
      setWidth(div.clientWidth)
      setHeight(div.clientHeight)
    }
    reset()
    const observer = new ResizeObserver(reset)
    observer.observe(div)

    return () => observer.disconnect()
  }, [div])

  return <div ref={setDiv} style={Style}>
    <MonacoEditor
      width={width}
      height={height}
      language='yaml'
      options={{
        tabSize: 2,
      }}
    />
  </div>
}
