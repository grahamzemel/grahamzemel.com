<script>
    export let src
    export let alt
    export let outline = false
</script>
  
{#if outline}
<img class="!opacity-[1] hover:opacity-[1] !p-[2px] !border-[#666666] !border-[1px] rounded-md absolute top-[-0.5rem] right-[-1rem]" {alt} height="30" width="30" {src} />
{:else}
<img class="!opacity-[1] absolute top-[-0.5rem] right-[-1rem]" {alt} height="30" width="30" {src} />
{/if}