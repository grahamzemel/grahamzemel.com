<script lang="ts">
  import Visibility from "$lib/components/visibility.svelte";

  // Web3Forms access key — intentionally public-safe (the key is bound to
  // me@grahamzemel.com server-side, so it can only deliver to that inbox).
  // Free-tier Web3Forms blocks server-side submission, so this submits direct
  // from the browser. Override with PUBLIC_WEB3FORMS_KEY env if you rotate it.
  const ACCESS_KEY = "728319f0-7de2-4a54-a1aa-0f1083aa13b4";

  let isVisible = false;
  let hasChanged = false;
  let hasObserverSupport = true;

  let name = "";
  let email = "";
  let projectType = "";
  let message = "";
  let honey = ""; // honeypot
  let status: "idle" | "sending" | "success" | "error" = "idle";
  let errorMessage = "";

  const projectOptions = [
    "Personal website",
    "Business website",
    "Full-stack SaaS",
    "Custom internal tool",
    "AI integration",
    "Security audit / pen test",
    "Other / just saying hi",
  ];

  async function handleSubmit(event: Event) {
    event.preventDefault();
    if (honey) return; // bot caught
    if (status === "sending") return;

    status = "sending";
    errorMessage = "";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name,
          email,
          subject: `[grahamzemel.com] ${projectType || "Contact"} — ${name}`,
          project_type: projectType,
          message,
          replyto: email,
          from_name: "grahamzemel.com contact form",
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        status = "success";
        name = "";
        email = "";
        projectType = "";
        message = "";
      } else {
        status = "error";
        errorMessage =
          data?.message ||
          "Something went wrong. Try emailing me directly at me@grahamzemel.com.";
      }
    } catch (err) {
      console.error("[get-in-touch] Submission failed", err);
      status = "error";
      errorMessage =
        "Couldn't reach the server. Try emailing me directly at me@grahamzemel.com.";
    }
  }
</script>

<div class="sm:mt-[8vh] mt-10" aria-hidden="true">
  <Visibility
    bind:hasObserverSupport
    visibilityUpdate={(state) => {
      if (!hasChanged && state !== false) {
        hasChanged = true;
        isVisible = state;
      }
    }}
  />
</div>

<section
  id="get-in-touch"
  class="section-band custom-transition {!hasObserverSupport || isVisible
    ? 'opacity-100'
    : 'opacity-0'}"
