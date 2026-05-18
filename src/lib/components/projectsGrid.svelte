<script lang="ts">
  const projects = [
    {
      title: "FratDoor",
      description:
        "The check-in operating system I built and deployed as Director of Technology for IFC on the Hill at CU Boulder. 42 chapters use it for ID/QR scanning, blacklist enforcement, ticketing, capacity gates, and live attendance analytics — backed by my own offline-first sync layer that keeps scanners working through venue WiFi blackouts. 150,000+ swipes processed across 300+ events.",
      image: "/fratdoor.png",
      tags: ["Web", "Internet", "IFC"],
      repoLink: null,
      demoLink: "https://fratdoor.com",
      featured: true,
    },
    {
      title: "Text Cloaker",
      description:
        "AI text protection tool I started after watching students and writers get falsely flagged by brittle AI detectors. Rewrites AI-generated text just enough to clear detection without changing meaning — running as a Chrome extension that hooks into Google Docs, or via the web app for one-off cloaks. 7,000+ users across 40+ countries have cloaked over 3.3 million characters with it.",
      image: "/textcloakerss.png",
      tags: ["AI", "Web", "Internet"],
      repoLink: null,
      demoLink: "https://text-cloaker.com",
      featured: true,
    },
    {
      title: "NPM Library: Offline Sync Engine",
      description:
        "Keeps your check-in scanner working when the venue's WiFi dies. A tiny offline-first mutation queue + idempotent server primitives I built for FratDoor and open-sourced — ~900 lines, zero runtime deps, on NPM. ULID idempotency keys + IndexedDB persistence give exactly-once delivery even through ack-loss, browser refreshes, and server restarts. Optional SSE-based realtime + catch-up replay (same pattern as Linear's sync engine) lets multiple scanners coordinate at the door.",
      image: "/offline-sync-engine.png",
      tags: ["Library", "Web"],
      repoLink: "https://github.com/grahamzemel/offline-sync-engine",
      demoLink: "https://grahamzemel.github.io/offline-sync-engine/",
      featured: true,
    },
    {
      title: "Apartment Availability Tracker",
      description:
        "A lightweight GitHub Actions cron I built while apartment hunting in Boulder. Every 24 hours it scrapes my target building's listings, scores each 2BR unit by floor plan + Flatirons view, and emails me a diff summary so I can pounce the day a good unit opens. Runs free on Actions minutes — beats refreshing the page 50 times a day.",
      image: "/spark-tracker.png",
      tags: ["Automation", "Internet"],
      repoLink: "https://github.com/grahamzemel/spark-tracker",
      demoLink: null,
    },
    {
      title: "Nick Lathrop Photography",
      description:
        "Photography portfolio I designed and built for Nick Lathrop, a senior-portrait and sideline shooter based in Golden, CO. Astro 5 + Svelte islands + Tailwind v4, with GSAP ScrollTrigger smoothness and a PhotoSwipe lightbox. A Playwright stealth scraper running on a 24-hour GitHub Actions cron pulls fresh Instagram posts (bypassing API restrictions), pushes full-res images to Cloudflare R2, and triggers a Netlify rebuild — so the portfolio updates itself whenever Nick shoots.",
      image: "/gingersnaps.jpg",
      tags: ["Web", "Internet"],
      repoLink: "https://github.com/grahamzemel/gingersnaps",
      demoLink: "https://nicksphotography.netlify.app/",
    },
    {
      title: "CU EventHub",
      description:
        "Centralized event registration and safety workflow hub I built for IFC on the Hill chapters at CU Boulder. Chapters submit parties, surface emergency contacts, coordinate with risk managers, and standardize event compliance — all from a single dashboard that pairs with FratDoor at the door itself.",
      image: "/ifc-eventhub.png",
      tags: ["Web", "Internet", "IFC"],
      repoLink: null,
      demoLink: "https://cueventhub.netlify.app/",
    },
    {
      title: "Student Living Advocacy Group",
      description:
        "Reporting hub I built so off-campus students on the Hill in Boulder can document housing problems — predatory leases, maintenance neglect, neighbor disputes — and feed them into a structured advocacy pipeline for IFC and local stakeholders.",
      image: "/slag.png",
      tags: ["Web", "Internet", "IFC"],
      repoLink: null,
      demoLink: "https://hillneighborhoodslag.netlify.app/",
    },
    {
      title: "The Vault Collection",
      description:
        "Unity + C# mobile collection bundling Flappy Bird, Stacker, Pong, and Brick Breaker into a single App Store release — my first commercial mobile product, complete with in-app payments and rewarded ads. The project that taught me the full ship-to-store pipeline end to end.",
      image: "/vaultcollection.png",
      tags: ["App", "Game"],
      repoLink: null,
      demoLink: null,
    },
    {
      title: "Graham Zemel (.com)",
      description:
        "Version 4.0 of my personal site, hand-built in SvelteKit + Tailwind. Doubles as my front-end playground — every iteration ships some new pattern I want to try (parallax scrolls, glassmorphic cards, observer-driven animations) without breaking the SEO and performance gains from prior versions. Source is on GitHub if you want to poke around.",
      image: "/grahamzemel.com.png",
      tags: ["Internet"],
      repoLink: "https://github.com/grahamzemel/grahamzemel.com",
      demoLink: "https://grahamzemel.com",
    },
    {
      title: "Game Bank",
      description:
        "Online arcade I'm building with a friend — a single hub where friends drop in to play classic browser games together or solo. Live preview is up; still iterating on the lobby + matchmaking layer.",
      image: "/gamebank.png",
      tags: ["Game", "Web"],
      repoLink: "https://github.com/grahamzemel/gamebank",
      demoLink: "https://gamebank.netlify.app",
    },
    {
      title: "QuantumChat",
      description:
        "Experimental chat room that wires the BB84 quantum-key-distribution protocol up to a live messaging UI. Two browsers negotiate a shared key over a simulated quantum channel, detect eavesdropping via QBER, and symmetric-encrypt every message — basically QKD as a teaching toy you can play with in your browser.",
      image: "/quantumss.png",
      tags: ["Quantum", "AI"],
      repoLink: null,
      demoLink: "https://quantum-chat.netlify.app",
    },
    {
      title: "Powerschool GPA Calculator",
      description:
        "Chrome extension I built in high school that auto-calculates weighted and unweighted GPAs directly inside the PowerSchool gradebook — no scraping, no logins, just a clean overlay on top of the page. Still pulling installs from the Chrome Web Store years later.",
      image: "/powerschoolss.png",
      tags: ["Internet", "Extension"],
      repoLink:
        "https://github.com/grahamzemel/PowerschoolGPACalculator",
      demoLink:
        "https://chrome.google.com/webstore/detail/powerschool-gpa-calculato/dgfnbmfhjioifionnlcklnpfkkjjglbj?hl=en&authuser=0",
    },
    {
      title: "Medium Twitter Bot",
      description:
        "Automation that watches @TGAonMedium's Medium feed and posts each new Gray Area article to Twitter the moment it goes live. Runs on Heroku off the Medium RSS feed + the Twitter API — zero manual work between drafting and audience.",
      image: "/tgaonmediumss.png",
      tags: ["Python", "Telegram"],
      repoLink: "https://github.com/grahamzemel/MediumTwitterBot",
      demoLink: "https://twitter.com/TGAonMedium",
    },
    {
      title: "Web Heck Scanner",
      description:
        "Bash-driven recon and vulnerability scanning toolkit that wires together Nikto, Nuclei, SQLMap, gau/gauplus, anew, httpx, and waybackurls behind a single command. My opening move in bug-hunting engagements: pick a target, run one script, walk away with a structured set of leads.",
      image: "/webheckscannerss.png",
      tags: ["Shell", "Internet", "Bash"],
      repoLink: "https://github.com/grahamzemel/WebHeckScanner",
      demoLink: null,
    },
    {
      title: "Hecker Bot",
      description:
        "Telegram bot I built as a front-end for my bug-bounty workflow — DM it a target and it kicks off recon, subdomain enumeration, vulnerability scans, and reporting steps that I'd otherwise chain by hand in the terminal.",
      image: "/heckerbotss.jpg",
      tags: ["Automation", "Telegram"],
      repoLink: null,
      demoLink: "https://t.me/heckerbot2022bot",
    },
    {
      title: "Bash Bunny",
      description:
        "Hotplug attack payloads I wrote for the Hak5 Bash Bunny — the small USB device that emulates HID, ethernet, and storage to drop into a locked machine in seconds. Covers credential grabs, network reconnaissance, and quick-touch persistence checks during physical pen tests.",
      image: "/bashbunnyss.png",
      tags: ["Automation", "Bash"],
      repoLink: "https://github.com/grahamzemel/Hotplug_Attacks",
      demoLink: null,
    },
    {
      title: "IDOR Automation",
      description:
        "Python scripts I wrote during a P1 bug-bounty engagement to enumerate IDOR (Insecure Direct Object Reference) endpoints — base64-encoding then URL-encoding values to bypass weak access controls. The full disclosure write-up lives on my Medium.",
      image: "/idorss.png",
      tags: ["Python", "Automation"],
      repoLink: "https://github.com/grahamzemel/idorAutomation",
      demoLink: null,
    },
    {
      title: "Aesculapius",
      description:
        "Healthcare-accessibility chatbot that won the MetroHacks 2022 healthcare track. Built in 24 hours with Svelte + Tailwind + TypeScript on the front-end and a Python + Cohere-powered intent classifier on the back-end, plus Twilio for emergency SMS escalation. The bot interprets free-text health questions and returns mapped/graphed information — or routes the user to emergency services when intent warrants it.",
      image: "/aesculapiusss.png",
      tags: ["Web", "Hackathon"],
      repoLink: "https://github.com/grahamzemel/Aesculapius-FrontEnd",
      demoLink: "https://aesculapius.tech",
    },
    {
      title: "Template Project",
      description:
        "Reusable starter template I cut from my actual project boilerplate — Svelte + Bulma on the front, Python on the back. Saves me roughly an hour of yak-shaving every time I start a new prototype.",
      image: "/templateprojss.png",
      tags: ["Web", "Internet"],
      repoLink: "https://github.com/grahamzemel/TemplateProj",
      demoLink: null,
    },
    {
      title: "Crypto Token Template",
      description:
        "Beginner-friendly template for spinning up your own ERC-20 token in REMIX. Ships three Solidity contracts at escalating complexity, deploy scripts using web3.js + ethers.js, and Solidity unit tests — meant as a learning scaffold (and absolutely not a rug-pull starter kit, despite what the dropdown might suggest).",
      image: "/cryptoss.png",
      tags: ["Internet", "Crypto"],
      repoLink: "https://github.com/grahamzemel/CreateCryptoToken",
      demoLink: null,
    },
    {
      title: "Discrete Mathematics",
      description:
        "Working notes, code, and Python explorations from my Discrete Math class at CU Boulder. Set theory, graph algorithms, combinatorics, and a handful of fractal visualizations that ended up being the most fun part of the semester.",
      image: "/fractalsss.png",
      tags: ["Python"],
      repoLink: "https://github.com/grahamzemel/DiscreteMath",
      demoLink: null,
    },
  ];

  const projectsWithWebsite = projects.map((project) => {
    const tags = project.demoLink
      ? Array.from(new Set([...project.tags, "Website"]))
      : project.tags;
    return { ...project, tags };
  });

  let query = "";
  let activeTag: string | null = null;
  let sortMode = "featured";

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  const getTagClass = (tag: string) => {
    switch (tag) {
      case "Quantum":
        return "bg-red-50 text-red-600";
      case "AI":
        return "bg-orange-50 text-orange-600";
      case "Web":
        return "bg-lime-50 text-lime-600";
      case "Game":
        return "bg-pink-50 text-pink-600";
      case "App":
        return "bg-emerald-50 text-emerald-600";
      case "Extension":
        return "bg-cyan-50 text-cyan-600";
      case "Website":
        return "bg-sky-50 text-sky-600";
      case "Internet":
        return "bg-teal-50 text-teal-600";
      case "Python":
        return "bg-green-50 text-green-600";
      case "Telegram":
        return "bg-blue-50 text-blue-600";
      case "Shell":
        return "bg-purple-50 text-purple-600";
      case "Bash":
        return "bg-red-50 text-red-600";
      case "Library":
        return "bg-indigo-50 text-indigo-600";
      case "Automation":
        return "bg-yellow-50 text-yellow-600";
      case "Hackathon":
        return "bg-pink-50 text-pink-600";
      case "Crypto":
        return "bg-blue-50 text-blue-600";
      case "IFC":
        return "bg-amber-50 text-amber-600";
      default:
        return "bg-blue-50 text-blue-600";
    }
  };

  const tagCounts = projectsWithWebsite.reduce((acc, project) => {
    project.tags.forEach((tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const sortedTags = Object.keys(tagCounts).sort(
    (a, b) => tagCounts[b] - tagCounts[a]
  );

  $: normalizedQuery = query.trim().toLowerCase();
  $: filteredProjects = projectsWithWebsite.filter((project) => {
    const matchesTag = activeTag ? project.tags.includes(activeTag) : true;
    const matchesQuery = normalizedQuery
      ? `${project.title} ${project.description} ${project.tags.join(" ")}`
          .toLowerCase()
          .includes(normalizedQuery)
      : true;
    return matchesTag && matchesQuery;
  });

  $: sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortMode === "featured") {
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
    if (sortMode === "az") {
      return a.title.localeCompare(b.title);
    }
    if (sortMode === "za") {
      return b.title.localeCompare(a.title);
    }
    if (sortMode === "tags") {
      return b.tags.length - a.tags.length;
    }
    return 0;
  });
</script>

  <div class="project-filter">
    <div class="filter-bar">
      <input
        class="filter-input"
        type="search"
        placeholder="Search projects"
        bind:value={query}
      />
      <div class="filter-stats">
        <span class="filter-count">{sortedProjects.length}</span>
        <span class="filter-label">projects</span>
      </div>
      <label class="filter-select">
        <span>Sort</span>
        <select bind:value={sortMode}>
          <option value="featured">Featured first</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
          <option value="tags">Most tags</option>
        </select>
      </label>
      <button class="filter-reset" type="button" on:click={() => (query = "")}>
        Clear Search
      </button>
      <button
        class="filter-reset"
        type="button"
        on:click={() => (activeTag = null)}
      >
        Clear Tag
      </button>
    </div>
  <div class="tag-row">
    <button
      class="tag-chip {activeTag === null ? 'tag-chip--active' : ''}"
      type="button"
      on:click={() => (activeTag = null)}
    >
      All
      <span class="tag-count">{projectsWithWebsite.length}</span>
    </button>
    {#each sortedTags as tag}
      <button
        class="tag-chip {activeTag === tag ? 'tag-chip--active' : ''}"
        type="button"
        on:click={() => (activeTag = activeTag === tag ? null : tag)}
      >
        {tag}
        <span class="tag-count">{tagCounts[tag]}</span>
      </button>
    {/each}
  </div>
</div>

{#if sortedProjects.length === 0}
  <p class="mt-8 text-gray-400">No projects match this filter.</p>
{:else}
  <div class="projects-grid mt-8">
    {#each sortedProjects as project, index}
      <article
        class="project-card {index < 3 ? 'project-card--emphasis' : ''}"
      >
        {#if project.featured}
          <div class="featured-badge">Featured</div>
        {/if}
        <div class="project-media">
          <img src={project.image} alt={project.title} loading="lazy" />
        </div>
        <div class="project-body">
          <div class="project-text">
            <h3 class="project-title">{project.title}</h3>
            <p class="project-desc">{project.description}</p>
          </div>
          <div class="project-bottom">
            <div class="project-tags">
              {#each project.tags as tag}
                <span class="tag {getTagClass(tag)}">{tag}</span>
              {/each}
            </div>
            <div class="project-links">
              {#if project.demoLink}
                <a
                  class="project-link"
                  href={project.demoLink}
                  target="_blank"
                  rel="noopener noreferer"
                >
                  Website: {getDomain(project.demoLink)}
                </a>
              {/if}
              {#if project.repoLink}
                <a
                  class="project-link"
                  href={project.repoLink}
                  target="_blank"
                  rel="noopener noreferer"
                >
                  Repo
                </a>
              {/if}
            </div>
          </div>
        </div>
      </article>
    {/each}
  </div>
{/if}

<style lang="postcss">
  .project-filter {
    @apply mt-10 flex flex-col gap-4;
  }

  .filter-bar {
    @apply flex flex-col lg:flex-row gap-3 lg:items-center;
  }

  .filter-input {
    @apply w-full rounded-xl border border-slate-800 bg-[#0b0f14] px-4 py-3 text-sm text-gray-200 placeholder:text-gray-500;
    height: 3.25rem;
  }

  .filter-stats {
    @apply inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-[#0b0f14] px-4 py-3 text-sm text-gray-300;
    height: 3.25rem;
  }

  .filter-count {
    @apply text-lg font-semibold text-accent-300;
  }

  .filter-label {
    @apply text-xs uppercase tracking-widest text-gray-500;
  }

  .filter-reset {
    @apply rounded-xl border border-slate-800 bg-[#0b0f14] px-4 py-3 text-xs uppercase tracking-widest text-gray-400 transition-colors;
    height: 3.25rem;
  }

  .filter-reset:hover {
    @apply border-accent-300 text-accent-200;
  }

  @media (min-width: 1024px) {
    .project-filter {
      position: static;
      padding: 0;
      backdrop-filter: none;
      background: transparent;
    }
  }

  .tag-row {
    @apply flex flex-wrap gap-2;
  }

  .tag-chip {
    @apply rounded-full border border-slate-800 bg-[#0b0f14] px-3 py-1 text-xs text-gray-300 transition-colors inline-flex items-center gap-2;
  }

  .tag-chip:hover {
    @apply border-accent-300 text-accent-200;
  }

  .tag-chip--active {
    @apply border-accent-300 bg-[#12233a] text-accent-200;
  }

  .tag-count {
    @apply rounded-full bg-[#152437] px-2 py-0.5 text-[10px] text-gray-400;
  }

  .filter-select {
    @apply inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-[#0b0f14] px-4 py-2 text-xs uppercase tracking-widest text-gray-400;
    height: 3.25rem;
  }

  .filter-select select {
    @apply bg-transparent text-sm text-gray-200 outline-none;
  }

  .projects-grid {
    @apply grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6;
  }

  .project-card {
    @apply rounded-xl bg-[#070a0d] bg-opacity-60 shadow overflow-hidden flex flex-col relative border border-slate-800/80;
    aspect-ratio: 1 / 1;
  }

  .project-card--emphasis {
    @apply border border-accent-400/20 shadow-lg;
  }

  .project-card {
    @apply border border-slate-800/80;
  }

  .featured-badge {
    @apply absolute top-4 right-4 rounded-full bg-[#12233a] px-4 py-2 text-[11px] uppercase tracking-widest text-accent-200;
  }

  .project-media {
    @apply w-full;
    height: 38%;
  }

  .project-media img {
    @apply w-full h-full object-cover;
  }

  .project-body {
    @apply flex flex-col gap-3 p-5 h-full min-h-0;
  }

  .project-text {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    padding-right: 0.5rem;
    /* Fade the top + bottom edges of the visible scroll area so the text
       gracefully bleeds into the card background instead of hard-cutting.
       Because mask-image applies to the element's visible rectangle (not
       the scrolling content), the fades stay pinned to the edges as the
       user scrolls inside. */
    mask-image: linear-gradient(
      to bottom,
      transparent 0,
      black 0.75rem,
      black calc(100% - 1.25rem),
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent 0,
      black 0.75rem,
      black calc(100% - 1.25rem),
      transparent 100%
    );
    scrollbar-width: thin;
    scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
  }

  .project-text::-webkit-scrollbar {
    width: 6px;
  }
  .project-text::-webkit-scrollbar-track {
    background: transparent;
  }
  .project-text::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.25);
    border-radius: 3px;
  }
  .project-text::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.5);
  }

  .project-title {
    @apply text-lg font-semibold;
  }

  .project-desc {
    @apply mt-2 text-sm text-gray-300;
    line-height: 1.5;
    padding-bottom: 0.5rem;
  }

  .project-bottom {
    @apply flex flex-col gap-3;
    flex-shrink: 0;
  }

  .project-tags {
    @apply flex flex-wrap gap-2;
  }

  .tag {
    @apply inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold;
  }

  .project-links {
    @apply flex flex-wrap gap-3 text-base text-accent-300;
  }

  .project-link {
    @apply inline-flex items-center rounded-full border border-[#2b6cb0]/40 bg-[#0e1c2f] px-3 py-1 text-sm font-semibold text-blue-200/90 transition-colors;
  }

  .project-link:hover {
    @apply border-[#5aa7ff]/70 text-blue-100;
  }
</style>
