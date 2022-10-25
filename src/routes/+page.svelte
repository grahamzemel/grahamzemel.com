<script>
  import '../app.css'
  import '../prism.css'
  import 'focus-visible'
  import { name, website } from '$lib/info.js'
  import { onMount } from 'svelte'
  onMount(async function () {
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/the-gray-area')
      .then((res) => res.json())

      .then((data) => {
        // Filter for acctual posts. Comments don't have categories, therefore can filter for items with categories bigger than 0
        const res = data.items //This is an array with the content. No feed, no info about author etc..
        const posts = res.filter((item) => item.categories.length > 0).slice(0, 3) // That's the main trick* !
        // Functions to create a short text out of whole blog's content
        function toText(node) {
          let tag = document.createElement('div')
          tag.innerHTML = node
          node = tag.innerText
          return node
        }
        function shortenText(text, startingPoint, maxLength) {
          return text.length > maxLength ? text.slice(startingPoint, maxLength) : text
        }

        // Put things in right spots of markup
        let output = ''
        posts.forEach((item) => {
          output += `
         <li class="blog__post">
            <a href="${item.link}">
               <img src="${item.thumbnail}" class="blog__topImg"></img>
               <div class="blog__content">
                  <div class="blog_preview">
                     <h2 class="blog__title">${shortenText(item.title, 0, 60)}</h2>
                     <p class="blog__intro">${shortenText(toText(item.content), 0, 150) + '...'}</p>
                  </div>
                  <div class="blog__info">
                     <span class="blog__author">${item.author}</span>
                     <span class="blog__date">${shortenText(item.pubDate, 0, 10)}</span>
                  </div>
                  <hr>
               </div>
            <a/>
         </li>`
        })
        document.querySelector('.blog__slider').innerHTML = output
      })
  })
  const ogImage = new Image();
  ogImage.src = "../static/favicon.png";

</script>

<svelte:head>
  <title>{name}</title>
  <meta name="description" content="Hi! I'm Graham Zemel - A full-stack developer, cybersecurity programmer, and IT enthusiast." />
  <meta name="author" content="Graham Zemel" />

  <!-- Facebook Meta Tags -->
  <meta property="og:url" content={website} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={name} />
  <meta property="og:description" content="Hi! I'm Graham Zemel - A full-stack developer, cybersecurity programmer, and IT enthusiast." />
  <meta property="og:image" content={ogImage} />

  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content={website} />
  <meta property="twitter:url" content={name} />
  <meta name="twitter:title" content={name} />
  <meta name="twitter:description" content="Hi! I'm Graham Zemel - A full-stack developer, cybersecurity programmer, and IT enthusiast."  />
  <meta name="twitter:image" content={ogImage} />
</svelte:head>
<!-- RIGHT COLUMN -->
<div class="mediumInvisible lg:absolute" style="justify-content:right;text-align:right;top:0%;left:79.5%;">
  <section id="blog" class="blog">
    <div class="blog__header">
      <p class="blog__header1 text-[#4b5563] dark:text-white">New From</p>
      <div>
        <a href="https://medium.com/the-gray-area/">
          <img
            src="/grayArea.jpg"
            alt="The Gray Area Medium"
            style="height:75px;width:75px;border-style:solid; border-color: #5a5a5a;padding:5px;border-width: 1px;"
          />
        </a>
      </div>
      <p class="blog__header2 text-[#4b5563] dark:text-white">The Gray Area</p>
    </div>
    <ul class="blog__slider">Javascript Required</ul>
  </section>
</div>

