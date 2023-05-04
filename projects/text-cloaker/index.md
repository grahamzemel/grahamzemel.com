---
title: Text Cloaker
date: 2023-05-04
time: 19:34
category: Programming Internet AI
featured: true
liveDemo: https://chrome.google.com/webstore/detail/textcloaker/kkijlllkhpclojhcgmdnjcddlmfccgcc
sourceCode: https://github.com/grahamzemel/TextCloaker
---
<script>  
import Link from '$lib/components/Link.svelte'
</script>
<div class="linkBtn">

A Google Extension to cloak your AI-generated text from those nosy detectors! 100% effective, free, and fast. Privacy Policy <Link href='https://grahamzemel.com/privacypolicy.html'>here</Link> .

This is a neat project I made that inserts specific invisible characters into text with Google Docs APIs, and alters it so that AI detectors will not parse the document properly. As a result, any AI detector will identify the document as being written <strong>entirely by a human</strong>, as tested on <strong>ZeroGPT</strong>, <strong>CopyLeaks</strong>, and many more.

<img
     alt="TextCloaker Google Extension"
     loading="lazy"
     decoding="async"
     width="672"
     height="448"
     src="./txtcloaker.png"
/>

</div>