<script>
  import '../../../app.css'
  import '../../../prism.css'
  import 'focus-visible'
  import { page } from '$app/stores'
  import { website } from '$lib/info'

  import ButtonLink from '$lib/components/ButtonLink.svelte'
  import ProjectPreview from '$lib/components/ProjectPreview.svelte'
  import ArrowLeftIcon from '$lib/components/ArrowLeftIcon.svelte'
  /** @type {import('./$types').PageData} */
  export let data
  const slug = $page.params.slug

  let mobile = false
  const ogImage = `${website}/favicon.png`
  const url = `${page.url}`
</script>

<svelte:head>
  <title>Graham Zemel | {slug}</title>
  <meta name="description" content="View all posts tagged '{slug}'" />
  <meta name="author" content="Graham Zemel" />

  <meta property="og:url" content={url} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Graham Zemel's {slug} posts" />
  <meta property="og:description" content="View all posts tagged '{slug}'" />
  <meta property="og:image" content={ogImage} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content={url} />
  <meta property="twitter:url" content={url} />
  <meta name="twitter:title" content="Graham Zemel's {slug} posts" />
  <meta name="twitter:description" content="View all posts tagged '{slug}'" />
  <meta name="twitter:image" content={ogImage} />
</svelte:head>

<hr />
  <p
    class="flex justify-center items-baseline gap-4 !mb-2 title_header text-[#000000] dark:text-[#FFFFFF]"
  >
    {slug}
  </p> <hr>
  <div class="grid gap-4 grid-cols-1 sm:grid-cols-1 row-end-3 !mt-4">
    {#each data.projects as project}
      <!-- {#if project.featured == true} (this comment took 2 hours of my life I'll never get back ffs)--> 
        <div class="flex p-4 border-4 border-gray-300 dark:border-gray-500 rounded-lg">
          <ProjectPreview {project} small />
        </div>
      <!-- {/if} -->
    {/each}
  </div>

<div class="pt-12 flex justify-between">
  <ButtonLink href={`/`}>
    <slot slot="icon-start">
      <ArrowLeftIcon class="h-5 w-5" />
    </slot>
    Back to [ / ]
    <slot slot="icon-end" />
  </ButtonLink>
</div>