<div class="flex flex-col">
  <h2 class="flex text-3xl lg:text-4xl items-baseline gap-4 !mb-2">About Me</h2>
  <hr />
  <h2>
    Hi! I'm Graham Zemel - A full-stack developer, cybersecurity programmer, and IT enthusiast.
  </h2>
  <h3 style="color:lightgray">
    I develop websites💻, code malware👾, and write about the latest and greatest in computer
    science📝.
  </h3>
  <br />
  <h3>Web Development</h3>
  <h5 class="linkBtn">
    I've done a fair amount of web dev, usually focusing on back-end aspects but I've been trying
    out a few front-end projects in my spare time. <br /> <br />
    In a few of my blog posts, I talk about SEO optimization and making
    <a
      class="after:bg-white dark:after:bg-black before:bg-white dark:before:bg-black"
      style="color:#5d5d5d;"
      href="https://medium.com/the-gray-area/creating-a-personal-portfolio-website-an-in-depth-guide-for-beginners-7155a785bfb3"
      ><span> your own portfolio website</span></a
    >
    step-by-step. If you're new to programming, want to show off some achievements, or just need another
    thing to add to your resume, that article is a great place to start.<br /><br />
    This website and it's branch-off,
    <a
      class="after:bg-white dark:after:bg-black before:bg-white dark:before:bg-black"
      style="color:#5d5d5d;"
      href="https://grayarea.grahamzemel.com/"><span>Graham Zemel: The Gray Area</span></a
    >
    , have been my latest projects involving front-end development. <br /> <br /> This website was a
    trial run of using some new front-end libraries, and I've got the source code up at
    <a
      class="after:bg-white dark:after:bg-black before:bg-white dark:before:bg-black"
      style="color:#5d5d5d;"
      href="https://github.com/grahamzemel/grahamzemel.com"><span>github.com/grahamzemel</span></a
    >
    if you're interested. <br /><br /><br />
    I build websites using the following frameworks and tools:
  </h5>
  <h5 class="text-gray dark:text-white">
    <p><i class="devicon-html5-plain colored" /> : HTML5</p>
    <p><i class="devicon-javascript-plain colored" /> : Javascript</p>
    <p><i class="devicon-css3-plain colored" /> : CSS3</p>
    <p><i class="devicon-svelte-plain colored" /> : Svelte</p>
    <p><i class="devicon-tailwindcss-plain colored" /> : Tailwild CSS</p>
    <p><i class="devicon-npm-original-wordmark colored" /> : NPM</p>
    <p><i class="devicon-nodejs-plain colored" /> : Node.JS</p>
    <p><i class="devicon-wordpress-plain colored" /> : Wordpress</p>
  </h5>

  <h3>Cybersecurity</h3>
  <h5 class="linkBtn">
    When I'm not blogging or developing web apps, I'm hacking. I don't know if I've experienced a
    feeling better than <a
      class="after:bg-white dark:after:bg-black before:bg-white dark:before:bg-black"
      style="color:#5d5d5d;"
      href="https://medium.com/the-gray-area/finding-p1-vulnerabilities-a-step-by-step-guide-b88521195204"
      ><span> finding P1 bugs</span></a
    >
    when you're bug hunting.<br /> <br />
    Hacking is awesome, whether it's surfing the dark web, building custom malware, or generating more
    income. I've learned a ton about securing your data online and making it harder for black-hat hackers
    (the bad ones) to hack you, and I've even programmed automated website
    <a
      class="after:bg-white dark:after:bg-black before:bg-white dark:before:bg-black"
      style="color:#5d5d5d;"
      href="https://github.com/grahamzemel/WebHeckScanner"><span> hacking scripts</span></a
    >
    to see if a website might have vulnerabilties. <br /><br />
    To learn more about what hacking really means and how to stay safe online, check out this post:
    <a
      class="after:bg-white dark:after:bg-black before:bg-white dark:before:bg-black"
      style="color:#5d5d5d;"
      href="https://grahamzemel.medium.com/taking-control-of-turgistans-government-through-hacking-63da20fbcfca"
      ><span>Creating 'The Hacker': The Myths Of Cybersecurity</span></a
    > <br /><br /> <br />
    Here's a few tools I use relating to cybersecurity:
  </h5>
  <h5 class="text-gray dark:text-white">
    <p><i class="devicon-linux-plain" /> : Linux</p>
    <p><i class="devicon-bash-plain colored" /> : Bash</p>
    <p><i class="devicon-heroku-plain colored" /> : Heroku</p>
    <p><i class="devicon-javascript-plain colored" /> : Javascript</p>
    <p><i class="devicon-python-plain colored" /> : Python</p>
    <p><i class="devicon-selenium-original colored" /> : Selenium</p>
    <p><i class="devicon-vscode-plain colored" /> : Visual Studio Code</p>
  </h5>

  <h3>Writing</h3>
  <h5 class="linkBtn">
    I post just about everything on my blog, <a
      class="after:bg-white dark:after:bg-black before:bg-white dark:before:bg-black"
      style="color:#5d5d5d;"
      href="https://medium.com/the-gray-area"><span>The Gray Area</span></a
    >
    (on Medium). Programming tips, cybersecurity software, bug bounties, you name it. <br /> <br />
    Anything that isn't on Medium is posted here:
    <a
      class="after:bg-white dark:after:bg-black before:bg-white dark:before:bg-black"
      style="color:#5d5d5d;"
      href="https://grayarea.grahamzemel.com/"><span>Graham Zemel: The Gray Area</span></a
    >. My personal blog is a branch off of the site you're currently on, grahamzemel.com. <br /><br
    />
    I post new articles every day, and I've got a few different social media accounts where you might
    see them if you follow me. <br />
    Medium:
    <a
      class="after:bg-white dark:after:bg-black before:bg-white dark:before:bg-black"
      style="color:#5d5d5d;margin-top:1rem;margin-bottom:1rem;"
      href="https://medium.com/@grahamzemel"><span>grahamzemel</span></a
    ><br />
    Twitter:
    <a
      class="after:bg-white dark:after:bg-black before:bg-white dark:before:bg-black"
      style="color:#5d5d5d;margin-bottom:1rem;"
      href="https://twitter.com/grahamzemel"><span>@grahamzemel</span></a
    ><br />
    (More to come!) <br /> <br />
    If you subscribe to get my posts via email using
    <a
      class="after:bg-white dark:after:bg-black before:bg-white dark:before:bg-black"
      style="color:#5d5d5d;"
      href="https://medium.com/the-gray-area/newsletters/medium-the-gray-area"
      ><span>this link</span></a
    > , you'll be the first to know whenever I find something neat or post something new.
  </h5>
  <br />
</div>
