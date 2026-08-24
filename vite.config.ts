import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

const pkg = JSON.parse(
  readFileSync(resolve(__dirname, 'package.json'), 'utf-8'),
) as { dependencies?: Record<string, string> }

const externalDeps = [
  ...Object.keys(pkg.dependencies ?? {}),
  'react',
  'react-dom',
  'react/jsx-runtime',
]

const isExternal = (id: string) => {
  if (id.endsWith('.css')) return false
  return externalDeps.some((dep) => id === dep || id.startsWith(`${dep}/`))
}

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
            cssFileName: 'styles',
          },
          rollupOptions: {
            external: isExternal,
            output: [
              {
                format: 'es',
                dir: 'dist',
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: '[name].js',
              },
              {
                format: 'cjs',
                dir: 'dist/cjs',
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: '[name].cjs',
                exports: 'named',
              },
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
