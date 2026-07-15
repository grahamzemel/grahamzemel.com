<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  const DEV = browser && window.location.hostname === 'localhost';
  const BASE_URL = DEV ? 'http://localhost:3000' : 'https://grahamzemelcom-596da5a7c96e.herokuapp.com';
  const CONTACT_EMAIL = 'me@grahamzemel.com';

  // Live source of truth — the outreach-engine Heroku backend. Every
  // business whose generate.sh run succeeded + deploy-site.sh pushed to
  // Netlify ends up in /api/preview-sites, sorted newest-first. This is
  // how a just-deployed site appears in the gallery seconds after the
  // dashboard's build finishes; no manual edit to this file needed.
  const PREVIEW_API = 'https://outreach-engine-f3a2aebc6ec0.herokuapp.com/api/preview-sites';

  // Hardcoded seed — identical shape to what /api/preview-sites returns.
  // Used only as an offline/SSR fallback so the page still renders when
  // Heroku is down or the edge runtime boots before the fetch resolves.
  // Once onMount() lands real data, this list is replaced in place.
  const FALLBACK_SITES = [
    { slug: 'the-bernardi-group', name: 'The Bernardi Group', category: 'Real Estate', url: 'https://the-bernardi-group-site.netlify.app', blurb: 'Boutique Boulder realty team — lead-gen focused with neighborhood guides.' },
    { slug: 'burgess-group-compass', name: 'Burgess Group Compass', category: 'Real Estate', url: 'https://burgess-group-compass-site.netlify.app', blurb: 'Compass-affiliated team site with listing showcase and agent storytelling.' },
    { slug: 'darcy-kiefel-photography', name: 'Darcy Kiefel Photography', category: 'Wedding Photographer', url: 'https://darcy-kiefel-photography-site.netlify.app', blurb: 'Editorial wedding photography portfolio with cinematic galleries.' },
    { slug: 'veterinary-emergency-group', name: 'Veterinary Emergency Group', category: 'Veterinary Clinic', url: 'https://veterinary-emergency-group-site.netlify.app', blurb: '24/7 emergency vet clinic — built for panic-moment clarity.' },
    { slug: 'vasu-skin-solutions', name: 'Vasu Skin Solutions', category: 'Med Spa', url: 'https://vasu-skin-solutions-site.netlify.app', blurb: 'Luxe med spa experience with treatment menus and booking funnel.' },
    { slug: 'terry-chiropractic-boulder', name: 'Terry Chiropractic Boulder', category: 'Chiropractor', url: 'https://terry-chiropractic-boulder-site.netlify.app', blurb: 'Neighborhood chiropractor — friendly, fast, new-patient ready.' },
    { slug: 'physical-therapy-of-boulder', name: 'Physical Therapy of Boulder', category: 'Physical Therapy', url: 'https://physical-therapy-of-boulder-site.netlify.app', blurb: 'Established PT clinic with provider bios and specialty programs.' },
    { slug: 'north-boulder-physical-therapy-foothills', name: 'North Boulder PT — Foothills', category: 'Physical Therapy', url: 'https://north-boulder-physical-therapy-foothills-site.netlify.app', blurb: 'North Boulder PT clinic location — clean service-area landing page.' },
    { slug: 'the-joint-chiropractic', name: 'The Joint Chiropractic', category: 'Chiropractor', url: 'https://the-joint-chiropractic-site.netlify.app', blurb: 'Membership-based chiropractic — pricing transparency front and center.' },
  ];
  let sites = FALLBACK_SITES;
  let sitesLoading = true;

  let hidden = new Set();
  let loadedVisibility = false;
  let isAdmin = false;
  let showLogin = false;
  let pwInput = '';
  let loginError = '';
  let loginLoading = false;
  let savingSet = new Set();
  let activeFilter = 'All';
  let authToken = '';
  let searchQuery = '';
  let page = 1;
  const PAGE_SIZE = 8;

  $: categories = ['All', ...Array.from(new Set(sites.map((s) => s.category)))];

  $: filteredSites = sites
    .filter((s) => isAdmin || !hidden.has(s.slug))
    .filter((s) => activeFilter === 'All' || s.category === activeFilter)
    .filter((s) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.blurb || '').toLowerCase().includes(q)
      );
    });

  $: totalPages = Math.max(1, Math.ceil(filteredSites.length / PAGE_SIZE));
  // Re-clamp page whenever filters/search shrink the result set
  $: if (page > totalPages) page = 1;
  $: pagedSites = filteredSites.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  $: visibleCount = sites.filter((s) => !hidden.has(s.slug)).length;

  // Reset to page 1 whenever the filter or search changes
  $: activeFilter, searchQuery, (page = 1);

  function goToPage(n) {
    page = Math.max(1, Math.min(totalPages, n));
    if (browser) window.scrollTo({ top: document.getElementById('work')?.offsetTop - 20 || 0, behavior: 'smooth' });
  }

  onMount(async () => {
    if (!browser) return;
    // Fire the three network calls in parallel — none of them depend on
    // each other, and the gallery feels instant when they resolve together.
    await Promise.all([verifyStoredToken(), loadVisibility(), loadSites()]);
  });

  // Fetch the canonical site list from outreach-engine. Failure falls back
  // to FALLBACK_SITES so the page still renders — e.g. if Heroku is
  // cold-starting or the user is offline.
  async function loadSites() {
    try {
      const res = await fetch(PREVIEW_API, { mode: 'cors' });
      if (!res.ok) throw new Error(`preview-sites ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        sites = data;
      }
    } catch (e) {
      console.error('preview-sites load failed — using offline fallback', e);
    } finally {
      sitesLoading = false;
    }
  }

  async function verifyStoredToken() {
    const t = localStorage.getItem('gz_admin_token') || '';
    if (!t) return;
    try {
      const res = await fetch(`${BASE_URL}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        authToken = t;
        isAdmin = true;
      } else {
        localStorage.removeItem('gz_admin_token');
      }
    } catch (error) {
      console.warn('Stored admin token verification failed', error);
    }
  }

  async function loadVisibility() {
    try {
      const res = await fetch(`${BASE_URL}/api/preview-visibility`, { mode: 'cors' });
      if (!res.ok) throw new Error(`visibility ${res.status}`);
      const data = await res.json();
      hidden = new Set(data.hidden || []);
    } catch (e) {
      console.error('visibility load failed', e);
    } finally {
      loadedVisibility = true;
      hidden = hidden;
    }
  }

  // Login via SvelteKit's same-origin /api/admin-auth (no CORS).
  // That matches how the main site logs admins in (see routes/+layout.svelte).
  async function login() {
    if (!pwInput) return;
    loginLoading = true;
    loginError = '';
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: pwInput }),
      });
      if (!res.ok) throw new Error('Incorrect password');
      authToken = 'gz_admin_a8f3e7c2d1b9';
      localStorage.setItem('gz_admin_token', authToken);
      isAdmin = true;
      showLogin = false;
      pwInput = '';
    } catch (e) {
      loginError = e.message || 'Login failed';
    } finally {
      loginLoading = false;
    }
  }

  function logout() {
    localStorage.removeItem('gz_admin_token');
    authToken = '';
    isAdmin = false;
  }

  async function toggle(slug) {
    if (!isAdmin) return;
    const next = new Set(hidden);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);

    savingSet.add(slug);
    savingSet = savingSet;
    hidden = next;

    try {
      const res = await fetch(`${BASE_URL}/api/preview-visibility`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ hidden: Array.from(next) }),
      });
      if (!res.ok) throw new Error('save failed');
    } catch (e) {
      const reverted = new Set(hidden);
      if (reverted.has(slug)) reverted.delete(slug);
      else reverted.add(slug);
      hidden = reverted;
      alert('Could not save visibility change: ' + e.message);
    } finally {
      savingSet.delete(slug);
      savingSet = savingSet;
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && showLogin) showLogin = false;
  }

