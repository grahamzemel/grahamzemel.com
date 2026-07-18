<script>
  import { page } from "$app/stores";

  $: slug = $page.params.slug || "";
  $: validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 100;
  $: netlifyUrl = validSlug ? `https://${slug}-site.netlify.app` : "";
</script>

<svelte:head>
  <title>{slug} — Preview</title>
  <meta name="robots" content="noindex, nofollow" />
  <style>
    html,
    body {
      margin: 0;
      padding: 0;
      height: 100%;
      overflow: hidden;
    }
  </style>
</svelte:head>

{#if validSlug}
  <iframe
    src={netlifyUrl}
    title="{slug} preview"
    sandbox="allow-scripts allow-same-origin"
    style="position:fixed;top:0;left:0;width:100%;height:100%;border:none;"
  ></iframe>
{:else}
  <p>Invalid preview.</p>
{/if}
