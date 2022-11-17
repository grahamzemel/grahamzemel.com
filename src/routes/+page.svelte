<script>
  import '../app.css'
  import '../prism.css'
  import 'focus-visible'
  import { name, website } from '$lib/info'
  import { onMount } from 'svelte'
  import ProjectPreview from '$lib/components/ProjectPreview.svelte'
  import { GenericEmbed } from 'sveltekit-embed'
    import it from 'date-fns/locale/it'
    import { space } from 'svelte/internal'
  /** @type {import('./$types').PageData} */
  export let data
  let output = ''
  let postOutput
  onMount(async function () {
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/the-gray-area')

      .then((res) => res.json()).catch(error => {
        console.log(error)
      })
      .then((data) => {
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
        posts.forEach((item) => {
          let categories = item.categories
          categories = categories.map((categories) => " " + categories.toUpperCase()).slice(0, 3)
          const post = {
            title: shortenText(item.title, 0, 60),
            link: item.link,
            thumbnail: item.thumbnail,
            date: shortenText(item.pubDate, 0, 10),
            creator: item.author,            
            tags: categories,
          }

          // <p class="blog__intro">${post.categories}</p>
          output += `
         <li class="blog__post">
            <a href="${post.link}">
               <img width="75%" height="100" alt="${post.title}" src="${post.thumbnail}"></img>
               <div class="blog__content">
                <div class="blog_preview">
                     <h2 class="blog__title">${post.title}</h2>
                      <p class="blog__intro">${post.tags}</p>
                  </div>
                  <div class="blog__info">
                     <span class="blog__author">Written by ${post.creator}</span> </br>
                     <span class="blog__date">Published on ${post.date}</span>
                  </div>
               </div>
               <hr>
            </a>
         </li>`
        })
        postOutput = document.querySelector('.blog__slider')
        postOutput.innerHTML = output
      })
      .catch(error => {
    console.error(error);
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
  <meta
    name="keywords"
    content="Graham Zemel, g-zem, grahamzemel, graham zemel blog, blog graham zemel, hacker graham zemel, graham zemel hacker, developer, programmer, cybersecurity, IT, full-stack"
  />
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
    <br />
    <h3 style="color:gray">
      I develop websites💻, code malware👾, and write about the latest and greatest in computer
      science📝.
    </h3>
  </div>
  <!-- featured projects -->
  <hr />
  <p class="text-[#000000] dark:text-[#FFFFFF] title_header !mb-2">
    <strong
      class="!text-transparent !bg-clip-text bg-gradient-to-b from-[#7ec3f8] to-[#043a54] text-[#7ec3f8] lg:text-[2.4rem] font-bold"
      >Featured</strong
    > Projects
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
  <br /> <br />
  <hr />
  <div class="relative">
    <div class="title_header">
      <p class="text-[#000000] dark:text-[#FFFFFF]">
        New from <a href="https://medium.com/the-gray-area"
          ><strong class="!text-[#606060]">The Gray Area</strong></a
        >
      </p>
    </div>
    <hr />
    <div id="blog" class="blog">
      <ul class="blog__slider flex-col w-50% lg:flex-row lg:w-35%">
        {postOutput}
        <br />
      </ul>
    </div>
  </div>
</div>
