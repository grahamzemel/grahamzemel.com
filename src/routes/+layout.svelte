<script async>
  import '../app.css'
  import '../prism.css'
  import 'focus-visible'

  import SocialIcons from '@rodneylab/svelte-social-icons'
  import { browser } from '$app/environment'
  import ThemeToggle from './ThemeToggle.svelte'
  import Grid from '$lib/components/Grid.svelte'
  import { page } from '$app/stores'
  import GetHeading from './GetHeading.svelte'
  const path = $page.url.pathname
  import MyDateComponent from './date.svelte'
  let date
</script>

<div class="logoImg">
  <img src="../favicon.png" alt="Logo" />
</div>

<div
  class="flex flex-row justify-around w-full text-black dark:text-[#808080] !pl-[5rem] !pb-[3rem] text-[10px] lg:text-[15px] nav btn-nav"
>
<a href="/about" class="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-bold text-[#707070] rounded-md !border-[1.5px] shadow-2xl group">
  <span class="absolute inset-0 w-full h-full transition duration-500 ease-out opacity-0 bg-gradient-to-br from-slate-100 via-zinc-300 to-slate-100 dark:from-zinc-800 dark:via-gray-700 dark:to-zinc-800 group-hover:opacity-100"></span>
  <span class="absolute top-0 left-0 w-full bg-gradient-to-b from-white to-transparent opacity-5 h-1/3"></span>
  <span class="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent opacity-5"></span>
  <span class="absolute bottom-0 left-0 w-4 h-full bg-gradient-to-r from-white to-transparent opacity-5"></span>
  <span class="absolute bottom-0 right-0 w-4 h-full bg-gradient-to-l from-white to-transparent opacity-5"></span>
  <span class="absolute inset-0 w-full h-full border border-white rounded-md opacity-10"></span>
  <span class="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-5"></span>
  <span class="relative" target="_self">About Me</span>
</a>
<a href="/projectlist" class="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-bold text-[#707070] rounded-md !border-[1.5px] shadow-2xl group">
  <span class="absolute inset-0 w-full h-full transition duration-500 ease-out opacity-0 bg-gradient-to-br from-slate-100 via-zinc-300 to-slate-100 dark:from-zinc-800 dark:via-gray-700 dark:to-zinc-800 group-hover:opacity-100"></span>
  <span class="absolute top-0 left-0 w-full bg-gradient-to-b from-white to-transparent opacity-5 h-1/3"></span>
  <span class="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent opacity-5"></span>
  <span class="absolute bottom-0 left-0 w-4 h-full bg-gradient-to-r from-white to-transparent opacity-5"></span>
  <span class="absolute bottom-0 right-0 w-4 h-full bg-gradient-to-l from-white to-transparent opacity-5"></span>
  <span class="absolute inset-0 w-full h-full border border-white rounded-md opacity-10"></span>
  <span class="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-5"></span>
  <span class="relative" target="_self">Projects</span>
</a>
<a href="https://medium.com/the-gray-area" class="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-bold text-[#707070] rounded-md !border-[1.5px] shadow-2xl group">
  <span class="absolute inset-0 w-full h-full transition duration-500 ease-out opacity-0 bg-gradient-to-br from-slate-100 via-zinc-300 to-slate-100 dark:from-zinc-800 dark:via-gray-700 dark:to-zinc-800 group-hover:opacity-100"></span>
  <span class="absolute top-0 left-0 w-full bg-gradient-to-b from-white to-transparent opacity-5 h-1/3"></span>
  <span class="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent opacity-5"></span>
  <span class="absolute bottom-0 left-0 w-4 h-full bg-gradient-to-r from-white to-transparent opacity-5"></span>
  <span class="absolute bottom-0 right-0 w-4 h-full bg-gradient-to-l from-white to-transparent opacity-5"></span>
  <span class="absolute inset-0 w-full h-full border border-white rounded-md opacity-10"></span>
  <span class="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-5"></span>
  <span class="relative" target="_self">Publication</span>
