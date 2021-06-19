import { exec as execCb, spawn } from 'child_process'
import { promisify } from 'util'
import { compile } from 'json-schema-to-typescript'
import { writeFileSync } from 'fs'
const exec = promisify(execCb)

const Features = 'tracing-subscriber,raw'

const code = await new Promise((res, rej) => {
  const child = spawn('cargo', ['build', '--features=' + Features], { cwd: 'rabbit-digger-pro', stdio: 'inherit' })
  child.on('close', res);
  child.on('error', rej)
})
if (code !== 0) {
  console.error('Build exit with error: ', code)
  process.exit(1)
}
console.log('Build done.')
const jsonSchema = (await exec(`cargo run --features=${Features} -- generate-schema`, { cwd: 'rabbit-digger-pro' })).stdout
console.log('Generate schema done.')
const result = await compile(JSON.parse(jsonSchema), 'Config', { strictIndexSignatures: true })
writeFileSync('src/rdp/generated.ts', result)
console.log('Done')
