<script>
  import { onMount } from "svelte";

  onMount(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const h   = document.getElementById("gz-scan-h");
    const v   = document.getElementById("gz-scan-v");
    const dot = document.getElementById("gz-scan-dot");
    const ret = document.getElementById("gz-scan-reticle");
    if (!h || !v || !dot || !ret) return;

    document.documentElement.classList.add("gz-cursor-active");

    let mx = 0, my = 0, visible = false, hovering = false, pressing = false;
    const els = [h, v, dot, ret];

    // ── Show / hide (inline opacity — reliable, no Svelte scope issues) ──
    function show() {
      if (visible) return;
      visible = true;
      els.forEach(el => { el.style.opacity = "1"; });
    }
    function hide() {
      visible = false;
      els.forEach(el => { el.style.opacity = "0"; });
    }

    window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; show(); });
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);

    // ── State helpers ──
    function applyHover(on) {
      h.style.filter   = on ? "brightness(2.8)" : "";
      v.style.filter   = on ? "brightness(2.8)" : "";
      dot.style.width  = on ? "5px" : "3px";
      dot.style.height = on ? "5px" : "3px";
      ret.classList.toggle("locked", on);
    }

    function applyPress(on) {
      h.style.filter       = on ? "brightness(4.5)" : (hovering ? "brightness(2.8)" : "");
      v.style.filter       = on ? "brightness(4.5)" : (hovering ? "brightness(2.8)" : "");
      dot.style.width      = on ? "6px"  : (hovering ? "5px"  : "3px");
      dot.style.height     = on ? "6px"  : (hovering ? "5px"  : "3px");
      dot.style.background = on ? "#fff" : "";
      dot.style.boxShadow  = on ? "0 0 7px rgba(255,255,255,0.65)" : "";
      ret.style.width      = on ? "14px" : "";
      ret.style.height     = on ? "14px" : "";
      ret.style.filter     = on ? "drop-shadow(0 0 8px oklch(0.78 0.18 145 / 1))" : "";
    }

    // ── Hover detection ──
    const INTERACTIVE = "a, button, label, input, textarea, select, [role='button'], [data-tilt]";
    document.addEventListener("mouseover", e => {
      hovering = !!e.target.closest(INTERACTIVE);
      if (!pressing) applyHover(hovering);
    });

    // ── Press / text selection ──
    window.addEventListener("mousedown", () => { pressing = true;  applyPress(true);  });
    window.addEventListener("mouseup",   () => { pressing = false; applyPress(false); });

    // ── RAF position loop ──
    function loop() {
      h.style.top    = my + "px";
      v.style.left   = mx + "px";
      dot.style.left = mx + "px";
      dot.style.top  = my + "px";
      ret.style.left = mx + "px";
      ret.style.top  = my + "px";
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  });
</script>

<div id="gz-scan-h"       aria-hidden="true"></div>
<div id="gz-scan-v"       aria-hidden="true"></div>
<div id="gz-scan-dot"     aria-hidden="true"></div>
<div id="gz-scan-reticle" aria-hidden="true">
  <span class="tl-h"></span><span class="tl-v"></span>
  <span class="tr-h"></span><span class="tr-v"></span>
  <span class="bl-h"></span><span class="bl-v"></span>
  <span class="br-h"></span><span class="br-v"></span>
</div>

<style>
  :global(.gz-cursor-active),
  :global(.gz-cursor-active *) { cursor: none !important; }

  #gz-scan-h,
  #gz-scan-v,
  #gz-scan-dot,
  #gz-scan-reticle {
    position: fixed;
    pointer-events: none;
    opacity: 0;            /* JS sets to 1 via inline style on first mousemove */
    will-change: transform;
  }

  /* Horizontal scan line */
  #gz-scan-h {
    left: 0; right: 0; height: 1px; z-index: 9990;
    background: linear-gradient(
      90deg,
      transparent 0%, rgba(74,222,128,0.07) 15%,
      rgba(74,222,128,0.16) 50%,
      rgba(74,222,128,0.07) 85%, transparent 100%
    );
    transition: opacity 200ms ease, filter 160ms ease;
  }

  /* Vertical scan line */
  #gz-scan-v {
    top: 0; bottom: 0; width: 1px; z-index: 9990;
    background: linear-gradient(
      180deg,
      transparent 0%, rgba(74,222,128,0.05) 15%,
      rgba(74,222,128,0.12) 50%,
      rgba(74,222,128,0.05) 85%, transparent 100%
    );
    transition: opacity 200ms ease, filter 160ms ease;
  }

  /* Center dot — transitions for hover/press size changes driven by JS */
  #gz-scan-dot {
    z-index: 9999;
    width: 3px; height: 3px;
    border-radius: 50%;
    background: oklch(0.78 0.18 145);
    transform: translate(-50%, -50%);
    transition:
      opacity 200ms ease,
      width 140ms cubic-bezier(0.16, 1, 0.3, 1),
      height 140ms cubic-bezier(0.16, 1, 0.3, 1),
      background 130ms ease,
      box-shadow 130ms ease;
  }

  /* Reticle — .locked class toggled by JS */
  #gz-scan-reticle {
    z-index: 9999;
    width: 20px; height: 20px;
    transform: translate(-50%, -50%);
    transition:
      opacity 200ms ease,
      width   220ms cubic-bezier(0.16, 1, 0.3, 1),
      height  220ms cubic-bezier(0.16, 1, 0.3, 1),
      filter  180ms ease;
  }
  #gz-scan-reticle.locked {
    width: 30px; height: 30px;
    filter: drop-shadow(0 0 5px oklch(0.78 0.18 145 / 0.75));
  }

  /* Corner bracket spans */
  #gz-scan-reticle span {
    position: absolute;
    background: oklch(0.78 0.18 145);
    opacity: 0.8;
  }
  #gz-scan-reticle.locked span { opacity: 1; }

  .tl-h { top: 0; left: 0;  width: 7px;   height: 1.5px; }
  .tl-v { top: 0; left: 0;  width: 1.5px; height: 7px;   }
  .tr-h { top: 0; right: 0; width: 7px;   height: 1.5px; }
  .tr-v { top: 0; right: 0; width: 1.5px; height: 7px;   }
  .bl-h { bottom: 0; left: 0;  width: 7px;   height: 1.5px; }
  .bl-v { bottom: 0; left: 0;  width: 1.5px; height: 7px;   }
  .br-h { bottom: 0; right: 0; width: 7px;   height: 1.5px; }
  .br-v { bottom: 0; right: 0; width: 1.5px; height: 7px;   }
</style>
