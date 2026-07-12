<script>
  import { onMount } from "svelte";
  import ProjectsGrid from "./projectsGrid.svelte";

  let isVisible = false;
  let sectionEl;

  onMount(() => {
    if (!sectionEl || !("IntersectionObserver" in window)) { isVisible = true; return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { isVisible = true; io.disconnect(); }
    }, { threshold: 0.08 });
    io.observe(sectionEl);
    return () => io.disconnect();
  });
</script>

<div class="sm:mt-[12vh] mt-10"></div>

<section
  bind:this={sectionEl}
  class="section-band custom-transition {isVisible ? 'opacity-100' : 'opacity-0'}"
>
  <h1 class="font-serif font-bold sm:text-6xl text-4xl">Projects</h1>
  <ProjectsGrid />
</section>

<style lang="postcss">
  .custom-transition {
    transition-property: opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 1500ms;
  }

  .resume-button {
    @apply flex flex-row w-min whitespace-nowrap mt-8 text-accent-300
      cursor-pointer select-none;
  }

  .resume-button:hover {
    @apply transition-colors text-accent-200;
  }
</style>
