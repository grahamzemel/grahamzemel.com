<script async>
  import '../app.css'
  import '../prism.css'
  import 'focus-visible'

  import SocialIcons from '@rodneylab/svelte-social-icons'
  import { browser } from '$app/environment'
  import ThemeToggle from './ThemeToggle.svelte'
  import Grid from '$lib/components/Grid.svelte'
  import { page } from '$app/stores'
  import NavLink from '$lib/components/NavLink.svelte'
  import GetHeading from './GetHeading.svelte'
  const path = $page.url.pathname
  import MyDateComponent from './date.svelte'
  let date
</script>

<div class="logoImg pl-[.8rem] pt-[0.20rem]">
  <a href="/" target="_self"><img src="../favicon.png" alt="Graham Zemel's Logo" /></a>
</div>

<div
  class="mediumInvisible flex flex-row justify-around w-full !pl-[5rem] !pb-[3rem] nav btn-nav"
>
  <NavLink href="/about" alt="Graham Zemel's About Me" src="/me.png">About Me</NavLink>
  <NavLink href="/projectlist" alt="Graham Zemel's Portfolio" src="/portfolio.png">Projects</NavLink>
  <NavLink href="https://medium.com/the-gray-area" outline=true alt="The Gray Area Publication" src="/grayArea.jpg">Publication</NavLink>
  <NavLink href="/contact" alt="Contact Graham Zemel" src="/contact.png">Contact</NavLink>
</div>
<div
  class="lg:invisible flex flex-row justify-around w-full text-black dark:text-[#808080] !pl-[5rem] !pb-[3rem] text-[10px] lg:text-[15px] nav btn-nav"
>
  <a href="/about" class="!p-[2px] !border-[1px] rounded-md" target="_self"
    ><img alt="About Me" width="35" height="35" src="/me.png" /></a
  >
  <a href="/projectlist" class="!p-[4px] !border-[1px] rounded-md" target="_self"
    ><img alt="Portfolio" width="30" height="30" src="/portfolio.png" /></a
  >
  <a
    href="https://medium.com/the-gray-area"
    class="!p-[2px] !border-[1px] rounded-md"
    target="_self"><img alt="Publication" width="35" height="35" src="/grayArea.jpg" /></a
  >
  <a href="/contact" class="!p-[4px] !border-[1px] rounded-md" target="_self"
    ><img alt="Contact Me" width="30" height="30" src="/contact.png" /></a
  >
</div>

<div
  class="mediumInvisible flex flex-col justify-around h-full !text-transparent bg-clip-text bg-[#ffffff] dark:bg-[#111111] !pt-[5rem] !pb-[2rem] sidenav"
>
  <a href="https://blog.grahamzemel.com/" alt="Graham Zemel's Blog" class="opacity-75 duration-500 hover:opacity-100">
    <SocialIcons network="medium" fgColor="#ffffff" />
  </a>
  <a href="https://github.com/grahamzemel" alt="Graham Zemel's Github Profile" class="opacity-75 duration-500 hover:opacity-100">
    <SocialIcons network="github" fgColor="#ffffff" />
  </a>
  <div style="padding-left:1rem;padding-bottom:.5rem;">
    <a href="https://patreon.com/grahamzemel" alt="Graham Zemel's Patreon Page" class="opacity-75 duration-500 hover:opacity-100">
      <img
        loading="lazy"
        decoding="async"
        width="50"
        height="50"
        alt="Patreon"
        style="border-style:solid;"
        src="/patreon.png"
      />
    </a>
  </div>
  <a href="https://twitter.com/grahamzemel" alt="Graham Zemel's Twitter Profile" class="opacity-75 duration-500 hover:opacity-100">
    <SocialIcons network="twitter" fgColor="#ffffff" />
  </a>
  <a
    href="https://www.linkedin.com/in/grahamzemel" alt="Graham Zemel's LinkedIn Profile" class="opacity-75 duration-500 hover:opacity-100" 
  >
    <SocialIcons network="linkedin" fgColor="#ffffff" />
  </a>
  <h2>
    <ThemeToggle />
  </h2>
  <p
    style="padding-left:1em;"
    class="absolute !pl-[2.3rem] bottom-10 z-0 text-[#4b5563] dark:text-white"
  >
    ©
  </p>
  <p class="pb-[2rem]" />
  <p
    class="absolute bottom-0 pb-[2rem] lg:pb-[4.5rem] z-10 flex justify-center items-center opacity-0 z-10 duration-300 hover:opacity-[1] text-[#4b5563] dark:text-white !text-[10px] lg:text-[15px]"
  >
    Graham Zemel 2022
  </p>
</div>
<MyDateComponent bind:date />

<div class="!mt-20 lg:!ml-10">
  <div class="flex flex-col min-h-screen bg-[#fcfcfc] dark:bg-[#0d0d0d]">
    <div class="mx-auto flex flex-col flex-grow w-full max-w-[65rem]">
      <!-- CENTER -->
      <div style="text-align: center; letter-spacing: .35em;margin-top: 1em;">
        <h2 class="pb-0.5 !font-Mukta">
          <a
            class="lg:text-8xl md:text-6xl text-5xl !bg-clip-text !text-transparent bg-[#606060] dark:bg-[#7a7a7a]"
            target="_self"
            href="/">Graham Zemel</a
          >
          <br />
        </h2>
      </div>
      <!-- SUB -->
      <div
        style="text-transform: uppercase; margin-top: 2em;"
        class="!flex h-8 px-4 py-1 justify-between"
      >
        <h2>
          <p
            class="flex !font-Mukta
        !text-transparent bg-clip-text !bg-[#FFFFFF] !dark:bg-[#000000]"
          >
            <GetHeading title={path} />
          </p>
        </h2>

        <h2
          style="display: flex;
      flex-wrap: wrap;
      contain: layout;
      overflow: visible;"
        >
          <p
            class="lg:text-[1.25rem] text-[.85rem] !font-Mukta
        !text-transparent bg-clip-text !bg-[#404040] !dark:bg-[#606060] !mr-1"
          >
            [
          </p>
          <p
            class="lg:text-[1.2rem] text-[.8rem] !font-Mukta
        !text-transparent bg-clip-text bg-[#8e8e8e]"
          >
            {date}
          </p>
          <p
            class="lg:text-[1.25rem] text-[.85rem] !font-Mukta
        !text-transparent bg-clip-text !bg-[#404040] !dark:bg-[#606060] !ml-1"
          >
            ]
          </p>
        </h2>
      </div>

      <span
        >{#if browser}
          <div
            style="margin: 0;
      position: relative;
      text-align: center;
      top: 50%;
      "
          />
        {/if}</span
      >
      <p class="subtitle fancy"><span /></p>
      <div id="gridDiv">
        <Grid refresh={path} />
      </div>
      <p
        class="dark:text-white text-black justify-center text-center pt-[12px] useWeb lg:hidden mb-[2%] opacity-35"
      >
        For best experience, use a computer!
      </p>
      <main
        class="prose prose-slate prose-sm sm:prose sm:prose-slate sm:prose-lg sm:max-w-none dark:prose-invert flex flex-col w-full flex-grow py-4 px-4"
      >
        <slot />
      </main>
    </div>
  </div>
</div>
