<script lang="ts" context="module">
  import type { ProjectTag } from "$lib/project-utils";

  export type Tag = ProjectTag;
</script>

<script lang="ts">
  import { getProjectTagClass } from "$lib/project-utils";
  import ProjectCardButtons from "./projectCardButtons.svelte";

  export let title: string;
  export let description: string;
  export let image: string;
  export let demoLink: string | null;
  export let repoLink: string | null;
  export let tags: Tag[];
  export let wide = false;
</script>

<article
  class="project-card flex my-10 rounded-lg bg-[#070a0d] bg-opacity-60 shadow {wide
    ? 'w-full mx-0'
    : 'mx-2 md:mx-0'}"
>
  <div class={wide ? "flex flex-col w-full" : "flex flex-col md:w-[22rem]"}>
    <img
      src={image}
      class="aspect-video object-cover rounded-t-lg pointer-events-none"
      alt={title}
    />
    <div class="p-4 flex flex-col grow justify-between">
      <div>
        <h3 class="text-xl font-medium text-gray-100">
          {title}
        </h3>
        <p class="mt-1 text-gray-300">
          {description}
        </p>
      </div>

      <div>
        <div class="my-4 flex gap-2">
          {#each tags as tag}
            <span class="tag {getProjectTagClass(tag)}">
              {tag}
            </span>
          {/each}
        </div>

        <ProjectCardButtons {repoLink} {demoLink} />
      </div>
    </div>
  </div>
</article>

<style lang="postcss">
  .project-card {
    position: relative;
    overflow: hidden;
    border: 1px solid oklch(0.30 0.012 250);
    transition:
      border-color 260ms var(--ease),
      transform 300ms var(--ease),
      box-shadow 300ms var(--ease);
  }
  .project-card::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(
      108deg,
      transparent 30%,
      oklch(1 0 0 / 0.05) 50%,
      transparent 70%
    );
    transform: translateX(-120%);
    transition: none;
  }
  .project-card:hover {
    border-color: oklch(0.48 0.014 250);
    transform: translateY(-2px);
    box-shadow: 0 12px 32px oklch(0 0 0 / 0.4), 0 0 0 1px oklch(0.78 0.18 145 / 0.08);
  }
  .project-card:hover::before {
    transform: translateX(220%);
    transition: transform 600ms var(--ease);
  }
  .tag {
    @apply inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold;
  }
</style>
