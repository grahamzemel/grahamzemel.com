---
title: IDOR Automation
date: 2022-10-20
time: 08:10:30.000Z
category: Programming Hacking Python
sourceCode: https://github.com/grahamzemel/idorAutomation 
---
<script>  
import Link from '$lib/components/Link.svelte'
</script>
<div class="linkBtn">

This was a simple Python script for parsing data from hacked sites. Check out some methods of hacking that I use which are published onto <Link href='https://medium.com/the-gray-area'>creating my blog</Link> !

I post a bunch of my bug-bounty endeavors on my Medium blog, so if you want to learn about things like <Link href='https://medium.com/the-gray-area/p1-bug-bounties-multi-factor-authentication-bypass-ca040180ab3f'>MFA Bypass</Link> , <Link href='https://medium.com/the-gray-area/a-500-open-redirect-bounty-in-under-10-minutes-fbb1cce063e5'>Open-Redirect Exploitation</Link> , and <Link href='https://medium.com/the-gray-area/finding-p1-vulnerabilities-tools-resources-32bb2e7a52fb'>Finding P1 Bugs</Link> . 

![idor](./idor.png)

Utilizing a few of the tools I'd become familiar with, I ended up hacking a website for <Link href='https://medium.com/the-gray-area/1-000-p1-pii-disclosure-w-idor-cb344c55d52e'>PII disclosure with IDORs</Link> (Insecure Direct Object Reference), and was able to quickly exfiltrate data with this tool.

If you're not familiar with hacking but still find it interesting and want to learn more, check out <Link href='https://medium.com/the-gray-area/everything-you-need-to-know-in-becoming-a-red-team-hacker-66ef63e8187f'>The Road to Professional Red-Team Hacker</Link> .

</div>