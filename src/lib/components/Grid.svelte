<script>
  import GridCell from './GridCell.svelte'

  import { onMount } from 'svelte'
  import { browser } from '$app/environment'
  import debounce from 'just-debounce'

  export let refresh = ''
  let inverted = false
  let squareCount = 0
  var count = 0
  var gridWidth = 0
  var out = false
  var thisPage = ''
  var loadedIn = false

  var colorList = [
    'black',
    'dimgray',
    'gray',
    'darkgray',
    'darkblue',
    '#0F1789',
    '#1A1E52',
    '#141d29'
  ]

  if (refresh && loadedIn) {
    out = true
    setTimeout(function () {
      thisPage = refresh
      out = false
    }, 360)
  } else {
    loadedIn = true
  }
  var setSquareCount = debounce(function () {
    if (!browser) return
    var newGridWidth =
      (window.innerWidth /
        parseInt(
          window.getComputedStyle(window.document.body, null).getPropertyValue('font-size')
        )) * 2
    // Prevents re-renders when only height changes
    if (gridWidth && gridWidth === newGridWidth) {
      return
    }
    gridWidth = newGridWidth / 1.9
    thisPage == refresh ? (thisPage = String(Math.random())) : (thisPage = refresh)
    if (squareCount) {
      count = squareCount / 10
      return
    }
    count = Math.floor(
      (window.innerWidth /
        (parseInt(
          window.getComputedStyle(window.document.body, null).getPropertyValue('font-size')
        ) /
          0.65)) *
        2
    )
  }, 300)
  onMount(function () {
    setSquareCount()
    thisPage = refresh
  })
  var randomColor = function () {
      var color = Math.floor(Math.random() * colorList.length)
      return colorList[color]
    
  }
</script>

<svelte:window on:resize={setSquareCount}/>

<div class="grid-wrapper">
  {#key thisPage}
    <div class="cell-grid" class:inverted aria-hidden="true">
      {#each Array(count) as cell}
        <GridCell color={randomColor()} {out} {gridWidth}/>
      {/each}
    </div>
  {/key}
</div>

<style lang="scss">
  
  .grid-wrapper {
    height: 2.5rem;
    position: relative;
    contain: layout size style;
    justify-content: center;
    justify-items: center;
    text-align: center;
    top: .5rem;
    left: 5%;
  }

  .cell-grid {
    height: 2.5rem;
    position: relative;
    z-index: 2;
    top: 0.5rem;
  }
  .cell-grid.inverted {
    top: 2.5rem;
  }
  .cell-grid.cell-grid.inverted:before {
    --paperHSL: darkblue;
    top: 0;
  }
  .cell-grid:before {
    content: '';
    background: linear-gradient(60deg, hsla(var(--paperHSL), 0), hsla(var(--paperHSL), 0.5));
    height: 4rem;
    position: relative;
    top: -1rem;
    z-index: 2;
  }
  @media only screen and (max-width: 1350px) {
    .cell-grid:before{
      height: 2rem;
      width: fit-content !important;
    }
    .grid-wrapper{
      left: 15% !important;
    }
  }
  @media only screen and (max-width: 885px) {
    .cell-grid:before{
      height: 2rem;
      width: fit-content !important;
    }
    .grid-wrapper{
      left: 22.5% !important;
    }
  }
  @media only screen and (max-width: 625px) {
    .cell-grid:before{
      height: 2rem;
      width: fit-content !important;
    }
    .grid-wrapper{
      left: 25% !important;
    }
  }
</style>
