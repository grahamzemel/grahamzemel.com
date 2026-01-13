<script>
  import '../app.css'
  import '../prism.css'
  import 'focus-visible'
  import { name, website } from '$lib/info'
  import { onMount } from 'svelte'
  import ProjectPreview from '$lib/components/ProjectPreview.svelte'
  import NavLink from '$lib/components/NavLink.svelte'
  // import Carousel from '$lib/components/Carousel.svelte'
  // import { GenericEmbed } from 'sveltekit-embed'

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

          output += `
         <li class="blog__post">
            <a href="${post.link}">
               <img width="200" height="100" alt="${post.title}" src="${post.thumbnail}"></img>
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
            </a>
         </li>`
        })
        postOutput = document.querySelector('.blog__slider')
        if(output){
          postOutput.innerHTML = output
          // console.log("output")
        } else {
          postOutput.innerHTML = `<p class="blog__intro">Please wait, obtaining posts from <a href="https://medium.com/the-gray-area" aria-label="The Gray Area on Medium">The Gray Area</a></p>`
        }
      })
      .catch(error => {
    console.error(error);
    })
      
  })
  
  const ogImage = `${website}/favicon.png`

  const normalizeCategory = (value) => String(value).toLowerCase()
  const hasCategory = (project, category) =>
    project.category?.some((cat) => normalizeCategory(cat) === category)

  $: allProjects = data.allProjects ?? []
  $: cybersecurityProjects = allProjects.filter((project) => hasCategory(project, 'cybersecurity'))
  $: programmingProjects = allProjects.filter(
    (project) => !hasCategory(project, 'cybersecurity') && hasCategory(project, 'programming')
  )
  $: miscProjects = allProjects.filter(
    (project) => !hasCategory(project, 'cybersecurity') && !hasCategory(project, 'programming')
  )

  let visible = false;
  let nextVisible = false;
	function typewriter(node, { speed = 1 }) {
		const valid = (
			node.childNodes.length === 1 &&
			node.childNodes[0].nodeType === Node.TEXT_NODE
		);

		if (!valid) {
			throw new Error(`This transition only works on elements with a single text node child`);
		}

		const text = node.textContent;
		const duration = text.length / (speed * 0.025);

		return {
			duration,
			tick: t => {
				const i = Math.trunc(text.length * t);
				node.textContent = text.slice(0, i);
			}
		};
	}
  // after loading the page, wait 1 second and then run the typewriter
  setTimeout(() => {
    visible = true;
  }, 1000);
  // once visible is true, the typewriter will run. Once the typewriter is done, it will wait 2 seconds and then run the typewriter again for the second time with a different variable
  setTimeout(() => {
    nextVisible = true;
  }, 5000);
</script>

<svelte:head>
  <title>Graham Zemel</title>
  <meta
    name="description"
    content="Hi! I'm Graham Zemel - A full-stack developer, ethical hacker, and IT enthusiast."
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
    <div style="width: 100%;">
      {#if visible}
        <h2 transition:typewriter class="!mt-[-4rem]">
          Hi! I'm Graham Zemel - A full-stack developer, cybersecurity programmer, and IT enthusiast.
        </h2>
      {/if}
    </div>
    
    <!-- <div style="width: 40%;">
      {#if nextVisible}
        <h3 transition:typewriter style="color:gray;">
          I develop websites, code malware, and write about the latest and greatest in computer
          science!
        </h3>
      {/if}
    </div> -->

  </div>
  <hr/>
  <div class="relative">
    <p class="text-[#000000] dark:text-[#FFFFFF] title_header !mb-2">
      My Work
    </p>
    <hr />
    <div class="grid gap-8 grid-cols-1 lg:grid-cols-[2fr,1fr] !mt-4">
      <div class="flex flex-col gap-6 text-left">
        <div>
          <h3 class="text-lg lg:text-xl font-semibold text-[#000000] dark:text-[#FFFFFF]">
            Programming Projects
          </h3>
          <ul class="linkBtn list-disc pl-5">
            {#each programmingProjects as project}
              <li>
                <a href={`/projects/${project.slug}`}>{project.title}</a>
              </li>
            {/each}
          </ul>
        </div>
        <div>
          <h3 class="text-lg lg:text-xl font-semibold text-[#000000] dark:text-[#FFFFFF]">
            Cybersecurity Projects
          </h3>
          <ul class="linkBtn list-disc pl-5">
            {#each cybersecurityProjects as project}
              <li>
                <a href={`/projects/${project.slug}`}>{project.title}</a>
              </li>
            {/each}
          </ul>
        </div>
        <div>
          <h3 class="text-lg lg:text-xl font-semibold text-[#000000] dark:text-[#FFFFFF]">
            Misc Projects
          </h3>
          <ul class="linkBtn list-disc pl-5">
            {#each miscProjects as project}
              <li>
                <a href={`/projects/${project.slug}`}>{project.title}</a>
              </li>
            {/each}
          </ul>
        </div>
      </div>
      <div>
        <p class="text-[#000000] dark:text-[#FFFFFF] title_header !mb-2">
          <strong
            class="!text-transparent !bg-clip-text bg-gradient-to-b from-[#7ec3f8] to-[#043a54] text-[#7ec3f8] lg:text-[2.4rem] font-bold"
            ><a style="color: #488fbe;" href="/projectlist">Featured</a></strong
          > Projects
        </p>
        <div class="grid gap-4 grid-cols-1 sm:grid-cols-1 row-end-3 !mt-4">
          {#each data.featuredProjects as project}
            {#if project.featured == true}
              <div class="flex p-4 border-4 border-gray-300 dark:border-gray-500 rounded-lg">
                <ProjectPreview {project} small />
              </div>
            {/if}
          {/each}
        </div>
      </div>
    </div>
  </div>
  <br /> <br />
  <hr>
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
      <ul class="blog__slider flex-col w-50% lg:flex-row lg:w-33% lg:border-2 lg:border-slate-700">
        {postOutput}
        <br />
      </ul>
    </div>
  </div>
  <br /> <br />
  <hr>
  <div class="relative">
    <!-- make this dynamic so it fetches each new vid -->
    <div class="title_header">
      <p class="text-[#000000] dark:text-[#FFFFFF]">
        Latest <a style="color: #ff0000;" href="https://www.youtube.com/channel/UCClonmlmbXDX3Mg8bd7Dh9w?sub_confirmation=1">Youtube</a> Upload
      </p>
    </div>
    <hr />
    <div style="display: flex; justify-content: center;">
      <div class="video-container">
        <iframe
          title="Graham Zemel's Youtube Channel"
          width="800"
          height="450"
          src="https://www.youtube.com/embed/9D6mXNf4fWI?autoplay=1"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
  <hr />
</div>