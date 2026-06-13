import "./style.css";

const canvas = document.querySelector("#visualiser");
const ctx = canvas.getContext("2d");
const languageSelect = document.querySelector("#languageSelect");
const setupScreen = document.querySelector("#setupScreen");
const liveScreen = document.querySelector("#liveScreen");
const controlPanel = document.querySelector("#controlPanel");
const audioPlayer = document.querySelector("#audioPlayer");
const audioFile = document.querySelector("#audioFile");
const filePicker = document.querySelector("#filePicker");
const fileName = document.querySelector("#fileName");
const errorMessage = document.querySelector("#errorMessage");
const startButton = controlPanel.querySelector(".start-button");
const intensity = document.querySelector("#intensity");
const intensityValue = document.querySelector("#intensityValue");
const visualMode = document.querySelector("#visualMode");
const palette = document.querySelector("#palette");
const symmetry = document.querySelector("#symmetry");
const blendMode = document.querySelector("#blendMode");
const reactivity = document.querySelector("#reactivity");
const motion = document.querySelector("#motion");
const trail = document.querySelector("#trail");
const detail = document.querySelector("#detail");
const bloom = document.querySelector("#bloom");
const autoCycle = document.querySelector("#autoCycle");
const beatPulse = document.querySelector("#beatPulse");
const mirror = document.querySelector("#mirror");
const modeName = document.querySelector("#modeName");
const shuffleButton = document.querySelector("#shuffleButton");
const presetButtons = document.querySelectorAll(".preset-button");
const pauseButton = document.querySelector("#pauseButton");
const pauseText = document.querySelector("#pauseText");
const backButton = document.querySelector("#backButton");
const fullscreenButton = document.querySelector("#fullscreenButton");
const sourceName = document.querySelector("#sourceName");
const trackName = document.querySelector("#trackName");
const bassMeter = document.querySelector("#bassMeter");
const bassValue = document.querySelector("#bassValue");

const palettes = {
  ice: ["#ffffff", "#c9dbff", "#7699e8"],
  violet: ["#f4deff", "#a66bff", "#5526c9"],
  ember: ["#fff0c7", "#ff7d32", "#bf1534"],
  ocean: ["#d6ffff", "#26bde2", "#0751a3"],
  acid: ["#f4ff76", "#59ff91", "#25a0ff"],
  mono: ["#ffffff", "#8b8b8b", "#303030"],
};

const paletteLabels = {
  ice: "Ice White",
  violet: "Ultraviolet",
  ember: "Solar Ember",
  ocean: "Deep Ocean",
  acid: "Acid Pulse",
  mono: "Pure Mono",
};

