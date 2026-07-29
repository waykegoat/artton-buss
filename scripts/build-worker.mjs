import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

import { build } from 'esbuild'

const projectRoot = resolve(import.meta.dirname, '..')
const outputDirectory = resolve(projectRoot, 'dist', 'server')

await mkdir(outputDirectory, { recursive: true })
await build({
  entryPoints: [resolve(projectRoot, 'worker', 'index.ts')],
  outfile: resolve(outputDirectory, 'index.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
})
