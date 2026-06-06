import { defineConfig, transformWithOxc } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    {
      name: 'transform-jsx-in-js',
      enforce: 'pre',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null;
        return transformWithOxc(code, id, {
          lang: 'jsx',
        });
      },
    },
    react({
      include: /\.(jsx|tsx|js)$/,
    }),
  ],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    // Source files use the .js extension for JSX; teach the dependency
    // scanner/optimizer to parse them as JSX.
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
});