const translations = {
  en: {
    language: "Language", home: "NOIR home", heroLine: "Make music", heroAccent: "visible.",
    heroCopy: "Choose your source, shape the look, and let sound take over the room.",
    session: "Your session", ready: "Ready", audioSource: "Audio source",
    systemAudio: "System audio", systemAudioHint: "Current Windows PC audio",
    microphone: "Microphone", microphoneHint: "Live input from the room",
    audioFile: "Audio file", chooseFile: "Choose a file", browse: "Browse",
    palette: "Palette", quickPresets: "Quick presets", intensity: "Intensity",
    advancedHint: "Shape, motion, and audio response", symmetry: "Symmetry",
    normal: "Normal", fold2: "2-fold", fold4: "4-fold", fold6: "6-fold", fold8: "8-fold",
    reactivity: "Reactivity", motion: "Motion", detail: "Detail",
    start: "Start visualisation", connecting: "Connecting audio...",
    privacy: "Audio stays on this computer and is never uploaded.",
    back: "Back to setup", fullscreen: "Fullscreen", nextScene: "Next scene",
    modeRings: "Rings", modeWave: "Wave", modeSpectrum: "Spectrum",
    modeKaleidoscope: "Kaleidoscope", modeConstellation: "Constellation",
    modeVortex: "Particle Vortex", sourceSystem: "SYSTEM AUDIO",
    sourceMicrophone: "MICROPHONE", sourceFile: "AUDIO FILE", liveInput: "LIVE INPUT",
    noFile: "Choose an audio file first.",
    noSystemAudio: "Windows did not provide system audio. Start playing music and try again.",
    audioBlocked: "Windows blocked access to system audio.",
    audioBusy: "Another app is using the audio device in exclusive mode.",
    audioUnknown: "System audio could not be connected",
  },
  de: {
    language: "Sprache", home: "NOIR Startseite", heroLine: "Mach Musik", heroAccent: "sichtbar.",
    heroCopy: "Wähle deine Quelle, forme den Look und lass den Sound den Raum übernehmen.",
    session: "Deine Session", ready: "Bereit", audioSource: "Audioquelle",
    systemAudio: "Systemaudio", systemAudioHint: "Aktueller Windows-PC-Ton",
    microphone: "Mikrofon", microphoneHint: "Live aus dem Raum",
    audioFile: "Audiodatei", chooseFile: "Datei auswählen", browse: "Durchsuchen",
    palette: "Farbwelt", quickPresets: "Schnell-Presets", intensity: "Intensität",
    advancedHint: "Form, Bewegung und Audio-Reaktion", symmetry: "Symmetrie",
    normal: "Normal", fold2: "2-fach", fold4: "4-fach", fold6: "6-fach", fold8: "8-fach",
    reactivity: "Reaktivität", motion: "Bewegung", detail: "Detail",
    start: "Visualisierung starten", connecting: "Audio wird verbunden...",
    privacy: "Audio bleibt lokal auf diesem Computer und wird nicht hochgeladen.",
    back: "Zurück zum Setup", fullscreen: "Vollbild", nextScene: "Nächste Szene",
    modeRings: "Ringe", modeWave: "Welle", modeSpectrum: "Spektrum",
    modeKaleidoscope: "Kaleidoskop", modeConstellation: "Konstellation",
    modeVortex: "Partikel-Vortex", sourceSystem: "SYSTEMAUDIO",
    sourceMicrophone: "MIKROFON", sourceFile: "AUDIODATEI", liveInput: "LIVE INPUT",
    noFile: "Bitte wähle zuerst eine Audiodatei aus.",
    noSystemAudio: "Windows hat keinen Systemton bereitgestellt. Starte Musik und versuche es erneut.",
    audioBlocked: "Der Zugriff auf den PC-Ton wurde von Windows blockiert.",
    audioBusy: "Der PC-Ton wird bereits von einer anderen App exklusiv verwendet.",
    audioUnknown: "PC-Ton konnte nicht verbunden werden",
  },
};

const modeLabelKeys = {
  rings: "modeRings",
  wave: "modeWave",
  spectrum: "modeSpectrum",
  kaleidoscope: "modeKaleidoscope",
  constellation: "modeConstellation",
  vortex: "modeVortex",
};

let currentLanguage = "en";

function t(key) {
  return translations[currentLanguage][key] ?? translations.en[key] ?? key;
}

function modeLabel(mode) {
  const key = modeLabelKeys[mode];
  return key ? t(key) : document.querySelector(`#visualMode option[value="${mode}"]`)?.textContent ?? mode;
}

const presets = {
  clean: {
    intensity: 72, reactivity: 70, motion: 35, trail: 35, detail: 60,
    symmetry: "1", blend: "lighter", bloom: true, beat: true, mirror: false,
  },
  cinema: {
    intensity: 62, reactivity: 55, motion: 28, trail: 76, detail: 82,
    symmetry: "2", blend: "screen", bloom: true, beat: true, mirror: true,
  },
  club: {
    intensity: 92, reactivity: 92, motion: 78, trail: 42, detail: 72,
    symmetry: "4", blend: "lighter", bloom: true, beat: true, mirror: false,
  },
  dream: {
    intensity: 68, reactivity: 63, motion: 52, trail: 88, detail: 90,
    symmetry: "6", blend: "screen", bloom: true, beat: false, mirror: true,
  },
};

let audioContext;
let analyser;
let sourceNode;
let mediaStream;
let dataArray;
let timeArray;
let animationFrame;
let selectedFile;
let isPaused = false;
let elapsed = 0;
let lastFrame = performance.now();
let smoothBass = 0;
let smoothMid = 0;
let smoothHigh = 0;
let particles = [];
let terrainHistory = [];
let beatEnergy = 0;
let beatKick = 0;
let lastBeatAt = 0;
let lastCycleAt = 0;

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function updateRange() {
  const value = intensity.value;
  intensityValue.value = `${value}%`;
  intensity.style.background = `linear-gradient(to right, #111 0 ${value}%, #d1d1cb ${value}% 100%)`;
}

