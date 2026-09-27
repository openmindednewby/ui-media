import { defineConfig } from 'tsup';

/**
 * Two entries. `framing` is deliberately framework-free (no react / react-native
 * import) so a non-React consumer — e.g. an Astro landing build — can import the
 * bounds without resolving react-native.
 */
export default defineConfig({
  entry: { index: 'src/index.ts', framing: 'src/framing/index.ts' },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: false,
  treeshake: true,
  minify: false,
  target: 'es2020',
  outDir: 'dist',
  external: ['react', 'react-dom', 'react-native', /^@dloizides\//],
});
