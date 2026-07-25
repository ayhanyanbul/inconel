import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => {
  const isPlayground = mode === 'playground'

  return {
    resolve: {
      alias: {
        assets: resolve(__dirname, 'src/assets'),
        components: resolve(__dirname, 'src/components'),
        hooks: resolve(__dirname, 'src/hooks'),
        'react-intl': resolve(__dirname, 'src/compat/reactIntl.ts'),
        store: resolve(__dirname, 'src/store'),
        utils: resolve(__dirname, 'src/utils'),
      },
    },
    plugins: [
      react(),
      ...(isPlayground
        ? []
        : [
            dts({
              tsconfigPath: './tsconfig.lib.json',
              insertTypesEntry: true,
            }),
          ]),
    ],
    build: isPlayground
      ? {
          outDir: 'playground-dist',
          emptyOutDir: true,
        }
      : {
          lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'Inconel',
            formats: ['es', 'cjs'],
            fileName: (format) =>
              format === 'es' ? 'index.js' : 'index.cjs',
            cssFileName: 'styles',
          },
          rollupOptions: {
            external: [
              '@floating-ui/react',
              '@tanstack/react-virtual',
              'react-svg',
              'react',
              'react-dom',
              'react/jsx-runtime',
            ],
          },
          sourcemap: true,
          emptyOutDir: true,
        },
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
    },
  }
})