</script>

<svelte:head>
  <title>Portfolio — Graham Zemel</title>
  <meta name="description" content="Hand-crafted websites by Graham Zemel — custom-coded sites for any brand that needs to look like it means business." />
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<div class="shell">
  <div class="grid-bg"></div>
  <div class="aura"></div>

  <!-- Top-right page nav — small, unobtrusive, always reachable -->
  <nav class="page-nav">
    <a class="cta primary" href="mailto:{CONTACT_EMAIL}?subject=New%20website%20project">
      Start a project
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14M13 5l7 7-7 7"/>
      </svg>
    </a>
  </nav>

  <div class="wrap">
    <!-- HERO -->
    <header class="hero">
      <h1 class="mega">
        Hand-crafted <span class="h-accent">websites.</span>
      </h1>
    </header>

    <!-- WORK -->
    <section id="work" class="work">
      <div class="work-head">
        <div class="search-wrap">
          <svg class="search-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
          </svg>
          <input
            class="search-input"
            type="text"
            bind:value={searchQuery}
            placeholder="Search by name, industry, or keyword"
          />
          {#if searchQuery}
            <button class="search-clear" on:click={() => (searchQuery = '')} aria-label="Clear search">×</button>
          {/if}
        </div>
        {#if isAdmin}
          <div class="admin-badge">
            <span class="pulse"></span>
            Admin · {hidden.size} hidden
            <button class="linklike" on:click={logout}>sign out</button>
          </div>
        {/if}
      </div>

      <div class="filters">
        {#each categories as cat}
          <button
            class="chip"
            class:active={activeFilter === cat}
            on:click={() => (activeFilter = cat)}
          >
            {cat}
          </button>
        {/each}
      </div>

      {#if loadedVisibility}
        <div class="grid">
          {#each pagedSites as site (site.slug)}
            {@const isHidden = hidden.has(site.slug)}
            {@const saving = savingSet.has(site.slug)}
            <div class="card" class:hidden-card={isHidden}>
              <a href="/preview/{site.slug}" target="_blank" rel="noopener noreferrer" class="card-link" aria-label="Open {site.name}">
                <div class="thumb">
                  <iframe
                    src={site.url}
                    title={site.name}
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                  ></iframe>
                  <div class="thumb-overlay">
                    <span class="view-btn">
                      Open preview
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M7 17L17 7M7 7h10v10"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </a>
              <div class="info">
                <div class="info-top">
                  <span class="cat-chip">{site.category}</span>
                  {#if isAdmin && isHidden}
                    <span class="status-chip hidden-chip">Hidden</span>
                  {/if}
                </div>
                <h3>{site.name}</h3>
                <div class="info-row">
                  <span class="slug">/preview/<span class="slug-name">{site.slug}</span></span>
                  {#if isAdmin}
                    <label class="toggle" title={isHidden ? 'Show to visitors' : 'Hide from visitors'}>
                      <input
                        type="checkbox"
                        checked={!isHidden}
                        disabled={saving}
                        on:change={() => toggle(site.slug)}
                      />
                      <span class="slider"></span>
                    </label>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>

        {#if filteredSites.length === 0}
          <div class="empty">
            <p>No sites match.</p>
            <button class="linklike" on:click={() => { searchQuery = ''; activeFilter = 'All'; }}>clear filters</button>
          </div>
        {:else if totalPages > 1}
          <nav class="pagination" aria-label="Pagination">
            <button class="pg-btn" disabled={page === 1} on:click={() => goToPage(page - 1)} aria-label="Previous page">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            {#each Array(totalPages) as _, i}
              <button
                class="pg-num"
                class:active={page === i + 1}
                on:click={() => goToPage(i + 1)}
                aria-label="Page {i + 1}"
                aria-current={page === i + 1 ? 'page' : undefined}
              >
                {i + 1}
              </button>
            {/each}
            <button class="pg-btn" disabled={page === totalPages} on:click={() => goToPage(page + 1)} aria-label="Next page">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </nav>
        {/if}
      {:else}
        <div class="grid">
          {#each Array(8) as _}
            <div class="card skeleton">
              <div class="thumb"></div>
              <div class="info">
                <div class="sk-line sk-sm"></div>
                <div class="sk-line sk-lg"></div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </section>

    <!-- CTA LINE -->
    <section class="foot">
      <p class="foot-line">
        Want one? <a href="mailto:{CONTACT_EMAIL}?subject=New%20website%20project">{CONTACT_EMAIL}</a>
      </p>
    </section>

    <!-- SITE FOOTER (mirrors main homepage) -->
    <footer class="site-footer">
      <p>
        Built with Svelte &amp; Tailwind —
        <a href="https://github.com/grahamzemel/grahamzemel.com" target="_blank" rel="noopener noreferrer">see inside</a>
      </p>
      <p class="copyright">&copy; Graham Zemel {new Date().getFullYear()}. All rights reserved.</p>
    </footer>
  </div>

  {#if !isAdmin}
    <button
      class="admin-trigger"
      on:click={() => (showLogin = true)}
      aria-label="Admin"
      title="Admin"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    </button>
  {/if}

  {#if showLogin}
    <div class="modal-backdrop" on:click={() => (showLogin = false)}>
      <form class="modal" on:submit|preventDefault={login} on:click|stopPropagation>
        <h2>Admin access</h2>
        <p class="modal-sub">Enter the password to show/hide portfolio sites.</p>
        <input
          type="password"
          bind:value={pwInput}
          placeholder="Password"
          autofocus
          autocomplete="off"
        />
        {#if loginError}<p class="err">{loginError}</p>{/if}
        <div class="modal-actions">
          <button type="button" class="cta ghost" on:click={() => (showLogin = false)}>Cancel</button>
          <button type="submit" class="cta primary" disabled={loginLoading || !pwInput}>
            {loginLoading ? 'Checking…' : 'Unlock'}
          </button>
        </div>
      </form>
    </div>
  {/if}
</div>

<style>
  :global(body) { background: #121217; }

  .shell {
    --accent-1: #33FFC1;   /* mint */
    --accent-2: #34F8FF;   /* cyan */
    --accent-3: #3377FF;   /* blue — used sparingly */
    /* softer mint→cyan gradient; drops the deep blue that was clashing */
    --accent-grad: linear-gradient(135deg, #33FFC1 0%, #34F8FF 60%, #3377FF 100%);
    --accent-grad-text: linear-gradient(120deg, #33FFC1 0%, #34F8FF 55%, #3377FF 100%);
    --bg: #121217;
    --surface: rgba(255,255,255,0.025);
    --border: rgba(255,255,255,0.07);
    --border-hi: rgba(255,255,255,0.16);
    --ink: #ebebef;
    --muted: #a8a8b3;
    --muted-2: #6b6b75;

    position: relative;
    min-height: 100vh;
    color: var(--ink);
    font-family: 'Source Sans Pro', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    overflow-x: hidden;
  }

  /* Grid background with radial mask — scoped to hero area */
  .grid-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    height: 1000px;
    pointer-events: none;
    background-image:
      linear-gradient(to right, rgba(52,248,255,0.06) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(52,248,255,0.06) 1px, transparent 1px);
    background-size: 64px 64px;
    -webkit-mask-image: radial-gradient(ellipse 80% 55% at 50% 0%, #000 45%, transparent 90%);
    mask-image: radial-gradient(ellipse 80% 55% at 50% 0%, #000 45%, transparent 90%);
  }
  .aura {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background:
      radial-gradient(900px 600px at 12% -10%, rgba(51,255,193,0.08), transparent 60%),
      radial-gradient(800px 500px at 88% 5%, rgba(51,119,255,0.13), transparent 55%),
      radial-gradient(1000px 600px at 50% 115%, rgba(12,85,255,0.1), transparent 60%);
  }

  .wrap {
    position: relative;
    z-index: 1;
    max-width: 1440px;
    margin: 0 auto;
    padding: 80px 32px 100px;
  }

  /* ---------- HERO ---------- */
  .hero { margin-bottom: 56px; max-width: 1100px; padding-top: 16px; }

  /* Floating top-right CTA */
  .page-nav {
    position: absolute;
    top: 24px;
    right: 28px;
    z-index: 2;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.55; transform: scale(1.35); }
  }

  h1.mega {
    font-family: 'Source Serif Pro', Georgia, serif;
    font-size: clamp(44px, 6.2vw, 96px);
    font-weight: 700;
    line-height: 1.02;
    letter-spacing: -0.03em;
    margin: 0;
    background: linear-gradient(180deg, #ffffff 0%, rgba(200,200,215,0.62) 110%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .h-accent {
    background: var(--accent-grad-text);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-style: italic;
  }

  .cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 20px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    border: 1px solid transparent;
    cursor: pointer;
    transition: transform 0.15s, background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s;
    font-family: inherit;
  }
  .cta.primary {
    background: var(--accent-grad);
    color: #081029;
    font-weight: 600;
    box-shadow: 0 10px 30px -10px rgba(51,119,255,0.6), 0 0 0 1px rgba(255,255,255,0.15) inset;
  }
  .cta.primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 34px -8px rgba(51,119,255,0.7), 0 0 0 1px rgba(255,255,255,0.2) inset;
  }
  .cta.primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .cta.ghost {
    background: transparent;
    color: var(--ink);
    border-color: rgba(255,255,255,0.14);
  }
  .cta.ghost:hover { border-color: rgba(52,248,255,0.4); background: rgba(52,248,255,0.04); color: #34F8FF; }

  /* ---------- WORK ---------- */
  .work { margin-bottom: 80px; scroll-margin-top: 40px; }
  .work-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }

  .search-wrap {
    position: relative;
    flex: 1;
    min-width: 280px;
    max-width: 420px;
    display: flex;
    align-items: center;
  }
  .search-ico {
    position: absolute;
    left: 14px;
    color: var(--muted-2);
    pointer-events: none;
  }
  .search-input {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 10px 38px 10px 38px;
    font-family: inherit;
    font-size: 13.5px;
    color: var(--ink);
    outline: none;
    transition: border-color 0.15s, background 0.15s;
  }
  .search-input::placeholder { color: var(--muted-2); }
  .search-input:focus { border-color: rgba(52,248,255,0.4); background: rgba(52,248,255,0.03); }
  .search-clear {
    position: absolute;
    right: 10px;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.08);
    border: none;
    border-radius: 50%;
    color: var(--muted);
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    padding: 0;
    transition: background 0.15s, color 0.15s;
  }
  .search-clear:hover { background: rgba(255,255,255,0.16); color: var(--ink); }

  .filters {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 28px;
  }
  .chip {
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    padding: 7px 13px;
    border-radius: 999px;
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--border);
    cursor: pointer;
    transition: all 0.15s;
  }
  .chip:hover { color: var(--ink); border-color: rgba(52,248,255,0.35); }
  .chip.active {
    background: var(--accent-grad);
    color: #081029;
    border-color: transparent;
    font-weight: 600;
  }
  .admin-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: var(--muted);
    background: rgba(51,255,193,0.08);
    border: 1px solid rgba(51,255,193,0.28);
    padding: 5px 11px;
    border-radius: 999px;
  }
  .pulse {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #33FFC1;
    animation: pulse 2s infinite;
  }
  .linklike {
    background: none;
    border: none;
    color: var(--muted-2);
    font-family: inherit;
    font-size: 11px;
    cursor: pointer;
    padding: 0;
    margin-left: 4px;
    text-decoration: underline;
    text-decoration-color: rgba(255,255,255,0.2);
  }
  .linklike:hover { color: var(--ink); }

  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  @media (max-width: 1100px) {
    .grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 840px) {
    .grid { grid-template-columns: repeat(2, 1fr); }
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
    overflow: hidden;
    transition: transform 0.25s cubic-bezier(.2,.8,.2,1), border-color 0.2s, box-shadow 0.25s;
    display: flex;
    flex-direction: column;
  }
  .card:hover {
    border-color: rgba(52,248,255,0.3);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -20px rgba(51,119,255,0.3);
  }
  .card.hidden-card { opacity: 0.55; border-style: dashed; }
  .card.hidden-card:hover { opacity: 0.9; }
  .card-link { display: block; text-decoration: none; color: inherit; }

  .thumb {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: #050506;
  }
  .thumb iframe {
    position: absolute;
    top: 0; left: 0;
    width: 200%; height: 200%;
    transform: scale(0.5);
    transform-origin: top left;
    border: none;
    pointer-events: none;
  }
  .thumb-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.7) 100%);
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 14px;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .card:hover .thumb-overlay { opacity: 1; }
  .view-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: #081029;
    background: var(--accent-grad);
    padding: 8px 14px;
    border-radius: 999px;
    box-shadow: 0 4px 12px rgba(51,119,255,0.3);
  }

  .info { padding: 16px 18px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
  .info-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .cat-chip {
    font-size: 9.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #34F8FF;
    background: rgba(52,248,255,0.08);
    padding: 3px 9px;
    border-radius: 999px;
    border: 1px solid rgba(52,248,255,0.18);
  }
  .status-chip {
    font-size: 9.5px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 999px;
    letter-spacing: 0.04em;
  }
  .hidden-chip {
    color: #fca5a5;
    background: rgba(248,113,113,0.08);
    border: 1px solid rgba(248,113,113,0.22);
  }
  .card h3 {
    font-family: 'Source Serif Pro', Georgia, serif;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.01em;
    margin: 2px 0 0;
    color: #fafafa;
    line-height: 1.25;
  }
  .info-row {
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding-top: 12px;
    border-top: 1px solid rgba(255,255,255,0.04);
  }
  .slug {
    font-size: 10.5px;
    color: var(--muted-2);
    font-family: 'SF Mono', ui-monospace, monospace;
    line-height: 1.4;
    word-break: break-all;
    overflow-wrap: anywhere;
    flex: 1;
    min-width: 0;
  }
  .slug-name { color: #34F8FF; }

  .toggle {
    position: relative;
    display: inline-block;
    width: 36px;
    height: 20px;
    flex-shrink: 0;
    cursor: pointer;
  }
  .toggle input { opacity: 0; width: 0; height: 0; }
  .slider {
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0.12);
    border-radius: 20px;
    transition: background 0.2s;
  }
  .slider::before {
    content: "";
    position: absolute;
    width: 14px;
    height: 14px;
    left: 3px;
    top: 3px;
    background: #fff;
    border-radius: 50%;
    transition: transform 0.2s;
  }
  .toggle input:checked + .slider { background: var(--accent-grad); }
  .toggle input:checked + .slider::before { transform: translateX(16px); }
  .toggle input:disabled + .slider { opacity: 0.5; }

  .empty {
    text-align: center;
    padding: 60px 20px;
    color: var(--muted-2);
    font-size: 14px;
  }
  .empty p { margin: 0 0 8px; }

  /* Pagination */
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 36px;
  }
  .pg-btn, .pg-num {
    min-width: 34px;
    height: 34px;
    border-radius: 8px;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    transition: all 0.15s;
  }
  .pg-btn:hover:not(:disabled),
  .pg-num:hover { color: var(--ink); border-color: rgba(52,248,255,0.4); background: rgba(52,248,255,0.04); }
  .pg-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .pg-num.active {
    background: var(--accent-grad);
    color: #081029;
    border-color: transparent;
    font-weight: 700;
  }
  .pg-num.active:hover { color: #081029; }

  .skeleton .thumb {
    background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%);
    background-size: 200% 100%;
    animation: shimmer 1.8s infinite;
  }
  .sk-line { background: rgba(255,255,255,0.05); border-radius: 4px; height: 10px; margin-bottom: 8px; }
  .sk-sm { width: 40%; }
  .sk-lg { width: 70%; height: 14px; }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ---------- FOOTER ---------- */
  .foot {
    text-align: center;
    padding: 48px 24px 16px;
  }
  .foot-line {
    font-size: 15px;
    color: var(--muted);
    margin: 0;
  }
  .foot-line a {
    color: #34F8FF;
    text-decoration: none;
    border-bottom: 1px solid rgba(52,248,255,0.4);
    transition: border-color 0.15s;
    margin-left: 4px;
  }
  .foot-line a:hover { border-bottom-color: #34F8FF; }

  /* Site footer — mirrors the main homepage */
  .site-footer {
    text-align: center;
    font-size: 13px;
    color: var(--muted-2);
    padding: 28px 20px 40px;
    border-top: 1px solid var(--border);
    margin-top: 32px;
  }
  .site-footer p { margin: 0 0 4px; }
  .site-footer a {
    color: var(--muted);
    text-decoration: none;
    border-bottom: 1px dotted rgba(255,255,255,0.25);
    transition: color 0.15s, border-color 0.15s;
  }
  .site-footer a:hover { color: #34F8FF; border-bottom-color: #34F8FF; }
  .site-footer .copyright { color: #555; }

  .admin-trigger {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 20;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    color: var(--muted-2);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0.35;
    transition: opacity 0.2s, color 0.2s, border-color 0.2s;
  }
  .admin-trigger:hover { opacity: 1; color: #34F8FF; border-color: rgba(52,248,255,0.4); }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .modal {
    background: #15151c;
    border: 1px solid rgba(52,248,255,0.15);
    border-radius: 16px;
    padding: 28px;
    width: 100%;
    max-width: 380px;
    box-shadow: 0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(52,248,255,0.05);
  }
  .modal h2 {
    font-family: 'Source Serif Pro', Georgia, serif;
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 6px;
    color: #fff;
    letter-spacing: -0.01em;
  }
  .modal-sub { font-size: 13px; color: var(--muted); margin: 0 0 18px; }
  .modal input {
    width: 100%;
    padding: 11px 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    color: #fff;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }
  .modal input:focus { border-color: rgba(52,248,255,0.5); }
  .err { color: #fca5a5; font-size: 12px; margin: 10px 0 0; }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }

  @media (max-width: 900px) {
    .work-head { flex-direction: column; align-items: stretch; }
    .search-wrap { max-width: none; }
  }
  @media (max-width: 620px) {
    .page-nav { top: 16px; right: 16px; }
    .page-nav .cta.primary { padding: 9px 14px; font-size: 13px; }
  }
  @media (max-width: 520px) {
    .wrap { padding: 72px 16px 20px; }
    .hero { margin-bottom: 40px; padding-top: 0; }
    .work { margin-bottom: 60px; }
    .grid { grid-template-columns: 1fr; gap: 16px; }
    h1.mega { font-size: clamp(40px, 12vw, 64px); }
  }
</style>
