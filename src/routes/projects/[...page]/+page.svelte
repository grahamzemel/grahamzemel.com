<script>
  import '../../../app.css'
  import '../../../prism.css'
  import 'focus-visible'
  import { onMount } from 'svelte'

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
        // Filter for actual posts. Comments don't have categories, therefore can filter for items with categories bigger than 0
        const res = data.items //This is an array with the content. No feed, no info about author etc..
        const posts = res.filter((item) => item.categories.length > 0).slice(0, 3) // That's the main trick, and slicing is important for the number of posts you want. 
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
</script>

<svelte:head>
  <title>Graham Zemel | Projects</title>
</svelte:head>

<div class="mediumInvisible lg:absolute" style="justify-content:right;text-align: right;top:1.5%;left:79.5%;">
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
  <div class="flex-grow divide-y divide-gray-300 dark:divide-gray-700">
    {#each data.projects as project}
      <div class="py-8 first:mt-4">
        <ProjectPreview {project} />
      </div>
    {/each}
    <br>
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
