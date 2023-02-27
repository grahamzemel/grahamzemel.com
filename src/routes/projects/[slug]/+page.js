/**
 * Dynamically loads the svelte component for the project (only possible in +page.js)
 * and pass on the data from +page.server.js
 *
 * @type {import('@sveltejs/kit').PageLoad}
 */
export async function load({ data }) {
  // load the markdown file based on slug
  const component = data.project.isIndexFile
    ? // vite requires relative paths and explicit file extensions for dynamic imports
      // see https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
      await import(`../../../../projects/${data.project.slug}/index.md`)
    : await import(`../../../../projects/${data.project.slug}.md`)

  return {
    project: data.project,
    component: component.default
  }
}

