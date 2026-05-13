import { createRequire } from 'node:module';
import path from 'node:path';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import solid from 'vite-plugin-solid';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const INPUT = process.env.INPUT;
if (!INPUT) {
  throw new Error('INPUT environment variable is not set');
}

const isDevelopment = process.env.NODE_ENV === 'development';
const inputPath = path.resolve(INPUT);

export default defineConfig({
  root: path.dirname(inputPath),
  plugins: [solid(), viteSingleFile()],
  build: {
    sourcemap: isDevelopment ? 'inline' : undefined,
    cssMinify: !isDevelopment,
    minify: !isDevelopment,
    rollupOptions: {
      input: path.basename(inputPath),
    },
    outDir: path.resolve('dist/apps'),
    emptyOutDir: false,
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
});
