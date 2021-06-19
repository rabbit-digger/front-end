import * as monaco from 'monaco-editor'
// @ts-ignore
import { YAMLWorker } from 'monaco-yaml/lib/esm/yamlWorker'

const languages = monaco.languages

// @ts-ignore
window.monaco = {
  Range: monaco.Range,
  languages: monaco.languages,
  Emitter: monaco.Emitter,
  MarkerSeverity: monaco.MarkerSeverity,
  editor: {
    ...monaco.editor,
    // hacking into monaco-yaml
    createWebWorker(opts: any) {
      console.log('create Worker', opts)
      const worker = new YAMLWorker({
        getMirrorModels() {
          return monaco.editor.getModels()
        }
      }, opts.createData)
      return {
        async getProxy() {
          return worker
        },
        async withSyncedResources() {
          // do nothing
        },
        dispose() {
          // do nothing
        }
      }
    }
  },
}

export {
  languages
}
