<script lang="ts" context="module">
  import type { ComponentProps } from "svelte";
  export type ProjectProps = ComponentProps<ProjectCard>;
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import ProjectCard from "./projectCard.svelte";

  let isHovering = false;
  const scrollSpeed = 0; // Adjust the speed as needed

  const autoScroll = () => {
    if (!isHovering) {
      list.scrollLeft += scrollSpeed;
      // Check if near the end of the first set and reset if needed
      if (list.scrollLeft >= list.scrollWidth - list.clientWidth) {
        list.scrollLeft = 0;
      }
    }
    requestAnimationFrame(autoScroll);
  };
  const toggleHover = (hover: boolean) => {
    isHovering = hover;
  };

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
      title: "offline-sync-engine",
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
      title: "Gingersnaps Photography",
      description: `
       A personal photography portfolio I designed and built for a friend (Nick Lathrop). Custom Instagram post acquisition script bypassing API restrictions to keep the portfolio fresh automatically.
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

  // --- List scrolling:

  let list: HTMLElement;
  let scrollState = { listX: 0, clientX: 0 };

  const onMouseDown = (e: MouseEvent) => {
    list.style.cursor = "grabbing";
    list.style.userSelect = "none";

    // Update the current scroll position
    scrollState = {
      listX: list.scrollLeft,
      clientX: e.clientX,
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    // Update the scroll position on the list
    const dx = e.clientX - scrollState.clientX;
    list.scrollLeft = scrollState.listX - dx;
  };

  const onMouseUp = (e: MouseEvent) => {
    list.style.cursor = "grab";
    list.style.removeProperty("user-select");
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  onMount(() => {
    list.addEventListener("mousedown", onMouseDown);
    requestAnimationFrame(autoScroll); // Start the auto-scroll
  });
</script>

<div class="projects-container">
  <div
    class="project-list flex flex-col md:flex-row overflow-x-auto no-scrollbar md:gap-8 cursor-grab"
    bind:this={list}
    on:mouseenter={() => toggleHover(true)}
    on:mouseleave={() => toggleHover(false)}
  >
    {#each projects as project}
      <ProjectCard {...project} />
    {/each}
  </div>
</div>

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .projects-container {
    position: relative;
    /* overflow: hidden; */
    /* overflow-y:scroll; */
    /* overflow-x:auto;
    white-space: nowrap; Prevents wrapping of inline elements */
  }

  .projects-container::before,
  .projects-container::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: 25px; /* Control the width of the fade effect */
    pointer-events: none;
    z-index: 2;
  }

  .projects-container::before {
    left: 0;
    background: linear-gradient(to right, rgba(18, 18, 23, 1), transparent);
  }

  .projects-container::after {
    right: 0;
    background: linear-gradient(to left, rgba(18, 18, 23, 1), transparent);
  }

  @media (max-width: 640px) {
    .projects-container::before,
    .projects-container::after {
      background: none;
    }
  }
</style>
