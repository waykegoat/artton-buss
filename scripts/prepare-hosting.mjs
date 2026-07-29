import { copyFile, cp, mkdir } from 'node:fs/promises'

await mkdir('dist/.openai', { recursive: true })
await copyFile('.openai/hosting.json', 'dist/.openai/hosting.json')
await cp('.openai/drizzle', 'dist/.openai/drizzle', { recursive: true })
