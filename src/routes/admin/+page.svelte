<script>
  import { onMount } from "svelte";
  import { get, post, del } from "$lib/api.js";

  let summary = null;
  let cashflow = null;
  let modifiers = [];
  let summaryLoading = true;
  let cashflowLoading = true;
  let error = null;

  // NLP input
  let nlpInput = "";
  let nlpLoading = false;
  let nlpError = null;

  // Tooltip state
  let tooltipPayment = null;
  let tooltipPos = { x: 0, y: 0 };

  // AI insights
  let insights = null;
  let insightsLoading = false;
  let insightsCached = false;

  /**
   * @param {string} section
   * @param {unknown} cause
   */
  function reportLoadError(section, cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    console.error(`[Overview] ${section} failed`, cause);
    error = `${section}: ${message}.`;
  }

  onMount(() => {
    // Load each independently — render sections as they arrive
    get("/api/dashboard/summary")
      .then(s => { summary = s; })
      .catch(e => { reportLoadError("Summary", e); })
      .finally(() => { summaryLoading = false; });

    get("/api/projections/cashflow?days=30")
      .then(c => { cashflow = c; })
      .catch(e => { reportLoadError("Cash flow", e); })
      .finally(() => { cashflowLoading = false; });

    get("/api/modifiers")
      .then(m => { modifiers = m.modifiers || []; })
      .catch(e => { reportLoadError("Modifiers", e); });

    // Auto-generate insights on login (cached daily)
    loadInsights();
  });

  async function refreshData() {
    const [s, c] = await Promise.all([
      get("/api/dashboard/summary"),
      get("/api/projections/cashflow?days=30"),
    ]);
    summary = s;
    cashflow = c;
  }

  async function submitModifier() {
    if (!nlpInput.trim()) return;
    nlpLoading = true;
    nlpError = null;
    try {
      const result = await post("/api/modifiers", { text: nlpInput });
      if (result.impact) result.modifier._impact = result.impact;
      modifiers = [result.modifier, ...modifiers];
      nlpInput = "";
      await refreshData();
    } catch (e) {
      nlpError = e.message;
    } finally {
      nlpLoading = false;
    }
  }

  async function removeModifier(id) {
    try {
      await del(`/api/modifiers/${id}`);
      modifiers = modifiers.filter(m => m.id !== id);
      await refreshData();
    } catch (e) {
      nlpError = e.message;
    }
  }

  function scrollToModifier(modId) {
    const el = document.getElementById(`mod-${modId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-amber-400");
      setTimeout(() => el.classList.remove("ring-2", "ring-amber-400"), 2000);
    }
  }

  // Find which modifier affects a payment
  function findModifierForPayment(p) {
    if (!p.isModified || !p.periodStart) return null;
    return modifiers.find(m => {
      if (!m.startDate || !m.endDate) return false;
      return m.startDate <= p.periodEnd && m.endDate >= p.periodStart;
    });
  }

  function showTooltip(e, p) {
    const mod = findModifierForPayment(p);
    if (!mod) return;
    tooltipPayment = { ...p, _mod: mod };
    const rect = e.currentTarget.getBoundingClientRect();
    tooltipPos = { x: rect.left, y: rect.top - 8 };
  }

  function hideTooltip() { tooltipPayment = null; }

  async function loadInsights(force = false) {
    insightsLoading = true;
    try {
      const result = await get(`/api/insights${force ? '?force=true' : ''}`);
      insights = result.configured ? result.insights : "Add ANTHROPIC_API_KEY to enable AI insights.";
      insightsCached = result.cached || false;
    } catch (e) {
      insights = "Error: " + e.message;
    } finally {
      insightsLoading = false;
    }
  }

  $: upcoming = (cashflow?.payments || []).slice(0, 8);
  $: next = upcoming[0] || null;

  // Split active vs inactive sources for projection display
  $: activeSources = (summary?.incomeBreakdown || []).filter(s => s.active !== false);
  $: inactiveSources = (summary?.incomeBreakdown || []).filter(s => s.active === false);

  function fmt(n) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n || 0); }
  function fmtE(n) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0); }
  function fmtD(s) {
    if (!s) return "";
    const d = new Date(s + "T12:00:00");
    const diff = Math.ceil((d - new Date()) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  function fmtRange(start, end) {
    if (!start || !end) return "";
    const s = new Date(start + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const e = new Date(end + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${s} – ${e}`;
  }

  function getPaymentToneClass(payment) {
    switch (payment?.type) {
      case "hourly":
        return "text-blue-600";
      case "salary":
        return "text-emerald-600";
      case "freelance":
        return "text-orange-600";
      case "business":
        return "text-violet-600";
      case "stripe_subscription_renewal":
        return "text-emerald-600";
      case "stripe_payout":
        return "text-sky-600";
      case "stripe_pending":
        return "text-amber-600";
      default:
        return payment?.isEstimate ? "text-amber-600" : "text-gray-900";
    }
  }

  function getPaymentKindLabel(payment) {
    switch (payment?.type) {
      case "hourly":
      case "salary":
      case "freelance":
        return "job pay";
      case "business":
        return "business payment";
      case "stripe_subscription_renewal":
        return "subscription renewal";
      case "stripe_payout":
        return payment?.status ? `stripe payout · ${payment.status}` : "stripe payout";
      case "stripe_pending":
        return "pending stripe balance";
      default:
        return payment?.status || (payment?.isEstimate ? "estimated" : "scheduled");
    }
  }

  function escapeHtml(text = "") {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderInsightInline(text = "") {
    let html = escapeHtml(text);
    html = html.replace(/`([^`]+)`/g, '<code class="rounded bg-gray-100 px-1 py-0.5 text-[0.85em] text-gray-700">$1</code>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return html;
  }

  function renderInsightMarkdown(markdown = "") {
    const lines = String(markdown || "").split(/\r?\n/);
    const blocks = [];
    let listItems = [];

    function flushList() {
      if (!listItems.length) return;
      blocks.push(`<ul class="list-disc space-y-1.5 pl-5">${listItems.map((item) => `<li>${item}</li>`).join("")}</ul>`);
      listItems = [];
    }

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        flushList();
        continue;
      }

      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        flushList();
        blocks.push(`<h3 class="text-sm font-semibold text-gray-900">${renderInsightInline(headingMatch[2])}</h3>`);
        continue;
      }

      const boldHeadingMatch = line.match(/^\*\*(.+)\*\*$/);
      if (boldHeadingMatch) {
        flushList();
        blocks.push(`<h3 class="text-xs font-semibold text-gray-900 uppercase tracking-wider mt-4 first:mt-0 border-b border-gray-100 pb-1">${renderInsightInline(boldHeadingMatch[1])}</h3>`);
        continue;
      }

      const listMatch = line.match(/^[-*+]\s+(.+)$/);
      if (listMatch) {
        listItems.push(renderInsightInline(listMatch[1]));
        continue;
      }

      flushList();
      blocks.push(`<p>${renderInsightInline(line)}</p>`);
    }

    flushList();
    return blocks.join("");
  }

  const typeLabels = { zero_hours: "No work", day_off: "Day off", extra_hours: "Extra hours", reduced_hours: "Reduced" };
</script>

<svelte:head><title>Overview | Income Engine</title></svelte:head>

{#if error}
  <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
{/if}

{#if summaryLoading && !summary}
  <!-- Skeleton while primary data loads -->
  <div class="space-y-6 animate-pulse">
    <div class="bg-white rounded-xl border border-gray-200 p-5">
      <div class="h-3 w-20 bg-gray-200 rounded mb-4"></div>
      <div class="h-4 w-full bg-gray-100 rounded mb-2"></div>
      <div class="h-4 w-3/4 bg-gray-100 rounded"></div>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      {#each Array(4) as _}
        <div class="bg-white rounded-xl border border-gray-200 p-4">
          <div class="h-2.5 w-12 bg-gray-200 rounded mb-2"></div>
          <div class="h-6 w-20 bg-gray-200 rounded"></div>
        </div>
      {/each}
    </div>
    <div class="bg-white rounded-xl border border-gray-200 p-5">
      <div class="h-3 w-16 bg-gray-200 rounded mb-4"></div>
      <div class="space-y-3">
        {#each Array(3) as _}
          <div class="h-4 w-full bg-gray-100 rounded"></div>
        {/each}
      </div>
    </div>
  </div>
{:else if summary}


  <!-- Adjustments Section -->
  <div class="mb-10">
    <h2 class="text-xs text-gray-400 uppercase tracking-widest font-medium mb-3">Adjustments</h2>
    <form on:submit|preventDefault={submitModifier} class="flex gap-2">
      <input
        bind:value={nlpInput}
        placeholder='e.g. "spring break last week, no hours" or "took wednesday off this week"'
        class="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900
               focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
               placeholder:text-gray-300"
        disabled={nlpLoading}
      />
      <button
        type="submit"
        class="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium
               hover:bg-gray-800 transition shrink-0 disabled:opacity-50"
        disabled={nlpLoading || !nlpInput.trim()}
      >
        {nlpLoading ? "..." : "Add"}
      </button>
    </form>
    {#if nlpError}
      <p class="text-xs text-red-500 mt-1.5">{nlpError}</p>
    {/if}

    {#if modifiers.length > 0}
      <div class="mt-2.5 space-y-1">
        {#each modifiers as mod (mod.id)}
          <div id="mod-{mod.id}"
               class="flex items-center justify-between bg-white border border-gray-200
                      rounded-lg px-4 py-2 text-sm group transition-all">
            <div class="flex-1 min-w-0 flex items-center gap-2.5">
              <span class="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded shrink-0
                {mod.type === 'zero_hours' ? 'bg-red-50 text-red-500' :
                 mod.type === 'extra_hours' ? 'bg-emerald-50 text-emerald-600' :
                 mod.type === 'day_off' ? 'bg-amber-50 text-amber-600' :
                 'bg-gray-50 text-gray-500'}">
                {typeLabels[mod.type] || mod.type}
              </span>
              <p class="text-gray-600 truncate text-xs">{mod.description}</p>
              <span class="text-gray-300 text-[11px] shrink-0">{fmtRange(mod.startDate, mod.endDate)}</span>
              {#if mod._impact?.delta}
                <span class="text-[11px] font-semibold shrink-0
                  {mod._impact.delta < 0 ? 'text-red-500' : 'text-emerald-600'}">
                  {mod._impact.delta < 0 ? '' : '+'}{fmtE(mod._impact.delta)}
                </span>
              {/if}
            </div>
            <button
              on:click={() => removeModifier(mod.id)}
              class="text-gray-300 hover:text-red-500 ml-3 shrink-0 w-5 h-5 flex items-center justify-center
                     rounded hover:bg-red-50 transition text-sm leading-none"
              title="Remove"
            >&times;</button>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Next payment hero -->
  {#if cashflowLoading && !next}
    <div class="mb-8 animate-pulse">
      <div class="h-3 w-24 bg-gray-200 rounded mb-3"></div>
      <div class="h-10 w-48 bg-gray-200 rounded"></div>
    </div>
  {:else if next}
    <div class="mb-8">
      <p class="text-xs text-gray-400 uppercase tracking-widest mb-2">Next payment</p>
      <div class="flex items-baseline gap-3 flex-wrap">
        <span class="text-4xl font-bold text-gray-900">{fmtE(next.amount)}</span>
        <span class="text-gray-400 text-sm">
          from {next.source} &middot; {fmtD(next.date)}
          {#if next.isModified}
            {@const mod = findModifierForPayment(next)}
            <button
              class="text-amber-500 hover:text-amber-600 ml-1 cursor-pointer underline decoration-dotted"
              on:click={() => mod && scrollToModifier(mod.id)}
            >
              adjusted from {fmtE(next.baseAmount)}
            </button>
          {/if}
        </span>
      </div>
    </div>
  {/if}

  <!-- Metrics -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
    {#each [
      { label: "Monthly", value: fmt(summary.totalMonthlyIncome) },
      { label: "Annual", value: fmt(summary.totalAnnualIncome) },
      { label: "Startup %", value: summary.totalMonthlyIncome > 0
        ? Math.round((summary.incomeBreakdown || []).filter(s => s.active !== false && s.type === 'business').reduce((sum, s) => sum + (s.estimatedMonthly || 0), 0) / summary.totalMonthlyIncome * 100) + '%'
        : '0%' },
      { label: "Next 30d", value: cashflowLoading ? "..." : fmt(cashflow?.totalExpected), accent: true },
    ] as m}
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{m.label}</p>
        <p class="text-xl font-semibold {m.accent ? 'text-emerald-600' : 'text-gray-900'}">{m.value}</p>
      </div>
    {/each}
  </div>

  <!-- This month -->
  {#if summary.thisMonth}
    <div class="bg-white rounded-xl border border-gray-200 p-4 mb-8">
      <div class="flex justify-between items-center mb-2">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider">This month</p>
        <p class="text-[11px] text-gray-400">{fmtE(summary.thisMonth.soFar)} of {fmtE(summary.thisMonth.expected)}</p>
      </div>
      <div class="w-full bg-gray-100 rounded-full h-1.5">
        <div class="bg-emerald-500 h-1.5 rounded-full transition-all" style="width: {Math.min(summary.thisMonth.progress, 100)}%"></div>
      </div>
    </div>
  {/if}

  <!-- Two columns -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
    <!-- Startups -->
    <div class="bg-white rounded-xl border border-gray-200 p-5">
      <div class="flex justify-between items-center mb-4">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider">Startups</p>
        <a href="/admin/stripe" class="text-[11px] text-emerald-600 hover:underline">Details</a>
      </div>
      {#each Object.entries(summary.stripeBalances) as [account, bal]}
        <div class="mb-3 last:mb-0">
          <p class="text-sm font-medium text-gray-700 mb-1.5">{bal.label || account}</p>
          {#if bal.error}
            <p class="text-xs text-red-400">{bal.error}</p>
          {:else}
            <div class="flex gap-5 text-sm">
              <div>
                <p class="text-[10px] text-gray-400">Available</p>
                <p class="font-medium text-gray-900">{fmtE(bal.availableTotal)}</p>
              </div>
              <div>
                <p class="text-[10px] text-gray-400">Pending</p>
                <p class="font-medium text-amber-600">{fmtE(bal.pendingTotal)}</p>
              </div>
              {#if summary.stripeMRR[account]?.mrr}
                <div>
                  <p class="text-[10px] text-gray-400">MRR</p>
                  <p class="font-medium text-violet-600">{fmtE(summary.stripeMRR[account].mrr)}</p>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
      {#if Object.keys(summary.stripeBalances).length === 0}
        <p class="text-sm text-gray-400">No Stripe accounts configured.</p>
      {/if}
    </div>

    <!-- Income sources -->
    <div class="bg-white rounded-xl border border-gray-200 p-5">
      <div class="flex justify-between items-center mb-4">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider">Income Sources</p>
        <a href="/admin/income" class="text-[11px] text-emerald-600 hover:underline">Manage</a>
      </div>
      {#if summary.incomeBreakdown.length === 0}
        <p class="text-sm text-gray-400">No sources yet. <a href="/admin/income" class="text-emerald-600 hover:underline">Add one</a></p>
      {:else}
        <div class="space-y-2.5">
          {#each summary.incomeBreakdown as src}
            <div class="flex justify-between items-center {src.active === false ? 'opacity-40' : ''}">
              <div class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 rounded-full
                  {src.type === 'hourly' ? 'bg-blue-500' : src.type === 'business' ? 'bg-violet-500' : src.type === 'salary' ? 'bg-emerald-500' : 'bg-gray-400'}
                  {src.active === false ? 'opacity-50' : ''}"></div>
                <span class="text-sm text-gray-700">{src.name}</span>
                {#if src.active === false}
                  <span class="text-[9px] px-1 py-0.5 rounded bg-gray-100 text-gray-400">inactive</span>
                {/if}
              </div>
              <span class="text-sm font-medium {src.active === false ? 'text-gray-300 line-through' : 'text-gray-500'}">{fmtE(src.estimatedMonthly)}/mo</span>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Upcoming payments -->
  <div class="bg-white rounded-xl border border-gray-200 p-5 mb-8">
    <div class="flex justify-between items-center mb-4">
      <p class="text-[10px] text-gray-400 uppercase tracking-wider">Upcoming</p>
      <a href="/admin/cashflow" class="text-[11px] text-emerald-600 hover:underline">Full timeline</a>
    </div>
    {#if upcoming.length === 0}
      <p class="text-sm text-gray-400">No upcoming payments.</p>
    {:else}
      <div class="divide-y divide-gray-100">
        {#each upcoming as p}
          <div class="flex items-center gap-4 py-2.5 first:pt-0 last:pb-0">
            <div class="w-14 shrink-0">
              <p class="text-xs text-gray-400">{fmtD(p.date)}</p>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-700 truncate">{p.source}</p>
              <p class="text-[10px] text-gray-400">{getPaymentKindLabel(p)}</p>
              {#if p.isModified}
                {@const mod = findModifierForPayment(p)}
                {#if mod}
                  <button
                    class="text-[10px] text-amber-500 hover:text-amber-600 cursor-pointer
                           underline decoration-dotted"
                    on:click={() => scrollToModifier(mod.id)}
                    on:mouseenter={(e) => showTooltip(e, p)}
                    on:mouseleave={hideTooltip}
                  >
                    {mod.description} &middot; was {fmtE(p.baseAmount)}
                  </button>
                {:else}
                  <p class="text-[10px] text-amber-500">modified (was {fmtE(p.baseAmount)})</p>
                {/if}
              {/if}
            </div>
            <div class="shrink-0 text-right">
              <p class="text-sm font-medium {getPaymentToneClass(p)}">
                {fmtE(p.amount)}
              </p>
              {#if p.isEstimate && !p.isModified}<p class="text-[10px] text-gray-400">estimated</p>{/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- AI Insights -->
  <div>
    <div class="bg-white rounded-xl border border-gray-200 p-5">
      <div class="flex justify-between items-center mb-4">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider">AI Insights</p>
        <button
          on:click={() => loadInsights(true)}
          disabled={insightsLoading}
          class="text-[11px] text-emerald-600 hover:text-emerald-700 disabled:opacity-50 transition"
        >
          {insightsLoading ? "Analyzing..." : "Re-generate"}
        </button>
      </div>
      {#if insightsLoading && !insights}
        <div class="flex items-center gap-2 text-gray-400 text-sm">
          <div class="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          Analyzing your finances...
        </div>
      {:else if insights}
        {#if insightsLoading}
          <div class="flex items-center gap-2 text-gray-400 text-xs mb-3">
            <div class="w-2.5 h-2.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            Refreshing...
          </div>
        {/if}
        <div class="space-y-3 text-sm text-gray-600 leading-relaxed">
          {@html renderInsightMarkdown(insights)}
        </div>
      {:else}
        <p class="text-sm text-gray-400">Loading insights...</p>
      {/if}
    </div>
  </div>

{/if}

<!-- Modifier tooltip -->
{#if tooltipPayment}
  <div
    class="fixed z-50 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg pointer-events-none max-w-xs"
    style="left: {tooltipPos.x}px; top: {tooltipPos.y}px; transform: translateY(-100%);"
  >
    <p class="font-medium mb-0.5">{tooltipPayment._mod.description}</p>
    <p class="text-gray-400">{fmtRange(tooltipPayment._mod.startDate, tooltipPayment._mod.endDate)}</p>
    <p class="text-amber-400 mt-0.5">{fmtE(tooltipPayment.baseAmount)} &rarr; {fmtE(tooltipPayment.amount)}</p>
  </div>
{/if}