function updateAdvancedRanges() {
  [reactivity, motion, trail, detail].forEach((control) => {
    const output = document.querySelector(`#${control.id}Value`);
    output.value = control.value;
    control.style.background = `linear-gradient(to right, #111 0 ${control.value}%, #d1d1cb ${control.value}% 100%)`;
  });
}

function updateModeName() {
  modeName.textContent = `${modeLabel(visualMode.value)} / ${paletteLabels[palette.value]}`.toUpperCase();
}

function updateLiveSourceLabels() {
  const type = selectedSource();
  if (type === "system") {
    sourceName.textContent = t("sourceSystem");
    trackName.textContent = t("sourceSystem");
  } else if (type === "microphone") {
    sourceName.textContent = t("sourceMicrophone");
    trackName.textContent = t("liveInput");
  } else if (type === "file") {
    sourceName.textContent = t("sourceFile");
    if (!selectedFile) trackName.textContent = t("sourceFile");
  }
}

function applyLanguage(language) {
  currentLanguage = translations[language] ? language : "en";
  document.documentElement.lang = currentLanguage;
  languageSelect.value = currentLanguage;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });
  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    element.title = t(element.dataset.i18nTitle);
  });

  if (!selectedFile) fileName.textContent = t("chooseFile");
  if (!startButton.disabled) startButton.querySelector("span").textContent = t("start");
  updateModeName();
  updateLiveSourceLabels();
}

function applyPreset(name) {
  const preset = presets[name];
  intensity.value = preset.intensity;
  reactivity.value = preset.reactivity;
  motion.value = preset.motion;
  trail.value = preset.trail;
  detail.value = preset.detail;
  symmetry.value = preset.symmetry;
  blendMode.value = preset.blend;
  bloom.checked = preset.bloom;
  beatPulse.checked = preset.beat;
  mirror.checked = preset.mirror;
  presetButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.preset === name));
  updateRange();
  updateAdvancedRanges();
}

function selectedSource() {
  return controlPanel.elements.source.value;
}

function updateSourceUI() {
  const isFile = selectedSource() === "file";
  filePicker.hidden = !isFile;
  errorMessage.textContent = "";
}

function setLoading(loading) {
  startButton.disabled = loading;
  startButton.querySelector("span").textContent = loading
    ? t("connecting")
    : t("start");
}

function setError(message) {
  errorMessage.textContent = message;
  setLoading(false);
}

async function createAudioGraph() {
  audioContext ??= new AudioContext();
  await audioContext.resume();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.82;
  analyser.minDecibels = -90;
  analyser.maxDecibels = -10;
  dataArray = new Uint8Array(analyser.frequencyBinCount);
  timeArray = new Uint8Array(analyser.fftSize);
}

async function connectSource(type) {
  await createAudioGraph();

  if (type === "system") {
    mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    if (!mediaStream.getAudioTracks().length) {
      mediaStream.getTracks().forEach((track) => track.stop());
      throw new Error("NO_SYSTEM_AUDIO");
    }

    mediaStream.getVideoTracks().forEach((track) => track.stop());
    sourceNode = audioContext.createMediaStreamSource(mediaStream);
    sourceNode.connect(analyser);
    sourceName.textContent = t("sourceSystem");
    trackName.textContent = t("sourceSystem");
  }

  if (type === "microphone") {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });
    sourceNode = audioContext.createMediaStreamSource(mediaStream);
    sourceNode.connect(analyser);
    sourceName.textContent = t("sourceMicrophone");
    trackName.textContent = t("liveInput");
  }

  if (type === "file") {
    if (!selectedFile) {
      throw new Error("NO_FILE");
    }

    audioPlayer.src = URL.createObjectURL(selectedFile);
    sourceNode = audioContext.createMediaElementSource(audioPlayer);
    sourceNode.connect(analyser);
    analyser.connect(audioContext.destination);
    sourceName.textContent = t("sourceFile");
    trackName.textContent = selectedFile.name.replace(/\.[^/.]+$/, "").toUpperCase();
    await audioPlayer.play();
  }
}

