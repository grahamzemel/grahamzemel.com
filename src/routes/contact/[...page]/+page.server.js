import { redirect } from '@sveltejs/kit'
import { projects } from '$lib/data/projects'
import { paginate } from '$lib/util'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  let page = 1
  let limit = 10

  if (params.page) {
    try {
      // a url of /projects/page/2 will come through as 'page/2' for params.page
      const index = params.page.split('page/').pop()

      if (index) {
        page = parseInt(index)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const projectsForPage = paginate(projects, { limit, page })

  // if page doesn't exist, direct to page 1
  if (projectsForPage.length == 0 && page > 1) {
    throw redirect(301, '/')
  }
  return {
    projects: projectsForPage,
    page,
    limit
  }
}
