<script lang="ts">
  import { onDestroy } from "svelte";

  let list: HTMLElement;

  let scrollState = { listX: 0, clientX: 0 };

  const onMouseDown = (event: MouseEvent) => {
    list.style.cursor = "grabbing";
    list.style.userSelect = "none";
    scrollState = {
      listX: list.scrollLeft,
      clientX: event.clientX,
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (event: MouseEvent) => {
    const dx = event.clientX - scrollState.clientX;
    list.scrollLeft = scrollState.listX - dx;
  };

  const onMouseUp = () => {
    list.style.cursor = "grab";
    list.style.removeProperty("user-select");
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  onDestroy(onMouseUp);
</script>

<div class="projects-container">
  <div
    class="project-list flex flex-col md:flex-row overflow-x-auto no-scrollbar md:gap-8 cursor-grab"
    bind:this={list}
    on:mousedown={onMouseDown}
  >
    <slot />
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
  }

  .projects-container::before,
  .projects-container::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: 25px;
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
