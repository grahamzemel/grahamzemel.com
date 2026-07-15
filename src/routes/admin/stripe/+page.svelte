<script>
  import { onMount } from "svelte";
  import { get } from "$lib/api.js";
  import { formatCurrency as fmtE } from "$lib/admin-utils.js";

  let tab = "fratdoor";
  let balances = {};
  let mrrs = {};
  let payouts = {};
  let analytics = { customers: [], subscriptions: [] };
  let tiers = {};
  let oneTime = {};
  let paypal = null;
  let loading = true;
  let error = null;
  let hover = { chart: null, point: null };

  const CHART = {
    width: 720,
    height: 220,
    pad: { top: 16, right: 18, bottom: 34, left: 52 },
  };

  onMount(async () => {
    try {
      const [bRes, mRes, pRes, aRes, tRes, otRes, ppRes] = await Promise.all([
        get("/api/stripe/balance"),
        get("/api/stripe/mrr"),
        get("/api/stripe/payouts?limit=20"),
        get("/api/stripe/analytics").catch(() => ({ customers: [], subscriptions: [] })),
        get("/api/stripe/tiers").catch(() => ({ tiers: [] })),
        get("/api/stripe/one-time?days=30").catch(() => ({ purchases: [] })),
        get("/api/paypal/summary?days=30").catch((err) => {
          console.error("[Startups] PayPal summary request failed", err);
          return null;
        }),
      ]);

      for (const b of bRes.balances || []) balances[b.account] = b;
      for (const m of mRes.mrr || []) mrrs[m.account] = m;
      for (const p of pRes.payouts || []) {
        if (!payouts[p.account]) payouts[p.account] = [];
        payouts[p.account].push(p);
      }
      analytics = aRes || { customers: [], subscriptions: [] };
      for (const t of (tRes.tiers || [])) tiers[t.account] = t;
      for (const o of (otRes.purchases || [])) oneTime[o.account] = o;
      paypal = ppRes;
      console.groupCollapsed("[Startups] FratDoor API payload");
      console.info("[Startups] PayPal summary source", paypal?.source || "unknown");
      console.info("[Startups] PayPal summary metrics", {
        totalOrders: paypal?.totalOrders || 0,
        recentOrders: paypal?.recentOrders || 0,
        totalBuyerSpend: paypal?.totalBuyerSpend || 0,
        totalNetToChapters: paypal?.totalNetToChapters || 0,
        totalPlatformFeesCharged: paypal?.totalPlatformFeesCharged || 0,
        totalProcessorFees: paypal?.totalProcessorFees || 0,
        totalPlatformNetRevenue: paypal?.totalPlatformNetRevenue || 0,
        totalPlatformPayouts: paypal?.totalPlatformPayouts || 0,
        netUnpaidPlatformRevenue: paypal?.netUnpaidPlatformRevenue || 0,
        outstandingChapterLiability: paypal?.outstandingChapterLiability || 0,
        averageOrderValue: paypal?.averageOrderValue || 0,
        medianOrderValue: paypal?.medianOrderValue || 0,
      });
      console.info("[Startups] PayPal summary dailyNetRevenue", paypal?.dailyNetRevenue || []);
      console.info("[Startups] PayPal summary dailyBuyerSpend", paypal?.dailyBuyerSpend || []);
      console.info("[Startups] PayPal summary paymentMethodMix", paypal?.paymentMethodMix || []);
      console.info("[Startups] PayPal summary topChapters", paypal?.topChapters || []);
      console.info("[Startups] PayPal summary recentOrdersPreview", paypal?.recentOrdersPreview || []);
      console.info("[Startups] PayPal summary recentPayouts", paypal?.recentPayouts || []);
      console.info("[Startups] PayPal summary sourceDebug", paypal?.sourceDebug || null);
      console.groupEnd();

      console.groupCollapsed("[Startups] Stripe raw metrics");
      console.info("[Startups] One-time purchases payload", oneTime);
      console.info("[Startups] MRR payload", mrrs);
      console.info("[Startups] Subscription analytics payload", analytics);
      console.groupEnd();
    } catch (e) {
      console.error("[Startups] Load failed", e);
      error = e.message;
    } finally {
      loading = false;
    }
  });

  $: accounts = Object.keys(balances).sort((a, b) => {
    if (a === "fratdoor") return -1;
    if (b === "fratdoor") return 1;
    if (a === "textcloaker") return -1;
    if (b === "textcloaker") return 1;
    return a.localeCompare(b);
  });
  $: bal = balances[tab];
  $: mrr = mrrs[tab];
  $: pays = payouts[tab] || [];
  $: custStats = (analytics.customers || []).find((entry) => entry.account === tab);
  $: subStats = (analytics.subscriptions || []).find((entry) => entry.account === tab);
  $: tierData = tiers[tab];
  $: otData = oneTime[tab];
  $: isFratDoor = tab === "fratdoor";
  $: isTextCloaker = tab === "textcloaker";

  $: stripePayoutSeries = aggregateByDate(
    pays.filter((entry) => entry.status === "paid"),
    "arrivalDate",
    "amount",
  );
  $: stripePayoutChart = buildLineChart(stripePayoutSeries, "amount");
  $: oneTimeChart = buildLineChart(otData?.oneTime?.daily, "amount");
  $: paypalRevenueChart = buildLineChart(paypal?.dailyNetRevenue, "amount");
  $: paypalPayoutChart = buildLineChart(paypal?.payoutTrend, "amount");
  $: paypalHasData = Boolean(
    paypal && (
      (paypal.recentOrders || 0) > 0 ||
      (paypal.totalBuyerSpend || 0) > 0 ||
      (paypal.totalPlatformPayouts || 0) > 0 ||
      (paypal.netUnpaidPlatformRevenue || 0) > 0 ||
      (paypal.recentPayouts || []).length > 0
    )
  );
  $: paypalPaymentMethods = paypal?.paymentMethodMix || [];
  $: paypalTopChapters = paypal?.topChapters || [];
  $: paypalRecentOrdersPreview = paypal?.recentOrdersPreview || [];

  function aggregateByDate(entries, dateKey, valueKey) {
    const daily = {};
    for (const entry of entries || []) {
      const rawDate = entry?.[dateKey];
      const dayKey = toDayKey(rawDate);
      if (!dayKey) continue;
      daily[dayKey] = Math.round(((daily[dayKey] || 0) + Number(entry?.[valueKey] || 0)) * 100) / 100;
    }
    return Object.entries(daily)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  function toDayKey(value) {
    if (!value) return "";
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  }

  function buildLineChart(entries, valueKey = "amount") {
    if (!entries?.length) return null;

    const values = entries.map((entry) => Number(entry?.[valueKey] || 0));
    const max = Math.max(...values, 1);
    const min = 0;
    const innerWidth = CHART.width - CHART.pad.left - CHART.pad.right;
    const innerHeight = CHART.height - CHART.pad.top - CHART.pad.bottom;

    const points = entries.map((entry, index) => {
      const value = Number(entry?.[valueKey] || 0);
      const x = CHART.pad.left + (entries.length > 1 ? (index / (entries.length - 1)) * innerWidth : innerWidth / 2);
      const y = CHART.pad.top + innerHeight - ((value - min) / Math.max(max - min, 1)) * innerHeight;
      return {
        ...entry,
        value,
        x,
        y,
        label: fmtShortDate(entry.date),
      };
    });

    const linePath = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${CHART.height - CHART.pad.bottom} L ${points[0].x} ${CHART.height - CHART.pad.bottom} Z`;

    return {
      points,
      linePath,
      areaPath,
      ticks: [max, max / 2, 0],
      xLabels: [
        points[0]?.label || "",
        points[Math.floor((points.length - 1) / 2)]?.label || "",
        points[points.length - 1]?.label || "",
      ],
    };
  }

  function setHover(chart, point) {
    hover = { chart, point };
  }

  function clearHover(chart) {
    if (hover.chart === chart) hover = { chart: null, point: null };
  }

  function getHoveredPoint(chart) {
    return hover.chart === chart ? hover.point : null;
  }

  function fmtPct(value) {
    return `${Number(value || 0).toFixed(2)}%`;
  }

  function fmtShortDate(value) {
    if (!value) return "";
    const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function metricTone(value, warning = 5, danger = 8) {
    if (Number(value || 0) >= danger) return "text-red-500";
    if (Number(value || 0) >= warning) return "text-amber-600";
    return "text-emerald-600";
  }
</script>

<svelte:head><title>Startups | Income Engine</title></svelte:head>

<div class="mb-6">
  <h1 class="text-2xl font-semibold text-gray-900">Startups</h1>
  <p class="text-sm text-gray-400 mt-1">Subscriptions, one-time purchases, and FratDoor ticketing fee payouts.</p>
</div>

{#if loading}
  <p class="text-gray-400 text-sm">Loading...</p>
{:else if error}
  <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
{:else}
  <div class="flex gap-2 mb-6 flex-wrap">
    {#each accounts as acct}
      <button
        on:click={() => { tab = acct; hover = { chart: null, point: null }; }}
        class="px-4 py-2 rounded-lg text-sm font-medium transition
          {tab === acct ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-900'}"
      >
        {balances[acct]?.label || acct}
      </button>
    {/each}
    <button
      on:click={() => { tab = "_paypal"; hover = { chart: null, point: null }; }}
      class="px-4 py-2 rounded-lg text-sm font-medium transition
        {tab === '_paypal' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-900'}"
    >
      PayPal
    </button>
  </div>

  {#if tab === "_paypal"}
    <div class="grid grid-cols-2 xl:grid-cols-5 gap-3 mb-6">
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Withdrawable Now</p>
        <p class="text-xl font-semibold text-emerald-600">{fmtE(paypal?.netUnpaidPlatformRevenue)}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Platform Revenue (30d)</p>
        <p class="text-xl font-semibold text-gray-900">{fmtE(paypal?.recentPlatformNetRevenue)}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Ticket Orders (30d)</p>
        <p class="text-xl font-semibold text-gray-900">{paypal?.recentOrders || 0}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Total Paid Out</p>
        <p class="text-xl font-semibold text-gray-900">{fmtE(paypal?.totalPlatformPayouts)}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">PayPal Balance</p>
        <p class="text-xl font-semibold text-gray-900">{fmtE(paypal?.balanceAvailable)}</p>
        {#if paypal?.balanceError}
          <p class="text-[10px] text-red-500 mt-1">{paypal.balanceError}</p>
        {/if}
      </div>
    </div>

    <div class="grid grid-cols-2 xl:grid-cols-5 gap-3 mb-6">
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Lifetime Ticket GMV</p>
        <p class="text-lg font-semibold text-gray-900">{fmtE(paypal?.totalBuyerSpend)}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Net To Chapters</p>
        <p class="text-lg font-semibold text-gray-900">{fmtE(paypal?.totalNetToChapters)}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Processor Fees</p>
        <p class="text-lg font-semibold text-gray-900">{fmtE(paypal?.totalProcessorFees)}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Outstanding Liability</p>
        <p class="text-lg font-semibold text-amber-600">{fmtE(paypal?.outstandingChapterLiability)}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Avg / Median Order</p>
        <p class="text-lg font-semibold text-gray-900">{fmtE(paypal?.averageOrderValue)} / {fmtE(paypal?.medianOrderValue)}</p>
      </div>
    </div>

    {#if !paypalHasData}
      <div class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 mb-6">
        No FratDoor ticketing payout data is available from this backend's current data source yet. If you just changed the backend code, restart the backend process first.
      </div>
    {/if}

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
      {#if paypalRevenueChart}
        {@const point = getHoveredPoint('paypal-revenue')}
        <div class="bg-white border border-gray-200 rounded-xl p-5" on:mouseleave={() => clearHover('paypal-revenue')}>
          <div class="flex items-start justify-between mb-4 gap-4">
            <div>
              <p class="text-[10px] text-gray-400 uppercase tracking-wider">FratDoor Fee Revenue (30d)</p>
              <p class="text-xs text-gray-400 mt-1">This is platform fee revenue after processor fees, not buyer spend.</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-400">{point ? point.label : `${paypal?.recentOrders || 0} orders`}</p>
              <p class="text-lg font-semibold text-gray-900">{point ? fmtE(point.value) : fmtE(paypal?.recentPlatformNetRevenue)}</p>
            </div>
          </div>

          <svg viewBox="0 0 {CHART.width} {CHART.height}" class="w-full" style="height: 200px;">
            {#each paypalRevenueChart.ticks as tick}
              {@const y = CHART.pad.top + (CHART.height - CHART.pad.top - CHART.pad.bottom) - (tick / Math.max(paypalRevenueChart.ticks[0], 1)) * (CHART.height - CHART.pad.top - CHART.pad.bottom)}
              <line x1={CHART.pad.left} x2={CHART.width - CHART.pad.right} y1={y} y2={y} stroke="#eef2f7" stroke-width="1" />
              <text x={CHART.pad.left - 8} y={y + 4} text-anchor="end" font-size="10" fill="#94a3b8">{fmtE(tick)}</text>
            {/each}
            <path d={paypalRevenueChart.areaPath} fill="url(#paypalRevenueGradient)" opacity="0.14" />
            <path d={paypalRevenueChart.linePath} fill="none" stroke="#0f766e" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
            {#each paypalRevenueChart.points as p}
              <circle cx={p.x} cy={p.y} r={point === p ? 4 : 3} fill="#0f766e" stroke="white" stroke-width="2" />
              <rect
                x={p.x - (CHART.width / paypalRevenueChart.points.length) / 2}
                y={CHART.pad.top}
                width={CHART.width / paypalRevenueChart.points.length}
                height={CHART.height - CHART.pad.top - CHART.pad.bottom}
                fill="transparent"
                on:mouseenter={() => setHover('paypal-revenue', p)}
              />
            {/each}
            <defs>
              <linearGradient id="paypalRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0f766e" />
                <stop offset="100%" stop-color="#0f766e" stop-opacity="0" />
              </linearGradient>
            </defs>
          </svg>

          <div class="flex justify-between mt-2 text-[10px] text-gray-400">
            {#each paypalRevenueChart.xLabels as label}
              <span>{label}</span>
            {/each}
          </div>
        </div>
      {/if}

      {#if paypalPayoutChart}
        {@const point = getHoveredPoint('paypal-payouts')}
        <div class="bg-white border border-gray-200 rounded-xl p-5" on:mouseleave={() => clearHover('paypal-payouts')}>
          <div class="flex items-start justify-between mb-4 gap-4">
            <div>
              <p class="text-[10px] text-gray-400 uppercase tracking-wider">FratDoor Ticket Sales Payouts</p>
              <p class="text-xs text-gray-400 mt-1">Tracked from platform payout records sent to your PayPal account.</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-400">{point ? point.label : "last 30 days"}</p>
              <p class="text-lg font-semibold text-gray-900">{point ? fmtE(point.value) : fmtE(paypal?.totalPlatformPayouts)}</p>
            </div>
          </div>

          <svg viewBox="0 0 {CHART.width} {CHART.height}" class="w-full" style="height: 200px;">
            {#each paypalPayoutChart.ticks as tick}
              {@const y = CHART.pad.top + (CHART.height - CHART.pad.top - CHART.pad.bottom) - (tick / Math.max(paypalPayoutChart.ticks[0], 1)) * (CHART.height - CHART.pad.top - CHART.pad.bottom)}
              <line x1={CHART.pad.left} x2={CHART.width - CHART.pad.right} y1={y} y2={y} stroke="#eef2f7" stroke-width="1" />
              <text x={CHART.pad.left - 8} y={y + 4} text-anchor="end" font-size="10" fill="#94a3b8">{fmtE(tick)}</text>
            {/each}
            <path d={paypalPayoutChart.areaPath} fill="url(#paypalPayoutGradient)" opacity="0.14" />
            <path d={paypalPayoutChart.linePath} fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
            {#each paypalPayoutChart.points as p}
              <circle cx={p.x} cy={p.y} r={point === p ? 4 : 3} fill="#2563eb" stroke="white" stroke-width="2" />
              <rect
                x={p.x - (CHART.width / paypalPayoutChart.points.length) / 2}
                y={CHART.pad.top}
                width={CHART.width / paypalPayoutChart.points.length}
                height={CHART.height - CHART.pad.top - CHART.pad.bottom}
                fill="transparent"
                on:mouseenter={() => setHover('paypal-payouts', p)}
              />
            {/each}
            <defs>
              <linearGradient id="paypalPayoutGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#2563eb" />
                <stop offset="100%" stop-color="#2563eb" stop-opacity="0" />
              </linearGradient>
            </defs>
          </svg>

          <div class="flex justify-between mt-2 text-[10px] text-gray-400">
            {#each paypalPayoutChart.xLabels as label}
              <span>{label}</span>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="px-5 py-3 border-b border-gray-100">
          <p class="text-[10px] text-gray-400 uppercase tracking-wider">Payment Method Mix</p>
        </div>
        {#if !paypalPaymentMethods.length}
          <div class="px-5 py-8 text-center text-sm text-gray-400">No ticket payment methods tracked yet.</div>
        {:else}
          <div class="divide-y divide-gray-50">
            {#each paypalPaymentMethods as method}
              <div class="flex justify-between items-center px-5 py-3">
                <div>
                  <p class="text-sm font-medium text-gray-700">{method.method}</p>
                  <p class="text-[11px] text-gray-400">{method.count || 0} txns · fees {fmtE(method.processorFees)}</p>
                </div>
                <span class="text-sm font-medium text-gray-900">{fmtE(method.gmv)}</span>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="px-5 py-3 border-b border-gray-100">
          <p class="text-[10px] text-gray-400 uppercase tracking-wider">Top Chapters (Platform Net)</p>
        </div>
        {#if !paypalTopChapters.length}
          <div class="px-5 py-8 text-center text-sm text-gray-400">No chapter revenue tracked yet.</div>
        {:else}
          <div class="divide-y divide-gray-50">
            {#each paypalTopChapters as chapter}
              <div class="flex justify-between items-center px-5 py-3 gap-3">
                <div>
                  <p class="text-sm font-medium text-gray-700">{chapter.chapterName || chapter.chapterUsername}</p>
                  <p class="text-[11px] text-gray-400">@{chapter.chapterUsername} · {chapter.orders || 0} orders · outstanding {fmtE(chapter.outstandingLiability)}</p>
                </div>
                <span class="text-sm font-medium text-gray-900">{fmtE(chapter.platformNetRevenue)}</span>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="px-5 py-3 border-b border-gray-100">
          <p class="text-[10px] text-gray-400 uppercase tracking-wider">Recent Ticket Purchases</p>
        </div>
        {#if !paypalRecentOrdersPreview.length}
          <div class="px-5 py-8 text-center text-sm text-gray-400">No recent ticket orders tracked yet.</div>
        {:else}
          <div class="divide-y divide-gray-50 max-h-[420px] overflow-y-auto">
            {#each paypalRecentOrdersPreview as order}
              <div class="px-5 py-3">
                <div class="flex justify-between items-start gap-3">
                  <div>
                    <p class="text-sm font-medium text-gray-700">{order.chapterName || order.chapterUsername}{#if order.eventName} · {order.eventName}{/if}</p>
                    <p class="text-[11px] text-gray-400">{fmtShortDate(order.date)} · {order.buyerName || order.buyerEmail || order.id}</p>
                    <p class="text-[11px] text-gray-400">{String(order.paymentMethod || '').toUpperCase()} · qty {order.quantity || 0} · chapter {fmtE(order.chapterNet)} · fees {fmtE(order.totalFees)}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium text-gray-900">{fmtE(order.total)}</p>
                    <p class="text-[11px] text-emerald-600">FD {fmtE(order.fratdoorFee)}</p>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="px-5 py-3 border-b border-gray-100">
          <p class="text-[10px] text-gray-400 uppercase tracking-wider">Recent Ticket Sales Payouts</p>
        </div>
        {#if !paypal?.recentPayouts?.length}
          <div class="px-5 py-8 text-center text-sm text-gray-400">No platform payouts tracked yet.</div>
        {:else}
          <div class="divide-y divide-gray-50 max-h-[420px] overflow-y-auto">
            {#each paypal.recentPayouts as payout}
              <div class="flex justify-between items-center px-5 py-3">
                <div class="flex items-center gap-3">
                  <span class="text-xs text-gray-500">{fmtShortDate(payout.createdAt)}</span>
                  <span class="text-[9px] px-1.5 py-0.5 rounded font-medium
                    {payout.status === 'paid' || payout.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                     payout.status === 'in_transit' ? 'bg-blue-50 text-blue-600' :
                     payout.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                     'bg-gray-100 text-gray-500'}">
                    {payout.status}
                  </span>
                  {#if payout.payoutEmail}
                    <span class="text-[11px] text-gray-400">{payout.payoutEmail}</span>
                  {/if}
                </div>
                <span class="text-sm font-medium text-gray-900">{fmtE(payout.amount)}</span>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  {:else if bal}
    <div class="grid grid-cols-2 xl:grid-cols-5 gap-3 mb-6">
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Available</p>
        <p class="text-xl font-semibold text-emerald-600">{fmtE(bal.availableTotal)}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Pending</p>
        <p class="text-xl font-semibold text-amber-600">{fmtE(bal.pendingTotal)}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">MRR</p>
        <p class="text-xl font-semibold text-violet-600">{fmtE(mrr?.mrr)}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Subscribers</p>
        <p class="text-xl font-semibold text-gray-900">{subStats?.activeSubscriptions || 0}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">ARPU</p>
        <p class="text-xl font-semibold text-gray-900">{fmtE(subStats?.arpu)}</p>
      </div>
    </div>

    <div class="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Customers</p>
        <p class="text-lg font-semibold text-gray-900">{custStats?.totalCustomers || 0}</p>
        {#if custStats?.newLast30Days > 0}
          <p class="text-[10px] text-emerald-600 mt-1">+{custStats.newLast30Days} this month</p>
        {/if}
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4">
        <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Churn (30d)</p>
        <p class="text-lg font-semibold {metricTone(subStats?.churnRate, 4, 8)}">{fmtPct(subStats?.churnRate)}</p>
        <p class="text-[10px] text-gray-400 mt-1">{subStats?.canceledLast30Days || 0} canceled</p>
      </div>

      {#if isFratDoor}
        <div class="bg-white border border-gray-200 rounded-xl p-4 col-span-2">
          <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Ticketing Processor</p>
          <p class="text-lg font-semibold text-gray-900">PayPal</p>
          <p class="text-[10px] text-gray-400 mt-1">FratDoor ticketing revenue is shown on the PayPal tab. The FratDoor Stripe tab is subscriptions only.</p>
        </div>
      {:else if isTextCloaker}
        <div class="bg-white border border-gray-200 rounded-xl p-4">
          <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">One-Time Purchases (30d)</p>
          <p class="text-lg font-semibold text-gray-900">{otData?.oneTime?.count || 0}</p>
          <p class="text-[10px] text-emerald-600 mt-1">{fmtE(otData?.oneTime?.total)} total</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-4">
          <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Avg One-Time Purchase</p>
          <p class="text-lg font-semibold text-gray-900">{fmtE(otData?.oneTime?.avgAmount)}</p>
          <p class="text-[10px] text-gray-400 mt-1">Subscriptions excluded</p>
        </div>
      {/if}
    </div>

    {#if tierData?.tiers?.length}
      <div class="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <p class="text-[10px] text-gray-400 uppercase tracking-wider">Subscription Tiers</p>
            <p class="text-xs text-gray-400 mt-1">Stripe subscription mix for {balances[tab]?.label || tab}.</p>
          </div>
          <p class="text-sm font-semibold text-violet-600">{fmtE(mrr?.mrr)}/mo</p>
        </div>

        <div class="space-y-3">
          {#each tierData.tiers as tier}
            {@const share = mrr?.mrr > 0 ? (tier.mrrContribution / mrr.mrr) * 100 : 0}
            <div>
              <div class="flex justify-between items-center mb-1.5">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-gray-700">{tier.label}</span>
                  <span class="text-xs text-gray-400">{tier.count} subscribers</span>
                </div>
                <span class="text-sm font-medium text-violet-600">{fmtE(tier.mrrContribution)}/mo</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2">
                <div class="bg-violet-500 h-2 rounded-full transition-all" style="width: {Math.min(share, 100)}%"></div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
      {#if isTextCloaker && oneTimeChart}
        {@const point = getHoveredPoint('one-time')}
        <div class="bg-white border border-gray-200 rounded-xl p-5" on:mouseleave={() => clearHover('one-time')}>
          <div class="flex items-start justify-between mb-4 gap-4">
            <div>
              <p class="text-[10px] text-gray-400 uppercase tracking-wider">One-Time Purchases (30d)</p>
              <p class="text-xs text-gray-400 mt-1">Only non-subscription payments are included here.</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-400">{point ? point.label : `${otData?.oneTime?.count || 0} purchases`}</p>
              <p class="text-lg font-semibold text-gray-900">{point ? fmtE(point.value) : fmtE(otData?.oneTime?.total)}</p>
            </div>
          </div>

          <svg viewBox="0 0 {CHART.width} {CHART.height}" class="w-full" style="height: 200px;">
            {#each oneTimeChart.ticks as tick}
              {@const y = CHART.pad.top + (CHART.height - CHART.pad.top - CHART.pad.bottom) - (tick / Math.max(oneTimeChart.ticks[0], 1)) * (CHART.height - CHART.pad.top - CHART.pad.bottom)}
              <line x1={CHART.pad.left} x2={CHART.width - CHART.pad.right} y1={y} y2={y} stroke="#eef2f7" stroke-width="1" />
              <text x={CHART.pad.left - 8} y={y + 4} text-anchor="end" font-size="10" fill="#94a3b8">{fmtE(tick)}</text>
            {/each}
            <path d={oneTimeChart.areaPath} fill="url(#oneTimeGradient)" opacity="0.14" />
            <path d={oneTimeChart.linePath} fill="none" stroke="#7c3aed" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
            {#each oneTimeChart.points as p}
              <circle cx={p.x} cy={p.y} r={point === p ? 4 : 3} fill="#7c3aed" stroke="white" stroke-width="2" />
              <rect
                x={p.x - (CHART.width / oneTimeChart.points.length) / 2}
                y={CHART.pad.top}
                width={CHART.width / oneTimeChart.points.length}
                height={CHART.height - CHART.pad.top - CHART.pad.bottom}
                fill="transparent"
                on:mouseenter={() => setHover('one-time', p)}
              />
            {/each}
            <defs>
              <linearGradient id="oneTimeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#7c3aed" />
                <stop offset="100%" stop-color="#7c3aed" stop-opacity="0" />
              </linearGradient>
            </defs>
          </svg>

          <div class="flex justify-between mt-2 text-[10px] text-gray-400">
            {#each oneTimeChart.xLabels as label}
              <span>{label}</span>
            {/each}
          </div>
        </div>
      {/if}

      {#if stripePayoutChart}
        {@const point = getHoveredPoint('stripe-payouts')}
        <div class="bg-white border border-gray-200 rounded-xl p-5" on:mouseleave={() => clearHover('stripe-payouts')}>
          <div class="flex items-start justify-between mb-4 gap-4">
            <div>
              <p class="text-[10px] text-gray-400 uppercase tracking-wider">Stripe Payout Trend</p>
              <p class="text-xs text-gray-400 mt-1">Actual paid Stripe payouts for this startup account.</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-400">{point ? point.label : `${pays.filter((entry) => entry.status === 'paid').length} paid payouts`}</p>
              <p class="text-lg font-semibold text-gray-900">{point ? fmtE(point.value) : fmtE(pays.filter((entry) => entry.status === 'paid').reduce((sum, entry) => sum + (entry.amount || 0), 0))}</p>
            </div>
          </div>

          <svg viewBox="0 0 {CHART.width} {CHART.height}" class="w-full" style="height: 200px;">
            {#each stripePayoutChart.ticks as tick}
              {@const y = CHART.pad.top + (CHART.height - CHART.pad.top - CHART.pad.bottom) - (tick / Math.max(stripePayoutChart.ticks[0], 1)) * (CHART.height - CHART.pad.top - CHART.pad.bottom)}
              <line x1={CHART.pad.left} x2={CHART.width - CHART.pad.right} y1={y} y2={y} stroke="#eef2f7" stroke-width="1" />
              <text x={CHART.pad.left - 8} y={y + 4} text-anchor="end" font-size="10" fill="#94a3b8">{fmtE(tick)}</text>
            {/each}
            <path d={stripePayoutChart.areaPath} fill="url(#stripePayoutGradient)" opacity="0.14" />
            <path d={stripePayoutChart.linePath} fill="none" stroke="#4f46e5" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
            {#each stripePayoutChart.points as p}
              <circle cx={p.x} cy={p.y} r={point === p ? 4 : 3} fill="#4f46e5" stroke="white" stroke-width="2" />
              <rect
                x={p.x - (CHART.width / stripePayoutChart.points.length) / 2}
                y={CHART.pad.top}
                width={CHART.width / stripePayoutChart.points.length}
                height={CHART.height - CHART.pad.top - CHART.pad.bottom}
                fill="transparent"
                on:mouseenter={() => setHover('stripe-payouts', p)}
              />
            {/each}
            <defs>
              <linearGradient id="stripePayoutGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#4f46e5" />
                <stop offset="100%" stop-color="#4f46e5" stop-opacity="0" />
              </linearGradient>
            </defs>
          </svg>

          <div class="flex justify-between mt-2 text-[10px] text-gray-400">
            {#each stripePayoutChart.xLabels as label}
              <span>{label}</span>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {#if isTextCloaker && otData?.oneTime?.recentPurchases?.length}
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100">
            <p class="text-[10px] text-gray-400 uppercase tracking-wider">Recent One-Time Purchases</p>
          </div>
          <div class="divide-y divide-gray-50 max-h-[320px] overflow-y-auto">
            {#each otData.oneTime.recentPurchases as purchase}
              <div class="flex justify-between items-center px-5 py-3">
                <div>
                  <p class="text-sm text-gray-700">{purchase.email || purchase.paymentIntent || purchase.id}</p>
                  <p class="text-[10px] text-gray-400">{fmtShortDate(purchase.date)}</p>
                </div>
                <span class="text-sm font-medium text-gray-900">{fmtE(purchase.amount)}</span>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="px-5 py-3 border-b border-gray-100">
          <p class="text-[10px] text-gray-400 uppercase tracking-wider">Recent Stripe Payouts</p>
        </div>
        {#if pays.length === 0}
          <div class="px-5 py-8 text-center text-sm text-gray-400">No payouts found.</div>
        {:else}
          <div class="divide-y divide-gray-50 max-h-[320px] overflow-y-auto">
            {#each pays as payout}
              <div class="flex justify-between items-center px-5 py-3">
                <div class="flex items-center gap-3">
                  <span class="text-xs text-gray-500">{fmtShortDate(payout.arrivalDate)}</span>
                  <span class="text-[9px] px-1.5 py-0.5 rounded font-medium
                    {payout.status === 'paid' ? 'bg-emerald-50 text-emerald-600' :
                     payout.status === 'in_transit' ? 'bg-blue-50 text-blue-600' :
                     payout.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                     'bg-gray-100 text-gray-500'}">
                    {payout.status}
                  </span>
                </div>
                <span class="text-sm font-medium text-gray-900">{fmtE(payout.amount)}</span>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  {/if}
{/if}
