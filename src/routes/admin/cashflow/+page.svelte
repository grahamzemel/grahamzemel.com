<script>
  import { onMount } from "svelte";
  import { get } from "$lib/api.js";
  import {
    formatCurrency as fmtE,
    formatDateRange as fmtRange,
    formatRelativeDate,
    formatWeekRange as fmtW,
    formatWholeCurrency as fmt,
    getPaymentKindLabel as getSharedPaymentKindLabel,
    getPaymentToneClass,
  } from "$lib/admin-utils.js";

  let data = null;
  let modifiers = [];
  let days = 90;
  let loading = true;
  let error = null;
  let filter = "all";
  let hoverPoint = null;

  onMount(() => load());

  async function load() {
    loading = true; error = null;
    try {
      const [d, m] = await Promise.all([
        get(`/api/projections/cashflow?days=${days}`),
        get("/api/modifiers"),
      ]);
      data = d;
      modifiers = m.modifiers || [];
    }
    catch (e) { error = e.message; }
    finally { loading = false; }
  }

  $: filtered = (data?.payments || []).filter(p => {
    if (filter === "all") return true;
    if (filter === "jobs") return p.type === "hourly" || p.type === "salary" || p.type === "freelance";
    if (filter === "stripe") return p.type?.startsWith("stripe_") || p.type === "business";
    if (filter === "confirmed") return !p.isEstimate;
    if (filter === "estimated") return p.isEstimate;
    if (filter === "modified") return p.isModified;
    return true;
  });

  $: grouped = (() => {
    const w = {};
    for (const p of filtered) {
      const d = new Date(p.date + "T12:00:00");
      const ws = new Date(d); ws.setDate(d.getDate() - d.getDay());
      const key = ws.toISOString().slice(0, 10);
      if (!w[key]) w[key] = { payments: [], total: 0 };
      w[key].payments.push(p);
      w[key].total += p.amount;
    }
    return Object.entries(w).sort((a, b) => a[0].localeCompare(b[0]));
  })();

  $: next = filtered[0] || null;
  $: modifiedCount = (data?.payments || []).filter(p => p.isModified).length;

  // Cumulative income chart
  const CHART_W = 600;
  const CHART_H = 140;
  const PAD = { top: 10, right: 10, bottom: 20, left: 10 };

  $: cumulativeChart = (() => {
    if (!filtered.length) return null;
    const w = CHART_W - PAD.left - PAD.right;
    const h = CHART_H - PAD.top - PAD.bottom;

    let running = 0;
    const points = filtered.map((p, i) => {
      running += p.amount;
      return {
        x: PAD.left + (filtered.length > 1 ? (i / (filtered.length - 1)) * w : w / 2),
        y: 0, // set below
        total: running,
        ...p,
      };
    });

    const maxTotal = Math.max(...points.map(p => p.total), 1);
    for (const p of points) {
      p.y = PAD.top + h - (p.total / maxTotal) * h;
    }

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = linePath + ` L ${points[points.length - 1].x} ${CHART_H - PAD.bottom} L ${points[0].x} ${CHART_H - PAD.bottom} Z`;

    return { points, linePath, areaPath, maxTotal };
  })();

  const fmtD = (value) => formatRelativeDate(value, { weekday: true });

  // Find modifier for a payment
  function findModifier(p) {
    if (!p.isModified || !p.periodStart) return null;
    return modifiers.find(m => m.startDate <= p.periodEnd && m.endDate >= p.periodStart);
  }

  const getPaymentKindLabel = (payment) =>
    getSharedPaymentKindLabel(payment, { describeEstimatedRenewals: true });

  const dots = { hourly: "bg-blue-500", salary: "bg-emerald-500", business: "bg-violet-500", freelance: "bg-orange-500", stripe_payout: "bg-violet-500", stripe_pending: "bg-amber-500", stripe_subscription_renewal: "bg-indigo-400", other: "bg-gray-400" };
  const dotColors = { hourly: "#3b82f6", salary: "#10b981", business: "#8b5cf6", stripe_payout: "#8b5cf6", stripe_pending: "#f59e0b", stripe_subscription_renewal: "#6366f1" };
