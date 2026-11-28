(() => {
  const canvas = document.getElementById('sceneCanvas');
  const ctx = canvas.getContext('2d');

  // Audio elements
  const bgMusic = document.getElementById('bgMusic');
  const customAudioInput = document.getElementById('customAudioInput');
  const btnAudio = document.getElementById('btnAudio');
  const volumeSlider = document.getElementById('volumeSlider');
  const btnPickSong = document.getElementById('btnPickSong');

  // UI elements
  const topHint = document.getElementById('topHint');
  const bottomBar = document.getElementById('bottomBar');
  const toastMsg = document.getElementById('toastMsg');
  const valWind = document.getElementById('valWind');
  const valSnow = document.getElementById('valSnow');
  const valFire = document.getElementById('valFire');
  const valSpeed = document.getElementById('valSpeed');

  const btnWindDown = document.getElementById('btnWindDown');
  const btnWindUp = document.getElementById('btnWindUp');
  const btnSnowDown = document.getElementById('btnSnowDown');
  const btnSnowUp = document.getElementById('btnSnowUp');
  const btnFireDown = document.getElementById('btnFireDown');
  const btnFireUp = document.getElementById('btnFireUp');
  const btnAurora = document.getElementById('btnAurora');
  const btnFireflies = document.getElementById('btnFireflies');
  const btnStoke = document.getElementById('btnStoke');
  const btnMeteor = document.getElementById('btnMeteor');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const btnPause = document.getElementById('btnPause');

  // Simulation state (matching screenshot defaults)
  const state = {
    wind: 0.8,
    snow: 1.1,
    fire: 1.2,
    speed: 1.0,
    aurora: true,
    fireflies: true,
    paused: false,
    uiHidden: false,
    musicPlaying: false,
    stokeBoost: 0,
    beatEnergy: 0,
    time: 0
  };

  let width = 0;
  let height = 0;
  let dpr = 1;

  // Dense ASCII grid metrics matching the screenshot's lush pine forest texture
  const CHAR_W = 7.6;
  const CHAR_H = 13.5;
  let cols = 0;
  let rows = 0;

  // Scene entities
  let stars = [];
  let meteors = [];
  let snowflakes = [];
  let embers = [];
  let treeSnowDust = [];
  let fireflies = [];
  let fireSmoke = [];
  let trees = [];

  let toastTimer = null;
  function showToast(text) {
    toastMsg.textContent = text;
    toastMsg.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMsg.classList.add('hidden');
    }, 3200);
  }

  // Audio playback setup
  bgMusic.volume = parseFloat(volumeSlider.value);

  function updateAudioStatusUI() {
    if (state.musicPlaying) {
      btnAudio.textContent = 'Âm thanh: Bật 🎵';
      btnAudio.classList.add('music-on');
    } else {
      btnAudio.textContent = 'Âm thanh: Tắt';
      btnAudio.classList.remove('music-on');
    }
  }

  bgMusic.addEventListener('play', () => {
    state.musicPlaying = true;
    updateAudioStatusUI();
  });

  bgMusic.addEventListener('pause', () => {
    state.musicPlaying = false;
    updateAudioStatusUI();
  });

  bgMusic.addEventListener('error', () => {
    showToast('Không tìm thấy file last-christmas.mp3 — hãy bấm nút 🎵 để chọn nhạc!');
  });

  function toggleMusic() {
    if (!bgMusic.paused) {
      bgMusic.pause();
    } else {
      bgMusic.volume = parseFloat(volumeSlider.value);
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            state.musicPlaying = true;
            updateAudioStatusUI();
            showToast('Đang phát: Last Christmas 🎄');
          })
          .catch((err) => {
            console.warn('Audio play error:', err);
            showToast('Không thể tự phát nhạc — hãy bấm lại nút Âm thanh hoặc chọn file 🎵');
          });
      }
    }
  }

  volumeSlider.addEventListener('input', (e) => {
    bgMusic.volume = parseFloat(e.target.value);
  });

  btnPickSong.addEventListener('click', () => {
    customAudioInput.click();
  });

  customAudioInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    bgMusic.src = url;
    bgMusic.play()
      .then(() => showToast(`Đang phát: ${file.name}`))
      .catch((err) => console.warn(err));
  });

  function updateHUD() {
    valWind.textContent = state.wind.toFixed(1);
    valSnow.textContent = state.snow.toFixed(1);
    valFire.textContent = state.fire.toFixed(1);
    valSpeed.textContent = state.speed.toFixed(2);
  }

  // Resize & Scene Initialization
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cols = Math.ceil(width / CHAR_W) + 2;
    rows = Math.ceil(height / CHAR_H) + 1;

    buildStars();
    buildDensePineForest();
    buildSnowflakes();
    buildFireflies();
  }

  function buildStars() {
    stars = [];
    const count = Math.floor((width * height * 0.52) / 3000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.56),
        r: Math.random() < 0.14 ? 2.1 : (Math.random() * 1.15 + 0.45),
        baseAlpha: Math.random() * 0.65 + 0.25,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 2.2 + 0.8,
        cross: Math.random() < 0.08
      });
    }
  }

  // Build lush, multi-tiered overlapping ASCII pine trees just like the reference image
  function buildDensePineForest() {
    trees = [];

    // 3 depth layers (0: far tall ridge trees, 1: mid forest, 2: foreground trees)
    const layers = [
      { depth: 0, baseRowRatio: 0.76, minH: 15, maxH: 22, step: 0.017 },
      { depth: 1, baseRowRatio: 0.86, minH: 16, maxH: 24, step: 0.016 },
      { depth: 2, baseRowRatio: 0.96, minH: 15, maxH: 23, step: 0.017 }
    ];

    function populateSide(startRatio, endRatio) {
      layers.forEach((layer) => {
        for (let r = startRatio; r <= endRatio; r += layer.step) {
          const jitter = (Math.random() - 0.5) * layer.step * 0.9;
          const posRatio = Math.max(0.005, Math.min(0.995, r + jitter));
          const col = Math.floor(posRatio * cols);
          const treeHeight =
            layer.minH + Math.floor(Math.random() * (layer.maxH - layer.minH + 1));
          const baseRow = Math.min(
            rows - 2,
            Math.floor(rows * layer.baseRowRatio + (Math.random() - 0.5) * 4)
          );
          const tiers = 3 + Math.floor(Math.random() * 2); // 3 to 4 layered pine bough tiers

          trees.push({
            col,
            baseRow,
            height: treeHeight,
            tiers,
            depth: layer.depth,
            swayPhase: Math.random() * Math.PI * 2,
            swayFreq: 1.3 + Math.random() * 0.85,
            flexibility: 0.7 + Math.random() * 0.6,
            seed: Math.floor(Math.random() * 97)
          });
        }
      });
    }

    // Left forest (0% .. 40.5%) & Right forest (56.5% .. 100%) framing the central campfire clearing
    populateSide(0.005, 0.405);
    populateSide(0.565, 0.995);

    // Paint back-to-front so nearer trees cleanly overlap background trees
    trees.sort((a, b) => a.baseRow - b.baseRow);
  }

  function buildSnowflakes() {
    snowflakes = [];
    const targetCount = Math.floor(170 * state.snow);
    const glyphs = ['*', '+', '.', '·', '•'];
    for (let i = 0; i < targetCount; i++) {
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vy: Math.random() * 34 + 20,
        driftPhase: Math.random() * Math.PI * 2,
        size: Math.random() < 0.22 ? 12 : 10,
        glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
        alpha: Math.random() * 0.55 + 0.35
      });
    }
  }

  function buildFireflies() {
    fireflies = [];
    const count = 22;
    for (let i = 0; i < count; i++) {
      fireflies.push({
        x: width * (0.1 + Math.random() * 0.8),
        y: height * (0.48 + Math.random() * 0.42),
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 9,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.65 ? 42 : 145
      });
    }
  }

  function spawnMeteor(targetX, targetY) {
    const startX = targetX !== undefined
      ? targetX - (180 + Math.random() * 140)
      : width * (0.1 + Math.random() * 0.65);
    const startY = targetY !== undefined
      ? Math.max(20, targetY - (90 + Math.random() * 80))
      : height * (0.05 + Math.random() * 0.22);

    const angle = (22 + Math.random() * 14) * (Math.PI / 180);
    const speed = 680 + Math.random() * 280;
    meteors.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      len: 110 + Math.random() * 70,
      life: 1.0
    });
  }

  function stokeCampfire() {
    state.stokeBoost = Math.min(2.2, state.stokeBoost + 1.15);
    const fireX = width * 0.485;
    const fireY = height * 0.895;
    const burst = Math.floor(28 + state.fire * 10);
    for (let i = 0; i < burst; i++) {
      embers.push({
        x: fireX + (Math.random() - 0.5) * 48,
        y: fireY - Math.random() * 18,
        vx: (Math.random() - 0.5) * 55 + state.wind * 12,
        vy: -(55 + Math.random() * 115),
        life: 1.0,
        decay: 0.45 + Math.random() * 0.55,
        char: Math.random() < 0.5 ? '*' : (Math.random() < 0.5 ? '·' : "'")
      });
    }
  }

  // Sky, Aurora, Crescent Moon, Shooting Stars
  function drawSkyAndAurora(t) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.72);
    skyGrad.addColorStop(0, '#03060f');
    skyGrad.addColorStop(0.45, '#071022');
    skyGrad.addColorStop(1, '#0d1a33');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    if (state.aurora) {
      const beatBoost = state.beatEnergy * 0.14;
      const ribbons = [
        {
          yBase: height * 0.21,
          amp: 34,
          freq: 0.0032,
          speed: 0.42,
          thick: 95,
          c1: `rgba(16, 185, 129, ${0.15 + beatBoost})`,
          c2: `rgba(45, 212, 191, ${0.07 + beatBoost * 0.5})`
        },
        {
          yBase: height * 0.27,
          amp: 28,
          freq: 0.0044,
          speed: -0.31,
          thick: 80,
          c1: `rgba(99, 102, 241, ${0.12 + beatBoost * 0.7})`,
          c2: `rgba(16, 185, 129, ${0.06 + beatBoost * 0.4})`
        }
      ];

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ribbons.forEach((rb) => {
        const grad = ctx.createLinearGradient(0, rb.yBase - rb.thick, 0, rb.yBase + rb.thick);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(0.45, rb.c1);
        grad.addColorStop(0.75, rb.c2);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, rb.yBase + rb.thick);
        for (let x = 0; x <= width; x += 24) {
          const wave =
            Math.sin(x * rb.freq + t * rb.speed) * rb.amp +
            Math.cos(x * rb.freq * 1.9 - t * rb.speed * 0.7) * (rb.amp * 0.45);
          ctx.lineTo(x, rb.yBase + wave - rb.thick * 0.4);
        }
        for (let x = width; x >= 0; x -= 24) {
          const wave =
            Math.sin(x * rb.freq + t * rb.speed) * rb.amp +
            Math.cos(x * rb.freq * 1.9 - t * rb.speed * 0.7) * (rb.amp * 0.45);
          ctx.lineTo(x, rb.yBase + wave + rb.thick * 0.65);
        }
        ctx.closePath();
        ctx.fill();
      });
      ctx.restore();
    }

    // Stars
    stars.forEach((s) => {
      const twinkle = 0.55 + 0.45 * Math.sin(t * s.speed + s.phase);
      const alpha = s.baseAlpha * twinkle;
      ctx.fillStyle = `rgba(226, 238, 255, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      if (s.cross && alpha > 0.65) {
        ctx.strokeStyle = `rgba(226, 238, 255, ${(alpha * 0.5).toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(s.x - 4, s.y);
        ctx.lineTo(s.x + 4, s.y);
        ctx.moveTo(s.x, s.y - 4);
        ctx.lineTo(s.x, s.y + 4);
        ctx.stroke();
      }
    });

    // Crescent Moon (Upper Right)
    const moonX = width * 0.785;
    const moonY = height * 0.22;
    const moonR = Math.max(15, Math.min(22, width * 0.014));

    const moonHalo = ctx.createRadialGradient(moonX, moonY, moonR * 0.4, moonX, moonY, moonR * 3.8);
    moonHalo.addColorStop(0, 'rgba(226, 232, 240, 0.22)');
    moonHalo.addColorStop(0.5, 'rgba(148, 163, 184, 0.06)');
    moonHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = moonHalo;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR * 3.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
    ctx.fillStyle = '#f1f5f9';
    ctx.fill();

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(moonX - moonR * 0.38, moonY - moonR * 0.14, moonR * 0.86, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Shooting stars
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      const mag = Math.hypot(m.vx, m.vy);
      const tailX = m.x - (m.vx / mag) * m.len;
      const tailY = m.y - (m.vy / mag) * m.len;

      const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${m.life})`);
      grad.addColorStop(0.35, `rgba(186, 230, 253, ${m.life * 0.55})`);
      grad.addColorStop(1, 'rgba(186, 230, 253, 0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      ctx.fillStyle = `rgba(255, 255, 255, ${m.life})`;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function getFireLight(c, r, fireCol, fireRow, lightRadiusCols) {
    const dx = (c - fireCol) * 0.68;
    const dy = (r - fireRow) * 1.18;
    const dist = Math.hypot(dx, dy);
    if (dist > lightRadiusCols) return 0;
    const norm = 1 - dist / lightRadiusCols;
    return norm * norm;
  }

  function blendWarmCool(warmFactor, coolRGB, warmRGB, alpha = 1) {
    const w = Math.min(1, Math.max(0, warmFactor));
    const r = Math.round(coolRGB[0] + (warmRGB[0] - coolRGB[0]) * w);
    const g = Math.round(coolRGB[1] + (warmRGB[1] - coolRGB[1]) * w);
    const b = Math.round(coolRGB[2] + (warmRGB[2] - coolRGB[2]) * w);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Full ASCII Winter Clearing & Lush Multi-Tiered Animated Pine Forest (No Cabin)
  function drawAsciiLandscape(t) {
    ctx.font = '11.5px "JetBrains Mono", "Fira Code", "Consolas", "Courier New", monospace';
    ctx.textBaseline = 'top';

    const fireCol = Math.floor(cols * 0.485);
    const fireRow = Math.floor(rows * 0.905);
    const flicker =
      Math.sin(t * 11) * 0.08 +
      Math.cos(t * 17.3) * 0.06 +
      state.beatEnergy * 0.25;
    const effectiveFire = Math.max(0.3, state.fire + state.stokeBoost + flicker);
    const lightRadiusCols = 28 + effectiveFire * 18;

    // Ambient warm radial glow around campfire illuminating inner forest edges
    const firePxX = fireCol * CHAR_W;
    const firePxY = fireRow * CHAR_H;
    const glowPxR = lightRadiusCols * CHAR_W * 1.3;

    const bgGlow = ctx.createRadialGradient(firePxX, firePxY, 8, firePxX, firePxY, glowPxR);
    bgGlow.addColorStop(0, `rgba(249, 115, 22, ${Math.min(0.36, 0.14 * effectiveFire)})`);
    bgGlow.addColorStop(0.45, `rgba(217, 119, 6, ${Math.min(0.16, 0.06 * effectiveFire)})`);
    bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = bgGlow;
    ctx.fillRect(0, height * 0.42, width, height * 0.58);

    // Subtle rising smoke plume glow above campfire
    const smokeGrad = ctx.createRadialGradient(
      firePxX + state.wind * 18,
      firePxY - 125,
      10,
      firePxX + state.wind * 28,
      firePxY - 135,
      115
    );
    smokeGrad.addColorStop(0, 'rgba(148, 163, 184, 0.13)');
    smokeGrad.addColorStop(1, 'rgba(148, 163, 184, 0)');
    ctx.fillStyle = smokeGrad;
    ctx.fillRect(firePxX - 140, firePxY - 260, 300, 260);

    // Build 2D ASCII buffer
    const gridChar = Array.from({ length: rows }, () => new Array(cols).fill(''));
    const gridColor = Array.from({ length: rows }, () => new Array(cols).fill(''));

    function setCell(c, r, ch, color) {
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        gridChar[r][c] = ch;
        gridColor[r][c] = color;
      }
    }

    // 1. Clearing snowfield & horizon texture between the left and right forests
    const groundStartRow = Math.floor(rows * 0.56);
    const groundChars = ['.', '-', '~', '_', ':', '.', '=', '-'];
    const windShift = Math.floor(t * state.wind * 2.0);
    for (let r = groundStartRow; r < rows - 1; r++) {
      for (let c = 0; c < cols; c++) {
        const hash = ((c + (r % 2 === 0 ? windShift : 0)) * 17 + r * 31) % 11;
        if (Math.abs(hash) < 7) {
          const ch = groundChars[Math.abs(c + r * 3) % groundChars.length];
          const warm = getFireLight(c, r, fireCol, fireRow, lightRadiusCols * 1.15);
          const colStr = blendWarmCool(warm * 1.3, [54, 72, 104], [251, 182, 76], 0.78);
          setCell(c, r, ch, colStr);
        }
      }
    }

    // 2. Lush Multi-Tiered Animated ASCII Pine Trees (matching the reference screenshot)
    const innerGlyphs = ['^', '*', '~', 'x', '+', '^', '*', '~', 'o', 'X'];
    trees.forEach((tr) => {
      // Travelling wind wave + steady wind lean
      const travellingGust =
        Math.sin(t * tr.swayFreq - tr.col * 0.085 + tr.swayPhase) * 0.7 +
        Math.sin(t * 0.7 - tr.col * 0.035) * 0.3;
      const steadyLean = state.wind * 0.5;
      const maxTopSway =
        (steadyLean + travellingGust * Math.max(0.45, Math.abs(state.wind) * 0.9)) *
        tr.flexibility;

      const trunkRows = 2;
      const crownRows = tr.height - trunkRows;
      const depthShade = tr.depth === 0 ? 0.82 : (tr.depth === 1 ? 0.92 : 1.0);
      const coolEdge = [
        Math.round(92 * depthShade),
        Math.round(116 * depthShade),
        Math.round(150 * depthShade)
      ];
      const coolFill = [
        Math.round(58 * depthShade),
        Math.round(76 * depthShade),
        Math.round(108 * depthShade)
      ];

      // Draw tiered evergreen pine crown (stacked widening triangular tiers)
      for (let i = 0; i < crownRows; i++) {
        const r = tr.baseRow - tr.height + i;
        const progress = i / crownRows; // 0 at top tip, 1 at lowest bough
        const bendFactor = Math.pow(1 - progress, 1.4);
        const rowSway = Math.round(maxTopSway * bendFactor);
        const centerC = tr.col + rowSway;

        // Tiered pine silhouette: widens overall while stepping in/out per tier
        const tierPos = (progress * tr.tiers) % 1; // 0..1 inside current branch tier
        const baseWidth = progress * (tr.height * 0.36);
        const tierFlare = tierPos * 1.9;
        const halfW = Math.floor(baseWidth + tierFlare);

        if (i === 0 || halfW <= 0) {
          const warm = getFireLight(centerC, r, fireCol, fireRow, lightRadiusCols);
          const tipChar = Math.abs(maxTopSway) > 1.3 ? (maxTopSway > 0 ? '/' : '\\') : '^';
          setCell(
            centerC,
            r,
            tipChar,
            blendWarmCool(warm * 1.15, coolEdge, [253, 186, 116], 0.95)
          );
        } else {
          const leftC = centerC - halfW;
          const rightC = centerC + halfW;
          const warmL = getFireLight(leftC, r, fireCol, fireRow, lightRadiusCols);
          const warmR = getFireLight(rightC, r, fireCol, fireRow, lightRadiusCols);

          setCell(leftC, r, '/', blendWarmCool(warmL * 1.15, coolEdge, [251, 165, 68], 0.94));
          setCell(rightC, r, '\\', blendWarmCool(warmR * 1.15, coolEdge, [251, 165, 68], 0.94));

          // Needle shimmer driven by wind speed
          const rustleOffset = Math.floor(
            t * (2.2 + Math.abs(state.wind) * 2.4) + tr.swayPhase * 3
          );
          const isTierBottom = tierPos > 0.84 && i < crownRows - 1;

          for (let x = leftC + 1; x < rightC; x++) {
            const warm = getFireLight(x, r, fireCol, fireRow, lightRadiusCols);
            let ch;
            if (x === centerC && i % 3 === 1) {
              ch = '|';
            } else if (isTierBottom) {
              ch = (x + i) % 2 === 0 ? '_' : '~';
            } else {
              ch = innerGlyphs[Math.abs(x * 7 + i * 11 + tr.seed + rustleOffset) % innerGlyphs.length];
            }
            setCell(x, r, ch, blendWarmCool(warm * 1.1, coolFill, [234, 142, 48], 0.9));
          }
        }
      }

      // Trunk at bottom of tree
      for (let k = 0; k < trunkRows; k++) {
        const r = tr.baseRow - trunkRows + k;
        const warm = getFireLight(tr.col, r, fireCol, fireRow, lightRadiusCols);
        setCell(tr.col, r, '|', blendWarmCool(warm, [58, 66, 86], [180, 95, 36], 0.92));
      }
    });

    // 3. Campfire ASCII Logs & Dynamic Flames in central clearing
    const logLines = [
      '   _.-====-._   ',
      ' //==XXXXXX==\\\\ '
    ];
    logLines.forEach((line, idx) => {
      const r = fireRow + idx;
      const startC = fireCol - Math.floor(line.length / 2);
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === ' ') continue;
        const isCoal = ch === 'X' || ch === '=';
        setCell(startC + i, r, ch, isCoal ? '#fb923c' : '#9a3412');
      }
    });

    const flameHeight = Math.min(11, Math.max(4, Math.round(4 + effectiveFire * 2.5)));
    const flameGlyphs = ['^', '*', '~', '(', ')', '@', '&', 'W'];
    for (let h = 0; h < flameHeight; h++) {
      const r = fireRow - 1 - h;
      const progress = h / flameHeight;
      const halfSpan = Math.max(0, Math.round((1 - progress) * (2.6 + effectiveFire * 1.1)));
      const windLean = Math.round(
        Math.sin(t * 7 + h * 0.9) * 0.8 + progress * state.wind * 0.85
      );

      for (let dx = -halfSpan; dx <= halfSpan; dx++) {
        if (Math.random() < 0.16 && h > 1) continue;
        const c = fireCol + dx + windLean;
        const ch =
          h === flameHeight - 1
            ? '^'
            : flameGlyphs[Math.floor((Math.sin(t * 14 + c * 3 + r * 5) + 1) * 3.99)];

        let color = '#fef08a';
        if (progress > 0.65 || Math.abs(dx) === halfSpan) {
          color = '#ef4444';
        } else if (progress > 0.32 || Math.abs(dx) >= halfSpan - 1) {
          color = '#f97316';
        }
        setCell(c, r, ch, color);
      }
    }

    fireSmoke.forEach((sm) => {
      const sc = Math.round(sm.x / CHAR_W);
      const sr = Math.round(sm.y / CHAR_H);
      setCell(sc, sr, sm.char, `rgba(148, 163, 184, ${(sm.life * 0.45).toFixed(2)})`);
    });

    // Render entire ASCII grid
    for (let r = 0; r < rows; r++) {
      const py = r * CHAR_H;
      for (let c = 0; c < cols; c++) {
        const ch = gridChar[r][c];
        if (!ch) continue;
        ctx.fillStyle = gridColor[r][c];
        ctx.fillText(ch, c * CHAR_W, py);
      }
    }
  }

  // Embers, Tree Snow Dust, Snowflakes & Fireflies
  function drawParticles(t) {
    // Campfire Embers
    embers.forEach((em) => {
      ctx.fillStyle = `rgba(253, 186, 116, ${em.life.toFixed(2)})`;
      ctx.font = 'bold 12px monospace';
      ctx.fillText(em.char, em.x, em.y);
    });

    // Snow dust shaken loose from swaying pine branches
    treeSnowDust.forEach((sd) => {
      ctx.fillStyle = `rgba(224, 242, 254, ${(sd.life * 0.72).toFixed(2)})`;
      ctx.font = '10px monospace';
      ctx.fillText('.', sd.x, sd.y);
    });

    // Winter Fireflies
    if (state.fireflies) {
      fireflies.forEach((ff) => {
        const pulse = 0.35 + 0.65 * Math.sin(t * 2.6 + ff.phase);
        const rad = 6 + pulse * 6;
        const g = ctx.createRadialGradient(ff.x, ff.y, 0.5, ff.x, ff.y, rad);
        g.addColorStop(0, `hsla(${ff.hue}, 95%, 75%, ${pulse})`);
        g.addColorStop(0.4, `hsla(${ff.hue}, 90%, 55%, ${pulse * 0.45})`);
        g.addColorStop(1, `hsla(${ff.hue}, 90%, 50%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(ff.x, ff.y, rad, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Falling ASCII Snow
    snowflakes.forEach((sf) => {
      ctx.fillStyle = `rgba(226, 240, 255, ${sf.alpha.toFixed(2)})`;
      ctx.font = `${sf.size}px monospace`;
      ctx.fillText(sf.glyph, sf.x, sf.y);
    });
  }

  // Simulation update step
  function update(dt) {
    const scaledDt = dt * state.speed;
    state.time += scaledDt;
    const t = state.time;

    // Rhythmic beat pulse when music is playing
    if (state.musicPlaying && !bgMusic.paused) {
      const beatPhase = bgMusic.currentTime * 1.8 * Math.PI * 2;
      const rawPulse = Math.pow(Math.max(0, Math.sin(beatPhase)), 3);
      state.beatEnergy += (rawPulse * 0.65 - state.beatEnergy) * 0.25;
    } else {
      state.beatEnergy *= 0.9;
    }

    if (state.stokeBoost > 0) {
      state.stokeBoost = Math.max(0, state.stokeBoost - scaledDt * 0.38);
    }

    // Random ambient meteors
    if (Math.random() < scaledDt * 0.22) {
      spawnMeteor();
    }

    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.x += m.vx * scaledDt;
      m.y += m.vy * scaledDt;
      m.life -= scaledDt * 0.85;
      if (m.life <= 0 || m.x > width + 150 || m.y > height * 0.72) {
        meteors.splice(i, 1);
      }
    }

    // Spawn continuous campfire embers
    const emberRate = (6 + state.fire * 6 + state.stokeBoost * 14) * scaledDt;
    if (Math.random() < emberRate) {
      const fireX = width * 0.485;
      const fireY = height * 0.89;
      embers.push({
        x: fireX + (Math.random() - 0.5) * 32,
        y: fireY - 12,
        vx: (Math.random() - 0.5) * 20 + state.wind * 14,
        vy: -(32 + Math.random() * 55 + state.fire * 10),
        life: 1.0,
        decay: 0.35 + Math.random() * 0.35,
        char: Math.random() < 0.55 ? '·' : '*'
      });
    }

    for (let i = embers.length - 1; i >= 0; i--) {
      const em = embers[i];
      em.x += (em.vx + Math.sin(t * 4 + i) * 10) * scaledDt;
      em.y += em.vy * scaledDt;
      em.life -= em.decay * scaledDt;
      if (em.life <= 0) embers.splice(i, 1);
    }

    // Snow dust shedding off swaying pine trees
    if (
      trees.length > 0 &&
      Math.abs(state.wind) > 0.5 &&
      Math.random() < scaledDt * Math.abs(state.wind) * 6
    ) {
      const tr = trees[Math.floor(Math.random() * trees.length)];
      treeSnowDust.push({
        x: tr.col * CHAR_W + (Math.random() - 0.5) * 28,
        y: (tr.baseRow - tr.height * 0.55) * CHAR_H,
        vx: state.wind * 22 + (Math.random() - 0.5) * 12,
        vy: 18 + Math.random() * 22,
        life: 1.0
      });
    }

    for (let i = treeSnowDust.length - 1; i >= 0; i--) {
      const sd = treeSnowDust[i];
      sd.x += sd.vx * scaledDt;
      sd.y += sd.vy * scaledDt;
      sd.life -= scaledDt * 0.65;
      if (sd.life <= 0) treeSnowDust.splice(i, 1);
    }

    // Spawn campfire smoke
    if (Math.random() < scaledDt * 7) {
      const fireX = width * 0.485;
      const fireY = height * 0.83;
      fireSmoke.push({
        x: fireX + (Math.random() - 0.5) * 20,
        y: fireY,
        vx: state.wind * 16 + (Math.random() - 0.5) * 8,
        vy: -(24 + Math.random() * 18),
        life: 1.0,
        char: Math.random() < 0.5 ? '~' : '.'
      });
    }

    for (let i = fireSmoke.length - 1; i >= 0; i--) {
      const sm = fireSmoke[i];
      sm.x += (sm.vx + Math.sin(t * 2 + i) * 6) * scaledDt;
      sm.y += sm.vy * scaledDt;
      sm.life -= scaledDt * 0.28;
      if (sm.life <= 0) fireSmoke.splice(i, 1);
    }

    // Update Snowflakes
    const targetSnowCount = Math.floor(170 * state.snow);
    while (snowflakes.length < targetSnowCount) {
      const glyphs = ['*', '+', '.', '·', '•'];
      snowflakes.push({
        x: Math.random() * width,
        y: -10,
        vy: Math.random() * 34 + 20,
        driftPhase: Math.random() * Math.PI * 2,
        size: Math.random() < 0.22 ? 12 : 10,
        glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
        alpha: Math.random() * 0.55 + 0.35
      });
    }
    if (snowflakes.length > targetSnowCount) {
      snowflakes.length = targetSnowCount;
    }

    snowflakes.forEach((sf) => {
      const windPush = state.wind * 26;
      const flutter = Math.sin(t * 1.8 + sf.driftPhase) * 14;
      sf.x += (windPush + flutter) * scaledDt;
      sf.y += sf.vy * (0.7 + state.snow * 0.25) * scaledDt;

      if (sf.y > height + 10) {
        sf.y = -10;
        sf.x = Math.random() * width;
      }
      if (sf.x > width + 20) sf.x = -15;
      if (sf.x < -20) sf.x = width + 15;
    });

    // Update Fireflies
    if (state.fireflies) {
      fireflies.forEach((ff) => {
        ff.x += (ff.vx + Math.sin(t + ff.phase) * 8 + state.wind * 3) * scaledDt;
        ff.y += (ff.vy + Math.cos(t * 1.3 + ff.phase) * 6) * scaledDt;
        if (ff.x < 20) ff.x = width - 20;
        if (ff.x > width - 20) ff.x = 20;
        if (ff.y < height * 0.42) ff.y = height * 0.88;
        if (ff.y > height * 0.92) ff.y = height * 0.46;
      });
    }
  }

  // Main Animation Loop
  let lastTs = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - lastTs) / 1000);
    lastTs = now;

    if (!state.paused) {
      update(dt);
    }

    drawSkyAndAurora(state.time);
    drawAsciiLandscape(state.time);
    drawParticles(state.time);

    requestAnimationFrame(loop);
  }

  // Canvas interactions
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const firePxX = width * 0.485;
    const firePxY = height * 0.89;

    if (Math.hypot(cx - firePxX, cy - firePxY) < 140 || cy > height * 0.72) {
      stokeCampfire();
    } else {
      spawnMeteor(cx, cy);
    }
  });

  // Control Bar Buttons
  btnWindDown.addEventListener('click', () => {
    state.wind = Math.max(-3.0, +(state.wind - 0.3).toFixed(1));
    updateHUD();
  });
  btnWindUp.addEventListener('click', () => {
    state.wind = Math.min(4.5, +(state.wind + 0.3).toFixed(1));
    updateHUD();
  });

  btnSnowDown.addEventListener('click', () => {
    state.snow = Math.max(0.0, +(state.snow - 0.2).toFixed(1));
    updateHUD();
  });
  btnSnowUp.addEventListener('click', () => {
    state.snow = Math.min(3.5, +(state.snow + 0.2).toFixed(1));
    updateHUD();
  });

  btnFireDown.addEventListener('click', () => {
    state.fire = Math.max(0.4, +(state.fire - 0.2).toFixed(1));
    updateHUD();
  });
  btnFireUp.addEventListener('click', () => {
    state.fire = Math.min(2.8, +(state.fire + 0.2).toFixed(1));
    updateHUD();
  });

  btnAurora.addEventListener('click', () => {
    state.aurora = !state.aurora;
    btnAurora.classList.toggle('active', state.aurora);
  });

  btnFireflies.addEventListener('click', () => {
    state.fireflies = !state.fireflies;
    btnFireflies.classList.toggle('active', state.fireflies);
  });

  btnStoke.addEventListener('click', () => {
    stokeCampfire();
  });

  btnMeteor.addEventListener('click', () => {
    spawnMeteor();
  });

  btnAudio.addEventListener('click', () => {
    toggleMusic();
  });

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Không thể bật toàn màn hình:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  btnFullscreen.addEventListener('click', toggleFullscreen);

  document.addEventListener('fullscreenchange', () => {
    const isFs = !!document.fullscreenElement;
    btnFullscreen.textContent = isFs ? 'Thoát toàn màn hình' : 'Toàn màn hình';
    btnFullscreen.classList.toggle('active', isFs);
  });

  btnPause.addEventListener('click', () => {
    state.paused = !state.paused;
    btnPause.textContent = state.paused ? 'Tiếp tục' : 'Tạm dừng';
    btnPause.classList.toggle('active', state.paused);
  });

  // Keyboard shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      stokeCampfire();
    } else if (e.key === 'h' || e.key === 'H') {
      state.uiHidden = !state.uiHidden;
      topHint.classList.toggle('hidden', state.uiHidden);
      bottomBar.classList.toggle('hidden', state.uiHidden);
    } else if (e.key === 'f' || e.key === 'F') {
      toggleFullscreen();
    } else if (e.key === 'm' || e.key === 'M') {
      toggleMusic();
    } else if (e.key === 'p' || e.key === 'P') {
      btnPause.click();
    }
  });

  window.addEventListener('resize', resize);

  // Boot
  resize();
  updateHUD();
  requestAnimationFrame(loop);
})();
