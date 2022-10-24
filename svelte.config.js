import { mdsvex } from 'mdsvex'
import mdsvexConfig from './mdsvex.config.js'
import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-auto'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  
  extensions: ['.svelte', ...mdsvexConfig.extensions],

  preprocess: [
    mdsvex(mdsvexConfig),
    [
      preprocess({
        postcss: true
      })
    ]
  ],
  kit: {
    adapter: adapter(),

    prerender: {
      entries: ['*', '/sitemap.xml', '/rss.xml']
    }
  }
}

export default config
