import { Buffer } from 'node:buffer'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'

const pngSignatureLength = 8
const safeChunks = new Set(['IHDR', 'PLTE', 'IDAT', 'IEND', 'tRNS', 'sRGB', 'gAMA'])
const projectRoot = resolve(import.meta.dirname, '..')
const targets = process.argv.slice(2)

if (targets.length === 0) {
  throw new Error('Pass at least one PNG file to sanitize')
}

for (const target of targets) {
  const filePath = resolve(projectRoot, target)
  const input = await readFile(filePath)
  const outputChunks = [input.subarray(0, pngSignatureLength)]
  let offset = pngSignatureLength

  while (offset < input.length) {
    const dataLength = input.readUInt32BE(offset)
    const chunkLength = dataLength + 12
    const chunkType = input.toString('ascii', offset + 4, offset + 8)

    if (safeChunks.has(chunkType)) {
      outputChunks.push(input.subarray(offset, offset + chunkLength))
    }

    offset += chunkLength
  }

  await writeFile(filePath, Buffer.concat(outputChunks))
}
