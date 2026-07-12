// a shader variable
let theShader;
let shaderBg;
let mainCanvas;

let time_;

// Mobile gets a lighter, lower-power version of the fractal — still visible,
// just dialed back so it isn't the visual centerpiece on a small screen and
// doesn't burn battery on a 24fps loop at full resolution.
const MOBILE_OPACITY = 0.5;
const MOBILE_RES_SCALE = 0.5;
const DESKTOP_OPACITY = 1.0;

function isMobile() {
  return windowWidth < 768 ||
    window.matchMedia("(pointer: coarse)").matches;
}

function isHomepage() {
  return window.location.pathname === "/";
}

function applyCanvasOpacity() {
  if (!mainCanvas) return;
  mainCanvas.style("opacity", isMobile() ? String(MOBILE_OPACITY) : String(DESKTOP_OPACITY));
  mainCanvas.style("transition", "opacity 240ms ease-out");
}

function createShaderBuffer() {
  if (isMobile()) {
    const sw = Math.max(1, Math.round(windowWidth * MOBILE_RES_SCALE));
    const sh = Math.max(1, Math.round(windowHeight * MOBILE_RES_SCALE));
    shaderBg = createGraphics(sw, sh, WEBGL);
    shaderBg.pixelDensity(1);
    // Park the auxiliary WEBGL canvas off-screen — we only consume its
    // pixels via image(shaderBg, ...) so it never needs to be visible itself.
    shaderBg.style("display", "block");
    shaderBg.style("position", "fixed");
    shaderBg.style("left", "-9999px");
    shaderBg.style("pointer-events", "none");
    frameRate(24);
  } else {
    shaderBg = createGraphics(windowWidth, windowHeight, WEBGL);
    // Match the main canvas at 1 device-pixel per CSS pixel. Without this the
    // buffer inherits the display density (2 on retina), so the heavy Mandelbulb
    // raymarch shades 4x the pixels — the cause of the desktop lag.
    shaderBg.pixelDensity(1);
    frameRate(60);
  }
  attachContextHandlers(shaderBg);
}

// ---------------------------------------------------------------------------
// WebGL context-loss resilience
//
// `shaderBg` is a WEBGL canvas, so it owns a GPU/WebGL context. Browsers cap
// the number of *live* WebGL contexts (~16 in Chrome) and silently kill the
// OLDEST one when that cap is exceeded. In dev, every Vite hot-reload spins up
// a new page generation whose context the browser is slow to reclaim, so after
// enough reloads the cap is breached and the victim is *this* fractal buffer —
// the canvas blanks with no recovery. Guard both ends:
//   1) Release the context on page-hide so a reload never leaks it (stops the
//      accumulation that triggers the loss in the first place).
//   2) If the context is lost anyway (GPU reset, tab thrash, bfcache), rebuild
//      the buffer + shader so the fractal comes back on its own.
let _rebuildingBuffer = false;
// `loadShader` is async. Outside p5's preload() nothing blocks draw() until the
// program is compiled, so we gate on this flag and only let draw() touch the
// shader once its load callback has fired. Without the gate, draw() can call
// into a half-built shader, throw, and kill p5's draw loop entirely.
let shaderReady = false;

function loadFractalShader() {
  shaderReady = false;
  theShader = loadShader(
    "/shader.vert",
    "/shader.frag",
    () => { shaderReady = true; },
    () => { shaderReady = false; }
  );
}

function attachContextHandlers(buffer) {
  const canvas = buffer && buffer.elt;
  if (!canvas || canvas._gzCtxHandlers) return;
  canvas._gzCtxHandlers = true;
  // preventDefault keeps the context *restorable* rather than permanently dead —
  // without it the browser never offers a path back. Then rebuild from scratch.
  canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); scheduleBufferRebuild(); }, false);
}

// Debounced rebuild. Re-entrancy is guarded so a draw()-error storm or a burst
// of context events collapses into a single rebuild attempt.
function scheduleBufferRebuild(delay) {
  if (_rebuildingBuffer || !isHomepage()) return;
  _rebuildingBuffer = true;
  // Defer so the browser finishes reclaiming the dead context before we ask for
  // a fresh one.
  setTimeout(() => { _rebuildingBuffer = false; rebuildShaderBuffer(); }, delay || 60);
}

function rebuildShaderBuffer() {
  try {
    if (shaderBg && typeof shaderBg.remove === "function") shaderBg.remove();
    shaderBg = null;
    theShader = null;
    shaderReady = false;
    createShaderBuffer();        // fresh WEBGL graphics + a fresh context
    loadFractalShader();         // recompiles against the new context when ready
  } catch (err) {
    // Context creation can transiently fail right after a loss; back off + retry.
    shaderBg = null;
    setTimeout(() => scheduleBufferRebuild(250), 0);
  }
}

function releaseShaderContext() {
  if (!shaderBg) return;
  const gl = shaderBg.drawingContext;
  if (gl && typeof gl.getExtension === "function") {
    const ext = gl.getExtension("WEBGL_lose_context");
    if (ext) ext.loseContext();
  }
  if (typeof shaderBg.remove === "function") shaderBg.remove();
  shaderBg = null;
}

function preload() {
  if (!isHomepage()) return;
  // In preload(), p5 blocks draw() until the load completes; the success
  // callback flips shaderReady before the first frame.
  loadFractalShader();
}

