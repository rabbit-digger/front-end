import { ChakraProvider, ColorModeScript, extendTheme, withDefaultColorScheme } from "@chakra-ui/react"
import * as React from "react"
import ReactDOM from "react-dom"
import { App } from "./App"
import reportWebVitals from "./reportWebVitals"
import * as serviceWorker from "./serviceWorker"
import { languages } from './importMonaco'
import 'monaco-yaml/lib/esm/monaco.contribution'
import schema from './rdp/jsonSchema.json'
import EditorWorker from 'worker-loader!monaco-editor/esm/vs/editor/editor.worker'
import YamlWorker from 'worker-loader!monaco-yaml/lib/esm/yaml.worker'

// @ts-ignore
window.MonacoEnvironment = {
  getWorker(workerId: string, label: string) {
    if (label === 'yaml') {
      return new YamlWorker();
    }
    return new EditorWorker();
  },
};

// @ts-ignore
languages.yaml.yamlDefaults.setDiagnosticsOptions({
  validate: true,
  enableSchemaRequest: true,
  hover: true,
  completion: true,
  schemas: [
    {
      fileMatch: ['*'],
      schema: {
        id: 'Config',
        ...schema,
      },
    },
  ]
})

const theme = extendTheme(withDefaultColorScheme({ colorScheme: "teal" }))

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript />
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root"),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
