import { projects } from '$lib/data/projects'
import { website } from '$lib/info'

export const prerender = true
const projectsUrl = `${website}/projects`
const projectListUrl = `${website}/projectlist`
const categoryUrl = `${website}/category`
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ setHeaders }) {
  setHeaders({
    'Cache-Control': `max-age=0, s-max-age=600`,
    'Content-Type': 'application/xml'
  })

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <urlset
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
      xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
      xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
      xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
      xmlns:pagemap="http://www.google.com/schemas/sitemap-pagemap/1.0"
      xmlns:xhtml="http://www.w3.org/1999/xhtml"
    >
      <url>
        <loc>${website}</loc>
        <priority>1.0</priority>
      </url>

      ${projects
        .map(
          (project) => `<url>
            <loc>${projectsUrl}/${project.slug}</loc>
            <lastmod
              >${
                project.updated
                  ? new Date(project.updated).toISOString()
                  : new Date(project.date).toISOString()
              }</lastmod
            >
            <changefreq>monthly</changefreq>
            <priority>1.0</priority>
          </url>`,
          (category) => `<url>
            <loc>${categoryUrl}/${project.category.toLowerCase()}</loc>
            <lastmod
              >${
                project.updated
                  ? new Date(project.updated).toISOString()
                  : new Date(project.date).toISOString()
              }</lastmod
            >
            <changefreq>monthly</changefreq>
            <priority>1.0</priority>
          </url>`
        )
        .join('')}
    </urlset>`

  return new Response(xml)
}
