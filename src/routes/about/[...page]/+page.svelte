<script>
  import '../../../app.css'
  import '../../../app.css'
  import 'focus-visible'
  import { name, website } from '$lib/info'
  const ogImage = `${website}/favicon.png`
</script>

<svelte:head>
  <title>Graham Zemel | About Me</title>
  <meta name="description" content="Read more about Graham Zemel here!" />
  <meta name="author" content="Graham Zemel" />

  <meta property="og:url" content={website} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={name} />
  <meta property="og:description" content="Read more about Graham Zemel here!" />
  <meta property="og:image" content={ogImage} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content={website} />
  <meta property="twitter:url" content={name} />
  <meta name="twitter:title" content={name} />
  <meta name="twitter:description" content="Read more about Graham Zemel here!"  />
  <meta name="twitter:image" content={ogImage} />
</svelte:head>

<div class="flex flex-col">
  <hr />
  <p
    class="flex justify-center items-baseline gap-4 !mb-2 title_header text-[#000000] dark:text-[#FFFFFF]"
  >
    Web Development
  </p> <hr> <h5 class="linkBtn">
    I've done a fair amount of web dev, usually focusing on back-end aspects but I've been trying
    out a few front-end projects in my spare time. <br /> <br />
    In a few of my blog posts, I talk about SEO optimization and making
    <a
      class="after:bg-white dark:after:bg-[#070707] before:bg-white dark:before:bg-[#070707]"
      style="color:#5d5d5d;"
      href="https://medium.com/the-gray-area/creating-a-personal-portfolio-website-an-in-depth-guide-for-beginners-7155a785bfb3"
      ><span> your own portfolio website</span></a
    >
    step-by-step. If you're new to programming, want to show off some achievements, or just need another
    thing to add to your resume, that article is a great place to start.<br /><br />
    This website and it's branch-off,
    <a
      class="after:bg-white dark:after:bg-[#070707] before:bg-white dark:before:bg-[#070707]"
      style="color:#5d5d5d;"
      href="https://grayarea.grahamzemel.com/"><span>Graham Zemel: The Gray Area</span></a
    >
    , have been my latest projects involving front-end development. <br /> <br /> This website was a
    trial run of using some new front-end libraries, and I've got the source code up at
    <a
      class="after:bg-white dark:after:bg-[#070707] before:bg-white dark:before:bg-[#070707]"
      style="color:#5d5d5d;"
      href="https://github.com/grahamzemel/grahamzemel.com"><span>github.com/grahamzemel</span></a
    >
    if you're interested. <br /><br /><br />
    I build websites using the following frameworks and tools:
  </h5>
  <br>
  <div class="flex justify-between text-gray dark:text-white text-[2rem] lg:text-[4rem]">
    <i class="devicon-html5-plain colored" />
    <i class="devicon-javascript-plain colored" />
    <i class="devicon-css3-plain colored" />
    <i class="devicon-svelte-plain colored" />
    <i class="devicon-tailwindcss-plain colored" />
    <i class="devicon-npm-original-wordmark colored" />
    <i class="devicon-nodejs-plain colored" />
    <i class="devicon-vscode-plain colored" />
  </div>
