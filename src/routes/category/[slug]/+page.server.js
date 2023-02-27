import { projects } from '$lib/data/projects'
import { error } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const toLower = (x) => {
    return x.toLowerCase();
  };
  let allProjects;
  let projectIndex
  let containsSlug = false
  let testVarBool
  let parameters
  let goodProj = []
  for (let project in projects) {
    testVarBool = ((JSON.parse(JSON.stringify(projects))[project].category).map(toLower).includes(params.slug))
    if (testVarBool) {//.includes(params.slug)){ //if contains valid categories + in slug(url), do
      parameters = JSON.parse(JSON.stringify(projects))[project]
      allProjects = projects
      projectIndex = project
      containsSlug = true;
      goodProj.push(projects[project])
    }
    else {
      containsSlug = false;
    }
  };
  // console.log(goodProj.length)
  // console.log(goodProj.map(x => x.title))
  // console.log("Valid Proj: " + goodProj)
  if (goodProj.length < 1) throw error(404, 'Not found');
  return { projects: goodProj };
}