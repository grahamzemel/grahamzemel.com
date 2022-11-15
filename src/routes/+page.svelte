<script>
  import '../app.css'
  import '../prism.css'
  import 'focus-visible'
  import { name, website } from '$lib/info'
  import { onMount } from 'svelte'
  import ProjectPreview from '$lib/components/ProjectPreview.svelte'
  /** @type {import('./$types').PageData} */
  export let data
  onMount(async function () {
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
               <img src="${item.thumbnail}" alt="Featured post image" class="blog__topImg"></img>
               <div class="blog__content">
                  <div class="blog_preview">
                     <h2 class="blog__title">${shortenText(item.title, 0, 60)}</h2>
                     <p class="blog__intro">${shortenText(toText(item.content), 0, 150) + '...'}</p>
                  </div>
                  <div class="blog__info">
                     <span class="blog__author">${item.author}</span>
                     <span class="blog__date">${shortenText(item.pubDate, 0, 10)}</span>
                  </div>
               </div>
               <hr>
            <a/>
         </li>`
        })
        document.querySelector('.blog__slider').innerHTML = output
      })
  })

  const ogImage = `${website}/favicon.png`
</script>

<svelte:head>
  <title>Graham Zemel</title>
  <meta
    name="description"
    content="Hi! I'm Graham Zemel - A full-stack developer, cybersecurity programmer, and IT enthusiast."
  />
  <meta name="author" content="Graham Zemel" />

  <meta property="og:url" content={website} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={name} />
  <meta
    property="og:description"
    content="Hi! I'm Graham Zemel - A full-stack developer, cybersecurity programmer, and IT enthusiast."
  />
  <meta property="og:image" content={ogImage} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content={website} />
  <meta property="twitter:url" content={name} />
  <meta name="twitter:title" content={name} />
  <meta
    name="twitter:description"
    content="Hi! I'm Graham Zemel - A full-stack developer, cybersecurity programmer, and IT enthusiast."
  />
  <meta name="twitter:image" content={ogImage} />
</svelte:head>

<div class="flex flex-col">
  <br /><br /><br /> <br />
  <div class="flex justify-between text-center relative">
    <h2 class="!mt-[-4rem]">
      Hi! I'm Graham Zemel - A full-stack developer, cybersecurity programmer, and IT enthusiast.
    </h2>
<br>
    <h3 style="color:gray">
      I develop websites💻, code malware👾, and write about the latest and greatest in computer
      science📝.
    </h3>
  </div>
  <!-- featured projects -->
  <hr/>
  <p
    class="flex justify-center items-baseline gap-4 !mb-2 title_header text-[#000000] dark:text-[#FFFFFF]"
  >
    Featured Projects
  </p>
  <hr />
  <div class="grid gap-4 grid-cols-1 sm:grid-cols-1 row-end-3 !mt-4">
    {#each data.featuredProjects as project}
      {#if project.featured == true}
        <div class="flex p-4 border-4 border-gray-300 dark:border-gray-500 rounded-lg">
          <ProjectPreview {project} small />
        </div>
      {/if}
    {/each}
  </div>
  <br/> <br/>
  <hr/>
  <div class="relative">
    <div class="title_header">
      <p class="text-[#000000] dark:text-[#FFFFFF]">
        New from <a href="https://medium.com/the-gray-area"
          ><strong class="!text-[#606060]">The Gray Area</strong></a
        >
      </p>
    </div>
    <hr />
    <section id="blog" class="blog">
      <ul class="blog__slider flex-col w-50% lg:flex-row lg:w-35%">
        Javascript Required
        <br />
      </ul>
      <ul class="blog__counter">
        <li class="blog__counterItem blog__counterItem-active" />
        <li class="blog__counterItem" />
        <li class="blog__counterItem" />
      </ul>
    </section>
  </div>
</div>
