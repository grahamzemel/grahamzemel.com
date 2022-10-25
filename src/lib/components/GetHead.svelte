<script>
  import SvelteCopyUrlButton from 'svelte-copy-url-button'
  import { Email, Reddit, Telegram, Facebook, Twitter } from 'svelte-share-buttons-component'
  import ButtonLink from '$lib/components/ButtonLink.svelte'
  import { page } from '$app/stores'
  import { website } from '$lib/info'

  export let pagedata = $page.data
  const path = $page.url.pathname
  export let onProject = `${website}${path}`.includes(`projects`)
  export let onProjectList = `${website}${path}`.includes(`projectlist`)
  export let onCategory = `${website}${path}`.includes(`category`)
  export let contact = `${website}${path}`.includes(`contact`)

  let projectsLength
  let recProjectList
  let recProjects
  let projectCategory
  let oldUrl
  let oldTitle
  let oldDesc
  let mainCat
  let sortedFUCL
  if (!onProject && onCategory) {
    projectsLength = pagedata.projects.length
    mainCat = `${pagedata.projects[0].category[0]}`
    //Used for categories && recent projects
    recProjectList = []
    recProjects = pagedata.projects
    let uniqueCategoryList = []
    let finalUniqueCategoryList = []
    for (let i = 0; i < recProjects.length; i++) {
      let uniqueCategories = [...new Set(recProjects[i].category)]
      uniqueCategoryList.push(uniqueCategories)
    }
    for (let j = 0; j < uniqueCategoryList.length; j++) {
      let item = uniqueCategoryList[j]
      for (let k = 0; k < item.length; k++) {
        finalUniqueCategoryList.push(item[k])
      }
    }
    let arr = [...new Set(finalUniqueCategoryList)]
    arr.sort(function (a, b) {
      // ASC  -> a.length - b.length
      // DESC -> b.length - a.length
      return b.length - a.length
    })
    sortedFUCL = arr
  } else if (!onCategory && onProject && !onProjectList) {
    recProjectList = []
    projectsLength = 1
    let arr = pagedata.project.category
    arr.sort(function (a, b) {
      // ASC  -> a.length - b.length
      // DESC -> b.length - a.length
      return b.length - a.length
    })
    projectCategory = arr
    oldUrl = `${website}${pagedata.project.url}`
    oldTitle = pagedata.project.title
    oldDesc = pagedata.project.preview.text
    recProjectList.push(pagedata.project)
  } else if (!onCategory && onProjectList) {
    recProjectList = []
    for (let i = 0; i < pagedata.projects.length; i++) {
      projectsLength = pagedata.projects.length
      oldUrl = `${website}${pagedata.projects[i].url}`
      oldTitle = pagedata.projects[i].title
      oldDesc = pagedata.projects[i].preview.text
      recProjectList.push(pagedata.projects[i])
    }
  } else if (!onCategory && !onProjectList && !onProject && contact) {
    // I'm not sure why this needs to be here. Just leave for now, otherwise it attempts to render pagedata.recentPosts (which is undefined) on the homepage
  } else {
    projectsLength = pagedata.recentProjects.length
    recProjectList = []
    recProjects = pagedata.recentProjects
    for (let i = 0; i < recProjects.length; i++) {
      recProjectList.push(recProjects[i])
      let arr = recProjects[i].category
      arr.sort(function (a, b) {
        // ASC  -> a.length - b.length
        // DESC -> b.length - a.length
        return b.length - a.length
      })
      projectCategory = arr
    }
  }
  export let url = oldUrl
  export let webTitle = oldTitle
  export let desc = oldDesc
</script>

