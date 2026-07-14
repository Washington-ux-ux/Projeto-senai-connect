import { cpSync } from 'fs'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['server.ts'],
  format: ['esm'],
  target: 'node18',
  clean: true,
  dts: false,
  sourcemap: false,
  onSuccess: async () => {
    cpSync('docs', 'dist/docs', { recursive: true })
  },
})
