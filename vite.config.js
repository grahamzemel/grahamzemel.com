import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import{ imagetools }from'vite-imagetools';

export default defineConfig({
  plugins: [imagetools({ force:true, optimizeAll:true,
    defaultDirectives: (url) => {
      return {
        quality: 75,
        format: 'webp',
        width: 672,
        height: 448,
      }
    }
   }), sveltekit()],
  server: {
    fs: {
      allow: ['./']
    }
  }
})
