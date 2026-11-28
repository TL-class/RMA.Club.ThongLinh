/**
 * ASCIIquarium Deluxe — High-DPI ASCII Canvas Engine & Ecosystem Simulator
 */

(function () {
  const canvas = document.getElementById('aquariumCanvas');
  const ctx = canvas.getContext('2d');

  // State
  let width = 800;
  let height = 500;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let fontSize = 13;
  let charWidth = 7.8;
  let lineHeight = 15;
  let glowEnabled = true;
  let currentTheme = 'ubuntu';

  const creatures = [];
  const bgFish = [];
  const plankton = [];
  const bubbles = [];
  const foods = [];
  const seaweeds = [];
  const corals = [];
  const sparkles = [];
  let chestOpenTimer = 0;

  const THEME_PALETTES = {
    ubuntu: {
      waveTop: '#f472b6',
      waveSub: '#c084fc',
      rayColor: 'rgba(232, 121, 249, 0.05)',
      sandColor: '#d97706',
      seaweedColors: ['#4ade80', '#2dd4bf', '#a3e635'],
      castleColor: '#94a3b8',
      bgSilhouettes: 'rgba(244, 114, 182, 0.14)'
    },
    abyss: {
      waveTop: '#38bdf8',
      waveSub: '#0284c7',
      rayColor: 'rgba(56, 189, 248, 0.065)',
      sandColor: '#1e3a8a',
      seaweedColors: ['#22d3ee', '#34d399', '#818cf8'],
      castleColor: '#475569',
      bgSilhouettes: 'rgba(56, 189, 248, 0.14)'
    },
    reef: {
      waveTop: '#5eead4',
      waveSub: '#2dd4bf',
      rayColor: 'rgba(153, 246, 228, 0.085)',
      sandColor: '#fbbf24',
      seaweedColors: ['#4ade80', '#10b981', '#a3e635'],
      castleColor: '#cbd5e1',
      bgSilhouettes: 'rgba(94, 234, 212, 0.16)'
    },
    crt: {
      waveTop: '#4ade80',
      waveSub: '#22c55e',
      rayColor: 'rgba(74, 222, 128, 0.055)',
      sandColor: '#16a34a',
      seaweedColors: ['#4ade80', '#86efac', '#22c55e'],
      castleColor: '#4ade80',
      bgSilhouettes: 'rgba(74, 222, 128, 0.12)'
    },
    cyber: {
      waveTop: '#e879f9',
      waveSub: '#22d3ee',
      rayColor: 'rgba(217, 70, 239, 0.07)',
      sandColor: '#a855f7',
      seaweedColors: ['#22d3ee', '#f472b6', '#a855f7'],
      castleColor: '#c084fc',
      bgSilhouettes: 'rgba(232, 121, 249, 0.15)'
    }
  };

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = Math.max(320, rect.width || window.innerWidth);
    height = Math.max(240, rect.height || (window.innerHeight - 115));
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    fontSize = width < 640 ? 10 : width < 1100 ? 12 : 13;
    ctx.font = `600 ${fontSize}px "Cascadia Code", "Fira Code", Consolas, monospace`;
    charWidth = ctx.measureText('M').width || 7.8;
    lineHeight = Math.round(fontSize * 1.15);

    rebuildFlora();
  }

  function rebuildFlora() {
    seaweeds.length = 0;
    corals.length = 0;
    bgFish.length = 0;
    plankton.length = 0;

    const palette = THEME_PALETTES[currentTheme];
    const spacing = Math.max(55, Math.floor(width / 16));
    for (let x = 28; x < width - 28; x += spacing + (Math.random() * 25 - 12)) {
      seaweeds.push({
        x,
        segments: 5 + Math.floor(Math.random() * 7),
        phase: Math.random() * Math.PI * 2,
        speed: 0.025 + Math.random() * 0.02,
        color: palette.seaweedColors[Math.floor(Math.random() * palette.seaweedColors.length)]
      });
    }

    const coralGlyphs = [
      { lines: [' \\|/ ', '--*--', ' /|\\ '], color: '#fb7185' },
      { lines: [' (o) ', '/( )\\'], color: '#f472b6' },
      { lines: ['\\^/^/', ' \\|/ '], color: '#fb923c' },
      { lines: [' .*. ', '(o o)'], color: '#c084fc' }
    ];
    for (let i = 0; i < Math.floor(width / 130); i++) {
      const tpl = coralGlyphs[i % coralGlyphs.length];
      corals.push({
        x: 60 + Math.random() * (width - 120),
        tpl
      });
    }

    // Distant background parallax fish silhouettes
    for (let i = 0; i < 14; i++) {
      bgFish.push({
        x: Math.random() * width,
        y: getSurfaceY() + 25 + Math.random() * (getFloorY() - getSurfaceY() - 60),
        dir: Math.random() < 0.5 ? 1 : -1,
        speed: 0.25 + Math.random() * 0.35
      });
    }

    // Floating glowing plankton specks
    for (let i = 0; i < 24; i++) {
      plankton.push({
        x: Math.random() * width,
        y: getSurfaceY() + 15 + Math.random() * (getFloorY() - getSurfaceY() - 30),
        phase: Math.random() * Math.PI * 2,
        glyph: Math.random() < 0.5 ? '.' : '·'
      });
    }
  }

  class SeaCreature {
    constructor(speciesKey, opts = {}) {
      const spec = SPECIES_CATALOG[speciesKey] || SPECIES_CATALOG.neon;
      this.spec = spec;
      this.id = Math.random().toString(36).slice(2);
      this.dir = opts.dir ?? (Math.random() < 0.5 ? 1 : -1);

      const rightFrames = Array.isArray(spec.framesRight) && spec.framesRight.length
        ? spec.framesRight
        : (SPECIES_CATALOG.neon.framesRight || [['?']]);
      const sampleFrame = Array.isArray(rightFrames[0]) ? rightFrames[0] : ['?'];
      this.artRows = sampleFrame.length;
      this.artCols = Math.max(...sampleFrame.map((l) => String(l).length));
      this.pixelW = this.artCols * charWidth;
      this.pixelH = this.artRows * lineHeight;

      const surfaceY = getSurfaceY();
      const floorY = getFloorY();

      if (spec.category === 'surface') {
        this.y = surfaceY - this.pixelH + lineHeight * 0.65;
      } else if (spec.category === 'bottom') {
        this.y = floorY - this.pixelH + 2;
      } else {
        const usableH = Math.max(120, floorY - surfaceY - this.pixelH - 12);
        const minD = spec.depthRange[0];
        const maxD = spec.depthRange[1];
        const depthFrac = minD + Math.random() * (maxD - minD);
        this.y = opts.y ?? (surfaceY + 14 + depthFrac * usableH);
      }

      this.x = opts.x ?? (this.dir === 1 ? -this.pixelW - Math.random() * 140 : width + Math.random() * 140);

      const [minS, maxS] = spec.speedRange;
      this.baseSpeed = minS + Math.random() * (maxS - minS);
      this.vx = this.baseSpeed * this.dir;
      this.vy = 0;

      this.bobPhase = Math.random() * Math.PI * 2;
      this.bobAmp =
        spec.id === 'dolphin'
          ? 0.65
          : spec.id === 'jellyfish'
          ? 0.55
          : spec.category === 'bottom'
          ? 0.02
          : spec.category === 'surface'
          ? 0.14
          : 0.22;
      this.animTimer = Math.random() * 100;
      this.frameIdx = 0;
      this.puffTimer = 0;
      this.tintColor = opts.tintColor || null;
    }

    puffUp() {
      if (this.spec.id === 'pufferfish') {
        this.puffTimer = 180;
        this.frameIdx = 1;
        spawnBubbleBurst(this.x + this.pixelW / 2, this.y + this.pixelH / 2, 6);
        window.oceanAudio.playBubble(0.8);
      }
    }

    update(dt) {
      this.animTimer += dt;

      if (this.spec.id === 'pufferfish') {
        if (this.puffTimer > 0) {
          this.puffTimer--;
          this.frameIdx = 1;
        } else {
          this.frameIdx = 0;
        }
      } else {
        const animSpeed = this.spec.id === 'shark' || this.spec.id === 'whale' ? 28 : 16;
        const frameCount = Array.isArray(this.spec.framesRight) ? this.spec.framesRight.length : 0;
        this.frameIdx = frameCount > 0
          ? Math.floor(this.animTimer / animSpeed) % frameCount
          : 0;
      }

      let targetFood = null;
      if (foods.length > 0 && !['shark', 'whale', 'submarine', 'crab', 'ship', 'duck'].includes(this.spec.id)) {
        let bestDist = 270;
        const cx = this.x + this.pixelW / 2;
        const cy = this.y + this.pixelH / 2;
        for (const f of foods) {
          const d = Math.hypot(f.x - cx, f.y - cy);
          if (d < bestDist) {
            bestDist = d;
            targetFood = f;
          }
        }
      }

      if (targetFood) {
        const cx = this.x + this.pixelW / 2;
        const cy = this.y + this.pixelH / 2;
        const dx = targetFood.x - cx;
        const dy = targetFood.y - cy;
        const dist = Math.hypot(dx, dy) || 1;
        this.dir = dx >= 0 ? 1 : -1;
        this.vx = (dx / dist) * (this.baseSpeed * 1.65);
        this.vy = (dy / dist) * (this.baseSpeed * 1.35);

        if (dist < 18) {
          const idx = foods.indexOf(targetFood);
          if (idx !== -1) foods.splice(idx, 1);
          spawnBubbleBurst(targetFood.x, targetFood.y, 2);
          window.oceanAudio.playBubble(1.4);
        }
      } else {
        this.vx += (this.baseSpeed * this.dir - this.vx) * 0.05;
        this.bobPhase += this.spec.id === 'dolphin' ? 0.055 : 0.035;
        this.vy = Math.sin(this.bobPhase) * this.bobAmp;
      }

      this.x += this.vx;
      this.y += this.vy;

      const surfaceY = getSurfaceY();
      const floorY = getFloorY();
      if (this.spec.category === 'bottom') {
        this.y = floorY - this.pixelH + 2;
      } else if (this.spec.category === 'surface') {
        this.y = surfaceY - this.pixelH + lineHeight * 0.65 + Math.sin(this.bobPhase) * 2.5;
      } else {
        if (this.y < surfaceY + 8) this.y = surfaceY + 8;
        if (this.y > floorY - this.pixelH - 8) this.y = floorY - this.pixelH - 8;
      }

      if (this.dir === 1 && this.x > width + 30) {
        if (['shark', 'whale', 'submarine', 'ship'].includes(this.spec.id) && creatures.length > 28) {
          return false;
        }
        this.dir = -1;
        this.x = width + 20;
      } else if (this.dir === -1 && this.x < -this.pixelW - 30) {
        if (['shark', 'whale', 'submarine', 'ship'].includes(this.spec.id) && creatures.length > 28) {
          return false;
        }
        this.dir = 1;
        this.x = -this.pixelW - 20;
      }

      if (Math.random() < 0.005 && !['bottom', 'surface'].includes(this.spec.category)) {
        const mouthX = this.dir === 1 ? this.x + this.pixelW - 4 : this.x + 4;
        const mouthY = this.y + this.pixelH * 0.45;
        spawnBubble(mouthX, mouthY, false);
      }

      // Propeller / jet trail bubbles for submarine & squid
      if ((this.spec.id === 'submarine' || this.spec.id === 'squid') && Math.random() < 0.08) {
        const tailX = this.dir === 1 ? this.x - 2 : this.x + this.pixelW + 2;
        spawnBubble(tailX, this.y + this.pixelH * 0.5, false);
      }

      if (this.spec.id === 'whale' && this.frameIdx === 1 && Math.random() < 0.12) {
        const spoutX = this.dir === 1 ? this.x + this.pixelW * 0.35 : this.x + this.pixelW * 0.65;
        spawnBubble(spoutX, this.y, true);
      }

      return true;
    }

    draw() {
      const rightFrames = Array.isArray(this.spec.framesRight) && this.spec.framesRight.length
        ? this.spec.framesRight
        : (SPECIES_CATALOG.neon.framesRight || [['?']]);
      const leftFrames = Array.isArray(this.spec.framesLeft) && this.spec.framesLeft.length
        ? this.spec.framesLeft
        : rightFrames;
      const frames = this.dir === 1 ? rightFrames : leftFrames;
      const art = Array.isArray(frames[this.frameIdx % frames.length])
        ? frames[this.frameIdx % frames.length]
        : (Array.isArray(frames[0]) ? frames[0] : ['?']);
      const colors = this.spec.colorRows || [];

      for (let r = 0; r < art.length; r++) {
        const line = art[r];
        let color = this.tintColor || colors[r] || this.spec.baseColor;
        if (currentTheme === 'crt') {
          color = r % 2 === 0 ? '#4ade80' : '#86efac';
        }
        ctx.fillStyle = color;
        if (glowEnabled) {
          ctx.shadowColor = color;
          ctx.shadowBlur = this.spec.id === 'anglerfish' ? 12 : 6;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fillText(line, this.x, this.y + r * lineHeight);
      }
      ctx.shadowBlur = 0;
    }
  }

  function getSurfaceY() {
    return Math.max(72, Math.round(height * 0.14));
  }

  function getFloorY() {
    return height - Math.max(24, lineHeight * 1.6);
  }

  function spawnBubble(x, y, large = false) {
    bubbles.push({
      x,
      y,
      vy: -(0.75 + Math.random() * 1.1),
      wobble: Math.random() * Math.PI * 2,
      glyph: large ? 'O' : Math.random() < 0.4 ? 'o' : '°',
      color: currentTheme === 'crt' ? '#86efac' : '#bae6fd'
    });
  }

  function spawnBubbleBurst(x, y, count = 8) {
    for (let i = 0; i < count; i++) {
      spawnBubble(x + (Math.random() * 26 - 13), y + (Math.random() * 18 - 9), Math.random() < 0.35);
    }
  }

  function spawnFoodAt(x, y) {
    const pellets = ['*', '+', '•', '¤'];
    const colors = ['#fde047', '#fb923c', '#f472b6', '#a3e635'];
    for (let i = 0; i < 5; i++) {
      foods.push({
        x: x + (Math.random() * 32 - 16),
        y: y + (Math.random() * 14 - 7),
        vy: 0.45 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        glyph: pellets[i % pellets.length],
        color: colors[i % colors.length]
      });
    }
    window.oceanAudio.playFeedPlop();
  }

  function spawnSchool(count = 6) {
    const neonColors = ['#22d3ee', '#38bdf8', '#f472b6', '#a3e635', '#facc15'];
    const baseColor = neonColors[Math.floor(Math.random() * neonColors.length)];
    const dir = Math.random() < 0.5 ? 1 : -1;
    const baseY = getSurfaceY() + 40 + Math.random() * Math.max(80, getFloorY() - getSurfaceY() - 120);
    const startX = dir === 1 ? -60 : width + 40;

    for (let i = 0; i < count; i++) {
      creatures.push(
        new SeaCreature('neon', {
          dir,
          x: startX - dir * (i * 26 + Math.random() * 16),
          y: baseY + (Math.random() * 44 - 22),
          tintColor: baseColor
        })
      );
    }
  }

  function initEcosystem() {
    creatures.length = 0;
    bubbles.length = 0;
    foods.length = 0;

    spawnSchool(6);
    creatures.push(new SeaCreature('shark', { dir: 1, x: width * 0.22 }));
    creatures.push(new SeaCreature('dolphin', { dir: -1, x: width * 0.72 }));
    creatures.push(new SeaCreature('angelfish', { dir: 1, x: width * 0.15 }));
    creatures.push(new SeaCreature('angelfish', { dir: -1, x: width * 0.80 }));
    creatures.push(new SeaCreature('clownfish', { dir: 1, x: width * 0.35 }));
    creatures.push(new SeaCreature('clownfish', { dir: -1, x: width * 0.62 }));
    creatures.push(new SeaCreature('stripedTropical', { dir: 1, x: width * 0.45 }));
    creatures.push(new SeaCreature('pufferfish', { dir: 1, x: width * 0.55 }));
    creatures.push(new SeaCreature('jellyfish', { dir: 1, x: width * 0.28 }));
    creatures.push(new SeaCreature('jellyfish', { dir: -1, x: width * 0.76 }));
    creatures.push(new SeaCreature('turtle', { dir: 1, x: width * 0.40 }));
    creatures.push(new SeaCreature('seahorse', { dir: 1, x: width * 0.18 }));
    creatures.push(new SeaCreature('stingray', { dir: -1, x: width * 0.68 }));
    creatures.push(new SeaCreature('squid', { dir: 1, x: width * 0.30 }));
    creatures.push(new SeaCreature('crab', { dir: 1, x: width * 0.48 }));
    creatures.push(new SeaCreature('octopus', { dir: -1, x: width * 0.65 }));
    creatures.push(new SeaCreature('duck', { dir: 1, x: width * 0.35 }));

    updateCreatureBadge();
  }

  function updateCreatureBadge() {
    const badge = document.getElementById('creatureCountBadge');
    if (badge) {
      badge.textContent = `🐟 ${creatures.length} sinh vật`;
    }
  }

  function drawLightRays(time) {
    const palette = THEME_PALETTES[currentTheme];
    const surfaceY = getSurfaceY();
    ctx.save();
    for (let i = 0; i < 5; i++) {
      const topX = width * (0.14 + i * 0.18) + Math.sin(time * 0.0005 + i) * 35;
      const topW = 36 + (i % 2) * 24;
      const bottomSpread = 130;

      const grad = ctx.createLinearGradient(topX, surfaceY, topX + 40, getFloorY());
      grad.addColorStop(0, palette.rayColor);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(topX, surfaceY);
      ctx.lineTo(topX + topW, surfaceY);
      ctx.lineTo(topX + topW + bottomSpread, getFloorY());
      ctx.lineTo(topX - bottomSpread * 0.4, getFloorY());
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function drawBackgroundDepth(time) {
    const palette = THEME_PALETTES[currentTheme];
    ctx.fillStyle = palette.bgSilhouettes;
    for (const bf of bgFish) {
      bf.x += bf.speed * bf.dir;
      if (bf.dir === 1 && bf.x > width + 30) bf.x = -30;
      if (bf.dir === -1 && bf.x < -30) bf.x = width + 30;
      ctx.fillText(bf.dir === 1 ? '><>' : '<><', bf.x, bf.y);
    }

    for (const p of plankton) {
      p.phase += 0.02;
      const py = p.y + Math.sin(p.phase) * 4;
      ctx.fillText(p.glyph, p.x, py);
    }
  }

  function drawWaterSurface(time) {
    const palette = THEME_PALETTES[currentTheme];
    const surfaceY = getSurfaceY();
    const cols = Math.ceil(width / charWidth) + 2;
    const shift = Math.floor(time / 140);

    let waveLine = '';
    const pattern = '~~~~^~~~~v~';
    for (let c = 0; c < cols; c++) {
      waveLine += pattern[(c + shift) % pattern.length];
    }

    ctx.fillStyle = palette.waveTop;
    if (glowEnabled) {
      ctx.shadowColor = palette.waveTop;
      ctx.shadowBlur = 8;
    }
    ctx.fillText(waveLine, 0, surfaceY);
    ctx.shadowBlur = 0;

    ctx.fillStyle = palette.waveSub;
    for (let row = 1; row <= 3; row++) {
      const y = surfaceY + row * (lineHeight * 0.92);
      const count = Math.floor(width / 110);
      for (let i = 0; i < count; i++) {
        const rx = ((i * 115 + row * 42 + Math.sin(time * 0.0012 + row + i) * 18) % Math.max(80, width - 40)) + 10;
        const ripple = (i + row) % 2 === 0 ? '^^^^' : '^^^';
        ctx.fillText(ripple, rx, y);
      }
    }
  }

  function drawSeabed() {
    const palette = THEME_PALETTES[currentTheme];
    const floorY = getFloorY();

    if (width > 540) {
      const castleX = 24;
      const castleTopY = floorY - CASTLE_ART.length * lineHeight + 4;
      ctx.fillStyle = palette.castleColor;
      ctx.globalAlpha = 0.72;
      for (let r = 0; r < CASTLE_ART.length; r++) {
        ctx.fillText(CASTLE_ART[r], castleX, castleTopY + r * lineHeight);
      }
      ctx.globalAlpha = 1;
    }

    chestOpenTimer = (chestOpenTimer + 1) % 420;
    const isChestOpen = chestOpenTimer > 280;
    const chestArt = isChestOpen ? CHEST_OPEN : CHEST_CLOSED;
    const chestX = width - 135;
    const chestTopY = floorY - chestArt.length * lineHeight + 4;
    ctx.fillStyle = isChestOpen ? '#facc15' : '#d97706';
    for (let r = 0; r < chestArt.length; r++) {
      ctx.fillText(chestArt[r], chestX, chestTopY + r * lineHeight);
    }
    if (isChestOpen && chestOpenTimer % 14 === 0) {
      spawnBubble(chestX + 35, chestTopY, true);
    }

    for (const c of corals) {
      ctx.fillStyle = currentTheme === 'crt' ? '#4ade80' : c.tpl.color;
      const topY = floorY - c.tpl.lines.length * lineHeight + 4;
      for (let r = 0; r < c.tpl.lines.length; r++) {
        ctx.fillText(c.tpl.lines[r], c.x, topY + r * lineHeight);
      }
    }

    for (const sw of seaweeds) {
      sw.phase += sw.speed;
      ctx.fillStyle = sw.color;
      for (let s = 0; s < sw.segments; s++) {
        const sway = Math.sin(sw.phase + s * 0.65) * 4.5;
        const glyph = s % 2 === 0 ? '(' : ')';
        ctx.fillText(glyph, sw.x + sway, floorY - s * lineHeight);
      }
    }

    const cols = Math.ceil(width / charWidth) + 2;
    let floorStr = '';
    const floorChars = '._~-._,.-~';
    for (let c = 0; c < cols; c++) {
      floorStr += floorChars[c % floorChars.length];
    }
    ctx.fillStyle = palette.sandColor;
    ctx.fillText(floorStr, 0, floorY + lineHeight * 0.75);
  }

  function updateAndDrawParticles() {
    const surfaceY = getSurfaceY();
    const floorY = getFloorY();

    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      b.y += b.vy;
      b.wobble += 0.08;
      b.x += Math.sin(b.wobble) * 0.45;

      if (b.y <= surfaceY + 4) {
        bubbles.splice(i, 1);
        continue;
      }

      ctx.fillStyle = b.color;
      ctx.fillText(b.glyph, b.x, b.y);
    }

    for (let i = foods.length - 1; i >= 0; i--) {
      const f = foods[i];
      f.y += f.vy;
      f.phase += 0.06;
      f.x += Math.sin(f.phase) * 0.35;

      if (f.y >= floorY - 4) {
        foods.splice(i, 1);
        continue;
      }

      ctx.fillStyle = currentTheme === 'crt' ? '#bbf7d0' : f.color;
      if (glowEnabled) {
        ctx.shadowColor = f.color;
        ctx.shadowBlur = 8;
      }
      ctx.fillText(f.glyph, f.x, f.y);
      ctx.shadowBlur = 0;
    }

    for (let i = sparkles.length - 1; i >= 0; i--) {
      const sp = sparkles[i];
      sp.life--;
      if (sp.life <= 0) {
        sparkles.splice(i, 1);
        continue;
      }
      ctx.fillStyle = `rgba(255, 255, 255, ${sp.life / 25})`;
      ctx.fillText(sp.life > 12 ? '( + )' : '. o .', sp.x - 16, sp.y);
    }
  }

  let lastFrameTime = performance.now();
  let fpsCounter = 0;
  let lastFpsUpdate = performance.now();

  function loop(now) {
    const dt = Math.min((now - lastFrameTime) / 16.67, 3);
    lastFrameTime = now;

    ctx.clearRect(0, 0, width, height);
    ctx.font = `600 ${fontSize}px "Cascadia Code", "Fira Code", Consolas, monospace`;
    ctx.textBaseline = 'top';

    drawLightRays(now);
    drawBackgroundDepth(now);
    drawWaterSurface(now);
    drawSeabed();

    for (let i = creatures.length - 1; i >= 0; i--) {
      const alive = creatures[i].update(dt);
      if (!alive) {
        creatures.splice(i, 1);
        updateCreatureBadge();
      } else {
        creatures[i].draw();
      }
    }

    updateAndDrawParticles();

    if (Math.random() < 0.045) {
      spawnBubble(40 + Math.random() * (width - 80), getFloorY() - 6, false);
    }

    fpsCounter++;
    if (now - lastFpsUpdate >= 1000) {
      const fpsBadge = document.getElementById('fpsBadge');
      if (fpsBadge) fpsBadge.textContent = `${fpsCounter} FPS`;
      fpsCounter = 0;
      lastFpsUpdate = now;
    }

    requestAnimationFrame(loop);
  }

  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    sparkles.push({ x: clickX, y: clickY, life: 25 });

    let hitPuffer = false;
    for (const c of creatures) {
      if (
        c.spec.id === 'pufferfish' &&
        clickX >= c.x - 15 &&
        clickX <= c.x + c.pixelW + 15 &&
        clickY >= c.y - 15 &&
        clickY <= c.y + c.pixelH + 15
      ) {
        c.puffUp();
        hitPuffer = true;
      }
    }

    if (!hitPuffer) {
      spawnFoodAt(clickX, Math.max(getSurfaceY() + 12, clickY));
    }
  });

  function populateSpawnGridAndEncyclopedia() {
    const spawnGrid = document.getElementById('spawnGrid');
    const encyGrid = document.getElementById('encyclopediaGrid');
    spawnGrid.innerHTML = '';
    encyGrid.innerHTML = '';

    Object.values(SPECIES_CATALOG).forEach((spec) => {
      const btn = document.createElement('button');
      btn.className = 'spawn-item-btn';
      btn.innerHTML = `<span>${spec.icon}</span><span>${spec.name}</span>`;
      btn.addEventListener('click', () => {
        if (spec.id === 'neon') {
          spawnSchool(5);
        } else {
          creatures.push(new SeaCreature(spec.id));
        }
        updateCreatureBadge();
        window.oceanAudio.playBubble(1.1);
      });
      spawnGrid.appendChild(btn);

      const card = document.createElement('div');
      card.className = 'ency-card';
      const sampleArt = spec.framesRight[0].join('\n');
      card.innerHTML = `
        <div>
          <div class="ency-title">
            <span>${spec.icon} ${spec.name}</span>
          </div>
          <pre class="ency-art" style="color:${spec.baseColor}">${escapeHtml(sampleArt)}</pre>
        </div>
        <div class="ency-desc">${spec.desc}</div>
      `;
      encyGrid.appendChild(card);
    });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  document.getElementById('btnFeed').addEventListener('click', () => {
    for (let i = 0; i < 4; i++) {
      spawnFoodAt(80 + Math.random() * (width - 160), getSurfaceY() + 20 + Math.random() * 40);
    }
  });

  document.getElementById('btnAddFish').addEventListener('click', () => {
    const tropicalKeys = ['angelfish', 'clownfish', 'stripedTropical', 'pufferfish', 'swordfish', 'seahorse', 'squid'];
    const randomKey = tropicalKeys[Math.floor(Math.random() * tropicalKeys.length)];
    creatures.push(new SeaCreature(randomKey));
    spawnSchool(4);
    updateCreatureBadge();
    window.oceanAudio.playBubble(1.2);
  });

  document.getElementById('btnAddShark').addEventListener('click', () => {
    const key = Math.random() < 0.7 ? 'shark' : 'narwhal';
    creatures.push(new SeaCreature(key));
    updateCreatureBadge();
    window.oceanAudio.playBubble(0.7);
  });

  document.getElementById('btnAddWhale').addEventListener('click', () => {
    const key = Math.random() < 0.65 ? 'whale' : 'ship';
    creatures.push(new SeaCreature(key));
    updateCreatureBadge();
    window.oceanAudio.playBubble(0.6);
  });

  document.getElementById('btnAddJelly').addEventListener('click', () => {
    const rareKeys = ['jellyfish', 'turtle', 'stingray', 'dolphin', 'mermaid', 'anglerfish', 'submarine'];
    const k1 = rareKeys[Math.floor(Math.random() * rareKeys.length)];
    const k2 = rareKeys[Math.floor(Math.random() * rareKeys.length)];
    creatures.push(new SeaCreature(k1));
    creatures.push(new SeaCreature(k2));
    updateCreatureBadge();
    window.oceanAudio.playBubble(1.0);
  });

  document.getElementById('btnBubbles').addEventListener('click', () => {
    for (let i = 0; i < 28; i++) {
      spawnBubble(40 + Math.random() * (width - 80), getFloorY() - Math.random() * 60, Math.random() < 0.4);
    }
    window.oceanAudio.playBubble(1.3);
  });

  document.getElementById('themeSelect').addEventListener('change', (e) => {
    currentTheme = e.target.value;
    document.body.className = `theme-${currentTheme}` + (document.body.classList.contains('hud-hidden') ? ' hud-hidden' : '');
    rebuildFlora();
  });

  document.getElementById('btnGlow').addEventListener('click', () => {
    glowEnabled = !glowEnabled;
    document.getElementById('glowState').textContent = glowEnabled ? 'BẬT' : 'TẮT';
  });

  document.getElementById('btnSound').addEventListener('click', () => {
    const isOn = window.oceanAudio.toggle();
    document.getElementById('soundIcon').textContent = isOn ? '🔊' : '🔇';
    document.getElementById('soundState').textContent = isOn ? 'Đang bật' : 'Âm thanh';
    if (isOn) window.oceanAudio.playBubble(1.2);
  });

  const spawnPopover = document.getElementById('spawnPopover');
  document.getElementById('btnSpawnMenu').addEventListener('click', () => {
    spawnPopover.classList.toggle('hidden');
  });
  document.getElementById('closePopover').addEventListener('click', () => {
    spawnPopover.classList.add('hidden');
  });

  const helpModal = document.getElementById('helpModal');
  document.getElementById('btnHelp').addEventListener('click', () => {
    helpModal.classList.remove('hidden');
  });
  document.getElementById('closeHelpModal').addEventListener('click', () => {
    helpModal.classList.add('hidden');
  });
  helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) helpModal.classList.add('hidden');
  });

  function toggleHud() {
    document.body.classList.toggle('hud-hidden');
    const hidden = document.body.classList.contains('hud-hidden');
    document.getElementById('btnRestoreHud').classList.toggle('hidden', !hidden);
    setTimeout(resize, 50);
  }

  document.getElementById('btnHideHud').addEventListener('click', toggleHud);
  document.getElementById('btnMinimize').addEventListener('click', toggleHud);
  document.getElementById('btnRestoreHud').addEventListener('click', toggleHud);

  document.getElementById('btnReset').addEventListener('click', () => {
    initEcosystem();
    runBootAnimation();
  });

  document.getElementById('btnMaximize').addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'h' || e.key === 'H') {
      toggleHud();
    } else if (e.code === 'Space') {
      e.preventDefault();
      document.getElementById('btnFeed').click();
    } else if (e.key === 'b' || e.key === 'B') {
      document.getElementById('btnBubbles').click();
    } else if (e.key === 'f' || e.key === 'F') {
      document.getElementById('btnMaximize').click();
    } else if (e.key === 'Escape') {
      helpModal.classList.add('hidden');
      spawnPopover.classList.add('hidden');
    }
  });

  function updateClock() {
    const now = new Date();
    const str = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const dayStr = now.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });
    const clockEl = document.getElementById('osClock');
    if (clockEl) clockEl.textContent = `${dayStr} ${str}`;
  }
  setInterval(updateClock, 10000);
  updateClock();

  function runBootAnimation() {
    const overlay = document.getElementById('bootOverlay');
    const textEl = document.getElementById('bootText');
    const cmd = 'aquarium@ocean:~$ asciiquarium --deluxe --species=22 --glow=on';
    overlay.classList.remove('fade-out');
    textEl.textContent = '';
    let idx = 0;
    const timer = setInterval(() => {
      textEl.textContent += cmd[idx];
      idx++;
      if (idx >= cmd.length) {
        clearInterval(timer);
        setTimeout(() => {
          overlay.classList.add('fade-out');
        }, 1400);
      }
    }, 28);
  }

  window.addEventListener('resize', resize);
  resize();
  populateSpawnGridAndEncyclopedia();
  initEcosystem();
  runBootAnimation();
  requestAnimationFrame(loop);
})();
