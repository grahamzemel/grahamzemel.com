<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { post, get } from "$lib/api.js";

  const navItems = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/income", label: "Income" },
    { href: "/admin/stripe", label: "Startups" },
    { href: "/admin/cashflow", label: "Cash Flow" },
    { href: "/admin/settings", label: "Settings" },
  ];

  let pushSupported = false;
  let pushSubscribed = false;
  let pushSettings = null;
  let menuOpen = false;
  let dark = false;

  async function logout() {
    try {
      const response = await fetch("/api/admin-auth", { method: "DELETE" });
      if (!response.ok) {
        throw new Error(`Sign-out request failed (${response.status})`);
      }
      localStorage.removeItem("gz_admin_token");
      window.location.href = "/";
    } catch (error) {
      console.error("[admin] Sign out failed", error);
      alert("Could not sign out. Please try again.");
    }
  }

  $: currentPath = $page.url.pathname;
  // Close menu on navigation
  $: currentPath, menuOpen = false;

  function toggleDark() {
    dark = !dark;
    localStorage.setItem('gz_dark_mode', dark ? '1' : '0');
  }

  onMount(async () => {
    if (!browser) return;
    dark = localStorage.getItem('gz_dark_mode') === '1';

    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        pushSupported = 'PushManager' in window;

        if (pushSupported) {
          const sub = await reg.pushManager.getSubscription();
          pushSubscribed = !!sub;
        }
        pushSettings = await get('/api/push/status').catch((error) => {
          console.warn('[Push] Could not load settings', error);
          return null;
        });
      } catch (err) {
        console.error('[SW] Registration failed:', err);
      }
    }
  });

  async function enablePush() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const { publicKey } = await get('/api/push/vapid-key');
      if (!publicKey) { alert('Push not configured on server'); return; }

      const vapidKey = urlBase64ToUint8Array(publicKey);
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });

      await post('/api/push/subscribe', { subscription: sub.toJSON() });
      pushSubscribed = true;

      pushSettings = await get('/api/push/status').catch((error) => {
        console.warn('[Push] Could not refresh settings', error);
        return pushSettings;
      });
      if (pushSettings?.settings?.autoSendTestOnSubscribe !== false) {
        await post('/api/push/test');
      }
    } catch (err) {
      console.error('[Push] Error:', err);
      alert('Could not enable notifications: ' + err.message);
    }
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
    return outputArray;
  }
</script>

<svelte:head>
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content={dark ? '#030712' : '#ffffff'} />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Income Engine" />
  <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
</svelte:head>