{#if onProject}
  <!-- Project -->
  <div class="mediumInvisible lg:absolute" style="margin-bottom: 1%;margin-top:18%; margin-left:5.5%;">
    <h2
      class="text-lg sm:text-3xl !font-Inter !text-transparent bg-clip-text bg-black dark:bg-white"
    >
      Share Project
      <hr />
    </h2>
    <br />

    <ul
      class="text-lg sm:text-[1rem] !font-Inter !text-transparent !bg-clip-text !bg-gradient-to-b from-zinc-200 to-zinc-700 "
    >
      <h5 class="!font-Inter !text-transparent !bg-clip-text !pr-5 !mt-2 !mb-5">
        <div id="socialLinks">
          <div
            id="shareButton"
            style="text-align:center !important; justify-content:center !important;"
            class="!bg-[#494949] !dark:bg-[#565656] !text-[#494949] !dark:text-[#565656]"
          >
            <SvelteCopyUrlButton
              size="20"
              icon={true}
              defaultText="Copy Url"
              copiedText="Copied!"
              timeout="9000"
            />
          </div>
          <Email subject={webTitle} body="{desc} {url}" /> <br />
          <Twitter
            class="share-button"
            text={webTitle}
            {url}
            hashtags="github,svelte"
            via="username"
            related="other,users"
          /> <br />
          <Telegram class="share-button" text={webTitle} {url} /> <br />
          <Reddit class="share-button" {webTitle} {url} /> <br />
          <Facebook class="share-button" quote={webTitle} {url} /> <br />
        </div>
      </h5>
    </ul>
  </div>

  <div class="mediumInvisible lg:absolute" style="margin-bottom: 1%;margin-top:45%; margin-left:5.5%;">
    <h2
      class="text-lg sm:text-3xl !font-Inter !text-transparent bg-clip-text bg-black dark:bg-white"
    >
      More Links
      <hr />
    </h2>
    <br />

    <ul class="text-lg sm:text-[1rem] !font-Inter !text-transparent bg-clip-text bg-[#778899]">
      <li>
        <div class="flex justify-between">
          <ButtonLink href={`/`}>Graham Zemel</ButtonLink>
          <hr />
        </div>
      </li>
      <li>
        <div class="flex justify-between">
          <ButtonLink href={`/projectlist`}>All Projects</ButtonLink>
          <hr />
        </div>
      </li>
      <li>
        <div class="flex justify-between">
          <ButtonLink href={`https://twitter.com/grahamzemel/`}>Twitter</ButtonLink>
          <hr />
        </div>
      </li>
      <li>
        <div class="flex justify-between">
          <ButtonLink href={`https://github.com/grahamzemel/grahamzemel.com`}>Source Code</ButtonLink>
          <hr />
        </div>
      </li>
      <li>
        <div class="flex justify-between">
          <ButtonLink href={`https://grahamzemel.gumroad.com/l/thegrayareapremium/`}
            >Premium Newsletter</ButtonLink
          >
          <hr />
        </div>
      </li>
    </ul>
  </div>

  <div class="mediumInvisible lg:absolute" style="margin-bottom: 1%;margin-top:70%; margin-left:5.5%;">
    <!-- now manipulate categories text to make look nice -->
    <h2
      class="text-lg sm:text-3xl !font-Inter !text-transparent bg-clip-text bg-black dark:bg-white text-black dark:text-white"
    >
      Categories
      <hr />
    </h2>
    <br />
    <div>
      {#each Array(projectsLength) as _, i}
        {#if projectsLength > 1}
          {#each pagedata.project[i].category as cat}
            <h5 class="category catList !mt-2 !mb-1 ">
              <a target="_self" href={`/category/${String(cat).toLowerCase()}`}>{cat}</a>
            </h5>
          {/each}
        {:else if projectsLength == 1}
          <p style="color:white">
            {#each pagedata.project.category as cat}
              <h5 class="category catList !mt-2 !mb-1 ">
                <a target="_self" href={`/category/${String(cat).toLowerCase()}`}>{cat}</a>
              </h5>
            {/each}
          </p>
        {/if}
      {/each}
    </div>
  </div>
{:else if onCategory}
  <!-- CATEGORIES -->
  <div class="mediumInvisible lg:absolute" style="margin-bottom: 1%;margin-top:18%; margin-left:5.5%;">
    <h2
      class="text-lg sm:text-4xl !font-Inter !text-transparent bg-clip-text bg-black dark:bg-white"
    >
      Share Page
      <hr />
    </h2>
    <br />

    <ul
      class="text-lg sm:text-[1rem] !font-Inter !text-transparent !bg-clip-text !bg-gradient-to-b from-zinc-200 to-zinc-700 "
    >
      <h5 class="!font-Inter !text-transparent !bg-clip-text !pr-5 !mt-2 !mb-5">
        <div id="socialLinks">
          <div
            id="shareButton"
            style="text-align:center !important; justify-content:center !important;"
            class="!bg-[#494949] !dark:bg-[#565656] !text-[#494949] !dark:text-[#565656]"
          >
            <SvelteCopyUrlButton
              size="20"
              icon={true}
              defaultText="Copy Url"
              copiedText="Copied!"
              timeout="9000"
            />
          </div>
          <Email subject={webTitle} body="{desc} {url}" /> <br />
          <Twitter
            class="share-button"
            text={webTitle}
            {url}
            hashtags="github,svelte"
            via="username"
            related="other,users"
          /> <br />
          <Telegram class="share-button" text={webTitle} {url} /> <br />
          <Reddit class="share-button" {webTitle} {url} /> <br />
          <Facebook class="share-button" quote={webTitle} {url} /> <br />
        </div>
      </h5>
    </ul>
  </div>
  <div class="mediumInvisible lg:absolute" style="margin-bottom: 1%;margin-top:45%; margin-left:5.5%;">
    <h2
      class="text-lg sm:text-3xl !font-Inter !text-transparent bg-clip-text bg-black dark:bg-white"
    >
      More Links
      <hr />
    </h2>
    <br />

    <ul class="text-lg sm:text-[1rem] !font-Inter !text-transparent bg-clip-text bg-[#778899]">
      <li>
        <div class="flex justify-between">
          <ButtonLink href={`/`}>Graham Zemel</ButtonLink>
          <hr />
        </div>
      </li>
      <li>
        <div class="flex justify-between">
          <ButtonLink href={`/projectlist`}>All Projects</ButtonLink>
          <hr />
        </div>
      </li>
      <li>
        <div class="flex justify-between">
          <ButtonLink href={`https://twitter.com/grahamzemel/`}>Twitter</ButtonLink>
          <hr />
        </div>
      </li>
      <li>
        <div class="flex justify-between">
          <ButtonLink href={`https://github.com/grahamzemel/grahamzemel.com`}>Source Code</ButtonLink>
          <hr />
        </div>
      </li>
      <li>
        <div class="flex justify-between">
          <ButtonLink href={`https://grahamzemel.gumroad.com/l/thegrayareapremium/`}
            >Premium Newsletter</ButtonLink
          >
          <hr />
        </div>
      </li>
    </ul>
  </div>
  <div class="mediumInvisible lg:absolute" style="margin-bottom: 1%;margin-top:70%; margin-left:5.5%;">
    <h2
      class="text-lg sm:text-3xl !font-Inter !text-transparent bg-clip-text bg-black dark:bg-white"
    >
      Categories
      <hr />
    </h2>
    <br />
    <div>
      {#each sortedFUCL as cat}
        <h5 class="category catList !mt-2 !mb-1 ">
          <a target="_self" href={`/category/${String(cat).toLowerCase()}`}>{cat}</a>
        </h5>
      {/each}
    </div>
  </div>
{:else if contact}
  <!-- Contact -->
  <div class="mediumInvisible lg:absolute" style="margin-bottom: 1%;margin-top:18%; margin-left:5.5%;">
    <h2
      class="text-lg sm:text-4xl !font-Inter !text-transparent bg-clip-text bg-black dark:bg-white"
    >
      Share Page
      <hr />
    </h2>
    <br />

    <ul
      class="text-lg sm:text-[1rem] !font-Inter !text-transparent !bg-clip-text !bg-gradient-to-b from-zinc-200 to-zinc-700 "
    >
      <h5 class="!font-Inter !text-transparent !bg-clip-text !pr-5 !mt-2 !mb-5">
        <div id="socialLinks">
          <div
            id="shareButton"
            style="text-align:center !important; justify-content:center !important;"
            class="!bg-[#494949] !dark:bg-[#565656] !text-[#494949] !dark:text-[#565656]"
          >
            <SvelteCopyUrlButton
              size="20"
              icon={true}
              defaultText="Copy Url"
              copiedText="Copied!"
              timeout="9000"
            />
          </div>
          <Email subject={webTitle} body="{desc} {url}" /> <br />
          <Twitter
            class="share-button"
            text={webTitle}
            {url}
            hashtags="github,svelte"
            via="username"
            related="other,users"
          /> <br />
          <Telegram class="share-button" text={webTitle} {url} /> <br />
          <Reddit class="share-button" {webTitle} {url} /> <br />
          <Facebook class="share-button" quote={webTitle} {url} /> <br />
        </div>
      </h5>
    </ul>
  </div>
  <div class="mediumInvisible lg:absolute" style="margin-bottom: 1%;margin-top:45%; margin-left:5.5%;">
    <h2
      class="text-lg sm:text-4xl !font-Inter !text-transparent bg-clip-text bg-black dark:bg-white"
    >
      More Links
      <hr />
    </h2>
    <br />

    <ul class="text-lg sm:text-[1rem] !font-Inter !text-transparent bg-clip-text bg-[#778899]">
      <li>
        <div class="flex justify-between">
          <ButtonLink href={`/`}>Graham Zemel</ButtonLink>
          <hr />
        </div>
      </li>
      <li>
        <div class="flex justify-between">
          <ButtonLink href={`/projectlist`}>All Projects</ButtonLink>
          <hr />
        </div>
      </li>
      <li>
        <div class="flex justify-between">
          <ButtonLink href={`https://twitter.com/grahamzemel/`}>Twitter</ButtonLink>
          <hr />
        </div>
      </li>
      <li>
        <div class="flex justify-between">
          <ButtonLink href={`https://github.com/grahamzemel/grahamzemel.com`}>Source Code</ButtonLink>
          <hr />
        </div>
      </li>
      <li>
        <div class="flex justify-between">
          <ButtonLink href={`https://grahamzemel.gumroad.com/l/thegrayareapremium/`}
            >Premium Newsletter</ButtonLink
          >
          <hr />
        </div>
      </li>
    </ul>
  </div>
{:else}
  <!-- HOMEPAGE -->
  <div class="mediumInvisible lg:absolute" style="margin-bottom: 1%;margin-top:18%; margin-left:5.5%;">
    <h2
      class="text-lg sm:text-4xl !font-Inter !text-transparent bg-clip-text bg-black dark:bg-white"
    >
      Share Page
      <hr />
    </h2>
    <br />

    <ul
      class="text-lg sm:text-[1rem] !font-Inter !text-transparent !bg-clip-text !bg-gradient-to-b from-zinc-200 to-zinc-700 "
    >
      <h5 class="!font-Inter !text-transparent !bg-clip-text !pr-5 !mt-2 !mb-5">
        <div id="socialLinks">
          <div
            id="shareButton"
            style="text-align:center !important; justify-content:center !important;"
            class="!bg-[#494949] !dark:bg-[#565656] !text-[#494949] !dark:text-[#565656]"
          >
            <SvelteCopyUrlButton
              size="20"
              icon={true}
              defaultText="Copy Url"
              copiedText="Copied!"
              timeout="9000"
            />
          </div>
          <Email subject={webTitle} body="{desc} {url}" /> <br />
          <Twitter
            class="share-button"
            text={webTitle}
            {url}
            hashtags="github,svelte"
            via="username"
            related="other,users"
          /> <br />
          <Telegram class="share-button" text={webTitle} {url} /> <br />
          <Reddit class="share-button" {webTitle} {url} /> <br />
          <Facebook class="share-button" quote={webTitle} {url} /> <br />
        </div>
      </h5>
    </ul>
  </div>
  <div class="mediumInvisible lg:absolute" style="margin-bottom: 1%;margin-top:45%; margin-left:5.5%;">
    <h2
      class="text-lg sm:text-4xl !font-Inter !text-transparent bg-clip-text bg-black dark:bg-white"
    >
      More Links
      <hr />
    </h2>
    <br />

    <ul class="text-lg sm:text-[1rem] !font-Inter !text-transparent bg-clip-text bg-[#778899]">
      <li>
        <div class="flex justify-between">
          <ButtonLink href={`/`}>Graham Zemel</ButtonLink>
          <hr />
        </div>
      </li>
      <li>
        <div class="flex justify-between">
          <ButtonLink href={`/projectlist`}>All Projects</ButtonLink>
          <hr />
        </div>
      </li>
      <li>
        <div class="flex justify-between">
          <ButtonLink href={`https://twitter.com/grahamzemel/`}>Twitter</ButtonLink>
          <hr />
        </div>
      </li>
      <li>
        <div class="flex justify-between">
          <ButtonLink href={`https://github.com/grahamzemel/grahamzemel.com`}>Source Code</ButtonLink>
          <hr />
        </div>
      </li>
      <li>
        <div class="flex justify-between">
          <ButtonLink href={`https://grahamzemel.gumroad.com/l/thegrayareapremium/`}
            >Premium Newsletter</ButtonLink
          >
          <hr />
        </div>
      </li>
    </ul>
  </div>
  <div class="mediumInvisible lg:absolute" style="margin-bottom: 1%;margin-top:70%; margin-left:5.5%;">
    {#if pagedata.projects}
      <h2
        style="font-size: 1.7rem;line-height: 2.25rem;"
        class="!font-Inter !text-transparent bg-clip-text bg-black dark:bg-white"
      >
        Recent Projects
        <hr />
      </h2>
    {:else}
      <h2
        style="font-size: 1.7rem;line-height: 2.25rem;"
        class="!font-Inter !text-transparent bg-clip-text bg-black dark:bg-white"
      >
        Categories
        <hr />
      </h2>
    {/if}
    <br />

    <ul
      class="text-lg sm:text-[1rem] !p-2 !font-Inter !text-transparent !bg-clip-text !bg-gradient-to-b from-[#000000] to-[#FFFFFF] dark:from-[#FFFFFF] dark:to-[#000000]"
    >
      {#if pagedata.projects}
        {#each pagedata.projects as project}
          <h5 class="!border-l-2 border-[#606060] !bg-clip-text !pl-4 !mt-2 !mb-5">
            <a target="_self" href={`/projects/${project.slug}`}>
              {project.title}
            </a>
          </h5>
        {/each}
      {:else}
        {#each projectCategory as cat}
          <h5 class="category catList !mt-2 !mb-1 ">
            <a target="_self" href={`/category/${String(cat).toLowerCase()}`}>{cat}</a>
          </h5>
        {/each}
      {/if}
    </ul>
  </div>
{/if}
