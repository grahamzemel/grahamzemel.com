<script>
  import PageTransition from './PageReload.svelte'
  import { prefersReducedMotion } from '$lib/data/store'
  import { page } from '$app/stores'
  export let isSingleProject = false
  let computedTitle = ''
  let title
  let isWorking
  const path = $page.url.pathname

  if (path === '/') {
    title = `home`
  } else if (path === '/projectlist') {
    title = `all projects`
  } else if (path === '/contact') {
    title = `contact me`
  } else if (path === '/about') {
    title = `about me`
  } else if (path.match('^\/projects\/(.*)$')) {
    title = path
    title = title.split('/').join(' / ').replace(/-/g, ' ')
  } else if (path.match('^\/category\/(.*)$')) {
    title = path
    title = title.split('/').join(' / ').replace(/-/g, ' ')
  }
  if(path.match('^\/projects\/(.*)$')){
    title = title.substring(2);
  }
  if(path.match('^\/category\/(.*)$')){
    title = title.substring(2);
  }


  isWorking = false
  computedTitle = title
  setTimeout(() => {
    isWorking = true
    computedTitle = title
  }, 420)
</script>

<PageTransition refresh={true} span={true}>
  {#if !isSingleProject}
    <div class="page-head lg:text-[1.25rem] text-[.85rem]">
      <div class="heading-wrapper" class:in={isWorking} class:no-motion={$prefersReducedMotion}>
        <span class="brace" aria-hidden="true">[</span>
        <h1>
          <div class="title-wrap">
            {computedTitle}
            <noscript>{title}</noscript>
          </div>
        </h1>
        <span class="brace closing-brace bg-[#FFFFFF] dark:bg-[#0d0d0d]" aria-hidden="true">]</span>

        <noscript>
          <!-- Just here to allow the heading to show when JS is disabled. -->
          <style>
            .closing-brace {
              transform: none !important;
            }
          </style>
        </noscript>
      </div>
    </div>
  {:else}
    <div class="page-head" />
  {/if}
</PageTransition>
<style>
  .page-head {
    --transition: transform 0.24s cubic-bezier(0.165, 0.84, 0.44, 1);
    --paper: #f5f5f5;
    margin-bottom: var(--halfNote);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    contain: layout;
    overflow: visible;
    position: relative;
    z-index: 0;
  }
  .page-head .heading-wrapper {
    display: flex;
    position: relative;
    width: auto;
    left: -0.5rem; 
    /* Keep within fancy span elem */
  }
  .page-head .heading-wrapper .brace {
    font-family: var(--heading-font);
    font-weight: normal;
    color: #404040;
    margin: 0 0 0 0.4rem;
    z-index: 2;
    position: inherit;
    left: -1px;
  }
  .page-head .heading-wrapper .brace.closing-brace {
    color: #404040;
    transition: var(--transition);
    transform: translateX(calc(-100% + .3em));
    /* FIX POSITIONING*/
    position: absolute;
    left: 100%;
    width: 100%;
    /* box-shadow: 3rem 0 0 1rem #1d2230; */
    overflow: visible;
  }
  .page-head .heading-wrapper.in .closing-brace {
    transform: translateX(0);
  }
  .page-head .heading-wrapper.no-motion .closing-brace {
    transform: translateX(0);
  }
  .page-head .heading-wrapper h1 {
    font-size: inherit;
    margin: 0 0 0 0.275rem;
    padding: 0;
    width: max-content;
    font-weight: normal;
    display: flex;
    align-items: center;
  }
  .page-head .heading-wrapper h1 .title-wrap {
     position: relative;
     z-index: 1;
     background: #8e8e8e;
     -webkit-text-fill-color: transparent;
     background-clip: text;
     font-family: var(--heading-font);
     text-transform: lowercase;
     flex: 1 1 auto;
     white-space: nowrap;
     line-height: 1.2;
  }
</style>