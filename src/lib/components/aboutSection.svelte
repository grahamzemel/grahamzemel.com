<script lang="ts">
  import Visibility from "$lib/components/visibility.svelte";

  let isVisible = false;
  let hasChanged = false;
  let hasObserverSupport = true;

  const techStack = [
    { label: "HTML5", slug: "html5", bg: "#e34f26" },
    { label: "JavaScript", slug: "javascript", bg: "#f7df1e" },
    {
      label: "CSS3",
      iconUrl:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
      bg: "#1572b6",
    },
    { label: "Svelte", slug: "svelte", bg: "#ff3e00" },
    { label: "Tailwind CSS", slug: "tailwindcss", bg: "#38bdf8" },
    { label: "npm", slug: "npm", bg: "#cb0000" },
    { label: "Node.js", slug: "nodedotjs", bg: "#3c873a" },
    {
      label: "VS Code",
      iconUrl:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
      bg: "#007acc",
    },
  ];
</script>

<div class="sm:mt-[30vh] mt-12" aria-hidden="true">
  <Visibility
    bind:hasObserverSupport
    visibilityUpdate={(state) => {
      // Only update one time (once visible)
      if (!hasChanged && state !== false) {
        hasChanged = true;
        isVisible = state;
      }
    }}
  />
</div>

<section
  class="section-band custom-transition {!hasObserverSupport || isVisible
    ? 'opacity-100'
    : 'opacity-0'}"
