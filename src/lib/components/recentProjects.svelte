<script lang="ts" context="module">
    import type { ComponentProps } from "svelte";
    export type ProjectProps = ComponentProps<ProjectCard>;
  </script>
  
  <script lang="ts">
    import ProjectCard from "./projectCard.svelte";
    import ProjectCarousel from "./projectCarousel.svelte";
  
    const projects: ProjectProps[] = [
      {
        title: "GPU Prices",
        description: `
        A neat site that provides the latest prices of various GPUs from Amazon in a neatly sorted table. Includes filters and sorting for GPU type, price, popularity, and more.
        `,
        image: "/gpuprices.png",
        tags: ["Web", "Internet", "Automation"],
        repoLink: null,
        demoLink: "https://gpuprices.xyz",
      },
      {
        title: "Macbook Prices",
        description: `
        Another website that provides up-to-date prices of Macbooks from Amazon in a sorted table. Includes filters and sorting for Macbook type, price, model, and more.
        `,
        image: "/macbookprices.png",
        tags: ["Web", "Internet", "Automation"],
        repoLink: null,
        demoLink: null,
      },
      {
        title: "Laptop Prices",
        description: `
        A website that provides up-to-date prices of laptops from Amazon in a sorted table. Includes filters and sorting for laptop type, price, brand, and more.
        `,
        image: "/laptopprices.png",
        tags: ["Web", "Internet", "Automation"],
        repoLink: null,
        demoLink: "https://laptopprices.xyz",
      },
    ];
  </script>
  
  <ProjectCarousel>
    {#each projects as project}
      <ProjectCard {...project} />
    {/each}
  </ProjectCarousel>
  