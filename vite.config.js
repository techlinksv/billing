import path from 'path'

import react from '@vitejs/plugin-react'
import laravel from 'laravel-vite-plugin'
import manifestSRI from 'vite-plugin-manifest-sri'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/ts/index.tsx'],
      refresh: ['resources/ts/**'],
    }),
    react({
      include: 'resources/ts',
    }),
    manifestSRI(),
  ],
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      '~gridjs': path.resolve(__dirname, 'node_modules/gridjs'),
      '~react-select-search': path.resolve(__dirname, 'node_modules/react-select-search'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          lodash: ['lodash'],
          reactbootstrap: ['react-bootstrap'],
          styledcomponents: ['styled-components'],
          gridjs: ['gridjs'],
          gridjsReact: ['gridjs-react'],
          dayjs: ['dayjs'],
        },
      },
    },
  },
})
