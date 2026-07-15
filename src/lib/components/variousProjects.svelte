<script lang="ts" context="module">
  import type { ComponentProps } from "svelte";
  export type ProjectProps = ComponentProps<ProjectCard>;
</script>

<script lang="ts">
  import ProjectCard from "./projectCard.svelte";
  import ProjectCarousel from "./projectCarousel.svelte";

  const projects: ProjectProps[] = [
    {
      title: "Aesculapius",
      description: `
      The winning project for the healthcare track in the MetroHacks 2022 hackathon. A 24 hour project based on furthering healthcare accessibility made with Svelte, Tailwind, Typescript, and a custom co:here AI chat bot.
      `,
      image: "/aesculapiusss.png",
      tags: ["Web", "Hackathon"],
      repoLink: "https://github.com/grahamzemel/Aesculapius-FrontEnd",
      demoLink: null,
    },
    {
      title: "Template Project",
      description: `
        A simple template project built with Svelte and Bulma on the front-end, and Python on the back-end. It's a great starting point for any web project. 
      `,
      image: "/templateprojss.png",
      tags: ["Web", "Internet"],
      repoLink: "https://github.com/grahamzemel/TemplateProj",
      demoLink: null,
    },
    {
      title: "Crypto Token Template",
      description: `
        This project was created as a template for web3 developers to build custom cryptocurrencies on the ERC20 blockchain. You can also do rug pulls with it, but I don't recommend that.
      `,
      image: "/cryptoss.png",
      tags: ["Internet", "Crypto"],
      repoLink: "https://github.com/grahamzemel/CreateCryptoToken",
      demoLink: null,
    },
    {
      title: "Discrete Mathematics",
      description: `
        A collection of my notes from my discrete mathematics class. It's a great resource for anyone looking to learn the basics of discrete math.
      `,
      image: "/fractalsss.png",
      tags: ["Python"],
      repoLink: "https://github.com/grahamzemel/DiscreteMath",
      demoLink: null,
    },
  ];

</script>

<ProjectCarousel>
  {#each projects as project}
    <ProjectCard {...project} />
  {/each}
</ProjectCarousel>
