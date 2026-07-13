<script lang="ts">
  import { cubicOut } from "svelte/easing";
  import { fade, scale } from "svelte/transition";

  export let showModal = false;

  const ACCESS_KEY = "728319f0-7de2-4a54-a1aa-0f1083aa13b4";

  let name = "";
  let email = "";
  let projectType = "";
  let message = "";
  let honey = "";
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

  function close() {
    if (status === "sending") return;
    showModal = false;
    // Reset on close after a beat so the success state finishes animating
    setTimeout(() => {
      if (!showModal) {
        status = "idle";
        errorMessage = "";
      }
    }, 320);
  }

  function onBackdrop(event: MouseEvent) {
    if (event.target === event.currentTarget) close();
  }

  function onKey(event: KeyboardEvent) {
    if (event.key === "Escape") close();
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    if (honey || status === "sending") return;

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
      const data = await response.json().catch(() => ({}));
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
    } catch {
      status = "error";
      errorMessage =
        "Couldn't reach the email service. Try emailing me directly at me@grahamzemel.com.";
    }
  }
</script>

<svelte:window on:keydown={onKey} />

{#if showModal}
  <div
    class="modal-backdrop"
    on:click={onBackdrop}
    on:keydown={onKey}
    role="dialog"
    aria-modal="true"
    aria-labelledby="contact-modal-title"
    transition:fade={{ duration: 180, easing: cubicOut }}
  >
    <div
      class="modal-card"
      transition:scale={{ duration: 240, start: 0.96, easing: cubicOut }}
    >
      <button class="modal-close" type="button" aria-label="Close" on:click={close}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      </button>

      {#if status === "success"}
        <div class="modal-success" role="status">
          <div class="modal-success-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 id="contact-modal-title" class="modal-success-title">Message sent.</h2>
          <p class="modal-success-copy">
            Thanks for reaching out. I'll reply within 24 hours at the
            email you provided.
          </p>
          <button class="modal-done" type="button" on:click={close}>
            Done
          </button>
        </div>
      {:else}
        <header class="modal-head">
          <p class="modal-kicker">Let's talk</p>
          <h2 id="contact-modal-title" class="modal-title">
            Got something worth building?
          </h2>
          <p class="modal-blurb">
            Personal sites, business platforms, full-stack SaaS, AI tools,
            security audits, automations — if it's interesting, I'd like to
            hear about it.
          </p>
        </header>

        <form class="modal-form" on:submit={handleSubmit} novalidate>
          <div class="modal-field-row">
            <label class="modal-field">
              <span class="modal-field-label">Name</span>
              <input
                type="text"
                name="name"
                autocomplete="name"
                required
                bind:value={name}
                placeholder="Jane Smith"
              />
            </label>
            <label class="modal-field">
              <span class="modal-field-label">Email</span>
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

          <label class="modal-field">
            <span class="modal-field-label">Project type</span>
            <div class="modal-select-wrap">
              <select bind:value={projectType} name="project_type">
                <option value="" disabled selected>Pick one</option>
                {#each projectOptions as option}
                  <option value={option}>{option}</option>
                {/each}
              </select>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </label>

          <label class="modal-field">
            <span class="modal-field-label">Message</span>
            <textarea
              name="message"
              required
              rows="5"
              bind:value={message}
              placeholder="What you're working on, what you need, timelines, anything else useful…"
            />
          </label>

          <label class="modal-honeypot" aria-hidden="true">
            Don't fill this out
            <input type="text" tabindex="-1" autocomplete="off" bind:value={honey} />
          </label>

          {#if status === "error"}
            <p class="modal-error" role="alert">{errorMessage}</p>
          {/if}

          <div class="modal-actions">
            <button class="modal-cancel" type="button" on:click={close}>
              Cancel
            </button>
            <button
              class="modal-submit"
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
          </div>

          <p class="modal-foot">
            Or email directly:
            <a href="mailto:me@grahamzemel.com">me@grahamzemel.com</a>
          </p>
        </form>
      {/if}
    </div>
  </div>
{/if}

<style lang="postcss">
  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 60;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: oklch(0 0 0 / 0.65);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .modal-card {
    position: relative;
    width: 100%;
    max-width: 32rem;
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
    border-radius: 1rem;
    border: 1px solid oklch(0.42 0.012 250);
    background: oklch(0.13 0.012 250);
    padding: 1.75rem;
    box-shadow: 0 30px 80px oklch(0 0 0 / 0.55);
  }
  @media (min-width: 640px) {
    .modal-card { padding: 2rem; }
  }

  .modal-close {
    position: absolute;
    top: 0.875rem;
    right: 0.875rem;
    height: 2.25rem;
    width: 2.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    background: transparent;
    border: 1px solid transparent;
    color: oklch(0.72 0.012 250);
    cursor: pointer;
    transition:
      background 180ms var(--ease),
      color 180ms var(--ease),
      border-color 180ms var(--ease);
  }
  .modal-close:hover {
    background: oklch(1 0 0 / 0.06);
    border-color: oklch(0.32 0.012 250);
    color: oklch(0.99 0 0);
  }
  .modal-close svg { height: 1.125rem; width: 1.125rem; }

  /* Header */
  .modal-head { margin-bottom: 1.25rem; padding-right: 2.5rem; }
  .modal-kicker {
    margin: 0;
    font-family: "JetBrains Mono", "SF Mono", ui-monospace, Menlo, monospace;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: oklch(0.78 0.008 250);
  }
  .modal-title {
    margin: 0.5rem 0 0;
    font-family: "Source Serif Pro", serif;
    font-size: 1.4rem;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.015em;
    color: oklch(1 0 0);
  }
  .modal-blurb {
    margin: 0.5rem 0 0;
    font-size: 0.9375rem;
    line-height: 1.5;
    color: oklch(0.92 0.005 250);
  }

  /* Form */
  .modal-form { display: flex; flex-direction: column; gap: 1rem; }
  .modal-field-row { display: flex; flex-direction: column; gap: 1rem; }
  @media (min-width: 480px) {
    .modal-field-row { flex-direction: row; gap: 0.875rem; }
    .modal-field-row .modal-field { flex: 1; }
  }
  .modal-field { display: flex; flex-direction: column; gap: 0.4rem; }
  .modal-field-label {
    font-family: "JetBrains Mono", "SF Mono", ui-monospace, Menlo, monospace;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: oklch(0.85 0.008 250);
  }
  .modal-field input,
  .modal-field textarea,
  .modal-field select {
    width: 100%;
    border: 1px solid oklch(0.58 0.012 250);
    background: oklch(0.09 0.012 250);
    color: oklch(1 0 0);
    border-radius: 0.5rem;
    padding: 0.85rem 1rem;
    font-size: 1rem;
    line-height: 1.5;
    font-family: inherit;
    transition:
      border-color 180ms var(--ease),
      background 180ms var(--ease),
      box-shadow 180ms var(--ease);
  }
  .modal-field textarea { resize: vertical; min-height: 7rem; }
  .modal-field input::placeholder,
  .modal-field textarea::placeholder { color: oklch(0.78 0.012 250); }
  .modal-field input:hover,
  .modal-field textarea:hover,
  .modal-field select:hover { border-color: oklch(0.72 0.012 250); }
  .modal-field input:focus,
  .modal-field textarea:focus,
  .modal-field select:focus {
    outline: none;
    border-color: oklch(0.66 0.13 165);
    background: oklch(0.11 0.012 250);
    box-shadow: 0 0 0 3px oklch(0.66 0.16 165 / 0.22);
  }
  .modal-select-wrap { position: relative; }
  .modal-select-wrap select {
    appearance: none;
    -webkit-appearance: none;
    padding-right: 2.5rem;
    cursor: pointer;
  }
  .modal-select-wrap svg {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    height: 1rem;
    width: 1rem;
    color: oklch(0.82 0.012 250);
    pointer-events: none;
  }

  .modal-honeypot {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  .modal-error {
    margin: 0;
    font-size: 0.875rem;
    color: oklch(0.86 0.16 25);
    background: oklch(0.18 0.06 25 / 0.6);
    border: 1px solid oklch(0.45 0.14 25 / 0.5);
    border-radius: 0.5rem;
    padding: 0.625rem 0.875rem;
    line-height: 1.4;
  }

  /* Actions */
  .modal-actions {
    margin-top: 0.25rem;
    display: flex;
    gap: 0.625rem;
    justify-content: flex-end;
  }

  .modal-cancel,
  .modal-submit,
  .modal-done {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    height: 2.625rem;
    padding: 0 1.125rem;
    border-radius: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid transparent;
    transition:
      background 180ms var(--ease),
      border-color 180ms var(--ease),
      color 180ms var(--ease),
      transform 180ms var(--ease),
      opacity 180ms var(--ease);
  }
  .modal-cancel {
    color: oklch(0.95 0.005 250);
    background: transparent;
    border-color: oklch(0.50 0.012 250);
  }
  .modal-cancel:hover {
    background: oklch(1 0 0 / 0.08);
    border-color: oklch(0.65 0.012 250);
    color: oklch(1 0 0);
  }
  .modal-submit,
  .modal-done {
    color: oklch(0.13 0.012 250);
    background: oklch(0.96 0.003 250);
    border-color: oklch(0.96 0.003 250);
  }
  .modal-submit:hover:not(:disabled),
  .modal-done:hover {
    background: oklch(1 0 0);
    transform: translateY(-1px);
  }
  .modal-submit:disabled { opacity: 0.65; cursor: not-allowed; }
  .modal-submit svg { height: 0.95rem; width: 0.95rem; transition: transform 180ms; }
  .modal-submit:hover:not(:disabled) svg { transform: translateX(2px); }

  .modal-foot {
    margin: 0.5rem 0 0;
    text-align: center;
    font-size: 0.8125rem;
    color: oklch(0.78 0.012 250);
  }
  .modal-foot a {
    color: oklch(0.95 0.008 250);
    text-decoration: none;
    transition: color 180ms var(--ease);
  }
  .modal-foot a:hover { color: oklch(0.99 0 0); }

  /* Success state */
  .modal-success {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.875rem;
  }
  .modal-success-icon {
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
  .modal-success-icon svg { height: 1.25rem; width: 1.25rem; }
  .modal-success-title {
    margin: 0;
    font-family: "Source Serif Pro", serif;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.2;
    color: oklch(0.97 0.005 250);
  }
  .modal-success-copy {
    margin: 0;
    font-size: 0.9375rem;
    line-height: 1.5;
    color: oklch(0.84 0.008 250);
  }
  .modal-done {
    margin-top: 0.5rem;
    align-self: flex-start;
  }
</style>
