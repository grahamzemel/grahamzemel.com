<script>
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
  <meta name="twitter:description" content="Read more about Graham Zemel here!" />
  <meta name="twitter:image" content={ogImage} />
</svelte:head>

<div class="flex flex-col">
  <hr />
  <p
    class="flex justify-center items-baseline gap-4 !mb-2 title_header text-[#000000] dark:text-[#FFFFFF]"
  >
    Web Development
  </p>
  <hr />
  <h5 class="linkBtn">
    I have extensive experience in web development, primarily focusing on <strong>back-end aspects</strong>. However, I've recently been exploring front-end projects in my spare time as well. <br /> <br />
    In some of my blog posts, I delve into topics like <strong>SEO optimization</strong> and provide step-by-step guidance on creating
    <Link
      href={'https://medium.com/the-gray-area/creating-a-personal-portfolio-website-an-in-depth-guide-for-beginners-7155a785bfb3'}
    >
      your own portfolio website
    </Link>
    step-by-step. Whether you're new to programming, looking to showcase your achievements, or simply aiming to enhance your resume, the resources from that article are an <strong>excellent</strong> starting point.<br /><br />
    
    My latest projects in front-end development involve this website and a new endeavor associated with <Link href={'https://medium.com/the-gray-area'}>The Gray Area</Link> . This website was a trial run utilizing <strong>cutting-edge</strong> front-end libraries. If you're interested, you can find the source code on <Link href={'https://github.com/grahamzemel/grahamzemel.com'}>github.com/grahamzemel</Link> .
    <br /><br /><br />
  </h5>
  <br />
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
  <br />
  <hr />
  <p
    class="flex justify-center items-baseline gap-4 !mb-2 title_header text-[#000000] dark:text-[#FFFFFF]"
  >
    Cybersecurity
  </p>
  <hr />
  <h5 class="linkBtn">
    When I'm not writing blog posts or developing web applications, I enjoy delving into <strong>cybersecurity</strong>. There's an exhilarating feeling that comes with <Link
    href={'https://medium.com/the-gray-area/finding-p1-vulnerabilities-a-step-by-step-guide-b88521195204'}
  >
    discovering P1 vulnerabilties
  </Link> after hours, days, or even weeks of bug hunting.
    
    <br/> <br />
    Hacking is an <strong>incredible pursuit</strong>, whether it involves exploring the depths of the  <strong>dark web</strong>, developing <strong>custom malware</strong>, or <strong>bug hunting</strong> on government websites. Through my experiences, I've gained <strong>extensive</strong> knowledge about safeguarding online data and making it more challenging for black-hat hackers (the malicious ones) to <strong>compromise your security</strong>. I've even programmed website <Link href={'https://github.com/grahamzemel/WebHeckScanner'}>hacking scripts</Link> to automatically perform <strong>penetration tests</strong> and identify <strong>vulnerabilities</strong>.
    To gain a deeper understanding of what hacking truly entails and to learn how to enhance your online safety, I invite you to read my <Link
    href={'https://grahamzemel.medium.com/taking-control-of-turgistans-government-through-hacking-63da20fbcfca'}
  >
    somewhat satirical article
  </Link> on the topic.

    <br /><br /> <br />
  </h5>
  <br />
  <div class="flex justify-between text-gray dark:text-white text-[2rem] lg:text-[4rem]">
    <i class="devicon-linux-plain" />
    <i class="devicon-heroku-plain colored" />
    <i class="devicon-javascript-plain colored" />
    <i class="devicon-python-plain colored" />
    <i class="devicon-selenium-original colored" />
    <i class="devicon-vscode-plain colored" />
  </div>
  <br />
  <hr />
  <p
    class="flex justify-center items-baseline gap-4 !mb-2 title_header text-[#000000] dark:text-[#FFFFFF]"
  >
    Writing
  </p>
  <hr />
  <h5 class="linkBtn">
    I share my best articles through my <strong>publication</strong>, <Link href={'https://medium.com/the-gray-area'}>
      <strong>The Gray Area</strong>
    </Link>, with over <strong>half a million readers</strong>. These articles cover a range of topics, including <strong>programming tips</strong>, <strong>cybersecurity software</strong>, and <strong>bug bounties</strong>.

    Additionally, I publish new articles on a <strong>daily basis</strong> through my <Link href={'https://blog.grahamzemel.com'}>personal profile</Link>, with around 3000 followers. You can find my work on various social media platforms if you choose to follow me.
    <br><br>
    <div class="justify-between">
      Medium:
      <Link href={'https://blog.grahamzemel.com'}>
        <strong>@grahamzemel</strong>
      </Link>
      <br />
      <hr class="introBreak" />
      Twitter:
      <Link href={'https://twitter.com/grahamzemel'}>
        <strong>@grahamzemel</strong>
      </Link>
      <br />
      <hr class="introBreak" />
      TGA's Twitter:
      <Link href={'https://twitter.com/tgaonmedium'}>
        <strong>@tgaonmedium</strong>
      </Link>
      <br />
    </div>
    <br />
   

    <br /><br />
    If you're interested in making a substantial contribution to my writing or furthering my skills as a developer, you can become a patron on my <Link href={'https://www.patreon.com/grahamzemel'}>Patreon</Link>. By doing so, you'll gain access to private newsletters, exclusive source code for projects, and my personal contact information.
  </h5>
  <br />
</div>
