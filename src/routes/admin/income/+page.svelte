<script>
  import { onMount } from "svelte";
  import { get, post, put, del } from "$lib/api.js";
  import { formatCurrency as fmtE } from "$lib/admin-utils.js";

  let sources = [];
  let loading = true;
  let error = null;
  let showModal = false;
  let editing = null;
  let form = getEmptyForm();

  const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const emptySchedule = () => ({ monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0, sunday: 0 });
  let useSchedule = false;

  function getEmptyForm() {
    return { name: "", type: "hourly", hoursPerWeek: null, dollarsPerHour: null, payFrequency: "biweekly", payPeriodSource: "", weeklySchedule: null, startDate: "", amount: null, frequency: "monthly", linkedStripeAccount: "", nextPaymentDate: "", active: true, notes: "" };
  }

  onMount(loadSources);

  async function loadSources() {
    loading = true;
    try { sources = (await get("/api/income")).sources; }
    catch (e) { error = e.message; }
    finally { loading = false; }
  }

  function openCreate() { form = getEmptyForm(); useSchedule = false; editing = null; showModal = true; }

  function openEdit(s) {
    form = { name: s.name || "", type: s.type || "other", hoursPerWeek: s.hoursPerWeek, dollarsPerHour: s.dollarsPerHour, payFrequency: s.payFrequency || "biweekly", payPeriodSource: s.payPeriodSource || "", weeklySchedule: s.weeklySchedule ? { ...s.weeklySchedule } : null, startDate: s.startDate || "", amount: s.amount, frequency: s.frequency || "monthly", linkedStripeAccount: s.linkedStripeAccount || "", nextPaymentDate: s.nextPaymentDate || "", active: s.active !== false, notes: s.notes || "" };
    useSchedule = !!s.weeklySchedule;
    editing = s.id;
    showModal = true;
  }

  async function save() {
    try {
      const b = { ...form };
      if (!b.payPeriodSource) b.payPeriodSource = null;
      if (!b.linkedStripeAccount) b.linkedStripeAccount = null;
      if (!b.nextPaymentDate) b.nextPaymentDate = null;
      if (!b.startDate) b.startDate = null;
      if (b.type !== "hourly") { b.hoursPerWeek = null; b.dollarsPerHour = null; b.payPeriodSource = null; b.payFrequency = null; b.weeklySchedule = null; }
      if (b.type === "hourly" || b.linkedStripeAccount) { b.amount = null; b.frequency = null; }
      if (b.type === "hourly" && useSchedule && b.weeklySchedule) {
        b.hoursPerWeek = Object.values(b.weeklySchedule).reduce((a, v) => a + (v || 0), 0);
      } else {
        b.weeklySchedule = null;
      }
      if (editing) await put(`/api/income/${editing}`, b);
      else await post("/api/income", b);
      showModal = false;
      await loadSources();
    } catch (e) { alert(e.message); }
  }

  async function remove(id) {
    if (!confirm("Delete this income source?")) return;
    try { await del(`/api/income/${id}`); await loadSources(); }
    catch (e) { alert(e.message); }
  }

  async function toggleActive(s) {
    try {
      await put(`/api/income/${s.id}`, { active: !s.active });
      await loadSources();
    } catch (e) { alert(e.message); }
  }

  async function quickUpdateHours(s, val) {
    try { await put(`/api/income/${s.id}`, { hoursPerWeek: parseFloat(val) }); await loadSources(); }
    catch (e) { alert(e.message); }
  }

  $: activeSources = sources.filter(s => s.active !== false);
  $: inactiveSources = sources.filter(s => s.active === false);
  $: activeTotal = activeSources.reduce((s, src) => s + (src.estimatedMonthly || 0), 0);
  $: inactiveTotal = inactiveSources.reduce((s, src) => s + (src.estimatedMonthly || 0), 0);
  $: total = activeTotal + inactiveTotal;

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500";
</script>