</script>

<svelte:head><title>Cash Flow | Income Engine</title></svelte:head>

<div class="flex justify-between items-center mb-6">
  <div>
    <h1 class="text-2xl font-semibold text-gray-900">Cash Flow</h1>
    <p class="text-sm text-gray-400 mt-1">When your money arrives</p>
  </div>
  <div class="flex gap-1.5">
    {#each [30, 60, 90, 180] as d}
      <button on:click={() => { days = d; load(); }}
        class="px-3 py-1.5 rounded-md text-xs font-medium transition
          {days === d ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-900'}">
        {d}d
      </button>
    {/each}
  </div>
</div>

{#if loading}
  <p class="text-gray-400 text-sm">Loading...</p>
{:else if error}
  <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
{:else if data}

  <!-- Stats -->
  <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
    <div class="bg-white border border-gray-200 rounded-xl p-4">
      <p class="text-[10px] text-gray-400 mb-1">Total ({days}d)</p>
      <p class="text-lg font-semibold text-gray-900">{fmt(data.totalExpected)}</p>
    </div>
    <div class="bg-white border border-gray-200 rounded-xl p-4">
      <p class="text-[10px] text-gray-400 mb-1">Confirmed</p>
      <p class="text-lg font-semibold text-emerald-600">{fmt(data.breakdown?.confirmed)}</p>
    </div>
    <div class="bg-white border border-gray-200 rounded-xl p-4">
      <p class="text-[10px] text-gray-400 mb-1">Estimated</p>
      <p class="text-lg font-semibold text-amber-600">{fmt(data.breakdown?.estimated)}</p>
    </div>
    <div class="bg-white border border-gray-200 rounded-xl p-4">
      <p class="text-[10px] text-gray-400 mb-1">Payments</p>
      <p class="text-lg font-semibold text-gray-900">{data.payments?.length || 0}</p>
    </div>
    {#if modifiedCount > 0}
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p class="text-[10px] text-amber-600 mb-1">Modified</p>
        <p class="text-lg font-semibold text-amber-600">{modifiedCount}</p>
      </div>
    {/if}
  </div>

  <!-- Cumulative income chart -->
  {#if cumulativeChart}
    <div class="bg-white border border-gray-200 rounded-xl p-5 mb-6">
      <div class="flex justify-between items-center mb-3">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider">Cumulative Income</p>
        <div class="text-right">
          {#if hoverPoint}
            <p class="text-xs text-gray-400">{hoverPoint.source} &middot; {fmtD(hoverPoint.date)}</p>
            <p class="text-sm font-semibold text-gray-900">{fmtE(hoverPoint.total)}</p>
          {:else}
            <p class="text-sm font-semibold text-gray-900">{fmtE(data.totalExpected)}</p>
          {/if}
        </div>
      </div>
      <svg viewBox="0 0 {CHART_W} {CHART_H}" class="w-full" style="height: 160px;"
           on:mouseleave={() => hoverPoint = null}>
        <!-- Grid -->
        {#each [0.25, 0.5, 0.75] as pct}
          <line x1={PAD.left} x2={CHART_W - PAD.right}
                y1={PAD.top + (CHART_H - PAD.top - PAD.bottom) * pct}
                y2={PAD.top + (CHART_H - PAD.top - PAD.bottom) * pct}
                stroke="#f3f4f6" stroke-width="0.5" />
        {/each}

        <!-- Area -->
        <path d={cumulativeChart.areaPath} fill="url(#cfGrad)" opacity="0.15" />

        <!-- Line -->
        <path d={cumulativeChart.linePath} fill="none" stroke="#10b981" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />

        <!-- Dots -->
        {#each cumulativeChart.points as p}
          {@const isModified = p.isModified}
          {@const isHovered = hoverPoint === p}
          <circle
            cx={p.x} cy={p.y}
            r={isHovered ? 5 : isModified ? 4 : 3}
            fill={isModified ? '#f59e0b' : (dotColors[p.type] || '#10b981')}
            stroke="white" stroke-width="1.5"
            class="transition-all"
          />
          {#if isModified}
            <circle cx={p.x} cy={p.y} r="7" fill="none" stroke="#f59e0b" stroke-width="1" opacity="0.4" />
          {/if}
          <!-- Hit area -->
          <rect
            x={p.x - (CHART_W / cumulativeChart.points.length) / 2}
            y={PAD.top}
            width={CHART_W / cumulativeChart.points.length}
            height={CHART_H - PAD.top - PAD.bottom}
            fill="transparent"
            on:mouseenter={() => hoverPoint = p}
          />
        {/each}

        <!-- Hover line -->
        {#if hoverPoint}
          <line x1={hoverPoint.x} x2={hoverPoint.x} y1={PAD.top} y2={CHART_H - PAD.bottom}
                stroke="#d1d5db" stroke-width="0.5" stroke-dasharray="3 3" />
        {/if}

        <defs>
          <linearGradient id="cfGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#10b981" />
            <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  {/if}

  <!-- Filters -->
  <div class="flex gap-1.5 mb-6">
    {#each [
      { key: "all", label: "All" },
      { key: "jobs", label: "Jobs" },
      { key: "stripe", label: "Startups" },
      { key: "confirmed", label: "Confirmed" },
      { key: "estimated", label: "Estimated" },
      ...(modifiedCount > 0 ? [{ key: "modified", label: `Modified (${modifiedCount})` }] : []),
    ] as f}
      <button on:click={() => filter = f.key}
        class="px-3 py-1.5 rounded-full text-xs font-medium transition
          {filter === f.key ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}">
        {f.label}
      </button>
    {/each}
  </div>

  <!-- Timeline -->
  {#if filtered.length === 0}
    <div class="bg-white border border-gray-200 rounded-xl p-10 text-center">
      <p class="text-gray-400 text-sm">No payments match this filter.</p>
    </div>
  {:else}
    {#each grouped as [weekStart, week]}
      <div class="mb-5">
        <div class="flex justify-between items-center mb-2 px-1">
          <p class="text-[11px] text-gray-400 uppercase tracking-wider font-medium">{fmtW(weekStart)}</p>
          <p class="text-[11px] text-gray-400 font-medium">{fmtE(week.total)}</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-50">
          {#each week.payments as p}
            {@const mod = findModifier(p)}
            <div class="flex items-center gap-4 px-5 py-3 hover:bg-gray-50/50 transition group
                        {p.isModified ? 'bg-amber-50/30' : ''}">
              <div class="w-1.5 h-8 rounded-full {dots[p.type] || dots.other} shrink-0 {p.isEstimate ? 'opacity-40' : ''}"></div>
              <div class="w-16 shrink-0">
                <p class="text-xs text-gray-500">{fmtD(p.date)}</p>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <p class="text-sm text-gray-700 truncate">{p.source}</p>
                  <span class="text-[9px] px-1 py-0.5 rounded bg-gray-100 text-gray-500 font-medium shrink-0">{getPaymentKindLabel(p)}</span>
                  {#if p.isEstimate && p.type !== 'stripe_pending'}
                    <span class="text-[9px] px-1 py-0.5 rounded bg-amber-50 text-amber-500 font-medium shrink-0">est</span>
                  {/if}
                </div>
                {#if p.isModified && mod}
                  <div class="flex items-center gap-1.5 mt-0.5">
                    <span class="text-[9px] px-1 py-0.5 rounded bg-amber-100 text-amber-600 font-medium">adjusted</span>
                    <span class="text-[10px] text-amber-600">{mod.description}</span>
                    <span class="text-[10px] text-gray-300">{fmtRange(mod.startDate, mod.endDate)}</span>
                    <span class="text-[10px] text-gray-400 line-through">{fmtE(p.baseAmount)}</span>
                  </div>
                {:else if p.isModified}
                  <p class="text-[10px] text-amber-500 mt-0.5">modified &middot; was {fmtE(p.baseAmount)}</p>
                {/if}
              </div>
              <div class="text-right shrink-0">
                <p class="text-sm font-medium {getPaymentToneClass(p)}">
                  {fmtE(p.amount)}
                </p>
                <p class="text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 transition">{fmtE(p.runningTotal)}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  {/if}
{/if}
