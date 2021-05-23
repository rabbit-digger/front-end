import { exec as execCb } from 'child_process'
import { promisify } from 'util'
import { compile } from 'json-schema-to-typescript'
import { writeFileSync } from 'fs'
const exec = promisify(execCb)

const jsonSchema = (await exec('cargo run -- generate-schema', { cwd: 'rabbit-digger-pro' })).stdout
const result = await compile(JSON.parse(jsonSchema), 'Config', { strictIndexSignatures: true })
writeFileSync('src/rdp/generated.ts', result)
console.log('Done')
