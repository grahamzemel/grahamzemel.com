<script>
  import { format, parseISO } from 'date-fns'
  import ButtonLink from './ButtonLink.svelte'
  import InlineSVG from 'svelte-inline-svg'
  export let project
  export let small = false

  function addTimezoneOffset(date) {
    const offsetInMilliseconds = new Date().getTimezoneOffset() * 60
    return new Date(new Date(date).getTime() + offsetInMilliseconds)
  }
  function addArticleOffset(date) {
    const offsetInMilliseconds = new Date().getTimezoneOffset() * 60 * 1000
    return new Date(new Date(date).getTime() + offsetInMilliseconds)
  }
</script>

<div class="flex flex-col">
  {#if project.liveDemo}
      <div class="absolute self-end rounded-md no-underline">
        <a href={project.liveDemo} aria-label={project.title} target="_blank">
          <InlineSVG src="/external-link.svg" class="h-12 w-12" />
      </div>
  {/if}
  <div>
    {#if !small}
      {#if project.featured}
        <h1 class="!mt-0 !mb-1 !pb-2 text-1lg lg:text-3xl featuredTitle">
          <a target="_self" href={`/projects/${project.slug}`} data-sveltekit-prefetch
            >{project.title}</a
          >
        </h1>
      {:else}
        <h3 class="!mt-0 !mb-1">
          <a target="_self" href={`/projects/${project.slug}`} data-sveltekit-prefetch
            >{project.title}</a
          >
        </h3>
      {/if}
    {:else if project.featured}
      <h3 class="!mt-0 !mb-1 text-1lg lg:text-3xl featuredTitle">
        <a target="_self" href={`/projects/${project.slug}`} data-sveltekit-prefetch
          >{project.title}</a
        >
      </h3>
    {:else}
      <h3 class="!mt-0 !mb-1">
        <a target="_self" href={`/projects/${project.slug}`} data-sveltekit-prefetch
          >{project.title}</a
        >
      </h3>
    {/if}

    <h4 class="!font-normal">
      {#if (addTimezoneOffset(new Date()) - addArticleOffset(new Date(`${project.date}T${project.time}`))) / 86400000 >= 7}
        Uploaded <time
          >{format(addTimezoneOffset(new Date(parseISO(project.date))), 'MMM d, yyyy')}</time
        >
      {:else if Math.floor((addTimezoneOffset(new Date()) - addArticleOffset(new Date(parseISO(`${project.date}T${project.time}`)))) / 86400000) > 1 && Math.floor((addTimezoneOffset(new Date()) - addArticleOffset(new Date(parseISO(`${project.date}T${project.time}`)))) / 86400000) < 7}
        Uploaded <time
          >{Math.floor(
            (addTimezoneOffset(new Date()) -
              addArticleOffset(new Date(parseISO(`${project.date}T${project.time}`)))) /
              86400000
          )} days ago</time
        >
      {:else}
        <!-- this one is more than a day but not a full 2 days -->
        {#if Math.floor((addTimezoneOffset(new Date(new Date().toISOString()).getTime()) - addArticleOffset(new Date(parseISO(project.date + 'T' + project.time)).getTime())) / (1000 * 3600 * 24)) === 1}
          Uploaded <time
            >{Math.floor(
              (addTimezoneOffset(new Date(new Date().toISOString()).getTime()) -
                addArticleOffset(new Date(parseISO(`${project.date}T${project.time}`)).getTime())) /
                (1000 * 3600 * 24)
            )} day ago</time
          >
        {:else}
          <!-- Less than 24 hours since (Get current time, subtract from project time)-->
          {#if Math.floor((addTimezoneOffset(new Date(new Date().toISOString()).getTime()) - addArticleOffset(new Date(parseISO(`${project.date}T${project.time}`)).getTime())) / (1000 * 3600)) < 24}
            Uploaded <time
              >{Math.floor(
                (addTimezoneOffset(new Date(new Date().toISOString()).getTime()) -
                  addArticleOffset(
                    new Date(parseISO(`${project.date}T${project.time}`)).getTime()
                  )) /
                  (1000 * 3600)
              )} hours ago</time
            >
          {:else}
            Uploaded <time
              >{Math.floor(
                (addTimezoneOffset(new Date(new Date().toISOString()).getTime()) -
                  addArticleOffset(new Date(parseISO(`2022-10-05T10:30:30.000Z`)).getTime())) /
                  (1000 * 3600)
              )} hour ago</time
            >
          {/if}
        {/if}
      {/if}
    </h4>
    {#if project.category}
      <h4 class="category text-xs lg:text-lg !mt-2 !mb-1 ">
        {#each project.category as cat}
          <a target="_self" href={`/category/${String(cat).toLowerCase()}`}>{cat}</a>
        {/each}
      </h4>
    {/if}
    <!-- 12:00 midnight	00:00
1:00 am	01:00
2:00 am	02:00
3:00 am	03:00
4:00 am	04:00
5:00 am	05:00
6:00 am	06:00
7:00 am	07:00
8:00 am	08:00
9:00 am	09:00
10:00 am	10:00
11:00 am	11:00
12:00 pm	12:00
1:00 pm	13:00
2:00 pm	14:00
3:00 pm	15:00
4:00 pm	16:00
5:00 pm	17:00
6:00 pm	18:00
7:00 pm	19:00
8:00 pm	20:00
9:00 pm	21:00
10:00 pm	22:00
11:00 pm	23:00
12:00 midnight	24:00 -->
  </div>
  <div class="linkBtn flex-[1_1_0%]">
    {@html project.preview.html}
  </div>
  <div class="!flex flex-col sm:flex-row !justify-around items-center">
    <slot name="actions">
      {#if project.sourceCode}
      <div class="pb-4">
        <ButtonLink size="small" href={`${project.sourceCode}`}>Source Code</ButtonLink>
      </div>
      {/if}
      <div class="pb-4">
        <ButtonLink size="small" href={`/projects/${project.slug}`}>{project.title}</ButtonLink>
      </div>
    </slot>
  </div>
</div>
