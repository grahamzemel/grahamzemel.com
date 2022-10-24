import { projects } from '$lib/data/projects'
import { error } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const { slug } = params

  // get project with metadata
  const project = projects.find((project) => project.slug === slug);
  // console.log(project);
  if (!project) throw error(404, 'Not found');

	return { project, next: projects[project.index + 1], prev: projects[project.index - 1] };
}