// ---------------------------------------------------------------------------
// Survive SvelteKit hydration
//
// p5 runs in global mode, booted from a <head> script on the window 'load'
// event, and appends its canvas to <body>. SvelteKit hydrates <body> around the
// same time and removes any DOM node it didn't server-render — including our
// canvas whenever p5's append wins the race against hydration. p5 keeps drawing
// to the now-detached canvas, so the fractal paints one frame then vanishes
// ("quick flash, then gone"). Because it's a race, it's intermittent and hits
// both first load and auto-reloads.
//
// Fix: re-attach the canvas whenever it's pulled out of <body>, but only for a
// short window — hydration is a one-time early event, and we must not fight a
// legitimate teardown later (route change, etc.).
function keepCanvasMounted() {
  const el = mainCanvas && mainCanvas.elt;
  if (!el || typeof MutationObserver === "undefined") return;
  const reattach = () => { if (!document.body.contains(el)) document.body.appendChild(el); };
  reattach();
  const obs = new MutationObserver(reattach);
  obs.observe(document.body, { childList: true });
  setTimeout(() => obs.disconnect(), 5000);
}

function setup() {
  if (!isHomepage()) {
    noCanvas();
    noLoop();
    return;
  }
  // Cap every p5 canvas at 1 device-pixel per CSS pixel. The Mandelbulb is a
  // heavy per-pixel raymarch, so on a retina display the default density (2)
  // quadruples the shading + blit cost and makes the fractal feel laggy. 1x is
  // plenty for an abstract background; page text is DOM, so it stays crisp.
  pixelDensity(1);
  mainCanvas = createCanvas(windowWidth, windowHeight);
  // Pin canvas as a fixed background so it doesn't push page content
  mainCanvas.style("position", "fixed");
  mainCanvas.style("top", "0");
  mainCanvas.style("left", "0");
  mainCanvas.style("z-index", "-1");
  mainCanvas.style("pointer-events", "none");
  // Cover the *dynamic* viewport via CSS so the address bar hiding/showing on
  // mobile never reveals a gap below the fixed canvas, regardless of when the
  // (debounced) resize re-fits the drawing buffer. 100dvh tracks the live
  // viewport; the abstract fractal tolerates the slight CSS scale.
  mainCanvas.style("width", "100vw");
  mainCanvas.style("height", "100dvh");
  applyCanvasOpacity();

  noStroke();
  time_ = random(0, TWO_PI);

  keepCanvasMounted();

  createShaderBuffer();

  // Free the WebGL context when the page is hidden (reload / navigation /
  // bfcache) so dev hot-reloads don't pile up un-reclaimed contexts and trip
  // the browser's live-context cap.
  window.addEventListener("pagehide", releaseShaderContext);
  // Returning from bfcache restores a page whose context we just released —
  // rebuild it so the fractal isn't blank on back/forward navigation.
  window.addEventListener("pageshow", (e) => {
    if (e.persisted && isHomepage() && !shaderBg) rebuildShaderBuffer();
  });
}

function draw() {
  // Always clear with the base hue so the canvas surface is never blank,
  // even before the shader/graphics buffer is ready.
  clear();

  // Wait for both the buffer and a fully-compiled shader before drawing.
  if (!shaderBg || !theShader || !shaderReady) return;

  // Guard the GL work: if the context is lost mid-frame the shader calls throw,
  // and an uncaught throw here would stop p5's draw loop for good (frozen
  // sketch). Catch it, trigger a rebuild, and keep looping.
  try {
    shaderBg.shader(theShader);

    time_ += 20 / ((frameRate() || 60) * 140);
    if (time_ > TWO_PI) {
      time_ -= TWO_PI;
    }
    const _scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const _scrollFrac = _scrollable > 0 ? window.scrollY / _scrollable : 0;
    theShader.setUniform("iAngle", time_ + _scrollFrac * Math.PI * 0.6);

    // Mobile uses a slightly tighter iPower range so the fractal pulses less
    // dramatically and reads as ambient backdrop rather than focal element.
    const powRange = isMobile() ? [7.5, 10.5] : [6, 12];
    let pow = map(sin(time_), -1, 1, powRange[0], powRange[1]);
    theShader.setUniform("iTime", millis() / 1000.0);
    theShader.setUniform("iPower", pow);
    theShader.setUniform("iResolution", [shaderBg.width, shaderBg.height]);

    shaderBg.rect(0, 0, shaderBg.width, shaderBg.height);
    image(shaderBg, 0, 0, width, height);
  } catch (err) {
    scheduleBufferRebuild();
  }
}

// Mobile browsers fire `resize` continuously while scrolling (the address bar
// shows/hides, changing innerHeight). The old code destroyed and recreated the
// WEBGL graphics buffer on every one of those events — which spins up a fresh
// WebGL context each time until the browser hits its context limit, kills the
// oldest contexts, and the fractal blanks out for good. Fix: debounce, and
// RESIZE the existing buffer instead of remove()+createGraphics() so we never
// allocate a new WebGL context on resize.
let _resizeTimer = null;
function windowResized() {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(applyResize, 120);
}

function applyResize() {
  resizeCanvas(windowWidth, windowHeight);
  // resizeCanvas() rewrites the canvas' inline width/height back to pixels,
  // so re-assert the dynamic-viewport CSS cover after it.
  if (mainCanvas) {
    mainCanvas.style("width", "100vw");
    mainCanvas.style("height", "100dvh");
  }
  if (shaderBg && typeof shaderBg.resizeCanvas === "function") {
    if (isMobile()) {
      const sw = Math.max(1, Math.round(windowWidth * MOBILE_RES_SCALE));
      const sh = Math.max(1, Math.round(windowHeight * MOBILE_RES_SCALE));
      shaderBg.resizeCanvas(sw, sh, false);
    } else {
      shaderBg.resizeCanvas(windowWidth, windowHeight, false);
    }
  } else {
    createShaderBuffer();
  }
  applyCanvasOpacity();
  frameRate(isMobile() ? 24 : 60);
}
