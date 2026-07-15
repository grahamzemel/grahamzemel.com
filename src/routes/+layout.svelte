<script>
  import "../app.postcss";

  import { dev } from "$app/environment";
  import { inject } from "@vercel/analytics";

  import { onMount } from "svelte";
  import Cursor from "$lib/components/cursor.svelte";

  // Vercel Analytics
  inject({ mode: dev ? "development" : "production" });

  // SEO: a branded, descriptive title + a shared keyword-rich description, plus
  // Person structured data so a name search surfaces the maintained profiles
  // (LinkedIn, GitHub) instead of stale ones.
  const pageTitle =
    "Graham Zemel · Full-Stack Engineer (FratDoor, TextCloaker)";
  const socialTitle = "Graham Zemel · Full-Stack Engineer";
  const metaDescription =
    "Full-stack engineer and CS student at CU Boulder. I build FratDoor (used by 42 fraternities) and TextCloaker (7,000+ users), and write for The Gray Area.";
  // Person structured data lives in app.html (a literal <script> tag inside a
  // Svelte component trips the preprocessor), so nothing JSON-LD lives here.

  /** @param {string} key */
  async function authenticateWithKey(key) {
    const trimmed = String(key || "").trim();
    if (!trimmed) return;
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: trimmed }),
      });
      if (res.ok) {
        window.location.href = "/admin";
        return;
      }
      alert("Incorrect password.");
    } catch (err) {
      console.error("[admin] Auth error:", err);
      alert("Authentication failed.");
    }
  }

  onMount(() => {
    let tapCount = 0;
    let lastTapAt = 0;
    const tapWindowMs = 900;

    /** @param {KeyboardEvent} e */
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        const entered = window.prompt("Enter admin password");
        if (entered !== null) authenticateWithKey(entered);
      }
    };

    /** @param {TouchEvent} e */
    const tapHandler = (e) => {
      const trigger =
        e.target instanceof Element
          ? e.target.closest("[data-admin-mobile-trigger='name']")
          : null;
      if (!trigger) return;

      const isMobileLike =
        window.matchMedia("(max-width: 767px)").matches ||
        window.matchMedia("(pointer: coarse)").matches;
      if (!isMobileLike) return;

      e.preventDefault();

      const now = Date.now();
      tapCount = now - lastTapAt <= tapWindowMs ? tapCount + 1 : 1;
      lastTapAt = now;

      if (tapCount >= 3) {
        tapCount = 0;
        lastTapAt = 0;
        const entered = window.prompt("Enter admin password");
        if (entered !== null) {
          authenticateWithKey(entered);
        }
      }
    };

    // Use capture phase on document to fire BEFORE p5.js can intercept
    document.addEventListener("keydown", handler, true);
    window.addEventListener("touchend", tapHandler, { passive: false });
    return () => {
      document.removeEventListener("keydown", handler, true);
      window.removeEventListener("touchend", tapHandler);
    };
  });
</script>

<Cursor />
<slot />

<svelte:head>
  <title>{pageTitle}</title>

  <!-- General Metas -->
  <link rel="canonical" href="https://grahamzemel.com/" />
  <meta name="title" content={socialTitle} />
  <meta name="description" content={metaDescription} />
  <meta name="author" content="Graham Zemel" />
  <meta name="robots" content="index, follow" />
  <!-- Identity: tie this site to the profiles worth finding -->
  <link rel="me" href="https://www.linkedin.com/in/grahamzemel/" />
  <link rel="me" href="https://github.com/grahamzemel" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content={socialTitle} />
  <meta property="og:description" content={metaDescription} />
  <meta property="og:url" content="https://grahamzemel.com/" />
  <meta property="og:image" content="https://grahamzemel.com/og-img.png" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://grahamzemel.com/" />
  <meta property="twitter:title" content={socialTitle} />
  <meta property="twitter:description" content={metaDescription} />
  <meta property="twitter:image" content="https://grahamzemel.com/og-img.png" />
</svelte:head>

<style global lang="postcss">
  html {
    @apply scroll-smooth antialiased bg-base;
    /* Belt-and-suspenders against horizontal overflow on mobile. `clip`
       (unlike `hidden`) doesn't create a scroll container, so vertical
       smooth-scroll keeps working — but the page can never scroll sideways. */
    overflow-x: clip;
  }

  body {
    @apply text-white selection:bg-accent-200 selection:text-base-800;
    background: transparent;
  }
</style>
