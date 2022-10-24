import { projects } from '$lib/data/projects'
import { error } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const toLower = (x) => {
    return x.toLowerCase();
  };
  const { slug } = params
  let allProjects;
  let projectIndex
  let containsSlug = false
  let testVarBool
  let parameters
  for (let project in projects) {
    testVarBool = ((JSON.parse(JSON.stringify(projects))[project].category).map(toLower).includes(params.slug))
    if (testVarBool) {//.includes(params.slug)){ //if contains valid categories + in slug(url), do
      parameters = JSON.parse(JSON.stringify(projects))[project]
      allProjects = projects
      projectIndex = project
      containsSlug = true;
      break;
    }
    else {
      containsSlug = false;
    }
  };
  let validProjects = []
  let newProjectSlug = (allProjects[projectIndex]) //category list of project

  if (containsSlug) {
    for (let i = 0; i < (newProjectSlug.category).length; i++) {
      if (String(newProjectSlug.category[i]).toLowerCase().includes(params.slug)) { //if this is true (any category is included in params)
        let validNewProjSlugCat = newProjectSlug.category[i].toLowerCase()
        validProjects = 
          allProjects.filter(newProjectSlug => {
            return String(newProjectSlug.category[i]).toLowerCase() == params.slug
          })

        // console.log("All Proj: " + allProjects)
        // console.log("Valid Proj: " + validProjects)
        // console.log("Params Slug: " + params.slug)
        // console.log("Valid New Proj Slug: " + newProjectSlug.category[i])


      }
    }
  }

  if (!containsSlug) throw error(404, 'Not found');
  return { projects: validProjects };
}