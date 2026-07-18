<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { page } from "$app/stores";
  import ContactModal from "./modals/contactModal.svelte";

  type LinkItem = { id: string; label: string; href?: string };

  $: brandName = $page.url.pathname === "/seo" ? "Graham Zemel SEO" : "Graham Zemel";

  const links: LinkItem[] = [
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "resume", label: "Resume" },
    { id: "blog", label: "Blog" },
    { id: "seo", label: "SEO", href: "/seo" },
  ];

  let menuOpen = false;
  let scrolled = false;
  let activeId: string | null = null;
  let showContactModal = false;

  function openContact() {
    showContactModal = true;
    menuOpen = false;
  }

  let scrollHandler: (() => void) | null = null;
  let observer: IntersectionObserver | null = null;

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
  }

  onMount(() => {
    scrollHandler = () => {
      scrolled = window.scrollY > 8;
    };
    scrollHandler();
    window.addEventListener("scroll", scrollHandler, { passive: true });

    const visible = new Set<string>();
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        }
        const next = links.find((l) => visible.has(l.id))?.id ?? null;
        activeId = next;
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );

    for (const { id } of links) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
  });

  onDestroy(() => {
    if (typeof window !== "undefined" && scrollHandler) {
      window.removeEventListener("scroll", scrollHandler);
    }
    if (observer) observer.disconnect();
  });
</script>

<svelte:head>
  <style>
    html {
      scroll-padding-top: 5rem;
    }
  </style>
</svelte:head>

