import { browser } from '$app/environment'
import { format } from 'date-fns'
import { parse } from 'node-html-parser'
import { splitText } from './split'

export let text

// we require some server-side APIs to parse all metadata
if (browser) {
  throw new Error(`Projects can only be imported server-side`)
}

// Get all projects and add metadata
export const projects = Object.entries(import.meta.glob('/projects/**/*.md', { eager: true }))
  .map(([filepath, project]) => {
    const html = parse(project.default.render().html)
    const preview = project.metadata.preview ? parse(project.metadata.preview): html.querySelector('p')
    const finalCategory = (splitText(project.metadata.category))
    return {
      ...project.metadata,

      // generate the slug from the file path
      slug: filepath.replace(/(\/index)?\.md/, '').split('/').pop(),

      isIndexFile: filepath.endsWith('/index.md'),

      // format date as yyyy-MM-dd
      date: project.metadata.date
        ? format(
          // offset by timezone so that the date is correct
          addTimezoneOffset(new Date(project.metadata.date)),
          'yyyy-MM-dd'
        )
        : undefined,
      //.toISOString(),
      imgLink: project.metadata.img ?? html.querySelector('img')?.getAttribute('src'),
      featured: project.metadata.featured,
      preview: {
        html: preview.toString(),
        // text-only preview (i.e no html elements), used for SEO
        text: preview.structuredText ?? preview.toString()
      },

      category: finalCategory,

      sourceCode: project.metadata.sourceCode,

      liveDemo: project.metadata.liveDemo,
    }
  })
  // sort by date
  .sort(
    (a, b) =>
      new Date(b.order ?? b.date).getTime() - new Date(a.order ?? a.date).getTime()
  )
  // add references to the next/previous project
  .map((project, index, allProjects) => ({
    ...project,
    next: allProjects[index - 1],
    previous: allProjects[index + 1]
  }));

function addTimezoneOffset(date) {
  const offsetInMilliseconds = new Date().getTimezoneOffset() * 60 * 1000
  return new Date(new Date(date).getTime() + offsetInMilliseconds)
}