>
  <h1 class="font-serif font-bold sm:text-6xl text-4xl">Get in touch</h1>

  <div class="contact-grid mt-10">
    <!-- LEFT: pitch card -->
    <aside class="pitch-card">
      <p class="pitch-kicker">Let's connect</p>

      <h2 class="pitch-headline">
        Got something worth building? I'd love to hear about it.
      </h2>

      <p class="pitch-copy">
        I take on freelance and contract work for projects that look fun or
        useful. If any of these sound like what you need, send a note — I
        usually respond within 24 hours.
      </p>

      <ul class="pitch-services">
        <li>Personal websites &amp; portfolios</li>
        <li>Business websites &amp; landing pages</li>
        <li>Full-stack SaaS products</li>
        <li>Custom internal tools &amp; dashboards</li>
        <li>AI integrations &amp; tooling</li>
        <li>Security audits &amp; ethical hacking</li>
        <li>Automations &amp; data pipelines</li>
      </ul>

      <div class="pitch-meta">
        <div class="pitch-meta-row">
          <span class="pitch-meta-label">Email</span>
          <a class="pitch-meta-value" href="mailto:me@grahamzemel.com">
            me@grahamzemel.com
          </a>
        </div>
        <div class="pitch-meta-row">
          <span class="pitch-meta-label">LinkedIn</span>
          <a
            class="pitch-meta-value"
            href="https://www.linkedin.com/in/grahamzemel"
            target="_blank"
            rel="noopener noreferrer"
          >
            grahamzemel
          </a>
        </div>
        <div class="pitch-meta-row">
          <span class="pitch-meta-label">Timezone</span>
          <span class="pitch-meta-value">GMT-5 · Boulder, CO</span>
        </div>
      </div>
    </aside>

    <!-- RIGHT: contact form -->
    <div class="form-card">
      {#if status === "success"}
        <div class="form-success" role="status">
          <div class="success-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 class="success-title">Message sent.</h3>
          <p class="success-copy">
            Thanks for reaching out. I'll get back to you within 24 hours
            at the email you provided.
          </p>
        </div>
      {:else}
        <form class="form" on:submit={handleSubmit} novalidate>
          <p class="form-kicker">Send a message</p>

          <div class="form-row form-row-split">
            <label class="field">
              <span class="field-label">Name</span>
              <input
                type="text"
                name="name"
                autocomplete="name"
                required
                bind:value={name}
                placeholder="Jane Smith"
              />
            </label>
            <label class="field">
              <span class="field-label">Email</span>
              <input
                type="email"
                name="email"
                autocomplete="email"
                required
                bind:value={email}
                placeholder="you@company.com"
              />
            </label>
          </div>

          <label class="field">
            <span class="field-label">Project type</span>
            <div class="select-wrapper">
              <select bind:value={projectType} name="project_type">
                <option value="" disabled selected>Pick one</option>
                {#each projectOptions as option}
                  <option value={option}>{option}</option>
                {/each}
              </select>
              <svg class="select-arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </label>

          <label class="field">
            <span class="field-label">Message</span>
            <textarea
              name="message"
              required
              rows="6"
              bind:value={message}
              placeholder="What you're working on, what you need, timelines, anything else useful…"
            />
          </label>

          <!-- honeypot -->
          <label class="honeypot" aria-hidden="true">
            Don't fill this out
            <input
              type="text"
              tabindex="-1"
              autocomplete="off"
              bind:value={honey}
            />
          </label>

          {#if status === "error"}
            <p class="form-error" role="alert">{errorMessage}</p>
          {/if}

          <button
            class="form-submit"
            type="submit"
            disabled={status === "sending"}
          >
            {#if status === "sending"}
              Sending…
            {:else}
              Send message
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            {/if}
          </button>

          <p class="form-foot">
            Or email me directly:
            <a href="mailto:me@grahamzemel.com">me@grahamzemel.com</a>
          </p>
        </form>
      {/if}
    </div>
  </div>
</section>

<style lang="postcss">
  .custom-transition {
    transition-property: opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 1500ms;
  }

  .contact-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  @media (min-width: 1024px) {
    .contact-grid {
      grid-template-columns: minmax(0, 24rem) minmax(0, 1fr);
      gap: 2rem;
      align-items: start;
    }
  }

  /* ---------- Left pitch card ---------- */
  .pitch-card {
    border-radius: 0.875rem;
    border: 1px solid oklch(0.30 0.012 250);
    background: oklch(0.13 0.012 250 / 0.92);
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1.125rem;
  }
  @media (min-width: 768px) { .pitch-card { padding: 2rem; } }

  .pitch-kicker {
    margin: 0;
    font-family: "JetBrains Mono", "SF Mono", ui-monospace, Menlo, monospace;
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: oklch(0.60 0.012 250);
  }

  .pitch-headline {
    margin: 0;
    font-family: "Source Serif Pro", serif;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.015em;
    color: oklch(0.97 0.005 250);
  }

  .pitch-copy {
    margin: 0;
    font-size: 0.9375rem;
    line-height: 1.55;
    color: oklch(0.78 0.008 250);
  }

  .pitch-services {
    margin: 0.25rem 0 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  .pitch-services li {
    position: relative;
    padding-left: 1.125rem;
    font-size: 0.9375rem;
    line-height: 1.4;
    color: oklch(0.88 0.006 250);
  }
  .pitch-services li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.55rem;
    width: 0.3rem;
    height: 0.3rem;
    border-radius: 9999px;
    background: oklch(0.66 0.13 165);
  }

  .pitch-meta {
    margin-top: 0.75rem;
    padding-top: 1.125rem;
    border-top: 1px solid oklch(0.26 0.012 250);
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  .pitch-meta-row {
    display: flex;
    align-items: baseline;
    gap: 0.875rem;
  }
  .pitch-meta-label {
    font-family: "JetBrains Mono", "SF Mono", ui-monospace, Menlo, monospace;
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: oklch(0.55 0.012 250);
    min-width: 5.25rem;
  }
  .pitch-meta-value {
    font-size: 0.9375rem;
    color: oklch(0.92 0.005 250);
    text-decoration: none;
    transition: color 180ms var(--ease);
  }
  a.pitch-meta-value:hover {
    color: oklch(0.99 0 0);
  }

  /* ---------- Right form card ---------- */
  .form-card {
    border-radius: 0.875rem;
    border: 1px solid oklch(0.30 0.012 250);
    background: oklch(0.13 0.012 250 / 0.92);
    padding: 1.75rem;
  }
  @media (min-width: 768px) { .form-card { padding: 2.25rem; } }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1.125rem;
  }

  .form-kicker {
    margin: 0 0 0.25rem;
    font-family: "JetBrains Mono", "SF Mono", ui-monospace, Menlo, monospace;
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: oklch(0.60 0.012 250);
  }

  .form-row {
    display: flex;
    flex-direction: column;
    gap: 1.125rem;
  }
  @media (min-width: 640px) {
    .form-row-split {
      flex-direction: row;
      gap: 1rem;
    }
    .form-row-split .field { flex: 1; }
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .field-label {
    font-family: "JetBrains Mono", "SF Mono", ui-monospace, Menlo, monospace;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: oklch(0.78 0.008 250);
  }

  .field input,
  .field textarea,
  .field select {
    width: 100%;
    border: 1px solid oklch(0.32 0.012 250);
    background: oklch(0.10 0.012 250);
    color: oklch(0.99 0.005 250);
    border-radius: 0.5rem;
    padding: 0.85rem 1rem;
    font-size: 1rem;
    line-height: 1.5;
    font-family: inherit;
    transition: border-color 180ms var(--ease),
      background 180ms var(--ease),
      box-shadow 180ms var(--ease);
  }
  .field textarea { resize: vertical; min-height: 9rem; }
  .field input::placeholder,
  .field textarea::placeholder {
    color: oklch(0.58 0.012 250);
  }

  .field input:hover,
  .field textarea:hover,
  .field select:hover {
    border-color: oklch(0.42 0.012 250);
  }

  .field input:focus,
  .field textarea:focus,
  .field select:focus {
    outline: none;
    border-color: oklch(0.55 0.10 165);
    background: oklch(0.12 0.013 250);
    box-shadow: 0 0 0 3px oklch(0.55 0.14 165 / 0.18);
  }

  .select-wrapper {
    position: relative;
  }
  .select-wrapper select {
    appearance: none;
    -webkit-appearance: none;
    padding-right: 2.5rem;
    cursor: pointer;
  }
  .select-arrow {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    height: 1rem;
    width: 1rem;
    color: oklch(0.62 0.012 250);
    pointer-events: none;
  }

  .honeypot {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  .form-error {
    margin: 0;
    font-size: 0.875rem;
    color: oklch(0.78 0.16 25);
    background: oklch(0.18 0.06 25 / 0.6);
    border: 1px solid oklch(0.45 0.14 25 / 0.5);
    border-radius: 0.5rem;
    padding: 0.625rem 0.875rem;
    line-height: 1.4;
  }

  .form-submit {
    margin-top: 0.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    height: 3rem;
    padding: 0 1.5rem;
    border-radius: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 600;
    color: oklch(0.13 0.012 250);
    background: oklch(0.95 0.003 250);
    border: 1px solid oklch(0.95 0.003 250);
    cursor: pointer;
    transition: background 180ms var(--ease),
      border-color 180ms var(--ease),
      transform 180ms var(--ease),
      opacity 180ms var(--ease);
  }
  .form-submit:hover:not(:disabled) {
    background: oklch(1 0 0);
    transform: translateY(-1px);
  }
  .form-submit:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
  .form-submit svg {
    height: 0.95rem;
    width: 0.95rem;
    transition: transform 180ms var(--ease);
  }
  .form-submit:hover:not(:disabled) svg {
    transform: translateX(2px);
  }

  .form-foot {
    margin: 0;
    text-align: center;
    font-size: 0.8125rem;
    color: oklch(0.55 0.012 250);
  }
  .form-foot a {
    color: oklch(0.78 0.008 250);
    text-decoration: none;
    transition: color 180ms var(--ease);
  }
  .form-foot a:hover {
    color: oklch(0.99 0 0);
  }

  /* ---------- Success state ---------- */
  .form-success {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.875rem;
    padding: 1rem 0;
  }
  .success-icon {
    height: 3rem;
    width: 3rem;
    border-radius: 9999px;
    background: oklch(0.55 0.18 145 / 0.14);
    border: 1px solid oklch(0.55 0.18 145 / 0.4);
    color: oklch(0.85 0.16 145);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .success-icon svg { height: 1.25rem; width: 1.25rem; }
  .success-title {
    margin: 0;
    font-family: "Source Serif Pro", serif;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.2;
    color: oklch(0.97 0.005 250);
  }
  .success-copy {
    margin: 0;
    font-size: 0.9375rem;
    line-height: 1.5;
    color: oklch(0.82 0.008 250);
  }
</style>
