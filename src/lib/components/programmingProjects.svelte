<script lang="ts" context="module">
  import type { ComponentProps } from "svelte";
  export type ProjectProps = ComponentProps<ProjectCard>;
</script>

<script lang="ts">
  import ProjectCard from "./projectCard.svelte";
  import ProjectCarousel from "./projectCarousel.svelte";

  const projects: ProjectProps[] = [
    {
      title: "FratDoor",
      description: `
       A door-check system that replaces paper lists with a structured event check-in flow.
      `,
      image: "/fratdoor.png",
      tags: ["Web", "Internet", "IFC"],
      repoLink: null,
      demoLink: "https://fratdoor.com",
    },
    {
      title: "NPM Library: Offline Sync Engine",
      description: `
       A tiny NPM library I built for FratDoor — an offline-first mutation queue + idempotent server primitives that keep check-in scanners running through venue WiFi blackouts. ~900 lines, zero deps, exactly-once delivery via ULID idempotency keys + IndexedDB persistence.
      `,
      image: "/offline-sync-engine.png",
      tags: ["Library", "Web"],
      repoLink: "https://github.com/grahamzemel/offline-sync-engine",
      demoLink: "https://grahamzemel.github.io/offline-sync-engine/",
    },
    {
      title: "Apartment Availability Tracker",
      description: `
       A lightweight GitHub Actions project I built to scrape my potential apartment building's listings for 2-bedroom units, rate them by floor plan and Flatirons view, and email me a summary every 24 hours so I can pounce when a good one opens.
      `,
      image: "/spark-tracker.png",
      tags: ["Automation", "Internet"],
      repoLink: "https://github.com/grahamzemel/spark-tracker",
      demoLink: null,
    },
    {
      title: "Nick Lathrop Photography",
      description: `
       Portfolio I designed and built for Nick Lathrop, a senior-portrait + sideline shooter in Golden, CO. Astro + Svelte islands, Playwright stealth scraper bypassing the Instagram API to keep the gallery fresh on a 24-hour GitHub Actions cron.
      `,
      image: "/gingersnaps.jpg",
      tags: ["Web", "Internet", "Website"],
      repoLink: "https://github.com/grahamzemel/gingersnaps",
      demoLink: "https://nicksphotography.netlify.app/",
    },
    {
      title: "CU EventHub",
      description: `
       Centralized event registration and safety workflow hub for IFC on the Hill chapters.
      `,
      image: "/ifc-eventhub.png",
      tags: ["Web", "Internet", "IFC"],
      repoLink: null,
      demoLink: "https://cueventhub.netlify.app/",
    },
    {
      title: "Student Living Advocacy Group",
      description: `
       Reporting hub for off-campus housing experiences on the Hill in Boulder.
      `,
      image: "/slag.png",
      tags: ["Web", "Internet", "IFC"],
      repoLink: null,
      demoLink: "https://hillneighborhoodslag.netlify.app/",
    },
    {
      title: "Graham Zemel (.com)",
      description: `
       This site! Version 4.0 of my personal website, built with SvelteKit and TailwindCSS.
      `,
      image: "/grahamzemel.com.png",
      tags: ["Internet"],
      repoLink: "https://github.com/grahamzemel/grahamzemel.com",
      demoLink: "https://grahamzemel.com",
    },
    {
      title: "Game Bank",
      description: `
       A fun project I built with a friend that allows users to play a variety of popular games online with friends or by themselves. Currently in development.
      `,
      image: "/gamebank.png",
      tags: ["Game", "Web"],
      repoLink: "https://github.com/grahamzemel/gamebank",
      demoLink: "https://gamebank.netlify.app",
    },
    {
      title: "QuantumChat",
      description: `
      This project is a quantum chat room that uses quantum key distribution to encrypt any traffic sent between users.
      `,
      image: "/quantumss.png",
      tags: ["Quantum", "AI"],
      repoLink: null,
      demoLink: "https://quantum-chat.netlify.app",
    },
    {
      title: "Text Cloaker",
      description: `
      A website to cloak your AI-generated text from those nosy detectors! 100% effective, free, and fast.
      `,
      image: "/textcloakerss.png",
      tags: ["AI", "Web", "Internet"],
      repoLink: null,
      demoLink: "https://text-cloaker.com",
    },
    {
      title: "Powerschool GPA Calculator",
      description: `
      An automated calculator Google Extension built to automatically calculate both weighted and unweighted GPAs of students through the powerschool.org gradebook.
      `,
      image: "/powerschoolss.png",
      tags: ["Internet", "Extension"],
      repoLink: "https://github.com/grahamzemel/PowerschoolGPACalculator",
      demoLink:
        "https://chromewebstore.google.com/detail/powerschool-gpa-calculato/dgfnbmfhjioifionnlcklnpfkkjjglbj",
    },
    {
      title: "Medium Twitter Bot",
      description: `
      A quick and fun automation bot that posts each new article from my publication, The Gray Area, onto Twitter. It requires no user interaction at all, all I have to do is publish an article. 
      `,
      image: "/tgaonmediumss.png",
      tags: ["Python", "Telegram"],
      repoLink: "https://github.com/grahamzemel/MediumTwitterBot",
      demoLink: "https://twitter.com/TGAonMedium",
    },
  ];

</script>

<ProjectCarousel>
  {#each projects as project}
    <ProjectCard {...project} />
  {/each}
</ProjectCarousel>
