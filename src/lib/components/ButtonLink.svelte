<script>
  import ArrowRightIcon from './ArrowRightIcon.svelte'

  export let href
  export let raised = true
  export let size = 'medium' // small, medium, or large

  let className = ''

  export { className as class }
</script>

<div class="not-prose">
  <a
  target="_self"
    {...$$restProps}
    {href}
    class={'block text-gray-800 dark:text-[#DCDCDC] rounded-md no-underline transition duration-500 opacity-80 hover:opacity-100 shadow-md hover:shadow-lg shadow-slate-500/50' +
      className}
    class:small={size === 'small'}
    class:medium={size === 'medium'}
    class:large={size === 'large'}
    class:raised
    data-sveltekit-prefetch
  >
    <div class="flex items-center space-x-1">
      <slot name="icon-start" />
      <span>
        <slot />
      </span>
      <slot name="icon-end">
        <ArrowRightIcon class="h-5 w-5" />
      </slot>
    </div>
  </a>
</div>

<style lang="postcss">
  .small {
    @apply text-sm font-medium;
  }

  .small.raised {
    @apply px-2 py-1;
  }

  .medium {
    @apply text-base;
  }

  .medium.raised {
    @apply px-3 py-1;
  }

  .large {
    @apply text-lg;
  }

  .large.raised {
    @apply px-4 py-2;
  }

  .raised {
    @apply bg-gray-300;
  }

  :global(.dark) .raised {
    @apply bg-gray-700;
  }
</style>