<header class="navbar-shell" class:scrolled class:menu-open={menuOpen}>
  <!-- Inner container mirrors the site's content grid exactly:
       mx-6 → sm:mx-16 → md:mx-24 (max-w-7xl) → lg/xl:mx-32 (max-w-7xl) → 2xl:mx-auto -->
  <div class="navbar-track">
    <div class="navbar-inner">
      <a
        href="#top"
        class="brand"
        on:click={closeMenu}
        aria-label="Graham Zemel — home"
      >
        <span class="brand-logo" aria-hidden="true">
          <svg
            viewBox="0 0 312 312"
            xmlns="http://www.w3.org/2000/svg"
            class="brand-logo-svg"
          >
            <text
              x="156"
              y="208"
              font-family="Source Serif Pro, serif"
              font-size="170"
              font-weight="700"
              text-anchor="middle"
              fill="currentColor"
            >GZ</text>
          </svg>
        </span>
        <span class="brand-name">{brandName}</span>
      </a>

      <nav class="nav-links" aria-label="Primary">
        {#each links as link}
          <a
            href={link.href ?? `#${link.id}`}
            class="nav-link"
            class:active={activeId === link.id}
            aria-current={activeId === link.id ? "page" : undefined}
            on:click={closeMenu}
          >
            {link.label}
          </a>
        {/each}

        <button type="button" class="cta" on:click={openContact}>
          <span>Let's talk</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            class="cta-arrow"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </nav>

      <button
        class="hamburger"
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        on:click={toggleMenu}
      >
        <span class="hamburger-bar bar-1" />
        <span class="hamburger-bar bar-2" />
        <span class="hamburger-bar bar-3" />
      </button>
    </div>
  </div>

  {#if menuOpen}
    <div class="mobile-menu-track">
      <nav class="mobile-menu" aria-label="Primary mobile">
        {#each links as link}
          <a
            href={link.href ?? `#${link.id}`}
            class="mobile-link"
            class:active={activeId === link.id}
            aria-current={activeId === link.id ? "page" : undefined}
            on:click={closeMenu}
          >
            {link.label}
          </a>
        {/each}

        <button type="button" class="mobile-cta" on:click={openContact}>
          <span>Let's talk</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            class="cta-arrow"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </nav>
    </div>
  {/if}
</header>

<ContactModal bind:showModal={showContactModal} />

<style lang="postcss">
  /* ---------- Surface (liquid glass) ---------- */
  .navbar-shell {
    position: fixed;
    inset: 0 0 auto 0;
    z-index: 40;
    background: oklch(0.16 0.015 250 / 0.52);
    backdrop-filter: blur(24px) saturate(160%);
    -webkit-backdrop-filter: blur(24px) saturate(160%);
    border-bottom: 1px solid oklch(0.38 0.012 250 / 0.45);
    box-shadow:
      inset 0 1px 0 oklch(1 0 0 / 0.07),
      0 4px 24px oklch(0 0 0 / 0.18);
    transition:
      background 220ms var(--ease),
      box-shadow 220ms var(--ease),
      border-color 220ms var(--ease);
  }

  .navbar-shell.scrolled {
    background: oklch(0.13 0.014 250 / 0.72);
    border-bottom-color: oklch(0.44 0.014 250 / 0.55);
    box-shadow:
      inset 0 1px 0 oklch(1 0 0 / 0.09),
      0 8px 32px oklch(0 0 0 / 0.32);
  }

  /* Track: mirrors +page.svelte content grid *exactly* so the navbar's
     left/right edges line up with the page content beneath it. */
  .navbar-track {
    margin: 0 1.5rem;
  }
  @media (min-width: 640px) {
    .navbar-track { margin: 0 4rem; }
  }
  @media (min-width: 768px) {
    .navbar-track {
      margin: 0 6rem;
      max-width: 80rem;
    }
  }
  @media (min-width: 1024px) {
    .navbar-track { margin: 0 8rem; max-width: 80rem; }
  }
  @media (min-width: 1280px) {
    .navbar-track { margin: 0 8rem; max-width: 80rem; }
  }
  @media (min-width: 1536px) {
    .navbar-track { margin: 0 auto; max-width: 80rem; }
  }

  .navbar-inner {
    height: 3.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  @media (min-width: 768px) {
    .navbar-inner { height: 4.25rem; }
  }

  /* ---------- Brand ---------- */
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    color: oklch(0.97 0.005 250);
    text-decoration: none;
    user-select: none;
    transition: color 220ms var(--ease);
  }

  .brand:hover {
    color: oklch(0.85 0.005 250);
  }

  .brand-logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 2.5rem;
    width: 2.5rem;
    border-radius: 0.5rem;
    color: oklch(0.96 0.005 250);
    background: oklch(1 0 0 / 0.08);
    border: 1px solid oklch(1 0 0 / 0.14);
    box-shadow: inset 0 1px 0 oklch(1 0 0 / 0.12);
  }

  .brand-logo-svg {
    height: 1.5rem;
    width: 1.5rem;
  }

  .brand-name {
    font-family: "Source Serif Pro", serif;
    font-weight: 700;
    font-size: 1.0625rem;
    line-height: 1;
    letter-spacing: -0.01em;
    color: inherit;
  }

  @media (min-width: 768px) {
    .brand-name { font-size: 1.1875rem; }
  }

  /* ---------- Desktop nav ---------- */
  .nav-links {
    display: none;
    align-items: center;
    gap: 1.75rem;
  }

  @media (min-width: 768px) {
    .nav-links { display: flex; gap: 1.5rem; }
  }
  @media (min-width: 1024px) {
    .nav-links { gap: 2rem; }
  }

  .navbar-shell .nav-link {
    position: relative;
    display: inline-flex;
    align-items: baseline;
    gap: 0.375rem;
    padding: 0.375rem 0;
    color: oklch(0.92 0.005 250);
    background: transparent;
    text-decoration: none;
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1;
    transition: color 180ms var(--ease);
  }

  /* Underline grows from left on hover/active — desaturated for restraint */
  .navbar-shell .nav-link::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -3px;
    height: 1px;
    background: oklch(0.85 0.005 250);
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 220ms var(--ease);
  }

  .navbar-shell .nav-link:hover {
    color: oklch(0.99 0 0);
  }
  .navbar-shell .nav-link:hover::after {
    transform: scaleX(1);
  }

  .navbar-shell .nav-link.active {
    color: oklch(0.99 0 0);
  }
  .navbar-shell .nav-link.active::after {
    transform: scaleX(1);
  }

  /* ---------- Desktop CTA ---------- */
  .navbar-shell .cta {
    display: inline-flex;
    align-items: center;
    gap: 0.4375rem;
    margin-left: 0.5rem;
    padding: 0.5rem 0.875rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1;
    color: oklch(0.97 0.005 250);
    background: oklch(1 0 0 / 0.04);
    border: 1px solid oklch(0.40 0.01 250);
    text-decoration: none;
    transition:
      background 180ms var(--ease),
      border-color 180ms var(--ease),
      color 180ms var(--ease);
  }

  .navbar-shell .cta:hover {
    background: oklch(1 0 0 / 0.08);
    border-color: oklch(0.55 0.012 250);
    color: oklch(0.99 0 0);
  }

  .cta-arrow {
    height: 0.875rem;
    width: 0.875rem;
    transition: transform 180ms var(--ease);
  }
  .navbar-shell .cta:hover .cta-arrow {
    transform: translateX(2px);
  }

  /* ---------- Hamburger ---------- */
  .hamburger {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 2.5rem;
    width: 2.5rem;
    gap: 0.3125rem;
    border-radius: 0.5rem;
    background: oklch(1 0 0 / 0.07);
    border: 1px solid oklch(1 0 0 / 0.13);
    box-shadow: inset 0 1px 0 oklch(1 0 0 / 0.10);
    color: oklch(0.97 0.005 250);
    cursor: pointer;
    transition:
      background 180ms var(--ease),
      border-color 180ms var(--ease);
  }

  @media (min-width: 768px) {
    .hamburger { display: none; }
  }

  .hamburger:hover {
    background: oklch(1 0 0 / 0.12);
    border-color: oklch(1 0 0 / 0.2);
  }

  .hamburger-bar {
    display: block;
    height: 1.5px;
    width: 1.125rem;
    background: oklch(0.97 0.005 250);
    border-radius: 2px;
    transition:
      transform 220ms var(--ease),
      opacity 180ms var(--ease);
    transform-origin: center;
  }

  .menu-open .bar-1 {
    transform: translateY(7px) rotate(45deg);
  }
  .menu-open .bar-2 {
    opacity: 0;
  }
  .menu-open .bar-3 {
    transform: translateY(-7px) rotate(-45deg);
  }

  /* ---------- Mobile drawer ---------- */
  .mobile-menu-track {
    background: oklch(0.12 0.012 250 / 0.78);
    backdrop-filter: blur(24px) saturate(160%);
    -webkit-backdrop-filter: blur(24px) saturate(160%);
    border-top: 1px solid oklch(1 0 0 / 0.08);
    animation: drawer-in 220ms var(--ease);
  }

  @media (min-width: 768px) {
    .mobile-menu-track { display: none; }
  }

  .mobile-menu {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    padding: 0.75rem 1.5rem 1.25rem;
  }
  @media (min-width: 640px) {
    .mobile-menu { padding: 0.75rem 4rem 1.25rem; }
  }

  .navbar-shell .mobile-link {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    height: 3.25rem;
    padding: 0 0.75rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    color: oklch(0.97 0.005 250);
    background: transparent;
    border: 1px solid transparent;
    text-decoration: none;
    transition:
      color 180ms var(--ease),
      background 180ms var(--ease),
      border-color 180ms var(--ease);
  }

  .navbar-shell .mobile-link:hover,
  .navbar-shell .mobile-link:active {
    background: oklch(1 0 0 / 0.05);
  }

  .navbar-shell .mobile-link.active {
    color: oklch(0.99 0 0);
    background: oklch(1 0 0 / 0.06);
    border-color: oklch(0.40 0.01 250);
  }

  .navbar-shell .mobile-cta {
    margin-top: 0.625rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    height: 3rem;
    padding: 0 1.25rem;
    border-radius: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 600;
    color: oklch(0.97 0.005 250);
    background: oklch(1 0 0 / 0.04);
    border: 1px solid oklch(0.40 0.01 250);
    text-decoration: none;
    transition: background 180ms var(--ease);
  }

  .navbar-shell .mobile-cta:active {
    background: oklch(1 0 0 / 0.08);
  }

  /* ---------- Focus rings ---------- */
  .navbar-shell a:focus-visible,
  .navbar-shell button:focus-visible {
    outline: 2px solid oklch(0.62 0.16 165 / 0.7);
    outline-offset: 3px;
    border-radius: 0.4rem;
  }

  /* ---------- Reduced motion ---------- */
  @media (prefers-reduced-motion: reduce) {
    .navbar-shell,
    .navbar-shell *,
    .navbar-shell *::before,
    .navbar-shell *::after {
      transition-duration: 0ms !important;
      animation-duration: 0ms !important;
      animation: none !important;
    }
  }

  @keyframes drawer-in {
    0% {
      opacity: 0;
      transform: translateY(-6px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
