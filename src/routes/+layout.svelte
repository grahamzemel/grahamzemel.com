<script>
  import "../app.postcss";

  import { dev } from "$app/environment";
  import { inject } from "@vercel/analytics";

  import { onMount } from "svelte";

  // Vercel Analytics
  inject({ mode: dev ? "development" : "production" });

  // SEO: a branded, descriptive title + a shared keyword-rich description, plus
  // Person structured data so a name search surfaces the maintained profiles
  // (LinkedIn, GitHub) instead of stale ones.
  const pageTitle = "Graham Zemel · Full-Stack Engineer (FratDoor, TextCloaker)";
  const socialTitle = "Graham Zemel · Full-Stack Engineer";
  const metaDescription =
    "Full-stack engineer and CS student at CU Boulder. I build FratDoor (used by 42 fraternities) and TextCloaker (7,000+ users), and write for The Gray Area.";
  // Person structured data lives in app.html (a literal <script> tag inside a
  // Svelte component trips the preprocessor), so nothing JSON-LD lives here.

  const SECRET = "Jetset14#";
  const ADMIN_TOKEN = "gz_admin_a8f3e7c2d1b9";
  let buffer = "";

  function setAdminCookie() {
    const secure = window.location.protocol === "https:";
    document.cookie = `gz_admin=${ADMIN_TOKEN}; Path=/; SameSite=${secure ? "Strict" : "Lax"};${secure ? " Secure;" : ""} Max-Age=3600`;
  }

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
        setAdminCookie();
        // Store token for cross-origin API calls (mobile Safari blocks 3rd-party cookies)
        localStorage.setItem("gz_admin_token", ADMIN_TOKEN);
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

    const handler = (e) => {
      if (!e.key || e.key.length !== 1) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      buffer += e.key;
      if (buffer.length > SECRET.length) {
        buffer = buffer.slice(-SECRET.length);
      }
      if (buffer === SECRET) {
        buffer = "";
        authenticateWithKey(SECRET);
      }
    };

    const tapHandler = (e) => {
      const trigger = e.target instanceof Element
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
