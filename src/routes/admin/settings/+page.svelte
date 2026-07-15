<script>
  import { onMount } from "svelte";
  import { get, put, post, del } from "$lib/api.js";

  let config = {};
  let loading = true;
  let error = null;
  let saving = false;
  let message = "";
  let pushStatus = null;
  let savingNotifications = false;
  let testingNotification = false;
  let testNotification = {
    title: "Income Engine test",
    body: "Push notifications are working from the Settings page.",
    url: "/admin/settings",
    tag: "settings-test",
  };

  // Push subscription on this device
  let pushSupported = false;
  let pushSubscribed = false;
  let enablingPush = false;
  let isIOSNotStandalone = false;

  // Email digest
  let digestSending = false;
  let digestMessage = "";
  let emailConfigured = null;

  let genSource = "";
  let genName = "";
  let genStartDate = "";
  let genCount = 26;
  let genPayDayOffset = 0;

  let newPeriodSource = "";
  let newPeriod = { startDate: "", endDate: "", payDate: "" };

  onMount(loadConfig);

  const DEFAULT_NOTIFICATION_SETTINGS = {
    enabled: true,
    channels: { push: true },
    autoSendTestOnSubscribe: true,
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00",
      timezone: "America/Denver",
    },
    events: {
      chargeSucceeded: true,
      chargeMinimumAmount: 5,
      chargeAccounts: { textcloaker: true, fratdoor: true },
      payoutCreated: false,
      payoutPaid: true,
      payoutAccounts: { textcloaker: true, fratdoor: true },
      subscriptionCanceled: true,
      subscriptionCanceledAccounts: { textcloaker: true, fratdoor: true },
      incomePaydayToday: true,
      incomePaydayTomorrow: true,
      incomeSourceTypes: { hourly: true, business: true, other: true },
      fratdoorBalanceReady: true,
      fratdoorBalanceMinimumAmount: 10,
      fratdoorPayoutRecorded: true,
      dailyDigest: false,
      dailyDigestLookaheadDays: 7,
    },
  };

  /**
   * @param {string} path
   * @param {string} label
   * @param {unknown} [fallback]
   */
  async function getOptional(path, label, fallback = null) {
    try {
      return await get(path);
    } catch (cause) {
      console.warn(`[Settings] ${label} unavailable`, cause);
      return fallback;
    }
  }

  function ensureNotificationSettings(raw = {}) {
    return {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      ...raw,
      channels: {
        ...DEFAULT_NOTIFICATION_SETTINGS.channels,
        ...(raw.channels || {}),
      },
      quietHours: {
        ...DEFAULT_NOTIFICATION_SETTINGS.quietHours,
        ...(raw.quietHours || {}),
      },
      events: {
        ...DEFAULT_NOTIFICATION_SETTINGS.events,
        ...(raw.events || {}),
        chargeAccounts: {
          ...DEFAULT_NOTIFICATION_SETTINGS.events.chargeAccounts,
          ...(raw.events?.chargeAccounts || {}),
        },
        payoutAccounts: {
          ...DEFAULT_NOTIFICATION_SETTINGS.events.payoutAccounts,
          ...(raw.events?.payoutAccounts || {}),
        },
        subscriptionCanceledAccounts: {
          ...DEFAULT_NOTIFICATION_SETTINGS.events.subscriptionCanceledAccounts,
          ...(raw.events?.subscriptionCanceledAccounts || {}),
        },
        incomeSourceTypes: {
          ...DEFAULT_NOTIFICATION_SETTINGS.events.incomeSourceTypes,
          ...(raw.events?.incomeSourceTypes || {}),
        },
      },
    };
  }

  async function loadConfig() {
    loading = true;
    try {
      const [configRes, pushRes] = await Promise.all([
        get("/api/config"),
        getOptional("/api/push/status", "Push status"),
      ]);
      config = {
        ...configRes,
        notifications: ensureNotificationSettings(configRes?.notifications),
      };
      pushStatus = pushRes;
      const emailStatus = await getOptional("/api/email/status", "Email status");
      emailConfigured = emailStatus?.configured ?? null;

      // Check push support on this device
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

      if (isIOS && !isStandalone) {
        // iOS Safari only supports push in standalone (Add to Home Screen) mode
        isIOSNotStandalone = true;
        pushSupported = false;
      } else if ('serviceWorker' in navigator && 'PushManager' in window) {
        pushSupported = true;
        try {
          const reg = await navigator.serviceWorker.ready;
          const sub = await reg.pushManager.getSubscription();
          pushSubscribed = !!sub;
        } catch (cause) {
          console.warn("[Settings] Could not inspect the push subscription", cause);
        }
      }
    }
    catch (e) { error = e.message; }
    finally { loading = false; }
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
    return outputArray;
  }

  async function enablePushOnDevice() {
    enablingPush = true;
    try {
      const reg = await navigator.serviceWorker.ready;
      const { publicKey } = await get('/api/push/vapid-key');
      if (!publicKey) { alert('Push not configured on server'); return; }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      await post('/api/push/subscribe', { subscription: sub.toJSON() });
      pushSubscribed = true;
      pushStatus = await getOptional("/api/push/status", "Push status refresh", pushStatus);

      // Auto-send test
      if (pushStatus?.settings?.autoSendTestOnSubscribe !== false) {
        await post('/api/push/test');
      }
    } catch (err) {
      alert('Could not enable notifications: ' + err.message);
    } finally {
      enablingPush = false;
    }
  }

  async function sendTestDigest() {
    digestSending = true;
    digestMessage = "";
    try {
      const result = await post("/api/email/test-digest");
      digestMessage = `Sent: ${result.subject}`;
      setTimeout(() => digestMessage = "", 5000);
    } catch (e) {
      digestMessage = "Error: " + e.message;
    } finally {
      digestSending = false;
    }
  }

  async function saveConfig() {
    saving = true; message = "";
    try {
      await put("/api/config", { taxRate: config.taxRate || 0.0025 });
      message = "Saved";
      setTimeout(() => message = "", 2000);
    } catch (e) { message = "Error: " + e.message; }
    finally { saving = false; }
  }

  async function saveNotificationSettings() {
    savingNotifications = true;
    message = "";
    try {
      const updated = await put("/api/config", {
        notifications: ensureNotificationSettings(config.notifications),
      });
      config = {
        ...updated,
        notifications: ensureNotificationSettings(updated?.notifications),
      };
      pushStatus = await getOptional("/api/push/status", "Push status refresh", pushStatus);
      message = "Notification settings saved";
      setTimeout(() => message = "", 2500);
    } catch (e) {
      message = "Error: " + e.message;
    } finally {
      savingNotifications = false;
    }
  }

  async function sendTestNotification() {
    testingNotification = true;
    message = "";
    try {
      const result = await post("/api/push/test", testNotification);
      pushStatus = await getOptional("/api/push/status", "Push status refresh", pushStatus);
      message = `Test sent to ${result.sent || 0} subscription${result.sent === 1 ? "" : "s"}`;
      setTimeout(() => message = "", 3000);
    } catch (e) {
      message = "Error: " + e.message;
    } finally {
      testingNotification = false;
    }
  }

  async function generatePeriods() {
    if (!genSource || !genName || !genStartDate || !genCount) { alert("All fields required."); return; }
    try {
      await post(`/api/config/pay-periods/${genSource}/generate`, { name: genName, startDate: genStartDate, count: parseInt(genCount), payDayOffset: parseInt(genPayDayOffset) });
      await loadConfig();
      message = `Generated ${genCount} periods for ${genName}.`;
      setTimeout(() => message = "", 3000);
    } catch (e) { alert(e.message); }
  }

  async function addPeriod() {
    if (!newPeriodSource || !newPeriod.startDate || !newPeriod.endDate || !newPeriod.payDate) { alert("All fields required."); return; }
    try {
      const cal = config.payPeriodCalendars?.[newPeriodSource];
      if (!cal) { alert("Source not found. Generate it first."); return; }
      const periods = [...(cal.periods || []), { ...newPeriod }];
      periods.sort((a, b) => a.payDate.localeCompare(b.payDate));
      await put(`/api/config/pay-periods/${newPeriodSource}`, { name: cal.name, periods });
      newPeriod = { startDate: "", endDate: "", payDate: "" };
      await loadConfig();
    } catch (e) { alert(e.message); }
  }

  async function deleteCalendar(source) {
    if (!confirm(`Delete "${source}" calendar?`)) return;
    try { await del(`/api/config/pay-periods/${source}`); await loadConfig(); }
    catch (e) { alert(e.message); }
  }

  async function removePeriod(source, index) {
    try {
      const cal = config.payPeriodCalendars[source];
      const periods = cal.periods.filter((_, i) => i !== index);
      await put(`/api/config/pay-periods/${source}`, { name: cal.name, periods });
      await loadConfig();
    } catch (e) { alert(e.message); }
  }

  $: calendars = Object.entries(config.payPeriodCalendars || {});
  $: notifications = ensureNotificationSettings(config.notifications);
