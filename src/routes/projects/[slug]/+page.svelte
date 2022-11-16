<script>
  import { format, parseISO } from 'date-fns'
  import { page } from '$app/stores'
  import ButtonLink from '$lib/components/ButtonLink.svelte'
  import { website } from '$lib/info'
  import ProjectPreview from '$lib/components/ProjectPreview.svelte'
  import ArrowLeftIcon from '$lib/components/ArrowLeftIcon.svelte'

  /** @type {import('./$types').PageData} */
  export let data

  const ogImage = `${website}/favicon.png`
  const url = `${website}/${data.project.slug}`
</script>

<svelte:head>
  <title>Graham Zemel | {data.project.title}</title>
  <meta name="description" content={data.project.preview.text} />
  <meta name="author" content="Graham Zemel" />

  <!-- Facebook Meta Tags -->
  <meta property="og:url" content={url} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={data.project.title} />
  <meta property="og:description" content={data.project.preview.text} />
  <meta property="og:image" content={ogImage} />

  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content={website} />
  <meta property="twitter:url" content={url} />
  <meta name="twitter:title" content={data.project.title} />
  <meta name="twitter:description" content={data.project.preview.text} />
  <meta name="twitter:image" content={ogImage} />
</svelte:head>

<article class="relative">
  <h1 class="!mt-4 !mb-1">
    <a class="!font-medium" href={$page.url.pathname}>
      {data.project.title}
    </a>
  </h1>
  <div class="opacity-70">
    Uploaded
    <time datetime={new Date(parseISO(data.project.date)).toISOString()}
      >{format(new Date(parseISO(data.project.date)), 'MMMM d, yyyy')}</time
    >
  </div>
  {#if data.project.category}
    <p class="category !mt-2 !mb-1">
      {#each data.project.category as cat}
        <a target="_self" href={`/category/${String(cat).toLowerCase()}`}>{cat}</a>
      {/each}
    </p>
  {/if}


  <hr class="introBreak" />

  <div class="relative">
    <!-- render the project -->
    <svelte:component this={data.component} />

    <!-- table of contents
    <div class="hidden xl:block absolute not-prose left-[100%]" aria-label="Table of Contents">
      <div class="fixed z-10 px-4 py-2 ml-8 top-[4.5rem]">
         ignore h1 tags as they should only be used for the project title, h5 is
        <ToC allowedHeadings={['h2', 'h3', 'h4', 'h5', 'h6']} />
      </div>
    </div> -->
  </div>
</article>

<div class="pt-12 flex justify-between">
  <ButtonLink size="small" href={'/'}>
    <slot slot="icon-start">
      <ArrowLeftIcon class="h-5 w-5" />
    </slot>
    Back to [ / ]
    <slot slot="icon-end" />
  </ButtonLink>
  {#if data.project.sourceCode}
  <ButtonLink size="small" href={`${data.project.sourceCode}`}>
    Source Code
  </ButtonLink>
  {/if}
  {#if data.project.liveDemo}
  <ButtonLink size="small" href={`${data.project.liveDemo}`}>
    View Live
  </ButtonLink>
  {/if}
</div>

<!-- next/previous projects -->
{#if data.project.previous || data.project.next}
  <hr />
  <div class="grid gap-8 grid-cols-1 sm:grid-cols-2">
    {#if data.project.previous}
      <div class="flex flex-col">
        <h6 class="not-prose project-preview-label">Previous Project</h6>
        <div class="flex-1 project-preview">
          <ProjectPreview project={data.project.previous} small />
        </div>
      </div>
    {:else}
      <div />
    {/if}
    {#if data.project.next}
      <div class="flex flex-col">
        <h6 class="not-prose project-preview-label flex justify-end">Next Project</h6>
        <div class="flex-1 project-preview">
          <ProjectPreview project={data.project.next} small />
        </div>
      </div>
    {/if}
  </div>
{/if}

<style lang="postcss">
  .project-preview {
    @apply flex p-4 border border-gray-300 rounded-lg;
  }

  .project-preview-label {
    @apply mb-2 text-gray-500 uppercase text-base font-medium;
  }

  :global(.dark) .project-preview {
    @apply border-gray-700;
  }

  :global(.dark) .project-preview-label {
    @apply text-gray-400;
  }
</style>
