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
    frameRate(60);
  }
}

function preload() {
  if (!isHomepage()) return;
  theShader = loadShader("/shader.vert", "/shader.frag");
}

function setup() {
  if (!isHomepage()) {
    noCanvas();
    noLoop();
    return;
  }
  mainCanvas = createCanvas(windowWidth, windowHeight);
  // Pin canvas as a fixed background so it doesn't push page content
  mainCanvas.style("position", "fixed");
  mainCanvas.style("top", "0");
  mainCanvas.style("left", "0");
  mainCanvas.style("z-index", "-1");
  mainCanvas.style("pointer-events", "none");
  applyCanvasOpacity();

  noStroke();
  time_ = random(0, TWO_PI);

  createShaderBuffer();
}

function draw() {
  // Always clear with the base hue so the canvas surface is never blank,
  // even before the shader/graphics buffer is ready.
  clear();

  if (!shaderBg || !theShader) return;
  shaderBg.shader(theShader);

  time_ += 20 / ((frameRate() || 60) * 140);
  if (time_ > TWO_PI) {
    time_ -= TWO_PI;
  }
  theShader.setUniform("iAngle", time_);

  // Mobile uses a slightly tighter iPower range so the fractal pulses less
  // dramatically and reads as ambient backdrop rather than focal element.
  const powRange = isMobile() ? [7.5, 10.5] : [6, 12];
  let pow = map(sin(time_), -1, 1, powRange[0], powRange[1]);
  theShader.setUniform("iTime", millis() / 1000.0);
  theShader.setUniform("iPower", pow);
  theShader.setUniform("iResolution", [shaderBg.width, shaderBg.height]);

  shaderBg.rect(0, 0, shaderBg.width, shaderBg.height);
  image(shaderBg, 0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (shaderBg) shaderBg.remove();
  createShaderBuffer();
  applyCanvasOpacity();
}