<svelte:head><title>Income | Income Engine</title></svelte:head>

<div class="flex justify-between items-center mb-8">
  <div>
    <h1 class="text-2xl font-semibold text-gray-900">Income Sources</h1>
    <p class="text-sm text-gray-400 mt-1">Manage where your money comes from</p>
  </div>
  <button on:click={openCreate} class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
    Add source
  </button>
</div>

{#if loading}
  <p class="text-gray-400 text-sm">Loading...</p>
{:else if error}
  <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
{:else if sources.length === 0}
  <div class="bg-white border border-gray-200 rounded-xl p-12 text-center">
    <p class="text-gray-400 mb-3">No income sources yet</p>
    <button on:click={openCreate} class="text-sm text-emerald-600 hover:underline">Add your first source</button>
  </div>
{:else}
  <!-- Active sources -->
  <div class="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
    <table class="w-full">
      <thead>
        <tr class="border-b border-gray-100">
          <th class="text-left text-[11px] text-gray-400 uppercase tracking-wider px-5 py-3 font-medium">Source</th>
          <th class="text-left text-[11px] text-gray-400 uppercase tracking-wider px-5 py-3 font-medium">Details</th>
          <th class="text-right text-[11px] text-gray-400 uppercase tracking-wider px-5 py-3 font-medium">Monthly</th>
          <th class="text-right text-[11px] text-gray-400 uppercase tracking-wider px-5 py-3 font-medium w-32"></th>
        </tr>
      </thead>
      <tbody>
        {#each activeSources as s}
          <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition">
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <div class="w-1.5 h-1.5 rounded-full shrink-0
                  {s.type === 'hourly' ? 'bg-blue-500' : s.type === 'business' ? 'bg-violet-500' : s.type === 'salary' ? 'bg-emerald-500' : s.type === 'freelance' ? 'bg-orange-500' : 'bg-gray-400'}"></div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{s.name}</p>
                  <p class="text-xs text-gray-400">{s.type}</p>
                </div>
              </div>
            </td>
            <td class="px-5 py-4">
              {#if s.type === "hourly"}
                {#if s.weeklySchedule}
                  <div class="text-sm text-gray-500">
                    {#each Object.entries(s.weeklySchedule).filter(([_, v]) => v > 0) as [day, hrs]}
                      <span class="inline-block mr-2">
                        <span class="text-gray-400 capitalize">{day.slice(0, 3)}</span> {hrs}h
                      </span>
                    {/each}
                    <span class="text-gray-300">&times; ${s.dollarsPerHour}/hr</span>
                  </div>
                {:else}
                  <div class="flex items-center gap-1 text-sm text-gray-500">
                    <input
                      type="number"
                      value={s.hoursPerWeek}
                      on:change={(e) => quickUpdateHours(s, e.target.value)}
                      class="w-12 text-center bg-transparent border-b border-gray-200 text-gray-700 text-sm focus:outline-none focus:border-emerald-500"
                    /> hrs/wk &times; ${s.dollarsPerHour}/hr
                  </div>
                {/if}
              {:else if s.linkedStripeAccount}
                <span class="text-sm text-gray-400">Stripe: {s.linkedStripeAccount}</span>
              {:else if s.amount}
                <span class="text-sm text-gray-500">{fmtE(s.amount)} / {s.frequency}</span>
              {/if}
            </td>
            <td class="px-5 py-4 text-right">
              <span class="text-sm font-medium text-gray-900">{fmtE(s.estimatedMonthly)}</span>
            </td>
            <td class="px-5 py-4 text-right">
              <button on:click={() => toggleActive(s)} class="text-xs text-gray-400 hover:text-amber-500 mr-2" title="Deactivate">Pause</button>
              <button on:click={() => openEdit(s)} class="text-xs text-gray-400 hover:text-gray-700 mr-2">Edit</button>
              <button on:click={() => remove(s.id)} class="text-xs text-gray-400 hover:text-red-500">Del</button>
            </td>
          </tr>
        {/each}
      </tbody>
      <tfoot>
        <tr class="bg-gray-50/50">
          <td class="px-5 py-3 text-sm text-gray-400" colspan="2">Active total</td>
          <td class="px-5 py-3 text-right text-sm font-semibold text-gray-900">{fmtE(activeTotal)}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- Inactive / Projected sources -->
  {#if inactiveSources.length > 0}
    <div class="mb-6">
      <h3 class="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">Projected (Inactive)</h3>
      <div class="bg-white border border-gray-200 border-dashed rounded-xl overflow-hidden opacity-60">
        <table class="w-full">
          <tbody>
            {#each inactiveSources as s}
              <tr class="border-b border-gray-50 last:border-0">
                <td class="px-5 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-1.5 h-1.5 rounded-full shrink-0 bg-gray-300"></div>
                    <div>
                      <p class="text-sm text-gray-500">{s.name}</p>
                      <p class="text-xs text-gray-300">{s.type}{#if s.startDate} &middot; starts {s.startDate}{/if}</p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-3">
                  {#if s.type === "hourly"}
                    <span class="text-xs text-gray-400">{s.hoursPerWeek} hrs/wk &times; ${s.dollarsPerHour}/hr</span>
                  {:else if s.amount}
                    <span class="text-xs text-gray-400">{fmtE(s.amount)} / {s.frequency}</span>
                  {/if}
                </td>
                <td class="px-5 py-3 text-right">
                  <span class="text-sm text-gray-400 italic">+{fmtE(s.estimatedMonthly)}/mo</span>
                </td>
                <td class="px-5 py-3 text-right">
                  <button on:click={() => toggleActive(s)} class="text-xs text-emerald-600 hover:text-emerald-700 mr-2" title="Activate">Activate</button>
                  <button on:click={() => openEdit(s)} class="text-xs text-gray-400 hover:text-gray-700 mr-2">Edit</button>
                  <button on:click={() => remove(s.id)} class="text-xs text-gray-400 hover:text-red-500">Del</button>
                </td>
              </tr>
            {/each}
          </tbody>
          <tfoot>
            <tr class="bg-gray-50/30">
              <td class="px-5 py-2.5 text-xs text-gray-400 italic" colspan="2">If activated, total would be {fmtE(total)}/mo</td>
              <td class="px-5 py-2.5 text-right text-xs text-gray-400 italic">+{fmtE(inactiveTotal)}/mo</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  {/if}
{/if}

<!-- Modal -->
{#if showModal}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" on:click|self={() => showModal = false}>
    <div class="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
      <h3 class="text-lg font-semibold text-gray-900 mb-5">{editing ? "Edit" : "Add"} Income Source</h3>

      <div class="space-y-4">
        <div>
          <label class="text-xs text-gray-500 block mb-1">Name</label>
          <input bind:value={form.name} class={inputClass} placeholder="e.g. CU Boulder - Research Assistant" />
        </div>

        <div>
          <label class="text-xs text-gray-500 block mb-1">Type</label>
          <select bind:value={form.type} class={inputClass}>
            <option value="hourly">Hourly</option>
            <option value="salary">Salary</option>
            <option value="business">Business / Startup</option>
            <option value="freelance">Freelance</option>
            <option value="other">Other</option>
          </select>
        </div>

        {#if form.type === "hourly"}
          <div>
            <label class="text-xs text-gray-500 block mb-1">$ / hour</label>
            <input type="number" step="0.01" bind:value={form.dollarsPerHour} class={inputClass} />
          </div>

          <div>
            <label class="flex items-center gap-2 cursor-pointer mb-2">
              <input type="checkbox" bind:checked={useSchedule} on:change={() => {
                if (useSchedule && !form.weeklySchedule) form.weeklySchedule = emptySchedule();
              }} class="accent-emerald-500 rounded" />
              <span class="text-xs text-gray-500">Set weekly schedule (hours per day)</span>
            </label>

            {#if useSchedule}
              <div class="grid grid-cols-7 gap-1.5">
                {#each DAYS as day}
                  <div class="text-center">
                    <label class="text-[10px] text-gray-400 block mb-1 capitalize">{day.slice(0, 3)}</label>
                    <input
                      type="number" step="0.5" min="0" max="24"
                      value={form.weeklySchedule?.[day] || 0}
                      on:input={(e) => {
                        if (!form.weeklySchedule) form.weeklySchedule = emptySchedule();
                        form.weeklySchedule[day] = parseFloat(e.target.value) || 0;
                        form.hoursPerWeek = Object.values(form.weeklySchedule).reduce((a, v) => a + (v || 0), 0);
                      }}
                      class="w-full border border-gray-200 rounded px-1 py-1.5 text-sm text-center text-gray-900 bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                {/each}
              </div>
              <p class="text-[11px] text-gray-400 mt-1.5">
                Total: <span class="font-medium text-gray-600">{form.hoursPerWeek || 0} hrs/week</span>
              </p>
            {:else}
              <div>
                <label class="text-xs text-gray-500 block mb-1">Hours / week</label>
                <input type="number" step="0.5" bind:value={form.hoursPerWeek} class={inputClass} />
              </div>
            {/if}
          </div>
          <div>
            <label class="text-xs text-gray-500 block mb-1">Pay period source</label>
            <input bind:value={form.payPeriodSource} class={inputClass} placeholder="cu_boulder" />
            <p class="text-[11px] text-gray-400 mt-1">Must match a calendar key in Settings</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 block mb-1">Pay frequency</label>
            <select bind:value={form.payFrequency} class={inputClass}>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Biweekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        {/if}

        {#if form.type === "business"}
          <div>
            <label class="text-xs text-gray-500 block mb-1">Linked Stripe account</label>
            <select bind:value={form.linkedStripeAccount} class={inputClass}>
              <option value="">None</option>
              <option value="fratdoor">FratDoor</option>
              <option value="textcloaker">TextCloaker</option>
            </select>
          </div>
        {/if}

        {#if form.type !== "hourly" && !form.linkedStripeAccount}
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-gray-500 block mb-1">Amount</label>
              <input type="number" step="0.01" bind:value={form.amount} class={inputClass} />
            </div>
            <div>
              <label class="text-xs text-gray-500 block mb-1">Frequency</label>
              <select bind:value={form.frequency} class={inputClass}>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Biweekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
                <option value="one-time">One-time</option>
              </select>
            </div>
          </div>
          <div>
            <label class="text-xs text-gray-500 block mb-1">Next payment date</label>
            <input type="date" bind:value={form.nextPaymentDate} class={inputClass} />
          </div>
        {/if}

        <div>
          <label class="text-xs text-gray-500 block mb-1">Start date (optional)</label>
          <input type="date" bind:value={form.startDate} class={inputClass} />
          <p class="text-[11px] text-gray-400 mt-1">When this job starts. Leave blank if already active.</p>
        </div>

        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" bind:checked={form.active} class="accent-emerald-500 rounded" />
            <span class="text-sm text-gray-600">Active</span>
          </label>
          {#if !form.active}
            <span class="text-[11px] text-gray-400">Inactive sources appear as projections — they won't count toward totals</span>
          {/if}
        </div>

        <div>
          <label class="text-xs text-gray-500 block mb-1">Notes</label>
          <textarea bind:value={form.notes} rows="2" class="{inputClass} resize-none" />
        </div>
      </div>

      <div class="flex gap-3 mt-6">
        <button on:click={save} class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition flex-1">
          {editing ? "Save" : "Create"}
        </button>
        <button on:click={() => showModal = false} class="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
          Cancel
        </button>
      </div>
    </div>
  </div>
{/if}