function averageRange(start, end) {
  let total = 0;
  for (let i = start; i < end; i += 1) total += dataArray[i];
  return total / Math.max(1, end - start) / 255;
}

function readAudio() {
  analyser.getByteFrequencyData(dataArray);
  analyser.getByteTimeDomainData(timeArray);

  const response = Number(reactivity.value) / 70;
  const bass = Math.min(1, averageRange(1, 18) * response);
  const mid = averageRange(18, 110);
  const high = averageRange(110, 360);
  smoothBass += (bass - smoothBass) * 0.18;
  smoothMid += (mid - smoothMid) * 0.13;
  smoothHigh += (high - smoothHigh) * 0.1;

  beatEnergy += (bass - beatEnergy) * 0.035;
  const now = performance.now();
  if (bass > beatEnergy * 1.42 && bass > 0.24 && now - lastBeatAt > 180) {
    beatKick = 1;
    lastBeatAt = now;
  }
  beatKick *= 0.9;

  const bassPercent = Math.round(smoothBass * 100);
  bassMeter.style.width = `${Math.min(100, bassPercent * 1.4)}%`;
  bassValue.textContent = String(bassPercent).padStart(2, "0");
}

function paintBackground(width, height, colors, energy) {
  const trailAmount = Number(trail.value) / 100;
  const clearAlpha = Math.max(0.035, 0.48 - trailAmount * 0.44);
  ctx.fillStyle = `rgba(0, 0, 0, ${clearAlpha})`;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.58,
  );
  glow.addColorStop(0, `${colors[2]}${Math.round(Math.min(1, energy) * 34).toString(16).padStart(2, "0")}`);
  glow.addColorStop(0.45, "rgba(10, 10, 14, 0.15)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
}

