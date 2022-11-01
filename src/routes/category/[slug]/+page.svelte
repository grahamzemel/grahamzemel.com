<script>
  import '../../../app.css'
  import '../../../prism.css'
  import 'focus-visible'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
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

<div class="categoryHeader text-3xl lg:text-4xl !mt-1"><span>{slug}</span></div>
<hr class="introBreak" />
<div class="flex-grow divide-y divide-gray-300 dark:divide-gray-700">
  {#each data.projects as project}
    <div class="py-8 first:pt-0">
      <ProjectPreview {project} />
    </div>
  {/each}
  <br />
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