</a>
<a href="/contact" class="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-bold text-[#707070] rounded-md !border-[1.5px] shadow-2xl group">
  <span class="absolute inset-0 w-full h-full transition duration-500 ease-out opacity-0 bg-gradient-to-br from-slate-100 via-zinc-300 to-slate-100 dark:from-zinc-800 dark:via-gray-700 dark:to-zinc-800 group-hover:opacity-100"></span>
  <span class="absolute top-0 left-0 w-full bg-gradient-to-b from-white to-transparent opacity-5 h-1/3"></span>
  <span class="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent opacity-5"></span>
  <span class="absolute bottom-0 left-0 w-4 h-full bg-gradient-to-r from-white to-transparent opacity-5"></span>
  <span class="absolute bottom-0 right-0 w-4 h-full bg-gradient-to-l from-white to-transparent opacity-5"></span>
  <span class="absolute inset-0 w-full h-full border border-white rounded-md opacity-10"></span>
  <span class="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-5"></span>
  <span class="relative" target="_self">Contact</span>
</a>
</div>

<div class="mediumInvisible lg:absolute">
  <div
    class="flex flex-col justify-around h-full !text-transparent bg-clip-text bg-[#ffffff] dark:bg-[#111111] !pt-[5rem] !pb-[2rem] sidenav"
  >
    <div style="padding-left:1rem;">
      <a
        href="https://patreon.com/grahamzemel"
      >
        <img src="/patreon.png" alt="Patreon" style="height:50px;width:50px;border-style:solid;" />
      </a>
    </div>
    <div style="padding-left:1rem;">
      <a href="https://medium.com/the-gray-area/newsletters/medium-the-gray-area">
        <img alt="Subscribe To Mailing List" src="/mail.png" width="50px" height="50px" />
      </a>
    </div>
    <a href="https://grahamzemel.medium.com/">
      <SocialIcons alt="Graham Zemel's Medium" network="medium" bgColor="#aaaaaa" />
    </a>
    <a href="https://github.com/grahamzemel">
      <SocialIcons alt="Graham Zemel's Github" network="github" bgColor="#aaaaaa" />
    </a>
    <a href="https://twitter.com/grahamzemel">
      <SocialIcons alt="Graham Zemel's Twitter" network="twitter" bgColor="#aaaaaa" />
    </a>
    <h2>
      <ThemeToggle />
    </h2>
    <p
      style="padding-left:.8rem;"
      class="absolute right-8 bottom-10 z-0 text-[#4b5563] dark:text-white"
    >
      ©
    </p>
    <p class="pb-[2rem]" />
    <p
      class="absolute bottom-0 pb-[2rem] lg:pb-[4.5rem] z-10 flex justify-center items-center opacity-0 z-10 duration-300 hover:opacity-100 text-[#4b5563] dark:text-white"
    >
      Graham Zemel 2022
    </p>
  </div>
</div>
<MyDateComponent bind:date />


<div class="!mt-20 !ml-10">

  <div class="flex flex-col min-h-screen bg-[#fcfcfc] dark:bg-[#070707]">
    <div class="mx-auto flex flex-col flex-grow w-full max-w-[65rem]">
      <!-- CENTER -->
      <div style="text-align: center; letter-spacing: .5em;margin-top: 1em; font-family: 'Mukta', sans-serif !important;">
        <h2 class="pb-0.5">
          <a
            class="lg:text-8xl md:text-6xl text-5xl !bg-clip-text !text-transparent bg-[#606060] dark:bg-[#565656]"
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
            class="flex !font-Inter
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
            class="lg:text-[1.25rem] text-[.85rem] !font-Inter
        !text-transparent bg-clip-text !bg-[#404040] !dark:bg-[#606060] !mr-1"
          >
            [
          </p>
          <p
            class="lg:text-[1.2rem] text-[.8rem] !font-Inter
        !text-transparent bg-clip-text !bg-[#7a7a7a] !dark:bg-[#7a7a7a]"
          >
            {date}
          </p>
          <p
            class="lg:text-[1.25rem] text-[.85rem] !font-Inter
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
      <p class="subtitle fancy"><span/></p>
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