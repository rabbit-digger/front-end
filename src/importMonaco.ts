import * as monaco from 'monaco-editor'

const languages = monaco.languages

// @ts-ignore
window.monaco = {
  Range: monaco.Range,
  languages: monaco.languages,
  Emitter: monaco.Emitter,
  editor: monaco.editor,
}

export {
  languages
}
