<script>
  import { prefersReducedMotion } from '$lib/data/store'
  import { TIMING_DURATION } from '$lib/data/constants'
  import { onMount } from 'svelte'

  export let color = 'transparent'
  export let out = false
  export let gridWidth = 0

  let size = 0.5

  onMount(() => {
    const cellSize = Math.random()
    if (cellSize > 0.95) {
      size = 1.5
    } else if (cellSize > 0.8) {
      size = 1
    }
  })

  var randomDelay = function () {
    return Math.random() * 0.5 + 's'
  }

  const randomX = function () {
    const randomLeftValue = Math.floor(Math.random() * gridWidth - 1) - size * 2

    return `${randomLeftValue / 2}rem`
  }

  const randomDrop = function () {
    const drop = Math.random() * 100
    if (drop > 93) {
      return '1rem'
    } else if (drop > 80) {
      return '0.5rem'
    } else if (drop > 60) {
      return '-0.5rem'
    } else if (drop > 40) {
      return '-1rem'
    }
    return '0'
  }

  const randomTiming = function () {
    return Math.floor(Math.random() * TIMING_DURATION * 1.2)
  }
</script>

{#key randomTiming()}
    <div
      class="cell"
      class:reduce={$prefersReducedMotion}
      class:out
      style="
				background: {color};
				width: {size}rem;
				height: {size}rem;
				animation-delay: {randomDelay()};
				top: {randomDrop()};
				left: {randomX()};
			"/>
{/key}

<style lang="scss">
  .cell {
    opacity: 0;
    mix-blend-mode: overlay;
    position: absolute;
    animation: fade_in 0.36s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  }
  .cell.out {
    opacity: 1;
    animation: fade_out 0.36s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards;
  }
  .cell.out.reduce {
    animation-name: reduce_motion_fade;
  }
  .cell.out.reduce.out {
    animation-name: reduce_motion_fade_reverse;
  }
  
  
  @keyframes fade_in {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fade_out {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-12px);
    }
  }

  @keyframes reduce_motion_fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

</style>
