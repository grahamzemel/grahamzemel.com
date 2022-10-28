import { projects } from '$lib/data/projects'
import { name, website } from '$lib/info'

export const prerender = true

const websiteDescription = `Graham Zemel. A full stack developer, hacker, and writer.`
const projectsUrl = `${website}projects`

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ setHeaders }) {
  setHeaders({
    'Cache-Control': `max-age=0, s-max-age=600`,
    'Content-Type': 'application/xml'
  })
  const xml = `<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
      <channel>
        <title>${name}</title>
        <link>${website}</link>
        <description>${websiteDescription}</description>
        <atom:link href="${website}rss.xml" rel="self" type="application/rss+xml" />
        ${projects
          .map(
            (project) =>
              `
              <item>
                <guid>${projectsUrl}/${project.slug}</guid>
                <title>${project.title}</title>
                <description>${project.preview.text}</description>
                <link>${projectsUrl}/${project.slug}</link>
                <pubDate>${new Date(project.date).toUTCString()}</pubDate>
            </item>
          `
          )
          .join('')}
      </channel>
    </rss>`

  return new Response(xml)
}
