<script>
    import { prefersReducedMotion } from '$lib/data/store'
    import { TIMING_DURATION } from '$lib/data/constants'
    import { cubicIn, cubicOut } from 'svelte/easing'
    import { fly } from 'svelte/transition'

    let yIn
    let yOut
    yIn = $prefersReducedMotion ? 0 : 12
    yOut = $prefersReducedMotion ? 0 : -12
    export let refresh = ''
    export let span = false
    export let transitionIn = true
    export let transitionOut = true
</script>
{#key refresh}
  <div
    class="transition-wrapper"
    class:span
    in:fly={ { 
      y: yIn,
      duration: transitionIn ? TIMING_DURATION : 0,
      delay: transitionIn ? TIMING_DURATION : 0,
      easing: cubicOut 
    }}
    out:fly={{
      y: yOut,
      duration: transitionOut ? TIMING_DURATION : 0,
      easing: cubicIn
    }}
  >
    <slot />
  </div>
{/key}
<style>
.transition-wrapper.span {
	 grid-column: -1;
	 grid-row: 0.5;
}
</style>