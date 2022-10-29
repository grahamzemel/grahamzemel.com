<script context="module">
  export const prerender = true
</script>

<script>
  import '../../../app.css'
  import '../../../prism.css'
  import 'focus-visible'
  import { onMount } from 'svelte'
  import { website } from '$lib/info'

  import ArrowLeftIcon from '$lib/components/ArrowLeftIcon.svelte'
  import ButtonLink from '$lib/components/ButtonLink.svelte'
  import ProjectPreview from '$lib/components/ProjectPreview.svelte'

  /** @type {import('./$types').PageData} */
  export let data
  $: isFirstPage = data.page === 1
  $: hasNextPage = data.projects[data.projects.length - 1]?.previous

  onMount(() => {
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/the-gray-area')
      .then((res) => res.json())

      .then((data) => {
        // Filter for acctual posts. Comments don't have categories, therefore can filter for items with categories bigger than 0
        const res = data.items //This is an array with the content. No feed, no info about author etc..
        const posts = res.filter((item) => item.categories.length > 0).slice(0, 3) // That's the main trick* !
        // Functions to create a short text out of whole blog's content
        function toText(node) {
          let tag = document.createElement('div')
          tag.innerHTML = node
          node = tag.innerText
          return node
        }
        function shortenText(text, startingPoint, maxLength) {
          return text.length > maxLength ? text.slice(startingPoint, maxLength) : text
        }

        // Put things in right spots of markup
        let output = ''
        posts.forEach((item) => {
          output += `
         <li class="blog__post">
            <a href="${item.link}">
               <img src="${item.thumbnail}" class="blog__topImg"></img>
               <div class="blog__content">
                  <div class="blog_preview">
                     <h2 class="blog__title">${shortenText(item.title, 0, 60)}</h2>
                     <p class="blog__intro">${shortenText(toText(item.content), 0, 150) + '...'}</p>
                  </div>
                  <div class="blog__info">
                     <span class="blog__author">${item.author}</span>
                     <span class="blog__date">${shortenText(item.pubDate, 0, 10)}</span>
                  </div>
                  <hr>
               </div>
            <a/>
         </li>`
        })
        document.querySelector('.blog__slider').innerHTML = output
      })
  })
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

<div class="mediumInvisible lg:absolute" style="top: 1.725%;left:79.5%;">
  <section id="blog" class="blog">
    <div class="blog__header">
      <p class="blog__header1 text-[#4b5563] dark:text-white">New From</p>
      <div>
        <a href="https://medium.com/the-gray-area/">
          <img
            src="/grayArea.jpg"
            alt="The Gray Area Medium"
            style="height:75px;width:75px;border-style:solid; border-color: #5a5a5a;padding:5px;border-width: 1px;"
          />
        </a>
      </div>
      <p class="blog__header2 text-[#4b5563] dark:text-white">The Gray Area</p>
    </div>
    <ul class="blog__slider">Javascript Required</ul>
  </section>
</div>

<div class="flex flex-col flex-grow">
  <!-- featured projects -->
  <h2 class="flex items-baseline text-3xl lg:text-4xl gap-4 !mb-2">Featured Projects</h2>
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
  <h2 class="flex items-baseline gap-4 !mb-2">Projects</h2>
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
