<script>
  export let href
  let className = ''

  export { className as class }
</script>

<a
  target="_self"
  {...$$restProps}
  {href}
  class={'after:bg-white dark:after:bg-[#0d0d0d] before:bg-white dark:before:bg-[#0d0d0d]' +
    className}
  style="color:#5d5d5d;"
  data-sveltekit-prefetch
>
  <span>
    <slot />
  </span>
</a>
