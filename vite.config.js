import { exec } from 'node:child_process'
import { promisify } from 'node:util'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const execAsync = promisify(exec)

const disableHmr = process.env.DISABLE_HMR === 'true'
const disableOpen = process.env.DISABLE_OPEN === 'true'
const frontendPort = process.env.PORT ? parseInt(process.env.PORT) : 3001

export default defineConfig(async () => {
  const codeVersionId = await getCodeVersionId()

  return {
    base: './',
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin', '@babel/plugin-syntax-import-assertions'],
        },
      }),
    ],
    build: {
      sourcemap: true,
      chunkSizeWarningLimit: 300 * 1024,
      rollupOptions: {
        output: {
          // By default, the names of the files are exposed
          entryFileNames: 'assets/[hash].js',
          chunkFileNames: 'assets/[hash].js',
          assetFileNames: 'assets/[hash].[ext]',
        },
      },
    },
    define: {
      __CODE_VERSION_ID__: JSON.stringify(codeVersionId),
      'process.env': {},
    },
    server: {
      port: frontendPort,
      open: !disableOpen,
      hmr: !disableHmr,
    },
  }
})

async function getCodeVersionId() {
  const { stdout: version } = await execAsync('./get-version.sh')

  return version
}
