<script context="module">
  export const prerender = true
</script>

<script>
  import '../../../app.css'
  import '../../../prism.css'
  import 'focus-visible'
  import { website } from '$lib/info'

  import ArrowLeftIcon from '$lib/components/ArrowLeftIcon.svelte'
  import ButtonLink from '$lib/components/ButtonLink.svelte'
  import ProjectPreview from '$lib/components/ProjectPreview.svelte'

  /** @type {import('./$types').PageData} */
  export let data
  $: isFirstPage = data.page === 1
  $: hasNextPage = data.projects[data.projects.length - 1]?.previous

  const ogImage = `${website}/favicon.png`
  const url = `${website}/projectlist`
</script>

<svelte:head>
  <title>Graham Zemel | All Projects</title>
  <meta name="description" content="View all projects from Graham Zemel" />
  <meta name="author" content="Graham Zemel" />

  <!-- Facebook Meta Tags -->
  <meta property="og:url" content={url} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Graham Zemel: All Projects" />
  <meta property="og:description" content="View all projects from Graham Zemel" />
  <meta property="og:image" content={ogImage} />

  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content={website} />
  <meta property="twitter:url" content={url} />
  <meta name="twitter:title" content="Graham Zemel: All Projects" />
  <meta name="twitter:description" content="View all projects from Graham Zemel" />
  <meta name="twitter:image" content={ogImage} />
</svelte:head>

<div class="flex flex-col flex-grow">
  <!-- featured projects -->
  <hr />
  <p
    class="flex justify-center items-baseline gap-4 !mb-2 title_header text-[#000000] dark:text-[#FFFFFF]"
  >
    <span
      class="!text-transparent !bg-clip-text bg-gradient-to-b from-[#7ec3f8] to-[#043a54] text-[#7ec3f8] font-bold"
      >Featured</span
    >Projects
  </p>
  <hr />
  <div class="grid gap-4 grid-cols-1 sm:grid-cols-1 row-end-3 !mt-4">
    {#each data.projects as project}
      {#if project.featured == true}
        <div class="flex p-4 border-4 border-gray-300 dark:border-gray-500 rounded-lg">
          <ProjectPreview {project} small />
        </div>
      {/if}
    {/each}
  </div>

  <!-- recent projects -->
  <hr />
  <p
    class="flex justify-center items-baseline gap-4 !mb-2 title_header text-[#000000] dark:text-[#FFFFFF]"
  >
    All Projects
  </p>
  <hr />
  <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 row-end-3 !mt-4">
    {#each data.projects as project}
      <div class="flex p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
        <ProjectPreview {project} small />
      </div>
    {/each}
  </div>

  <!-- pagination -->
  <div class="flex visible items-center justify-between pt-8 opacity-70">
    {#if !isFirstPage}
      <ButtonLink raised={false} href={`/page/${data.page - 1}`}>
        <slot slot="icon-start">
          <ArrowLeftIcon class="h-5 w-5" />
        </slot>
        Previous
        <slot slot="icon-end" /></ButtonLink
      >
    {:else}
      <div />
    {/if}

    {#if hasNextPage}
      <ButtonLink raised={false} href={`/page/${data.page + 1}`}>Next</ButtonLink>
    {/if}
  </div>
</div>