</script>

<svelte:head><title>Settings | Income Engine</title></svelte:head>

<div class="mb-8">
  <h1 class="text-2xl font-semibold text-gray-900">Settings</h1>
  <p class="text-sm text-gray-400 mt-1">Tax rates, pay period calendars</p>
</div>

{#if loading}
  <p class="text-gray-400 text-sm">Loading...</p>
{:else if error}
  <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
{:else}
  {#if message}
    <div class="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 rounded-lg text-sm mb-6">{message}</div>
  {/if}

  <!-- General -->
  <div class="bg-white border border-gray-200 rounded-xl p-6 mb-8">
    <h2 class="text-sm font-medium text-gray-900 mb-4">Tax Rate</h2>
    <div class="flex items-end gap-4">
      <div class="w-48">
        <label class="text-xs text-gray-400 block mb-1">Effective rate (decimal)</label>
        <input type="number" step="0.001" min="0" max="1" bind:value={config.taxRate}
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
        <p class="text-[11px] text-gray-400 mt-1">0.0025 = 0.25% (CU Boulder student exempt)</p>
      </div>
      <button on:click={saveConfig} disabled={saving}
        class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50">
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  </div>

  <div class="bg-white border border-gray-200 rounded-xl p-6 mb-8">
    <div class="flex items-start justify-between gap-4 mb-5">
      <div>
        <h2 class="text-sm font-medium text-gray-900">Notifications</h2>
        <p class="text-xs text-gray-400 mt-1">Control push delivery, event thresholds, quiet hours, and custom test notifications.</p>
      </div>
      <div class="text-right text-xs text-gray-500">
        <p>Push configured: <span class={pushStatus?.configured ? "text-emerald-600 font-medium" : "text-red-500 font-medium"}>{pushStatus?.configured ? "Yes" : "No"}</span></p>
        <p>Subscriptions: <span class="text-gray-900 font-medium">{pushStatus?.subscriptionCount || 0}</span></p>
      </div>
    </div>

    <!-- Enable push notifications on this device -->
    {#if pushSupported && !pushSubscribed}
      <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6 flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-emerald-900">Enable push notifications on this device</p>
          <p class="text-xs text-emerald-600 mt-0.5">Get alerts for paydays, charges, and digests</p>
        </div>
        <button on:click={enablePushOnDevice} disabled={enablingPush}
          class="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50 shrink-0">
          {enablingPush ? "Enabling..." : "Enable"}
        </button>
      </div>
    {:else if pushSubscribed}
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
        <p class="text-xs text-gray-600">Push notifications active on this device</p>
      </div>
    {:else if isIOSNotStandalone}
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p class="text-sm font-medium text-blue-900 mb-1">Add to Home Screen to enable push</p>
        <p class="text-xs text-blue-700">iOS Safari only supports push notifications for installed web apps. Tap the <strong>Share</strong> button (square with arrow), then <strong>"Add to Home Screen"</strong>. Open the app from there, and the Enable button will appear.</p>
      </div>
    {:else if !pushSupported}
      <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p class="text-xs text-amber-600">Push notifications not supported on this browser. Use Chrome or Safari on iOS 16.4+.</p>
      </div>
    {/if}

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div class="border border-gray-100 rounded-lg p-3">
        <p class="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Push Channel</p>
        <p class="text-sm font-medium text-gray-900">{notifications.channels.push ? "Enabled" : "Disabled"}</p>
      </div>
      <div class="border border-gray-100 rounded-lg p-3">
        <p class="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Charge Threshold</p>
        <p class="text-sm font-medium text-gray-900">${Number(notifications.events.chargeMinimumAmount || 0).toFixed(2)}</p>
      </div>
      <div class="border border-gray-100 rounded-lg p-3">
        <p class="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Quiet Hours</p>
        <p class="text-sm font-medium text-gray-900">
          {#if notifications.quietHours.enabled}
            {notifications.quietHours.start} - {notifications.quietHours.end}
          {:else}
            Off
          {/if}
        </p>
      </div>
      <div class="border border-gray-100 rounded-lg p-3">
        <p class="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Auto Test On Subscribe</p>
        <p class="text-sm font-medium text-gray-900">{notifications.autoSendTestOnSubscribe ? "Enabled" : "Disabled"}</p>
      </div>
    </div>

    <div class="space-y-6">
      <div>
        <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Delivery</h3>
        <div class="grid md:grid-cols-2 gap-4">
          <label class="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <input type="checkbox" bind:checked={config.notifications.enabled} class="mt-0.5" />
            <span>
              <span class="block text-sm font-medium text-gray-900">Enable all automatic notifications</span>
              <span class="block text-xs text-gray-400 mt-1">Master kill switch for event-driven push notifications.</span>
            </span>
          </label>
          <label class="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <input type="checkbox" bind:checked={config.notifications.channels.push} class="mt-0.5" />
            <span>
              <span class="block text-sm font-medium text-gray-900">Send push notifications</span>
              <span class="block text-xs text-gray-400 mt-1">Uses the browser subscription stored for this admin app.</span>
            </span>
          </label>
          <label class="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <input type="checkbox" bind:checked={config.notifications.autoSendTestOnSubscribe} class="mt-0.5" />
            <span>
              <span class="block text-sm font-medium text-gray-900">Auto-send a test after enabling push</span>
              <span class="block text-xs text-gray-400 mt-1">Fires one test notification when you subscribe a browser.</span>
            </span>
          </label>
        </div>
      </div>

      <div>
        <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Quiet Hours</h3>
        <div class="grid md:grid-cols-4 gap-3">
          <label class="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3 md:col-span-1">
            <input type="checkbox" bind:checked={config.notifications.quietHours.enabled} class="mt-0.5" />
            <span>
              <span class="block text-sm font-medium text-gray-900">Mute automatic notifications</span>
              <span class="block text-xs text-gray-400 mt-1">Test notifications still send immediately.</span>
            </span>
          </label>
          <div>
            <label for="quiet-start" class="text-[10px] text-gray-400 block mb-1">Start</label>
            <input id="quiet-start" type="time" bind:value={config.notifications.quietHours.start}
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label for="quiet-end" class="text-[10px] text-gray-400 block mb-1">End</label>
            <input id="quiet-end" type="time" bind:value={config.notifications.quietHours.end}
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label for="quiet-timezone" class="text-[10px] text-gray-400 block mb-1">Timezone</label>
            <input id="quiet-timezone" bind:value={config.notifications.quietHours.timezone}
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Revenue Notifications</h3>
        <div class="grid md:grid-cols-3 gap-3 mb-3">
          <label class="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3 md:col-span-1">
            <input type="checkbox" bind:checked={config.notifications.events.chargeSucceeded} class="mt-0.5" />
            <span>
              <span class="block text-sm font-medium text-gray-900">Notify on charge success</span>
              <span class="block text-xs text-gray-400 mt-1">Applies to Stripe charge.succeeded webhooks only.</span>
            </span>
          </label>
          <div>
            <label for="charge-threshold" class="text-[10px] text-gray-400 block mb-1">Minimum amount ($)</label>
            <input id="charge-threshold" type="number" min="0" step="0.01" bind:value={config.notifications.events.chargeMinimumAmount}
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
          </div>
        </div>
        <div class="grid md:grid-cols-2 gap-3">
          <label class="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <input type="checkbox" bind:checked={config.notifications.events.chargeAccounts.textcloaker} class="mt-0.5" />
            <span>
              <span class="block text-sm font-medium text-gray-900">TextCloaker charge alerts</span>
              <span class="block text-xs text-gray-400 mt-1">Revenue notifications for TextCloaker Stripe charges.</span>
            </span>
          </label>
          <label class="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <input type="checkbox" bind:checked={config.notifications.events.chargeAccounts.fratdoor} class="mt-0.5" />
            <span>
              <span class="block text-sm font-medium text-gray-900">FratDoor charge alerts</span>
              <span class="block text-xs text-gray-400 mt-1">Revenue notifications for FratDoor Stripe charges.</span>
            </span>
          </label>
        </div>
      </div>

      <div>
        <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Payout Notifications</h3>
        <div class="grid md:grid-cols-2 gap-3 mb-3">
          <label class="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <input type="checkbox" bind:checked={config.notifications.events.payoutCreated} class="mt-0.5" />
            <span>
              <span class="block text-sm font-medium text-gray-900">Notify when payout is created</span>
              <span class="block text-xs text-gray-400 mt-1">A heads-up as soon as Stripe schedules a payout.</span>
            </span>
          </label>
          <label class="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <input type="checkbox" bind:checked={config.notifications.events.payoutPaid} class="mt-0.5" />
            <span>
              <span class="block text-sm font-medium text-gray-900">Notify when payout is paid</span>
              <span class="block text-xs text-gray-400 mt-1">Sent when Stripe marks a payout as deposited.</span>
            </span>
          </label>
        </div>
        <div class="grid md:grid-cols-2 gap-3">
          <label class="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <input type="checkbox" bind:checked={config.notifications.events.payoutAccounts.textcloaker} class="mt-0.5" />
            <span>
              <span class="block text-sm font-medium text-gray-900">TextCloaker payout alerts</span>
              <span class="block text-xs text-gray-400 mt-1">Applies to payout created and paid events.</span>
            </span>
          </label>
          <label class="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <input type="checkbox" bind:checked={config.notifications.events.payoutAccounts.fratdoor} class="mt-0.5" />
            <span>
              <span class="block text-sm font-medium text-gray-900">FratDoor payout alerts</span>
              <span class="block text-xs text-gray-400 mt-1">Applies to payout created and paid events.</span>
            </span>
          </label>
        </div>
      </div>

      <div>
        <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Subscription Notifications</h3>
        <div class="grid md:grid-cols-3 gap-3">
          <label class="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3 md:col-span-1">
            <input type="checkbox" bind:checked={config.notifications.events.subscriptionCanceled} class="mt-0.5" />
            <span>
              <span class="block text-sm font-medium text-gray-900">Notify on subscription cancellations</span>
              <span class="block text-xs text-gray-400 mt-1">Uses Stripe customer.subscription.deleted events.</span>
            </span>
          </label>
          <label class="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <input type="checkbox" bind:checked={config.notifications.events.subscriptionCanceledAccounts.textcloaker} class="mt-0.5" />
            <span>
              <span class="block text-sm font-medium text-gray-900">TextCloaker churn alerts</span>
              <span class="block text-xs text-gray-400 mt-1">Send cancellation alerts for TextCloaker subscriptions.</span>
            </span>
          </label>
          <label class="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <input type="checkbox" bind:checked={config.notifications.events.subscriptionCanceledAccounts.fratdoor} class="mt-0.5" />
            <span>
              <span class="block text-sm font-medium text-gray-900">FratDoor churn alerts</span>
              <span class="block text-xs text-gray-400 mt-1">Send cancellation alerts for FratDoor subscriptions.</span>
            </span>
          </label>
        </div>
      </div>

      <div>
        <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Scheduled Income Notifications</h3>
        <div class="grid md:grid-cols-2 gap-3 mb-3">
          <label class="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <input type="checkbox" bind:checked={config.notifications.events.incomePaydayToday} class="mt-0.5" />
            <span>
              <span class="block text-sm font-medium text-gray-900">Notify on paydays due today</span>
              <span class="block text-xs text-gray-400 mt-1">For hourly jobs and scheduled recurring income from the income tracker.</span>
            </span>
          </label>
          <label class="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <input type="checkbox" bind:checked={config.notifications.events.incomePaydayTomorrow} class="mt-0.5" />
            <span>
              <span class="block text-sm font-medium text-gray-900">Notify one day before payday</span>
              <span class="block text-xs text-gray-400 mt-1">Heads-up for tomorrow’s expected pay events.</span>
            </span>
          </label>
        </div>
        <div class="grid md:grid-cols-3 gap-3">
          <label class="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <input type="checkbox" bind:checked={config.notifications.events.incomeSourceTypes.hourly} class="mt-0.5" />
            <span>
              <span class="block text-sm font-medium text-gray-900">Hourly income alerts</span>
              <span class="block text-xs text-gray-400 mt-1">Examples: jobs tied to a pay-period calendar.</span>
            </span>
          </label>
          <label class="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <input type="checkbox" bind:checked={config.notifications.events.incomeSourceTypes.business} class="mt-0.5" />
            <span>
              <span class="block text-sm font-medium text-gray-900">Business schedule alerts</span>
              <span class="block text-xs text-gray-400 mt-1">Scheduled business payments from your income sources list.</span>
            </span>
          </label>
          <label class="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <input type="checkbox" bind:checked={config.notifications.events.incomeSourceTypes.other} class="mt-0.5" />
            <span>
              <span class="block text-sm font-medium text-gray-900">Other recurring income alerts</span>
              <span class="block text-xs text-gray-400 mt-1">Catches non-hourly scheduled income entries.</span>
            </span>
          </label>
        </div>
      </div>

      <div>
        <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">FratDoor Notifications</h3>
        <div class="grid md:grid-cols-2 gap-3 mb-3">
          <label class="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <input type="checkbox" bind:checked={config.notifications.events.fratdoorBalanceReady} class="mt-0.5" />
            <span>
              <span class="block text-sm font-medium text-gray-900">Notify when FratDoor balance is withdrawable</span>
              <span class="block text-xs text-gray-400 mt-1">Uses the same FratDoor payout summary you’re already showing in the admin.</span>
            </span>
          </label>
          <div>
            <label for="fratdoor-balance-threshold" class="text-[10px] text-gray-400 block mb-1">Minimum withdrawable amount ($)</label>
            <input id="fratdoor-balance-threshold" type="number" min="0" step="0.01" bind:value={config.notifications.events.fratdoorBalanceMinimumAmount}
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
          </div>
        </div>
        <div class="grid md:grid-cols-2 gap-3">
          <label class="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <input type="checkbox" bind:checked={config.notifications.events.fratdoorPayoutRecorded} class="mt-0.5" />
            <span>
              <span class="block text-sm font-medium text-gray-900">Notify when a FratDoor platform payout is recorded</span>
              <span class="block text-xs text-gray-400 mt-1">Polls your existing FratDoor payout feed and dedupes by payout id.</span>
            </span>
          </label>
        </div>
      </div>

      <div>
        <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Digest Notifications</h3>
        <div class="grid md:grid-cols-2 gap-3">
          <label class="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <input type="checkbox" bind:checked={config.notifications.events.dailyDigest} class="mt-0.5" />
            <span>
              <span class="block text-sm font-medium text-gray-900">Send a daily income digest</span>
              <span class="block text-xs text-gray-400 mt-1">Summarizes scheduled income coming in over the next few days.</span>
            </span>
          </label>
          <div>
            <label for="digest-lookahead" class="text-[10px] text-gray-400 block mb-1">Digest lookahead (days)</label>
            <input id="digest-lookahead" type="number" min="1" max="30" step="1" bind:value={config.notifications.events.dailyDigestLookaheadDays}
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
          </div>
        </div>
      </div>

      <div class="pt-2 border-t border-gray-100">
        <div class="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500">Send Test Notification</h3>
            <p class="text-xs text-gray-400 mt-1">Useful for validating service worker, push subscription, and payload formatting.</p>
          </div>
          <button on:click={sendTestNotification} disabled={testingNotification}
            class="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50">
            {testingNotification ? "Sending..." : "Send Test"}
          </button>
        </div>
        <div class="grid md:grid-cols-2 gap-3">
          <div>
            <label for="test-title" class="text-[10px] text-gray-400 block mb-1">Title</label>
            <input id="test-title" bind:value={testNotification.title}
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label for="test-tag" class="text-[10px] text-gray-400 block mb-1">Tag</label>
            <input id="test-tag" bind:value={testNotification.tag}
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
          </div>
          <div class="md:col-span-2">
            <label for="test-body" class="text-[10px] text-gray-400 block mb-1">Body</label>
            <textarea id="test-body" bind:value={testNotification.body} rows="3"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-emerald-500"></textarea>
          </div>
          <div class="md:col-span-2">
            <label for="test-url" class="text-[10px] text-gray-400 block mb-1">Open URL</label>
            <input id="test-url" bind:value={testNotification.url}
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button on:click={saveNotificationSettings} disabled={savingNotifications}
          class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50">
          {savingNotifications ? "Saving..." : "Save Notification Settings"}
        </button>
      </div>
    </div>
  </div>

  <!-- Email Digest -->
  <div class="bg-white border border-gray-200 rounded-xl p-6 mb-8">
    <h2 class="text-sm font-medium text-gray-900 mb-1">Weekly Email Digest</h2>
    <p class="text-xs text-gray-400 mb-4">Sent every Monday at 7am MT with your weekly income projections.</p>

    <div class="flex items-center gap-3">
      <button on:click={sendTestDigest} disabled={digestSending}
        class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50">
        {digestSending ? "Sending..." : "Send test digest"}
      </button>
      {#if digestMessage}
        <span class="text-xs {digestMessage.startsWith('Error') ? 'text-red-500' : 'text-emerald-600'}">{digestMessage}</span>
      {/if}
    </div>
    {#if !emailConfigured && emailConfigured !== null}
      <p class="text-xs text-amber-500 mt-2">Email not configured. Set <code class="bg-gray-100 px-1 rounded">EMAIL_USER</code> and <code class="bg-gray-100 px-1 rounded">EMAIL_PASSWORD</code> on Heroku.</p>
    {/if}
  </div>

  <!-- Pay Period Calendars -->
  <div class="bg-white border border-gray-200 rounded-xl p-6 mb-8">
    <h2 class="text-sm font-medium text-gray-900 mb-5">Pay Period Calendars</h2>

    {#if calendars.length === 0}
      <p class="text-sm text-gray-400 mb-4">No calendars yet. Generate one below.</p>
    {:else}
      {#each calendars as [source, cal]}
        <div class="mb-8 last:mb-0">
          <div class="flex justify-between items-center mb-3">
            <div>
              <p class="text-sm font-medium text-gray-700">{cal.name}</p>
              <p class="text-xs text-gray-400"><code class="text-emerald-600">{source}</code> &middot; {cal.periods?.length || 0} periods</p>
            </div>
            <button on:click={() => deleteCalendar(source)} class="text-xs text-red-400 hover:text-red-600">Delete</button>
          </div>

          {#if cal.periods?.length > 0}
            <div class="border border-gray-100 rounded-lg overflow-hidden max-h-56 overflow-y-auto mb-3">
              <table class="w-full text-xs">
                <thead class="bg-gray-50 sticky top-0">
                  <tr>
                    <th class="text-left px-4 py-2 text-gray-400 font-medium">Start</th>
                    <th class="text-left px-4 py-2 text-gray-400 font-medium">End</th>
                    <th class="text-left px-4 py-2 text-gray-400 font-medium">Pay Date</th>
                    <th class="px-4 py-2 w-8"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  {#each cal.periods as period, i}
                    <tr class="hover:bg-gray-50/50">
                      <td class="px-4 py-2 text-gray-600">{period.startDate}</td>
                      <td class="px-4 py-2 text-gray-600">{period.endDate}</td>
                      <td class="px-4 py-2 text-emerald-600 font-medium">{period.payDate}</td>
                      <td class="px-4 py-2 text-right">
                        <button on:click={() => removePeriod(source, i)} class="text-gray-300 hover:text-red-400">&times;</button>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}

          <!-- Add single period -->
          <div class="flex gap-2 items-end">
            <div class="flex-1">
              <label class="text-[10px] text-gray-400">Start</label>
              <input type="date" bind:value={newPeriod.startDate} on:focus={() => newPeriodSource = source}
                class="w-full border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div class="flex-1">
              <label class="text-[10px] text-gray-400">End</label>
              <input type="date" bind:value={newPeriod.endDate} on:focus={() => newPeriodSource = source}
                class="w-full border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div class="flex-1">
              <label class="text-[10px] text-gray-400">Pay date</label>
              <input type="date" bind:value={newPeriod.payDate} on:focus={() => newPeriodSource = source}
                class="w-full border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:border-emerald-500" />
            </div>
            <button on:click={() => { newPeriodSource = source; addPeriod(); }}
              class="border border-gray-200 text-gray-600 px-3 py-1.5 rounded text-xs hover:bg-gray-50 shrink-0">
              Add
            </button>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <!-- Generate -->
  <div class="bg-white border border-gray-200 rounded-xl p-6">
    <h2 class="text-sm font-medium text-gray-900 mb-1">Generate Pay Periods</h2>
    <p class="text-xs text-gray-400 mb-5">Auto-generate biweekly periods from a start date.</p>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
      <div>
        <label class="text-[10px] text-gray-400 block mb-1">Source key</label>
        <input bind:value={genSource} placeholder="cu_boulder" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
      </div>
      <div>
        <label class="text-[10px] text-gray-400 block mb-1">Display name</label>
        <input bind:value={genName} placeholder="CU Boulder" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
      </div>
      <div>
        <label class="text-[10px] text-gray-400 block mb-1">First period start</label>
        <input type="date" bind:value={genStartDate} class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
      </div>
      <div>
        <label class="text-[10px] text-gray-400 block mb-1"># Periods</label>
        <input type="number" bind:value={genCount} class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
      </div>
      <div>
        <label class="text-[10px] text-gray-400 block mb-1">Pay offset (days)</label>
        <input type="number" bind:value={genPayDayOffset} class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
      </div>
    </div>
    <button on:click={generatePeriods} class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
      Generate
    </button>
  </div>
{/if}