<!-- Override the global dark body for the admin area — fixed position covers everything -->
<div class="fixed inset-0 overflow-y-auto z-50 transition-colors duration-200 admin-shell
  {dark ? 'dark-mode bg-gray-950 text-gray-100' : 'bg-[#fafafa] text-gray-900'}">
  <!-- Top nav -->
  <header class="sticky top-0 z-10 border-b transition-colors duration-200
    {dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
      <div class="flex items-center gap-8">
        <a href="/admin" class="text-sm font-semibold tracking-tight {dark ? 'text-gray-100' : 'text-gray-900'}">Income Engine</a>
        <!-- Desktop nav -->
        <nav class="hidden md:flex gap-1">
          {#each navItems as item}
            <a
              href={item.href}
              class="px-3 py-1.5 rounded-md text-sm transition-colors
                {currentPath === item.href
                  ? dark ? 'bg-gray-800 text-gray-100 font-medium' : 'bg-gray-100 text-gray-900 font-medium'
                  : dark ? 'text-gray-400 hover:text-gray-100 hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}"
            >
              {item.label}
            </a>
          {/each}
        </nav>
      </div>
      <div class="flex items-center gap-3">
        <!-- Dark mode toggle -->
        <button
          on:click={toggleDark}
          class="w-8 h-8 flex items-center justify-center rounded-md transition
            {dark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-400'}"
          title={dark ? 'Light mode' : 'Dark mode'}
        >
          {#if dark}
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          {:else}
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          {/if}
        </button>
        {#if pushSupported && !pushSubscribed}
          <button
            on:click={enablePush}
            class="hidden sm:inline text-xs text-emerald-600 hover:text-emerald-700 transition"
            title="Enable push notifications"
          >
            Enable notifications
          </button>
        {/if}
        {#if pushSubscribed}
          <span class="hidden sm:inline text-[10px] text-emerald-500" title="Push notifications active">notifications on</span>
        {/if}
        <button
          on:click={logout}
          class="hidden md:inline text-xs transition {dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}"
        >
          Sign out
        </button>
        <!-- Hamburger (mobile) -->
        <button
          on:click={() => menuOpen = !menuOpen}
          class="md:hidden w-8 h-8 flex items-center justify-center rounded-md transition
            {dark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}"
          aria-label="Toggle menu"
        >
          {#if menuOpen}
            <svg class="w-5 h-5 {dark ? 'text-gray-300' : 'text-gray-600'}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          {:else}
            <svg class="w-5 h-5 {dark ? 'text-gray-300' : 'text-gray-600'}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          {/if}
        </button>
      </div>
    </div>

    <!-- Mobile dropdown menu -->
    {#if menuOpen}
      <nav class="md:hidden border-t px-4 pb-3 pt-1
        {dark ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'}">
        {#each navItems as item}
          <a
            href={item.href}
            class="block px-3 py-2.5 rounded-md text-sm transition-colors
              {currentPath === item.href
                ? dark ? 'bg-gray-800 text-gray-100 font-medium' : 'bg-gray-100 text-gray-900 font-medium'
                : dark ? 'text-gray-400 hover:text-gray-100 hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}"
          >
            {item.label}
          </a>
        {/each}
        <div class="border-t mt-2 pt-2 flex items-center justify-between px-3
          {dark ? 'border-gray-800' : 'border-gray-100'}">
          {#if pushSupported && !pushSubscribed}
            <button
              on:click={enablePush}
              class="text-xs text-emerald-600 hover:text-emerald-700 transition"
            >
              Enable notifications
            </button>
          {:else if pushSubscribed}
            <span class="text-[10px] text-emerald-500">notifications on</span>
          {:else}
            <span></span>
          {/if}
          <button
            on:click={logout}
            class="text-xs transition {dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}"
          >
            Sign out
          </button>
        </div>
      </nav>
    {/if}
  </header>

  <!-- Main content -->
  <main class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
    <slot />
  </main>
</div>

<style global>
  /* Dark mode overrides — applied globally when .dark-mode is on the admin shell */
  .dark-mode .bg-white { background-color: rgb(17 24 39) !important; } /* gray-900 */
  .dark-mode .bg-gray-50 { background-color: rgb(31 41 55) !important; } /* gray-800 */
  .dark-mode .bg-gray-100 { background-color: rgb(31 41 55) !important; }
  .dark-mode .bg-emerald-50 { background-color: rgb(6 78 59 / 0.3) !important; }
  .dark-mode .bg-amber-50 { background-color: rgb(120 53 15 / 0.3) !important; }
  .dark-mode .bg-blue-50 { background-color: rgb(30 58 138 / 0.3) !important; }
  .dark-mode .bg-red-50 { background-color: rgb(127 29 29 / 0.3) !important; }

  .dark-mode .border-gray-200 { border-color: rgb(55 65 81) !important; } /* gray-700 */
  .dark-mode .border-gray-100 { border-color: rgb(55 65 81) !important; }
  .dark-mode .border-emerald-200 { border-color: rgb(6 95 70) !important; }
  .dark-mode .border-amber-200 { border-color: rgb(146 64 14) !important; }
  .dark-mode .border-blue-200 { border-color: rgb(30 64 175) !important; }

  .dark-mode .text-gray-900 { color: rgb(243 244 246) !important; } /* gray-100 */
  .dark-mode .text-gray-800 { color: rgb(229 231 235) !important; }
  .dark-mode .text-gray-700 { color: rgb(209 213 219) !important; } /* gray-300 */
  .dark-mode .text-gray-600 { color: rgb(156 163 175) !important; } /* gray-400 */
  .dark-mode .text-gray-500 { color: rgb(156 163 175) !important; }
  .dark-mode .text-gray-400 { color: rgb(107 114 128) !important; } /* gray-500 */
  .dark-mode .text-gray-300 { color: rgb(75 85 99) !important; }

  .dark-mode .text-emerald-900 { color: rgb(167 243 208) !important; }
  .dark-mode .text-emerald-600 { color: rgb(52 211 153) !important; }
  .dark-mode .text-blue-900 { color: rgb(147 197 253) !important; }
  .dark-mode .text-blue-700 { color: rgb(96 165 250) !important; }
  .dark-mode .text-amber-600 { color: rgb(251 191 36) !important; }

  .dark-mode .divide-gray-100 > :not([hidden]) ~ :not([hidden]) {
    border-color: rgb(55 65 81) !important;
  }

  .dark-mode input,
  .dark-mode select,
  .dark-mode textarea {
    background-color: rgb(31 41 55) !important;
    border-color: rgb(55 65 81) !important;
    color: rgb(229 231 235) !important;
  }
  .dark-mode input::placeholder,
  .dark-mode textarea::placeholder {
    color: rgb(107 114 128) !important;
  }

  /* Progress bar track */
  .dark-mode .bg-gray-100.rounded-full { background-color: rgb(55 65 81) !important; }

  /* Skeleton loading pulses */
  .dark-mode .animate-pulse .bg-gray-200 { background-color: rgb(55 65 81) !important; }
</style>
