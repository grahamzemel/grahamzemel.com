import { projects } from '$lib/data/projects'

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  return {
    // eslint-disable-next-line no-unused-vars
    recentProjects: projects.slice(0, 2)
  }
}