function drawAura(width, height, colors, power) {
  const cx = width / 2;
  const cy = height / 2;
  const points = Math.round(90 + Number(detail.value) * 1.8);
  const pulse = beatPulse.checked ? beatKick * 0.055 : 0;
  const base = Math.min(width, height) * (0.17 + smoothBass * 0.09 * power + pulse);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.globalCompositeOperation = "lighter";
  ctx.shadowBlur = bloom.checked ? 28 + smoothBass * 70 : 0;

  for (let layer = 3; layer >= 0; layer -= 1) {
    ctx.beginPath();
    for (let i = 0; i <= points; i += 1) {
      const index = Math.floor((i / points) * (dataArray.length * 0.46));
      const amplitude = dataArray[index] / 255;
      const angle = (i / points) * Math.PI * 2 - Math.PI / 2;
      const folds = Math.max(1, Number(symmetry.value));
      const speed = Number(motion.value) / 45;
      const flutter = Math.sin(angle * (6 + folds) + elapsed * 0.0015 * speed) * smoothHigh * 18;
      const radius = base + amplitude * (70 + layer * 8) * power + flutter + layer * 11;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = colors[layer % colors.length];
    ctx.globalAlpha = 0.18 + (3 - layer) * 0.13;
    ctx.lineWidth = layer === 0 ? 1.6 : 1;
    ctx.shadowColor = colors[layer % colors.length];
    ctx.stroke();
  }

  const core = ctx.createRadialGradient(0, 0, 0, 0, 0, base * 0.95);
  core.addColorStop(0, `rgba(255,255,255,${0.06 + smoothBass * 0.12})`);
  core.addColorStop(0.55, `${colors[1]}18`);
  core.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalAlpha = 1;
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(0, 0, base, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBars(width, height, colors, power) {
  const barCount = Math.min(160, Math.floor(35 + Number(detail.value) * 1.2));
  const gap = 3;
  const usableWidth = Math.min(width * 0.78, 1100);
  const barWidth = usableWidth / barCount - gap;
  const startX = (width - usableWidth) / 2;
  const centerY = height / 2;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < barCount; i += 1) {
    const normalized = Math.abs(i - barCount / 2) / (barCount / 2);
    const index = Math.floor(normalized * dataArray.length * 0.62);
    const level = dataArray[index] / 255;
    const barHeight = Math.max(2, level * height * 0.34 * power);
    const gradient = ctx.createLinearGradient(0, centerY - barHeight, 0, centerY + barHeight);
    gradient.addColorStop(0, colors[2]);
    gradient.addColorStop(0.48, colors[0]);
    gradient.addColorStop(1, colors[2]);
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.34 + level * 0.68;
    ctx.shadowBlur = bloom.checked ? level * 22 : 0;
    ctx.shadowColor = colors[1];
    ctx.fillRect(startX + i * (barWidth + gap), centerY - barHeight, barWidth, barHeight * 2);
  }
  ctx.restore();
}

function drawRings(width, height, colors, power) {
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = Math.min(width, height) * 0.39;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.globalCompositeOperation = "lighter";

  const ringCount = Math.round(5 + Number(detail.value) / 8);
  for (let ring = 0; ring < ringCount; ring += 1) {
    const level = dataArray[ring * 12 + 4] / 255;
    const radius = maxRadius * ((ring + 1) / 10) + level * 24 * power;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = colors[ring % 3];
    ctx.lineWidth = 0.6 + level * 2.2;
    ctx.globalAlpha = 0.1 + level * 0.45;
    ctx.shadowBlur = bloom.checked ? level * 30 : 0;
    ctx.shadowColor = colors[ring % 3];
    ctx.stroke();
  }

  const particleTarget = Math.floor(35 + smoothHigh * 90 * power);
  while (particles.length < particleTarget) {
    particles.push({
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * maxRadius,
      speed: 0.0002 + Math.random() * 0.0007 * (Number(motion.value) / 45),
      size: 0.5 + Math.random() * 1.8,
    });
  }
  particles.length = particleTarget;

  particles.forEach((particle) => {
    particle.angle += particle.speed * (1 + smoothMid * 3) * 16;
    const x = Math.cos(particle.angle) * particle.radius;
    const y = Math.sin(particle.angle) * particle.radius;
    ctx.fillStyle = colors[0];
    ctx.globalAlpha = 0.15 + smoothHigh * 0.7;
    ctx.fillRect(x, y, particle.size, particle.size);
  });
  ctx.restore();
}

function drawWave(width, height, colors, power) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const layers = Math.max(2, Math.round(Number(symmetry.value) / 2));
  for (let layer = 0; layer < Math.min(6, layers + 2); layer += 1) {
    ctx.beginPath();
    for (let i = 0; i < timeArray.length; i += 3) {
      const x = (i / (timeArray.length - 1)) * width;
      const sample = (timeArray[i] - 128) / 128;
      const y =
        height / 2 +
        sample * height * (0.17 + layer * 0.035) * power +
        Math.sin(i * 0.018 + elapsed * 0.001 * (Number(motion.value) / 45) + layer) * smoothHigh * 16;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = colors[layer % colors.length];
    ctx.globalAlpha = 0.2 + (2 - layer) * 0.2;
    ctx.lineWidth = 1 + (2 - layer) * 0.6;
    ctx.shadowBlur = bloom.checked ? 14 + smoothBass * 32 : 0;
    ctx.shadowColor = colors[layer % colors.length];
    ctx.stroke();
  }
  ctx.restore();
}

function drawSpectrum(width, height, colors, power) {
  const cx = width / 2;
  const cy = height / 2;
  const count = Math.round(72 + Number(detail.value) * 1.4);
  const base = Math.min(width, height) * (0.12 + beatKick * 0.025);
  const symmetryFactor = Number(symmetry.value);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(elapsed * 0.00003 * Number(motion.value));
  ctx.globalCompositeOperation = blendMode.value;
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2;
    const folded = Math.abs(Math.sin(angle * symmetryFactor * 0.5));
    const index = Math.floor(folded * dataArray.length * 0.55);
    const level = dataArray[index] / 255;
    const length = 12 + level * Math.min(width, height) * 0.27 * power;
    const x1 = Math.cos(angle) * base;
    const y1 = Math.sin(angle) * base;
    const x2 = Math.cos(angle) * (base + length);
    const y2 = Math.sin(angle) * (base + length);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = colors[i % colors.length];
    ctx.globalAlpha = 0.25 + level * 0.75;
    ctx.lineWidth = 0.6 + level * 2.4;
    ctx.shadowBlur = bloom.checked ? level * 24 : 0;
    ctx.shadowColor = colors[i % colors.length];
    ctx.stroke();
  }
  ctx.restore();
}

function drawTunnel(width, height, colors, power) {
  const cx = width / 2;
  const cy = height / 2;
  const rings = Math.round(11 + Number(detail.value) / 5);
  const speed = Number(motion.value) / 28;
  const sides = Math.max(4, Number(symmetry.value) * 2);
  const maxRadius = Math.hypot(width, height) * 0.5;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.globalCompositeOperation = blendMode.value;
  for (let r = 0; r < rings; r += 1) {
    const phase = ((r / rings + elapsed * 0.00008 * speed) % 1);
    const radius = 20 + phase * maxRadius;
    const level = dataArray[Math.floor(phase * dataArray.length * 0.35)] / 255;
    ctx.beginPath();
    for (let side = 0; side <= sides; side += 1) {
      const angle = (side / sides) * Math.PI * 2 + elapsed * 0.00006 * speed;
      const warped = radius * (1 + level * 0.09 * power);
      const x = Math.cos(angle) * warped;
      const y = Math.sin(angle) * warped;
      if (side === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = colors[r % colors.length];
    ctx.globalAlpha = (1 - phase) * 0.08 + phase * (0.25 + level * 0.45);
    ctx.lineWidth = 0.6 + level * 2;
    ctx.shadowBlur = bloom.checked ? 18 * level : 0;
    ctx.shadowColor = colors[r % colors.length];
    ctx.stroke();
  }
  ctx.restore();
}

function drawKaleidoscope(width, height, colors, power) {
  const cx = width / 2;
  const cy = height / 2;
  const segments = Math.max(4, Number(symmetry.value) * 2);
  const samples = Math.round(45 + Number(detail.value));
  const radius = Math.min(width, height) * 0.38;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(elapsed * 0.00008 * Number(motion.value));
  ctx.globalCompositeOperation = blendMode.value;
  for (let segment = 0; segment < segments; segment += 1) {
    ctx.save();
    ctx.rotate((segment / segments) * Math.PI * 2);
    if (segment % 2) ctx.scale(-1, 1);
    ctx.beginPath();
    for (let i = 0; i < samples; i += 1) {
      const level = dataArray[Math.floor((i / samples) * dataArray.length * 0.45)] / 255;
      const x = (i / samples) * radius;
      const y = Math.sin(i * 0.24 + elapsed * 0.001) * 8 + level * radius * 0.34 * power;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = colors[segment % colors.length];
    ctx.globalAlpha = 0.18 + smoothMid * 0.6;
    ctx.lineWidth = 0.8 + smoothBass * 2;
    ctx.shadowBlur = bloom.checked ? 20 : 0;
    ctx.shadowColor = colors[segment % colors.length];
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

function drawTerrain(width, height, colors, power) {
  const columns = Math.round(35 + Number(detail.value) * 0.65);
  const rows = Math.round(14 + Number(detail.value) * 0.18);
  const snapshot = Array.from({ length: columns }, (_, i) => {
    const index = Math.floor((i / columns) * dataArray.length * 0.42);
    return dataArray[index] / 255;
  });
  if (elapsed % 70 < 18) terrainHistory.unshift(snapshot);
  terrainHistory.length = Math.min(rows, terrainHistory.length);

  ctx.save();
  ctx.translate(width / 2, height * 0.28);
  ctx.globalCompositeOperation = blendMode.value;
  terrainHistory.forEach((row, rowIndex) => {
    const depth = rowIndex / rows;
    const spread = width * (0.22 + depth * 0.48);
    const yBase = depth * height * 0.62;
    ctx.beginPath();
    row.forEach((level, column) => {
      const x = (column / (columns - 1) - 0.5) * spread;
      const y = yBase - level * height * 0.2 * power * (1 - depth * 0.45);
      if (column === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = colors[rowIndex % colors.length];
    ctx.globalAlpha = 0.08 + (1 - depth) * 0.42;
    ctx.lineWidth = 0.7 + smoothBass;
    ctx.shadowBlur = bloom.checked ? smoothBass * 18 : 0;
    ctx.shadowColor = colors[rowIndex % colors.length];
    ctx.stroke();
  });
  ctx.restore();
}

function ensureParticles(count, width, height) {
  while (particles.length < count) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * Math.min(width, height) * 0.42,
      speed: 0.0005 + Math.random() * 0.0015,
      size: 0.7 + Math.random() * 2,
    });
  }
  particles.length = count;
}

function drawConstellation(width, height, colors, power) {
  const count = Math.round(35 + Number(detail.value) * 0.7);
  const speed = Number(motion.value) / 45;
  ensureParticles(count, width, height);
  ctx.save();
  ctx.globalCompositeOperation = blendMode.value;
  particles.forEach((particle, i) => {
    const band = dataArray[(i * 7) % Math.floor(dataArray.length * 0.45)] / 255;
    particle.x += particle.vx * speed * (1 + band * 2);
    particle.y += particle.vy * speed * (1 + band * 2);
    if (particle.x < 0 || particle.x > width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > height) particle.vy *= -1;
    ctx.fillStyle = colors[i % colors.length];
    ctx.globalAlpha = 0.35 + band * 0.65;
    ctx.shadowBlur = bloom.checked ? 12 * band : 0;
    ctx.shadowColor = colors[i % colors.length];
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size + band * 2 * power, 0, Math.PI * 2);
    ctx.fill();

    for (let j = i + 1; j < Math.min(count, i + 7); j += 1) {
      const other = particles[j];
      const distance = Math.hypot(other.x - particle.x, other.y - particle.y);
      if (distance < 105 + smoothMid * 80) {
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = colors[(i + j) % colors.length];
        ctx.globalAlpha = (1 - distance / 185) * (0.08 + smoothHigh * 0.35);
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  });
  ctx.restore();
}

function drawVortex(width, height, colors, power) {
  const count = Math.round(80 + Number(detail.value) * 1.6);
  const speed = Number(motion.value) / 38;
  ensureParticles(count, width, height);
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.globalCompositeOperation = blendMode.value;
  particles.forEach((particle, i) => {
    const band = dataArray[(i * 5) % Math.floor(dataArray.length * 0.5)] / 255;
    particle.angle += particle.speed * speed * (1 + band * 4);
    const pulse = 1 + band * 0.16 * power + beatKick * 0.08;
    const x = Math.cos(particle.angle) * particle.radius * pulse;
    const y = Math.sin(particle.angle) * particle.radius * pulse * 0.72;
    ctx.fillStyle = colors[i % colors.length];
    ctx.globalAlpha = 0.18 + band * 0.78;
    ctx.shadowBlur = bloom.checked ? 10 + band * 18 : 0;
    ctx.shadowColor = colors[i % colors.length];
    ctx.fillRect(x, y, particle.size + band * 2, particle.size + band * 2);
  });
  ctx.restore();
}

function cycleScene() {
  const options = Array.from(visualMode.options);
  const current = options.findIndex((option) => option.value === visualMode.value);
  visualMode.value = options[(current + 1) % options.length].value;
  particles = [];
  terrainHistory = [];
  updateModeName();
}

function draw(now) {
  const delta = Math.min(32, now - lastFrame);
  lastFrame = now;
  if (!isPaused) elapsed += delta;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const colors = palettes[palette.value];
  const beatBoost = beatPulse.checked ? beatKick * 0.25 : 0;
  const power = Number(intensity.value) / 55 + beatBoost;

  if (!isPaused) readAudio();
  paintBackground(width, height, colors, smoothBass * power);

  if (autoCycle.checked && elapsed - lastCycleAt > 12000) {
    cycleScene();
    lastCycleAt = elapsed;
  }

  ctx.save();
  if (mirror.checked) {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }
  ctx.globalCompositeOperation = blendMode.value;
  if (visualMode.value === "aura") drawAura(width, height, colors, power);
  if (visualMode.value === "bars") drawBars(width, height, colors, power);
  if (visualMode.value === "rings") drawRings(width, height, colors, power);
  if (visualMode.value === "wave") drawWave(width, height, colors, power);
  if (visualMode.value === "spectrum") drawSpectrum(width, height, colors, power);
  if (visualMode.value === "tunnel") drawTunnel(width, height, colors, power);
  if (visualMode.value === "kaleidoscope") drawKaleidoscope(width, height, colors, power);
  if (visualMode.value === "terrain") drawTerrain(width, height, colors, power);
  if (visualMode.value === "constellation") drawConstellation(width, height, colors, power);
  if (visualMode.value === "vortex") drawVortex(width, height, colors, power);
  ctx.restore();

  animationFrame = requestAnimationFrame(draw);
}

async function startVisualisation(event) {
  event.preventDefault();
  errorMessage.textContent = "";
  const sourceType = selectedSource();

  if (sourceType === "file" && !selectedFile) {
    setError(t("noFile"));
    return;
  }

  setLoading(true);

  try {
    await connectSource(sourceType);
    resizeCanvas();
    document.body.classList.add("is-live");
    setupScreen.classList.add("is-hidden");
    liveScreen.classList.add("is-visible");
    liveScreen.setAttribute("aria-hidden", "false");
    setLoading(false);
    lastFrame = performance.now();
    animationFrame = requestAnimationFrame(draw);
  } catch (error) {
    cleanupAudio();
    if (error.message === "NO_FILE") {
      setError(t("noFile"));
    } else if (error.message === "NO_SYSTEM_AUDIO") {
      setError(t("noSystemAudio"));
    } else if (error.name === "NotAllowedError") {
      setError(t("audioBlocked"));
    } else if (error.name === "NotReadableError") {
      setError(t("audioBusy"));
    } else {
      console.error(error);
      setError(`${t("audioUnknown")} (${error.name || "unknown error"}).`);
    }
  }
}

function cleanupAudio() {
  cancelAnimationFrame(animationFrame);
  mediaStream?.getTracks().forEach((track) => track.stop());
  mediaStream = null;
  if (sourceNode) {
    try {
      sourceNode.disconnect();
    } catch {
      // The source may already be disconnected by the browser.
    }
  }
  sourceNode = null;
  audioPlayer.pause();
  if (audioPlayer.src) {
    URL.revokeObjectURL(audioPlayer.src);
    audioPlayer.removeAttribute("src");
    audioPlayer.load();
  }
  analyser = null;
  dataArray = null;
  timeArray = null;
  smoothBass = 0;
  smoothMid = 0;
  smoothHigh = 0;
  particles = [];
  terrainHistory = [];
  beatEnergy = 0;
  beatKick = 0;
}

function returnToSetup() {
  cleanupAudio();
  document.body.classList.remove("is-live");
  setupScreen.classList.remove("is-hidden");
  liveScreen.classList.remove("is-visible", "is-paused");
  liveScreen.setAttribute("aria-hidden", "true");
  isPaused = false;
  pauseText.textContent = "PAUSE";
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

async function togglePause() {
  isPaused = !isPaused;
  liveScreen.classList.toggle("is-paused", isPaused);
  pauseText.textContent = isPaused ? "PLAY" : "PAUSE";

  if (selectedSource() === "file") {
    if (isPaused) audioPlayer.pause();
    else await audioPlayer.play();
  } else if (audioContext) {
    if (isPaused) await audioContext.suspend();
    else await audioContext.resume();
  }
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch (error) {
    console.error("Fullscreen is not available:", error);
  }
}

controlPanel.addEventListener("submit", startVisualisation);
controlPanel.addEventListener("change", (event) => {
  if (event.target.name === "source") updateSourceUI();
});
filePicker.addEventListener("click", () => audioFile.click());
audioFile.addEventListener("change", () => {
  selectedFile = audioFile.files[0];
  fileName.textContent = selectedFile?.name ?? t("chooseFile");
});
languageSelect.addEventListener("change", () => applyLanguage(languageSelect.value));
intensity.addEventListener("input", updateRange);
reactivity.addEventListener("input", updateAdvancedRanges);
motion.addEventListener("input", updateAdvancedRanges);
trail.addEventListener("input", updateAdvancedRanges);
detail.addEventListener("input", updateAdvancedRanges);
visualMode.addEventListener("change", () => {
  particles = [];
  terrainHistory = [];
  updateModeName();
});
palette.addEventListener("change", updateModeName);
presetButtons.forEach((button) => button.addEventListener("click", () => applyPreset(button.dataset.preset)));
shuffleButton.addEventListener("click", cycleScene);
pauseButton.addEventListener("click", togglePause);
backButton.addEventListener("click", returnToSetup);
fullscreenButton.addEventListener("click", toggleFullscreen);
window.addEventListener("resize", resizeCanvas);
window.addEventListener("beforeunload", cleanupAudio);

resizeCanvas();
applyLanguage("en");
updateRange();
updateAdvancedRanges();
updateModeName();
updateSourceUI();
