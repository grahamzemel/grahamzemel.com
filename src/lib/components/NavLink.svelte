<script>
  // import NavImage from './NavImage.svelte'
  export let href
  // export let src
  // export let alt
  // export let outline = false
  let className = ''
  export { className as class }
</script>

<a
  target="_self"
  {...$$restProps}
  {href}
  class={'relative flex flex-row px-5 py-2 overflow-hidden font-bold text-zinc-500 rounded-lg group ' +
    className}
  data-sveltekit-prefetch
>
  <!-- <span
    class="absolute inset-0 w-full h-full transition duration-1000 ease-out opacity-0 bg-gradient-to-br from-zinc-200 via-[#e8e8e8] to-zinc-200 dark:from-zinc-800 dark:via-[#202020] dark:to-zinc-800 group-hover:opacity-[.75]"
  /> -->
  <!-- <span
    class="absolute top-0 left-0 w-full bg-gradient-to-b from-black dark:from-white to-transparent opacity-[0.075] h-1/3"
  />
  <span
    class="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black dark:from-white to-transparent opacity-[0.075]"
  />
  <span
    class="absolute bottom-0 left-0 w-4 h-full bg-gradient-to-r from-black dark:from-white to-transparent opacity-[0.075]"
  />
  <span
    class="absolute bottom-0 right-0 w-4 h-full bg-gradient-to-l from-black dark:from-white to-transparent opacity-[0.075]"
  /> -->
  <span
    class="absolute inset-0 w-full h-full border border-black dark:border-white rounded-md opacity-[0]"
  />  
  <!-- Small seperate image loading file required, without it the image fades on hover just like the background -->
  <span class="relative hover-underline-animation"><slot/></span>
  <!-- <NavImage {src} {alt} {outline}/> -->
  
</a>

<style>
  .hover-underline-animation {
  display: inline-block;
  position: relative;
}

.hover-underline-animation::after {
  content: '';
  position: absolute;
  width: 97.5%;
  transform: scaleX(0);
  height: 3px;
  bottom: 0;
  left: 0;
  background-color: #808080;
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}

.hover-underline-animation:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}
</style>