>
  <h1 class="font-serif font-bold sm:text-6xl text-4xl">About Me</h1>
  <p class="mt-4 text-lg text-gray-300 w-full">
    I build full-stack systems with a backend focus and a growing front-end
    practice. I write daily for
    <a
      class="link-highlight"
      href="https://thegrayarea.tech"
      target="_blank"
      rel="noopener noreferer"
    >
      The Gray Area
    </a>
    and serve as Director of Technology for
    <a
      class="link-highlight"
      href="https://coloradoifc.org"
      target="_blank"
      rel="noopener noreferer"
    >
      IFC on the Hill
    </a>
    at CU Boulder.
  </p>

  <div class="current-grid mt-10">
    <article class="focus-card">
      <h3 class="text-2xl font-semibold">Startup Founder</h3>
      <p class="mt-3 text-gray-300 leading-relaxed">
        I’m rolling out
        <a
          class="link-highlight"
          href="https://fratdoor.com"
          target="_blank"
          rel="noopener noreferer"
        >
          FratDoor
        </a>
        across 42 fraternities, processing 300,000+ check-ins across 1,500+
        events to replace paper lists with a fast, structured door-check
        system.
      </p>
      <p class="mt-3 text-gray-300 leading-relaxed">
        FratDoor is my most promising startup so far, and I’m actively searching
        for new prospects to adopt it and pioneer deployments at additional
        schools.
      </p>
      <p class="mt-3 text-gray-300 leading-relaxed">
        I’m also building
        <a
          class="link-highlight"
          href="https://text-cloaker.com"
          target="_blank"
          rel="noopener noreferer"
        >
          TextCloaker
        </a>,
        a web app that cloaks AI-generated text to reduce AI-detector flags
        <strong class="font-semibold text-gray-100">without ever changing the
        text</strong>.
      </p>
    </article>

    <article class="focus-card">
      <h3 class="text-2xl font-semibold">IFC on the Hill</h3>
      <p class="mt-3 text-gray-300 leading-relaxed">
        As Director of Technology, I built
        <a
          class="link-highlight"
          href="https://cueventhub.netlify.app/"
          target="_blank"
          rel="noopener noreferer"
        >
          CU EventHub
        </a>
        from the ground up to standardize event registration and safety
        workflows, and I also built the
        <a
          class="link-highlight"
          href="https://hillneighborhoodslag.netlify.app/"
          target="_blank"
          rel="noopener noreferer"
        >
          Student Living Advocacy Group (SLAG)
        </a>
        platform to make housing issues easier to document, aggregate, and act
        on.
      </p>
      <ul class="mt-4 list-disc ml-5 text-gray-300 space-y-1">
        <li>Structured event submissions and notifications</li>
        <li>Emergency contact visibility and compliance support</li>
        <li>Neighborhood-focused reporting and advocacy</li>
      </ul>
    </article>
  </div>

  <h2 class="mt-12 font-serif font-bold sm:text-3xl text-2xl">
    Tech Stack
  </h2>
  <div class="tech-grid mt-6">
    {#each techStack as tech}
      <div class="tech-badge" aria-label={tech.label}>
        <div class="tech-icon" style={`background:${tech.bg}`}>
          <img
            src={tech.iconUrl ??
              `https://cdn.simpleicons.org/${tech.slug}/ffffff?viewbox=auto&size=48`}
            alt={`${tech.label} logo`}
            loading="lazy"
          />
        </div>
        <span class="tech-label">{tech.label}</span>
      </div>
    {/each}
  </div>

  <h2 class="mt-12 font-serif font-bold sm:text-3xl text-2xl">
    Focus Areas
  </h2>
  <div class="focus-grid mt-6">
    <article class="focus-card">
      <h3 class="text-2xl font-semibold">Web Development</h3>
      <p class="mt-3 text-gray-300 leading-relaxed">
        Backend-first, and increasingly hands-on with modern front-end
        frameworks. Above all I build <em>utility-focused</em>: every project
        solves a concrete problem, and when an existing tool falls short I build
        the missing piece myself. For FratDoor’s offline sync, that meant a
        custom ULID-based idempotency layer I wrote into an
        <a
          class="link-highlight"
          href="https://github.com/grahamzemel/offline-sync-engine"
          target="_blank"
          rel="noopener noreferer"
        >
          NPM library</a><span class="hidden md:inline">, because Firestore’s own
        offline and ID handling didn’t behave the same across platforms and I
        needed guaranteed exactly-once writes everywhere</span>. I also publish
        SEO and portfolio guides on
        <a
          class="link-highlight"
          href="https://thegrayarea.tech"
          target="_blank"
          rel="noopener noreferer"
        >
          The Gray Area
        </a>, and this site itself was a front-end trial run, with its source on
        <a
          class="link-highlight"
          href="https://github.com/grahamzemel"
          target="_blank"
          rel="noopener noreferer"
        >
          GitHub
        </a>.
      </p>
    </article>

    <article class="focus-card">
      <h3 class="text-2xl font-semibold">Cybersecurity</h3>
      <p class="mt-3 text-gray-300 leading-relaxed">
        Offense and defense. I hunt bug bounties and build my own
        <a
          class="link-highlight"
          href="https://github.com/grahamzemel/WebHeckScanner"
          target="_blank"
          rel="noopener noreferer"
        >
          recon-and-scan tooling</a>
        to surface vulnerabilities fast. On the build side, I’ve secured
        150,000+ real check-ins on
        <a
          class="link-highlight"
          href="https://fratdoor.com"
          target="_blank"
          rel="noopener noreferer"
        >
          FratDoor</a>
        behind passes that can’t be screenshotted, shared, or replayed, and I
        pen-test
        my own products before they ship. <span class="hidden md:inline">Sensitive
        keys and data never leave the server, every action is logged so it can’t
        be quietly rewritten, and forged requests are rejected at the backend
        rather than just hidden in the UI.</span>
      </p>
    </article>

  </div>

  <div class="writing-section mt-6">
    <div class="writing-header">
      <h3 class="text-2xl font-semibold">Papers & Writing</h3>
      <p class="mt-2 text-gray-300 leading-relaxed">
        Writing is how I think out loud. I founded and run
        <a
          class="link-highlight"
          href="https://thegrayarea.tech"
          target="_blank"
          rel="noopener noreferer"
        >
          The Gray Area
        </a>, a tech publication now read by more than 2,000,000 people across
        30+ contributors, where I publish security research, vulnerability
        disclosures, deep-dive tutorials, and essays on the craft of shipping
        software. <span class="hidden md:inline">My own pieces have reached over
        half a million readers, and I still publish something new most days, from
        P1 write-ups to step-by-step build logs.</span>
      </p>
    </div>
    <div class="writing-grid">
      <a
        class="link-card"
        href="https://thegrayarea.tech"
        target="_blank"
        rel="noopener noreferer"
      >
        <span class="link-title">The Gray Area</span>
        <span class="link-subtitle">Security research, papers &amp; essays · 2M+ readers</span>
      </a>
      <a
        class="link-card"
        href="https://medium.com/@grahamzemel"
        target="_blank"
        rel="noopener noreferer"
      >
        <span class="link-title">Medium</span>
        <span class="link-subtitle">@grahamzemel · daily posts &amp; disclosures</span>
      </a>
    </div>
  </div>
</section>

<style lang="postcss">
  .custom-transition {
    transition-property: opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 1500ms;
  }

  .link-highlight {
    @apply text-accent-300 underline decoration-accent-300/60 underline-offset-4;
  }

  .link-highlight:hover {
    @apply text-accent-200 decoration-accent-200/70 transition-colors;
  }

  .current-grid {
    @apply grid grid-cols-1 lg:grid-cols-2 gap-6;
  }

  .tech-grid {
    @apply grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4;
  }

  .tech-badge {
    @apply flex flex-col items-center gap-2;
  }

  .tech-icon {
    @apply h-14 w-14 rounded-2xl flex items-center justify-center bg-[#0b0f14] border border-slate-800 shadow;
  }

  .tech-icon img {
    @apply h-8 w-8;
    filter: brightness(0) invert(1);
  }

  .tech-label {
    @apply text-xs text-gray-400;
  }

  .focus-grid {
    @apply grid grid-cols-1 lg:grid-cols-2 gap-6;
  }

  .focus-card {
    @apply rounded-lg bg-[#070a0d] bg-opacity-60 p-6 shadow;
  }

  .writing-section {
    @apply rounded-lg border border-slate-800 bg-[#070a0d] bg-opacity-60 p-6;
  }

  .writing-grid {
    @apply mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4;
  }

  .link-card {
    @apply rounded-lg border border-accent-400/30 bg-[#0b0f14] p-4 transition-colors;
  }

  .link-card:hover {
    @apply border-accent-300;
  }

  .link-title {
    @apply text-accent-300 font-semibold;
  }

  .link-subtitle {
    @apply mt-1 block text-sm text-gray-400;
  }
</style>
