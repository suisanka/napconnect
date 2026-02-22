import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/utils/index.ts'],
  dts: true,
  sourcemap: true,
  minify: true,
})
