import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import{ imagetools }from'vite-imagetools';

export default defineConfig({
  plugins: [imagetools({ force:true, optimizeAll:true, webp:true,
    defaultDirectives: (url) => {
       return new URLSearchParams(url.href + "&webp");
   }}), sveltekit()],
  server: {
    fs: {
      allow: ['./']
    }
  }
})
