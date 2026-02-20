import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  dts: true,
  sourcemap: true,
  clean: true,
  banner: {
    js: `/* NapConnect, Copyright ${new Date().getFullYear()} Cladonia. */\n`,
    dts: `/* NapConnect, Copyright ${new Date().getFullYear()} Cladonia. */\n`,
  },
})
