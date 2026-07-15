<script lang="ts" context="module">
  import type { ComponentProps } from "svelte";
  export type ProjectProps = ComponentProps<ProjectCard>;
</script>

<script lang="ts">
  import ProjectCard from "./projectCard.svelte";
  import ProjectCarousel from "./projectCarousel.svelte";

  const projects: ProjectProps[] = [
    {
      title: "Web Heck Scanner",
      description: `
      A hacking tool built for the bug hunters, Web Heck Scanner is a compilation of 3 popular hacking tools and 5 components that hands you bugs on a silver platter.
      `,
      image: "/webheckscannerss.png",
      tags: ["Shell", "Internet", "Bash"],
      repoLink: "https://github.com/grahamzemel/WebHeckScanner",
      demoLink: null,
    },
    {
      title: "Hecker Bot",
      description: `
      This telegram bot that I coded from scratch automates hacking processes for bug hunting and general cybersecurity purposes. 
      `,
      image: "/heckerbotss.jpg",
      tags: ["Automation", "Telegram"],
      repoLink: null,
      demoLink: "https://t.me/heckerbot2022bot",
    },
    {
      title: "Bash Bunny",
      description: `
      I created multiple scripts for physical pen-testing using my Bash Bunny, a hotplug attack tool. The bash bunny is one of the most powerful physical attack vectors I've ever used. 
      `,
      image: "/bashbunnyss.png",
      tags: ["Automation", "Bash"],
      repoLink: "https://github.com/grahamzemel/Hotplug_Attacks",
      demoLink: null,
    },
    {
      title: "IDOR Automation",
      description: `
      This was a simple Python script for parsing data from hacked sites. Check out some hacking write-ups for vulnerabilities like IDORs, XSS, Broken Access Control, and more on The Gray Area!
      `,
      image: "/idorss.png",
      tags: ["Python", "Automation"],
      repoLink: "https://github.com/grahamzemel/idorAutomation",
      demoLink: null,
    },
  ];

</script>

<ProjectCarousel>
  {#each projects as project}
    <ProjectCard {...project} />
  {/each}
</ProjectCarousel>
