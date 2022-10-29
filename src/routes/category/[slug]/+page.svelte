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
  onMount(() => {
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/the-gray-area')
      .then((res) => res.json())

      .then((data) => {
        // Filter for actual posts. Comments don't have categories, therefore can filter for items with categories bigger than 0
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

<div class="mediumInvisible lg:absolute" style="top: 1.5% !important;left:79.5%;">
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
