import { languages } from './importMonaco'
import 'monaco-yaml/lib/esm/monaco.contribution'
import schema from '../rdp/jsonSchema.json'

// @ts-ignore
languages.yaml.yamlDefaults.setDiagnosticsOptions({
  validate: true,
  enableSchemaRequest: true,
  hover: true,
  completion: true,
  schemas: [
    {
      uri: 'data:application/json;base64,' + btoa(JSON.stringify(schema)),
      fileMatch: ['*'],
      schema: {
        id: 'Config',
        ...schema,
      },
    },
  ]
})
