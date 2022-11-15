<script>
  export let href
  let className = ''

  export { className as class }
</script>

<a
  target="_self"
  {...$$restProps}
  {href}
  class={'after:bg-white dark:after:bg-[#070707] before:bg-white dark:before:bg-[#070707]' +
    className}
  style="color:#5d5d5d;"
  data-sveltekit-prefetch
>
  <span>
    <slot />
  </span>
</a>