<hr>
  <p
    class="flex justify-center items-baseline gap-4 !mb-2 title_header text-[#000000] dark:text-[#FFFFFF]"
  >
    Cybersecurity
  </p> <hr> <h5 class="linkBtn">
    When I'm not blogging or developing web apps, I'm hacking. I don't know if I've experienced a
    feeling better than <a
      class="after:bg-white dark:after:bg-[#070707] before:bg-white dark:before:bg-[#070707]"
      style="color:#5d5d5d;"
      href="https://medium.com/the-gray-area/finding-p1-vulnerabilities-a-step-by-step-guide-b88521195204"
      ><span> finding P1 vulnerabilties</span></a
    >
    when you're bug hunting.<br /> <br />
    Hacking is awesome, whether it's surfing the dark web, building custom malware, or generating more
    income. I've learned a ton about securing your data online and making it harder for black-hat hackers
    (the bad ones) to hack you, and I've even programmed automated website
    <a
      class="after:bg-white dark:after:bg-[#070707] before:bg-white dark:before:bg-[#070707]"
      style="color:#5d5d5d;"
      href="https://github.com/grahamzemel/WebHeckScanner"><span> hacking scripts</span></a
    >
    to see if a website might have vulnerabilties. <br /><br />
    To learn more about what hacking really means and how to stay safe online, check out this post:
    <a
      class="after:bg-white dark:after:bg-[#070707] before:bg-white dark:before:bg-[#070707]"
      style="color:#5d5d5d;"
      href="https://grahamzemel.medium.com/taking-control-of-turgistans-government-through-hacking-63da20fbcfca"
      ><span>Creating 'The Hacker': The Myths Of Cybersecurity</span></a
    > <br /><br /> <br />
    Here's a few tools I use relating to cybersecurity:
  </h5>
  <br>
  <div class="flex justify-between text-gray dark:text-white text-[2rem] lg:text-[4rem]">
    <i class="devicon-linux-plain" />
    <i class="devicon-heroku-plain colored" />
    <i class="devicon-javascript-plain colored" />
    <i class="devicon-python-plain colored" />
    <i class="devicon-selenium-original colored" />
    <i class="devicon-vscode-plain colored" />
  </div>
<hr>
  <p
    class="flex justify-center items-baseline gap-4 !mb-2 title_header text-[#000000] dark:text-[#FFFFFF]"
  >
    Writing
  </p> <hr> <h5 class="linkBtn">
    I post just about everything on my blog, <a
      class="after:bg-white dark:after:bg-[#070707] before:bg-white dark:before:bg-[#070707]"
      style="color:#5d5d5d;"
      href="https://medium.com/the-gray-area"><span>The Gray Area</span></a
    >
    (on Medium). Programming tips, cybersecurity software, bug bounties, you name it. <br /> <br />
    Anything that isn't on Medium is posted here:
    <a
      class="after:bg-white dark:after:bg-[#070707] before:bg-white dark:before:bg-[#070707]"
      style="color:#5d5d5d;"
      href="https://grayarea.grahamzemel.com/"><span>Graham Zemel: The Gray Area</span></a
    >. My personal blog is a branch off of the site you're currently on, grahamzemel.com. <br /><br
    />
    I post new articles every day, and I've got a few different social media accounts where you might
    see them if you follow me. <br />
    <div class="justify-between">
    Medium:
    <a
      class="after:bg-white dark:after:bg-[#070707] before:bg-white dark:before:bg-[#070707]"
      style="color:#5d5d5d;margin-top:1rem;margin-bottom:1rem;"
      href="https://medium.com/@grahamzemel"><span>grahamzemel</span></a
    ><br />
    Twitter:
    <a
      class="after:bg-white dark:after:bg-[#070707] before:bg-white dark:before:bg-[#070707]"
      style="color:#5d5d5d;margin-bottom:1rem;"
      href="https://twitter.com/grahamzemel"><span>@grahamzemel</span></a
    ><br />
    TGA's Twitter:
    <a
      class="after:bg-white dark:after:bg-[#070707] before:bg-white dark:before:bg-[#070707]"
      style="color:#5d5d5d;margin-bottom:1rem;"
      href="https://twitter.com/tgaonmedium"><span>@tgaonmedium</span></a
    ><br />
  </div>
    <br /> <br />
    If you subscribe to get my posts via email using
    <a
      class="after:bg-white dark:after:bg-[#070707] before:bg-white dark:before:bg-[#070707]"
      style="color:#5d5d5d;"
      href="https://medium.com/the-gray-area/newsletters/medium-the-gray-area"
      ><span>this link</span></a
    > , you'll be the first to know whenever I find something neat or post something new.
  </h5>
  <br />
</div>
