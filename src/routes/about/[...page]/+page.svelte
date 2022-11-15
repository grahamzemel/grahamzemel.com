<script>
  import '../../../app.css'
  import '../../../app.css'
  import 'focus-visible'
  import Link from '$lib/components/Link.svelte'
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
    <Link href={'https://medium.com/the-gray-area/creating-a-personal-portfolio-website-an-in-depth-guide-for-beginners-7155a785bfb3'}>
      your own portfolio website
    </Link>
    step-by-step. If you're new to programming, want to show off some achievements, or just need another
    thing to add to your resume, that article is a great place to start.<br /><br />
    This website and a new project I'm working on in relation to
    <Link href={'https://medium.com/the-gray-area'}>
      The Gray Area
    </Link>
     have been my latest projects involving front-end development. <br /> <br /> This website was a
    trial run of using some new front-end libraries, and I've got the source code up at
    <Link href={'https://github.com/grahamzemel/grahamzemel.com'}>
      github.com/grahamzemel
    </Link>
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
  <br>
<hr>
  <p
    class="flex justify-center items-baseline gap-4 !mb-2 title_header text-[#000000] dark:text-[#FFFFFF]"
  >
    Cybersecurity
  </p> <hr> <h5 class="linkBtn">
    When I'm not blogging or developing web apps, I'm hacking. 
    <Link href={'https://medium.com/the-gray-area/finding-p1-vulnerabilities-a-step-by-step-guide-b88521195204'}>
      Finding P1 vulnerabilties
    </Link>
    is a phenomenal feeling when you're bug hunting for hours, days, sometimes weeks at a time.<br /> <br />
    Hacking is awesome, whether it's surfing the dark web, building custom malware, or generating more
    income. I've learned a ton about securing your data online and making it harder for black-hat hackers
    (the bad ones) to hack you, and I've even programmed website
    <Link href={'https://github.com/grahamzemel/WebHeckScanner'}>
      hacking scripts
    </Link>
    to automatically pen-test websites for vulnerabilties. <br /><br />
    To learn more about what hacking really means and how to stay safe online, check out 
    <Link href={'https://grahamzemel.medium.com/taking-control-of-turgistans-government-through-hacking-63da20fbcfca'}>
      Creating 'The Hacker'
    </Link>.
    <br /><br /> <br />
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
  <br>
<hr>
  <p
    class="flex justify-center items-baseline gap-4 !mb-2 title_header text-[#000000] dark:text-[#FFFFFF]"
  >
    Writing
  </p> <hr> <h5 class="linkBtn">
    I post just about everything on my blog, 
    <Link href={'https://medium.com/the-gray-area'}>
    The Gray Area
    </Link>
    . Programming tips, cybersecurity software, bug bounties, you name it. <br /> <br />

    I post new articles every day, and I've got a few different social media accounts where you might
    see them if you follow me. <br /> <br />
    <div class="justify-between">
    <!-- <hr class="introBreak"> -->
    Medium:
    <Link href={'https://blog.grahamzemel.com'}>
      @grahamzemel
    </Link>
    <br />
    <hr class="introBreak">
    Twitter:
    <Link href={'https://twitter.com/grahamzemel'}>
      @grahamzemel
    </Link>
    <br />
    <hr class="introBreak">
    TGA's Twitter:
    <Link href={'https://twitter.com/tgaonmedium'}>
      @tgaonmedium
    </Link>
    <br />
  </div>
    <br />
    If you subscribe to get my posts via email using
    <Link href={'https://medium.com/the-gray-area/newsletters/medium-the-gray-area'}>
      this link
    </Link>
    , you'll be the first to know whenever I find something neat or post something new.
  </h5>
  <br />
</div>
