'use strict';
// ---------------------------------------------------------------------------
// The valley of Vael — level layout, scenery and props
// ---------------------------------------------------------------------------
const ZONES = [
  {
    x: 0, num: 'I', name: 'The Weeping Road',
    sky: ['#09080b', '#24131a', '#4a2224'], far: '#160f13', mid: '#100b0e', near: '#0a0708',
    ground: '#1a1513', groundDark: '#0b0909', weather: 'rain', moon: '#d6c7ae', fog: '90,70,75',
  },
  {
    x: 3400, num: 'II', name: 'Hallowmere, That Was',
    sky: ['#0c0505', '#33100a', '#7a2810'], far: '#1c0d0a', mid: '#140908', near: '#0b0605',
    ground: '#1d1411', groundDark: '#0d0807', weather: 'ash', moon: '#e0a070', fog: '120,60,40',
  },
  {
    x: 6800, num: 'III', name: 'The Steps of Saint Varn',
    sky: ['#040508', '#121722', '#3b151c'], far: '#0e1016', mid: '#0a0b10', near: '#060609',
    ground: '#17161a', groundDark: '#09090b', weather: 'rain', moon: '#b8241c', fog: '70,70,90',
  },
];

const LEVEL = {
  width: 9480,
  bossGate: 8260, arenaEnd: 9260, bossX: 8960, doorX: 9330,
  shrines: [
    { id: 0, x: 170, name: 'Wayside Shrine' },
    { id: 1, x: 3640, name: 'Hallowmere Well' },
    { id: 2, x: 7020, name: 'Cathedral Steps' },
  ],
  enemies: [
    { type: 'peasant', x: 1080, idle: 'feed', facing: 1 },
    { type: 'peasant', x: 1520, facing: -1 },
    { type: 'peasant', x: 1960, idle: 'feed', facing: -1 },
    { type: 'peasant', x: 2060, idle: 'pray', facing: -1 },
    { type: 'footman', x: 2480, facing: -1 },
    { type: 'peasant', x: 2760, facing: -1 },
    { type: 'peasant', x: 2850, idle: 'feed', facing: 1 },
    { type: 'flagellant', x: 3160, facing: -1 },
    { type: 'footman', x: 4360, facing: -1 },
    { type: 'peasant', x: 4520, idle: 'pray', facing: 1 },
    { type: 'peasant', x: 4590, idle: 'pray', facing: 1 },
    { type: 'flagellant', x: 5000, facing: -1 },
    { type: 'flagellant', x: 5160, facing: -1 },
    { type: 'footman', x: 5520, facing: -1 },
    { type: 'footman', x: 5650, facing: -1 },
    { type: 'peasant', x: 5920, idle: 'feed', facing: -1 },
    { type: 'peasant', x: 5990, idle: 'feed', facing: 1 },
    { type: 'peasant', x: 6060, facing: -1 },
    { type: 'flagellant', x: 6440, facing: -1 },
    { type: 'footman', x: 6620, facing: -1 },
    { type: 'footman', x: 7360, facing: -1 },
    { type: 'flagellant', x: 7520, idle: 'pray', facing: -1 },
    { type: 'footman', x: 7720, facing: -1 },
    { type: 'flagellant', x: 7880, facing: -1 },
  ],
  npcs: [
    { id: 'osric', x: 640 },
    { id: 'wren', x: 3930 },
  ],
  notes: [
    { id: 'letter', x: 1720 },
    { id: 'order', x: 4720 },
    { id: 'hymn', x: 6230 },
    { id: 'scripture', x: 7980 },
  ],
  hints: [
    { x: 230, text: 'A / D — walk     Shift — sprint     Space — roll (stay invulnerable mid-roll)', touch: 'Drag on the left to walk — push to the rim to sprint.   ⟳ ROLL dodges blows' },
    { x: 470, text: 'E — speak, read, rest at shrines', touch: '✋ appears near people, notes and shrines' },
    { x: 860, text: 'J / Left Click — attack (chain up to three)     K / Right Click — heavy attack', touch: '⚔ ATTACK chains up to three cuts     ✦ HEAVY cleaves' },
    { x: 1300, text: 'Hold L — raise your guard. Guard just before a blow lands to PARRY.', touch: 'Hold ⛨ GUARD to block. Guard just before a blow lands to PARRY.' },
    { x: 1640, text: 'Wounded, staggered or crippled foes can be EXECUTED — press F when the sigil appears.', touch: 'Wounded, staggered or crippled foes can be EXECUTED — tap ☠ when it glows.' },
    { x: 2150, text: 'S + Attack — Hamstring Cut. Take their legs and they will crawl.     Q — drink a vial', touch: 'Hold the stick down + ⚔ — Hamstring Cut. Take their legs.   ⚱ — drink a vial' },
    { x: 2600, text: 'Every cut builds BLEED. Fill the gauge to cause a hemorrhage.' },
  ],
  props: [],
};

// Hand-placed props
(function placeProps() {
  const P = LEVEL.props;
  const add = (type, x, o) => P.push(Object.assign({ type, x }, o || {}));
  // --- zone I
  add('tree', 60, { seed: 3, h: 230 }); add('tree', 420, { seed: 7, h: 190 });
  add('cart', 610); add('tree', 900, { seed: 11, h: 260 });
  add('corpse', 1110, { style: 'peasant', rot: 1 }); add('gibbet', 1330, { seed: 1 });
  add('corpse', 1700, { style: 'footman', rot: -1 }); add('pike', 1830); add('pike', 1870, { empty: true });
  add('tree', 2000, { seed: 21, h: 210 }); add('corpse', 2000, { style: 'peasant', rot: -1 });
  add('gibbet', 2320, { seed: 2 }); add('gibbet', 2600, { seed: 3 }); add('tree', 2700, { seed: 5, h: 240 });
  add('corpse', 2880, { style: 'peasant', rot: 1 }); add('pike', 2960); add('tree', 3080, { seed: 9, h: 200 });
  add('sign', 3300, { text: 'HALLOWMERE' });
  // --- zone II
  add('house', 3480, { w: 210, burning: false }); add('well', 3640);
  add('grave', 3850); add('grave', 3890, { cross: true }); add('grave', 3990); add('grave', 4040, { cross: true }); add('grave', 4085);
  add('house', 4180, { w: 240, burning: true }); add('cage', 4460); add('corpse', 4550, { style: 'footman', rot: 1 });
  add('pike', 4700); add('house', 4880, { w: 220, burning: true }); add('banner', 5060);
  add('corpse', 5260, { style: 'peasant', rot: -1 }); add('house', 5380, { w: 260, burning: false });
  add('pike', 5480); add('pike', 5520); add('house', 5760, { w: 230, burning: true });
  add('corpse', 5960, { style: 'peasant', rot: 1 }); add('cage', 6150); add('house', 6300, { w: 250, burning: true });
  add('banner', 6560); add('pike', 6700);
  // --- zone III
  add('pillar', 6900); add('statue', 7180); add('pillar', 7300); add('candles', 7440); add('pillar', 7640);
  add('statue', 7800); add('pillar', 8000); add('candles', 8120); add('pillar', 8200);
  add('brazier', 8320); add('brazier', 9200); add('statue', 8760, { big: true });
  add('cathedral', LEVEL.doorX);
})();

// ---------------------------------------------------------------------------
// Parallax scenery generated once from a seed
// ---------------------------------------------------------------------------
const Scenery = {
  layers: [],
  build() {
    const rnd = seeded(1093);
    const mk = (factor, gen) => {
      const items = [];
      for (let wx = -400; wx < LEVEL.width + 600; wx += gen.step * (0.6 + rnd() * 0.8)) {
        const x = (wx - W / 2) * factor + W / 2;
        const zone = zoneIndex(wx);
        items.push(gen.make(x, zone, rnd));
      }
      return { factor, items };
    };
    // far hills
    const hills = [];
    for (let x = -200; x < LEVEL.width * 0.12 + W + 400; x += 40) hills.push({ x, h: 60 + Math.sin(x * 0.006) * 30 + rnd() * 25 });
    this.hills = hills;
    this.layers = [
      mk(0.25, {
        step: 180, make: (x, z, r) => {
          if (z === 0) return { k: r() < 0.6 ? 'ftree' : 'windmill', x, h: 60 + r() * 50, z };
          if (z === 1) return { k: r() < 0.25 ? 'tower' : 'roofs', x, h: 50 + r() * 60, w: 60 + r() * 80, z };
          return { k: r() < 0.5 ? 'spire' : 'tower', x, h: 140 + r() * 120, w: 30 + r() * 30, z };
        },
      }),
      mk(0.5, {
        step: 260, make: (x, z, r) => {
          if (z === 0) return { k: r() < 0.7 ? 'mtree' : 'gallows', x, h: 120 + r() * 80, seed: Math.floor(r() * 1000), z };
          if (z === 1) return { k: 'house', x, h: 90 + r() * 50, w: 90 + r() * 70, lit: r() < 0.5, z };
          return { k: r() < 0.5 ? 'arch' : 'mtree', x, h: 150 + r() * 80, w: 60 + r() * 40, seed: Math.floor(r() * 1000), z };
        },
      }),
    ];
  },
};

function zoneIndex(x) { return x >= ZONES[2].x ? 2 : x >= ZONES[1].x ? 1 : 0; }

// palette blended across zone borders (400px crossfade)
function zonePalette(x) {
  const i = zoneIndex(x);
  const z = ZONES[i];
  const next = ZONES[i + 1];
  const t = next ? clamp((x - (next.x - 400)) / 400, 0, 1) : 0;
  if (!next || t === 0) return { z, t: 0, mix: k => z[k], mixArr: (k, n) => z[k][n] };
  return { z, t, mix: k => mixHex(z[k], next[k], t), mixArr: (k, n) => mixHex(z[k][n], next[k][n], t) };
}

function drawTree(ctx, x, y, h, seed, col) {
  const r = seeded(seed);
  ctx.strokeStyle = col; ctx.lineCap = 'round';
  const branch = (bx, by, ang, len, w, depth) => {
    const ex = bx + Math.sin(ang) * len, ey = by - Math.cos(ang) * len;
    ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(bx, by);
    ctx.quadraticCurveTo(bx + Math.sin(ang + 0.3) * len * 0.5, by - Math.cos(ang + 0.3) * len * 0.5, ex, ey); ctx.stroke();
    if (depth > 0) {
      const n = 2 + (r() < 0.4 ? 1 : 0);
      for (let i = 0; i < n; i++) branch(ex, ey, ang + (r() - 0.5) * 1.6, len * (0.55 + r() * 0.2), w * 0.62, depth - 1);
    }
  };
  branch(x, y, (r() - 0.5) * 0.2, h * 0.42, h * 0.07, 4);
}

function drawBackground(ctx, camX, t, playerX) {
  const pal = zonePalette(playerX);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, pal.mixArr('sky', 0)); g.addColorStop(0.55, pal.mixArr('sky', 1)); g.addColorStop(1, pal.mixArr('sky', 2));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // moon
  const moonCol = pal.mix('moon');
  const mx = 720 - camX * 0.02, my = 110;
  const mg = ctx.createRadialGradient(mx, my, 10, mx, my, 160);
  mg.addColorStop(0, 'rgba(255,220,190,0.18)'); mg.addColorStop(1, 'rgba(255,220,190,0)');
  ctx.fillStyle = mg; ctx.fillRect(mx - 160, my - 160, 320, 320);
  ctx.fillStyle = moonCol; ctx.beginPath(); ctx.arc(mx, my, 42, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.beginPath(); ctx.arc(mx - 12, my - 8, 9, 0, Math.PI * 2); ctx.arc(mx + 14, my + 10, 6, 0, Math.PI * 2); ctx.arc(mx + 5, my - 18, 4, 0, Math.PI * 2); ctx.fill();
  // clouds
  ctx.fillStyle = 'rgba(10,6,8,0.55)';
  for (let i = 0; i < 6; i++) {
    const cx = ((i * 260 - camX * 0.05 - t * 6) % (W + 400) + W + 400) % (W + 400) - 200;
    ctx.beginPath(); ctx.ellipse(cx, 70 + (i % 3) * 40, 160, 16, 0, 0, Math.PI * 2); ctx.fill();
  }
  // far hills
  ctx.fillStyle = pal.mix('far');
  ctx.beginPath(); ctx.moveTo(0, H);
  const off = camX * 0.12;
  for (const hp of Scenery.hills) {
    const x = hp.x - off;
    if (x < -60 || x > W + 60) continue;
    ctx.lineTo(x, GROUND - 90 - hp.h);
  }
  ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
  // silhouette layers
  for (let li = 0; li < Scenery.layers.length; li++) {
    const L = Scenery.layers[li];
    ctx.fillStyle = li === 0 ? pal.mix('mid') : pal.mix('near');
    ctx.strokeStyle = ctx.fillStyle;
    const base = li === 0 ? GROUND - 50 : GROUND - 18;
    for (const it of L.items) {
      const x = it.x - camX * L.factor;
      if (x < -200 || x > W + 200) continue;
      drawSilhouette(ctx, it, x, base, t);
    }
    // ground strip for the layer
    ctx.fillRect(0, base, W, H - base);
  }
}

function drawSilhouette(ctx, it, x, base, t) {
  switch (it.k) {
    case 'ftree': drawTree(ctx, x, base, it.h, Math.floor(it.x), ctx.fillStyle); break;
    case 'mtree': drawTree(ctx, x, base, it.h, it.seed, ctx.fillStyle); break;
    case 'windmill': {
      ctx.beginPath(); ctx.moveTo(x - 14, base); ctx.lineTo(x - 8, base - it.h); ctx.lineTo(x + 8, base - it.h); ctx.lineTo(x + 14, base); ctx.fill();
      ctx.lineWidth = 4; const a = t * 0.15;
      for (let i = 0; i < 4; i++) { const an = a + i * Math.PI / 2; ctx.beginPath(); ctx.moveTo(x, base - it.h); ctx.lineTo(x + Math.cos(an) * 46, base - it.h + Math.sin(an) * 46); ctx.stroke(); }
      break;
    }
    case 'roofs':
      ctx.beginPath(); ctx.moveTo(x - it.w / 2, base); ctx.lineTo(x - it.w / 2, base - it.h * 0.6); ctx.lineTo(x, base - it.h); ctx.lineTo(x + it.w / 2, base - it.h * 0.6); ctx.lineTo(x + it.w / 2, base); ctx.fill();
      break;
    case 'tower':
      ctx.fillRect(x - it.w / 4, base - it.h, it.w / 2, it.h);
      ctx.beginPath(); ctx.moveTo(x - it.w / 3, base - it.h); ctx.lineTo(x, base - it.h - it.w * 0.8); ctx.lineTo(x + it.w / 3, base - it.h); ctx.fill();
      break;
    case 'spire':
      ctx.fillRect(x - it.w / 2, base - it.h * 0.6, it.w, it.h * 0.6);
      ctx.beginPath(); ctx.moveTo(x - it.w / 2, base - it.h * 0.6); ctx.lineTo(x, base - it.h - 40); ctx.lineTo(x + it.w / 2, base - it.h * 0.6); ctx.fill();
      ctx.fillRect(x - 1, base - it.h - 60, 2, 22); ctx.fillRect(x - 7, base - it.h - 52, 14, 2);
      break;
    case 'gallows':
      ctx.fillRect(x - 3, base - it.h, 6, it.h); ctx.fillRect(x - 3, base - it.h, 50, 5);
      ctx.fillRect(x + 40, base - it.h, 1.5, 22);
      ctx.save(); ctx.translate(x + 41, base - it.h + 22); ctx.rotate(Math.sin(t * 0.8 + x) * 0.05);
      ctx.fillRect(-4, 0, 8, 26); ctx.fillRect(-3, 26, 2.5, 22); ctx.fillRect(1, 26, 2.5, 22); ctx.beginPath(); ctx.arc(0, -2, 5, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      break;
    case 'house': {
      const hw = it.w / 2;
      ctx.beginPath(); ctx.moveTo(x - hw, base); ctx.lineTo(x - hw, base - it.h * 0.55); ctx.lineTo(x - hw * 0.2, base - it.h); ctx.lineTo(x + hw * 0.3, base - it.h * 0.85); ctx.lineTo(x + hw, base - it.h * 0.55); ctx.lineTo(x + hw, base); ctx.fill();
      if (it.lit) {
        const f = 0.5 + Math.sin(t * 7 + x) * 0.2;
        ctx.fillStyle = `rgba(255,120,40,${f})`; ctx.fillRect(x - hw * 0.5, base - it.h * 0.4, 10, 12); ctx.fillRect(x + hw * 0.3, base - it.h * 0.42, 9, 11);
        ctx.fillStyle = ctx.strokeStyle;
      }
      break;
    }
    case 'arch':
      ctx.fillRect(x - it.w / 2, base - it.h, 14, it.h); ctx.fillRect(x + it.w / 2 - 14, base - it.h, 14, it.h);
      ctx.beginPath(); ctx.moveTo(x - it.w / 2, base - it.h); ctx.quadraticCurveTo(x, base - it.h - it.w * 0.7, x + it.w / 2, base - it.h); ctx.lineTo(x + it.w / 2, base - it.h + 14); ctx.quadraticCurveTo(x, base - it.h - it.w * 0.45, x - it.w / 2, base - it.h + 14); ctx.fill();
      break;
  }
}

// Playfield ground with ruts, stones and puddles
const groundDetail = (() => {
  const r = seeded(77); const arr = [];
  for (let x = 0; x < LEVEL.width + 200; x += 18 + r() * 40) arr.push({ x, y: GROUND + 4 + r() * 90, w: 2 + r() * 8, k: r() < 0.08 ? 'puddle' : r() < 0.55 ? 'stone' : 'grass' });
  return arr;
})();

function drawGround(ctx, l, r, playerX) {
  const pal = zonePalette(playerX);
  const g = ctx.createLinearGradient(0, GROUND - 4, 0, H);
  g.addColorStop(0, pal.mix('ground')); g.addColorStop(1, pal.mix('groundDark'));
  ctx.fillStyle = g; ctx.fillRect(l - 20, GROUND - 2, r - l + 40, H - GROUND + 80);
  ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fillRect(l - 20, GROUND - 2, r - l + 40, 2);
  for (const d of groundDetail) {
    if (d.x < l - 30 || d.x > r + 30) continue;
    const zi = zoneIndex(d.x);
    if (d.k === 'puddle') {
      ctx.fillStyle = 'rgba(70,40,45,0.35)'; ctx.beginPath(); ctx.ellipse(d.x, d.y, d.w * 5, d.w * 0.8, 0, 0, Math.PI * 2); ctx.fill();
    } else if (d.k === 'stone') {
      ctx.fillStyle = zi === 0 ? 'rgba(0,0,0,0.35)' : 'rgba(80,72,70,0.22)';
      if (zi === 0) { ctx.beginPath(); ctx.ellipse(d.x, d.y, d.w, d.w * 0.5, 0, 0, Math.PI * 2); ctx.fill(); }
      else ctx.fillRect(d.x, d.y, d.w * 3.2, d.w * 0.9);
    } else if (zi === 0 && d.y < GROUND + 30) {
      ctx.strokeStyle = '#1f1a12'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(d.x, GROUND); ctx.lineTo(d.x - 3, GROUND - 7); ctx.moveTo(d.x + 2, GROUND); ctx.lineTo(d.x + 4, GROUND - 6); ctx.stroke();
    }
  }
}

// ---------------------------------------------------------------------------
// Props on the playfield
// ---------------------------------------------------------------------------
const PROP_CORPSE_POSE = basePose({ lean: 0, armF: 2.6, elbowF: 0.4, armB: 0.9, elbowB: 0.6, legF: 0.3, kneeF: 0.6, legB: -0.1, kneeB: 0.2, head: 0.5 });
const PROP_CORPSE_RIG = solveRig(PROP_CORPSE_POSE);

function drawProp(ctx, p, t, game) {
  const x = p.x, y = GROUND;
  switch (p.type) {
    case 'tree': drawTree(ctx, x, y + 2, p.h, p.seed, '#0d0a0a'); break;
    case 'cart':
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = '#2a1e15'; ctx.save(); ctx.rotate(-0.12); ctx.fillRect(-50, -34, 90, 10); ctx.fillRect(-50, -46, 6, 14); ctx.fillRect(34, -46, 6, 14); ctx.restore();
      ctx.strokeStyle = '#2a1e15'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(-20, -16, 16, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 2; for (let i = 0; i < 4; i++) { const a = i * Math.PI / 4; ctx.beginPath(); ctx.moveTo(-20 + Math.cos(a) * 16, -16 + Math.sin(a) * 16); ctx.lineTo(-20 - Math.cos(a) * 16, -16 - Math.sin(a) * 16); ctx.stroke(); }
      ctx.save(); ctx.translate(36, -4); ctx.rotate(1.2); ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(0, 0, 16, 5, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(40, -30); ctx.lineTo(80, -6); ctx.stroke();
      ctx.restore();
      break;
    case 'corpse': {
      const st = ENEMY_DEFS[p.style].style;
      ctx.save(); ctx.translate(x, y); ctx.scale(p.rot, 1); ctx.translate(-40, -5); ctx.rotate(Math.PI / 2);
      drawHumanoid(ctx, PROP_CORPSE_RIG, PROP_CORPSE_POSE, st, { head: p.style !== 'footman', armF: true, armB: p.style !== 'peasant', legF: true, legB: true }, { shield: false, t: 0 });
      ctx.restore();
      ctx.fillStyle = 'rgba(80,0,0,0.65)'; ctx.beginPath(); ctx.ellipse(x, y + 4, 38, 6, 0, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case 'gibbet': {
      ctx.fillStyle = '#16110e'; ctx.fillRect(x - 4, y - 200, 8, 200); ctx.fillRect(x - 4, y - 200, 70, 7);
      ctx.fillRect(x, y - 180, 30, 5); // brace
      ctx.save(); ctx.translate(x + 2, y - 176); ctx.rotate(-0.78); ctx.fillRect(0, 0, 34, 4); ctx.restore();
      ctx.fillStyle = '#2a2420'; ctx.fillRect(x + 56, y - 193, 1.5, 36);
      ctx.save(); ctx.translate(x + 57, y - 157); ctx.rotate(Math.sin(t * 0.9 + p.seed) * 0.06);
      const st = ENEMY_DEFS.peasant.style;
      const hp = basePose({ lean: 0, head: 0.6, armF: 0.05, elbowF: 0.05, armB: -0.05, elbowB: 0.05, legF: 0.05, kneeF: 0.02, legB: -0.03, kneeB: 0.02 });
      const j = solveRig(hp);
      ctx.translate(0, -j.head.y + RIG.headR);
      drawHumanoid(ctx, j, hp, st, { head: true, armF: true, armB: true, legF: true, legB: true }, { t: 0 });
      ctx.restore();
      break;
    }
    case 'pike': {
      ctx.fillStyle = '#1d150f'; ctx.fillRect(x - 2, y - 120, 4, 120);
      ctx.beginPath(); ctx.moveTo(x - 2, y - 120); ctx.lineTo(x, y - 132); ctx.lineTo(x + 2, y - 120); ctx.fill();
      if (!p.empty) {
        drawHead(ctx, { x, y: y - 122 }, 0.3, ENEMY_DEFS.peasant.style, 0);
        ctx.fillStyle = '#5a0000'; ctx.fillRect(x - 2, y - 114, 4, 30);
      }
      break;
    }
    case 'sign':
      ctx.fillStyle = '#1e1610'; ctx.fillRect(x - 3, y - 90, 6, 90);
      ctx.save(); ctx.translate(x, y - 78); ctx.rotate(-0.06);
      ctx.fillStyle = '#2e2218'; ctx.beginPath(); ctx.moveTo(-6, -12); ctx.lineTo(70, -12); ctx.lineTo(82, 0); ctx.lineTo(70, 12); ctx.lineTo(-6, 12); ctx.fill();
      ctx.fillStyle = '#8a7a5a'; ctx.font = `10px ${TITLE_FONT}`; ctx.textAlign = 'left'; ctx.fillText(p.text, 0, 4);
      ctx.restore();
      break;
    case 'house': {
      const w = p.w, h = 190;
      ctx.fillStyle = '#17100c'; ctx.fillRect(x - w / 2, y - h, w, h);
      ctx.fillStyle = '#0e0907';
      ctx.beginPath(); ctx.moveTo(x - w / 2 - 14, y - h); ctx.lineTo(x - w * 0.1, y - h - 80); ctx.lineTo(x + w * 0.15, y - h - 60); ctx.lineTo(x + w * 0.25, y - h - 70); ctx.lineTo(x + w / 2 + 14, y - h); ctx.fill();
      ctx.strokeStyle = '#24170f'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(x - w / 2, y - h * 0.5); ctx.lineTo(x + w / 2, y - h * 0.5);
      ctx.moveTo(x - w / 2, y - h); ctx.lineTo(x - w / 4, y - h * 0.5); ctx.moveTo(x + w / 2, y - h); ctx.lineTo(x + w / 4, y - h * 0.5); ctx.stroke();
      // door + windows
      ctx.fillStyle = '#060404'; ctx.fillRect(x - 18, y - 70, 36, 70);
      const fl = p.burning ? 0.6 + Math.sin(t * 13 + x) * 0.25 : 0.12;
      ctx.fillStyle = p.burning ? `rgba(255,${110 + Math.sin(t * 9) * 30},30,${fl})` : '#060404';
      ctx.fillRect(x - w / 2 + 22, y - h * 0.4, 26, 28); ctx.fillRect(x + w / 2 - 48, y - h * 0.4, 26, 28);
      ctx.fillRect(x - 14, y - h + 26, 28, 26);
      break;
    }
    case 'well':
      ctx.fillStyle = '#2a2624'; ctx.fillRect(x - 32, y - 34, 64, 34);
      ctx.fillStyle = '#383330'; for (let i = 0; i < 4; i++) ctx.fillRect(x - 32 + i * 16 + 1, y - 34, 14, 7);
      ctx.fillStyle = '#1a120c'; ctx.fillRect(x - 30, y - 90, 5, 56); ctx.fillRect(x + 25, y - 90, 5, 56);
      ctx.beginPath(); ctx.moveTo(x - 40, y - 86); ctx.lineTo(x, y - 110); ctx.lineTo(x + 40, y - 86); ctx.fill();
      break;
    case 'grave':
      ctx.fillStyle = '#1a1310'; ctx.beginPath(); ctx.ellipse(x, y + 2, 26, 8, 0, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#231a14';
      if (p.cross) { ctx.fillRect(x - 2, y - 46, 4, 46); ctx.fillRect(x - 12, y - 36, 24, 4); }
      else { ctx.fillStyle = '#2b2826'; rr(ctx, x - 10, y - 34, 20, 34, 8); ctx.fill(); }
      break;
    case 'cage': {
      ctx.fillStyle = '#16110e'; ctx.fillRect(x - 3, y - 230, 6, 230); ctx.fillRect(x - 3, y - 230, 50, 6);
      ctx.save(); ctx.translate(x + 40, y - 224); ctx.rotate(Math.sin(t * 0.7 + x) * 0.05);
      ctx.strokeStyle = '#2c2622'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 20); ctx.stroke();
      ctx.lineWidth = 2;
      for (let i = -14; i <= 14; i += 7) { ctx.beginPath(); ctx.moveTo(i * 0.6, 22); ctx.quadraticCurveTo(i, 50, i * 0.8, 74); ctx.stroke(); }
      ctx.beginPath(); ctx.ellipse(0, 22, 9, 3, 0, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, 74, 12, 3, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#b8ad98'; ctx.beginPath(); ctx.arc(-2, 50, 4, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(-4, 54, 4, 14); ctx.fillRect(1, 58, 1.5, 14);
      ctx.restore();
      break;
    }
    case 'banner': {
      ctx.fillStyle = '#16110e'; ctx.fillRect(x - 2, y - 220, 4, 220);
      ctx.fillStyle = '#4a0b0b';
      ctx.beginPath(); ctx.moveTo(x + 2, y - 214);
      for (let i = 0; i <= 6; i++) ctx.lineTo(x + 2 + 40 + Math.sin(t * 2 + i) * 3, y - 214 + i * 16);
      ctx.lineTo(x + 30, y - 110); ctx.lineTo(x + 22, y - 126); ctx.lineTo(x + 14, y - 104); ctx.lineTo(x + 2, y - 118); ctx.fill();
      ctx.fillStyle = '#c9b77a'; ctx.beginPath(); ctx.arc(x + 22, y - 180, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#4a0b0b'; ctx.beginPath(); ctx.arc(x + 22, y - 180, 3, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case 'pillar':
      ctx.fillStyle = '#16151a'; ctx.fillRect(x - 18, y - 300, 36, 300);
      ctx.fillStyle = '#1e1d23'; ctx.fillRect(x - 24, y - 300, 48, 14); ctx.fillRect(x - 24, y - 16, 48, 16);
      ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(x + 6, y - 286, 12, 270);
      break;
    case 'statue': {
      const s = p.big ? 1.6 : 1;
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      ctx.fillStyle = '#25242a'; ctx.fillRect(-22, -40, 44, 40);
      ctx.fillStyle = '#2f2e35';
      ctx.beginPath(); ctx.moveTo(-14, -40); ctx.lineTo(-18, -110); ctx.quadraticCurveTo(0, -128, 18, -110); ctx.lineTo(14, -40); ctx.fill();
      ctx.beginPath(); ctx.arc(0, -122, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(-22, -104, 44, 6);
      ctx.fillStyle = '#7a0000'; ctx.fillRect(-4, -122, 1.5, 22); ctx.fillRect(3, -122, 1.5, 30);
      ctx.restore();
      break;
    }
    case 'candles':
      for (let i = 0; i < 7; i++) {
        const cx = x + i * 9 - 30, ch = 8 + ((i * 7) % 5) * 3;
        ctx.fillStyle = '#c8bc9e'; ctx.fillRect(cx, y - ch, 4, ch);
        ctx.fillStyle = `rgba(255,190,90,${0.7 + Math.sin(t * 11 + i) * 0.3})`; ctx.beginPath(); ctx.ellipse(cx + 2, y - ch - 4, 1.8, 3.5, 0, 0, Math.PI * 2); ctx.fill();
      }
      break;
    case 'brazier':
      ctx.fillStyle = '#1b1a1e'; ctx.fillRect(x - 3, y - 60, 6, 60); ctx.fillRect(x - 14, y - 4, 28, 4);
      ctx.beginPath(); ctx.moveTo(x - 18, y - 70); ctx.lineTo(x + 18, y - 70); ctx.lineTo(x + 10, y - 56); ctx.lineTo(x - 10, y - 56); ctx.fill();
      break;
    case 'cathedral': {
      const open = game && game.flags.bossDead;
      ctx.fillStyle = '#0f0f13'; ctx.fillRect(x - 130, y - 420, 300, 420);
      ctx.fillStyle = '#16161b';
      ctx.beginPath(); ctx.moveTo(x - 140, y - 420); ctx.lineTo(x + 20, y - 520); ctx.lineTo(x + 180, y - 420); ctx.fill();
      ctx.fillStyle = '#0a0a0d'; ctx.beginPath(); ctx.arc(x + 20, y - 330, 40, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#2a1a22'; ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.beginPath(); ctx.moveTo(x + 20, y - 330); ctx.lineTo(x + 20 + Math.cos(a) * 40, y - 330 + Math.sin(a) * 40); ctx.stroke(); }
      ctx.fillStyle = 'rgba(150,20,20,0.25)'; ctx.beginPath(); ctx.arc(x + 20, y - 330, 38, 0, Math.PI * 2); ctx.fill();
      // doors
      ctx.fillStyle = '#060507';
      ctx.beginPath(); ctx.moveTo(x - 40, y); ctx.lineTo(x - 40, y - 150); ctx.quadraticCurveTo(x + 20, y - 220, x + 80, y - 150); ctx.lineTo(x + 80, y); ctx.fill();
      if (open) {
        const gl = ctx.createLinearGradient(0, y - 180, 0, y);
        gl.addColorStop(0, 'rgba(160,20,20,0.05)'); gl.addColorStop(1, `rgba(190,30,20,${0.35 + Math.sin(t * 1.4) * 0.12})`);
        ctx.fillStyle = gl; ctx.beginPath(); ctx.moveTo(x - 30, y); ctx.lineTo(x - 30, y - 145); ctx.quadraticCurveTo(x + 20, y - 205, x + 70, y - 145); ctx.lineTo(x + 70, y); ctx.fill();
      } else {
        ctx.fillStyle = '#211812'; ctx.fillRect(x - 34, y - 150, 52, 150); ctx.fillRect(x + 22, y - 150, 52, 150);
        ctx.fillStyle = '#3a3a3a'; ctx.fillRect(x - 34, y - 100, 108, 6); ctx.fillRect(x - 34, y - 40, 108, 6);
      }
      break;
    }
  }
}

// Shrines: stone altars topped with a grey lantern
function drawShrine(ctx, s, t, kindled, near) {
  const x = s.x, y = GROUND;
  ctx.fillStyle = '#26232a'; ctx.fillRect(x - 26, y - 36, 52, 36);
  ctx.fillStyle = '#322e36'; ctx.fillRect(x - 32, y - 42, 64, 8);
  ctx.fillStyle = '#1b181e'; ctx.fillRect(x - 3, y - 74, 6, 32);
  ctx.fillRect(x - 12, y - 76, 24, 4);
  // lantern
  ctx.fillStyle = '#3a3a40'; ctx.fillRect(x - 9, y - 100, 18, 3); ctx.fillRect(x - 7, y - 97, 14, 20);
  ctx.beginPath(); ctx.moveTo(x - 9, y - 100); ctx.lineTo(x, y - 110); ctx.lineTo(x + 9, y - 100); ctx.fill();
  const f = kindled ? 0.8 + Math.sin(t * 7) * 0.12 + Math.sin(t * 13) * 0.06 : 0.12;
  ctx.fillStyle = kindled ? `rgba(255,190,100,${f})` : 'rgba(120,120,140,0.25)';
  ctx.fillRect(x - 5, y - 95, 10, 16);
  if (kindled) {
    ctx.globalCompositeOperation = 'lighter';
    const gr = ctx.createRadialGradient(x, y - 88, 2, x, y - 88, 150);
    gr.addColorStop(0, `rgba(255,170,80,${0.32 * f})`); gr.addColorStop(1, 'rgba(255,170,80,0)');
    ctx.fillStyle = gr; ctx.fillRect(x - 150, y - 240, 300, 300);
    ctx.globalCompositeOperation = 'source-over';
    if (chance(0.08)) FX.ember(x + rand(-6, 6), y - 92);
  }
  if (near && !kindled) {
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = `rgba(200,200,255,${0.08 + Math.sin(t * 3) * 0.04})`;
    ctx.beginPath(); ctx.arc(x, y - 88, 20, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
}

// NPCs
const NPC_STYLES = {
  osric: {
    helm: 'cowl', hood: '#3b3127', skin: '#b39882', armor: '#3b3127', armorDark: '#2f271f', armorLight: '#4a3f33',
    body: '#3b3127', tabard: '#2f271f', tabardLen: 26, leg: '#3b3127', legDark: '#2f271f', boot: '#1d1813', bootDark: '#16120e',
    hand: '#b39882', limbW: 7, hipW: 9, shW: 10, belt: '#6a5a40',
  },
  wren: {
    helm: 'kerchief', kerchief: '#6b2a22', hair: '#4a2d18', skin: '#c9a68c', armor: '#57473a', armorDark: '#46392e', armorLight: '#6a5848',
    body: '#625040', tabard: '#3f3328', tabardLen: 18, leg: '#3a3028', legDark: '#2c241e', boot: '#211a14', bootDark: '#18130f',
    hand: '#c9a68c', limbW: 5, hipW: 7, shW: 8,
  },
};

function drawNPC(ctx, n, t, game) {
  const x = n.x, y = GROUND;
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(x, y + 3, 20, 4, 0, 0, Math.PI * 2); ctx.fill();
  if (n.id === 'osric') {
    // sitting against the cart, clutching his side
    const pose = basePose({ lean: -0.35 + Math.sin(t * 1.3) * 0.02, head: 0.35, armF: 0.6, elbowF: 1.9, armB: 0.3, elbowB: 1.6, legF: 1.5, kneeF: 0.15, legB: 1.35, kneeB: 0.4 });
    const j = solveRig(pose);
    ctx.save(); ctx.translate(x, y + 10); ctx.scale(-1, 1);
    drawHumanoid(ctx, j, pose, NPC_STYLES.osric, { head: true, armF: true, armB: true, legF: true, legB: true }, { t });
    ctx.restore();
    ctx.fillStyle = 'rgba(90,0,0,0.6)'; ctx.beginPath(); ctx.ellipse(x - 6, y + 5, 26, 5, 0, 0, Math.PI * 2); ctx.fill();
  } else if (n.id === 'wren') {
    const dig = (Math.sin(t * 2.4) + 1) / 2;
    const pose = basePose({ lean: 0.3 + dig * 0.35, head: 0.2, armF: 0.9 + dig * 0.6, elbowF: 0.8 - dig * 0.4, armB: 0.6 + dig * 0.5, elbowB: 1.0, weap: 0.4 + dig * 0.4, legF: 0.45, kneeF: 0.5, legB: -0.3, kneeB: 0.3 });
    const j = solveRig(pose);
    ctx.save(); ctx.translate(x, y); ctx.scale(-0.82, 0.82);
    drawHumanoid(ctx, j, pose, NPC_STYLES.wren, { head: true, armF: true, armB: true, legF: true, legB: true }, { weapon: c => drawWeaponShape(c, 'shovel', 0), t });
    ctx.restore();
    ctx.fillStyle = '#16100c'; ctx.beginPath(); ctx.ellipse(x - 42, y + 2, 26, 6, 0, Math.PI, 0); ctx.fill();
  }
}

// Notes lying on the ground (a pale scrap with a glimmer)
function drawNote(ctx, n, t, read) {
  const x = n.x, y = GROUND;
  ctx.fillStyle = '#b8ab8c'; ctx.save(); ctx.translate(x, y - 2); ctx.rotate(-0.15); ctx.fillRect(-7, -3, 14, 5); ctx.restore();
  if (!read) {
    ctx.globalCompositeOperation = 'lighter';
    const a = 0.25 + Math.sin(t * 3 + x) * 0.15;
    const g = ctx.createRadialGradient(x, y - 6, 0, x, y - 6, 22);
    g.addColorStop(0, `rgba(240,220,170,${a})`); g.addColorStop(1, 'rgba(240,220,170,0)');
    ctx.fillStyle = g; ctx.fillRect(x - 22, y - 28, 44, 44);
    ctx.globalCompositeOperation = 'source-over';
  }
}

// Fog wall that seals the boss arena
function drawFogGate(ctx, x, t) {
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 6; i++) {
    const yy = GROUND - 30 - i * 45;
    const xx = x + Math.sin(t * 1.3 + i) * 8;
    const g = ctx.createRadialGradient(xx, yy, 2, xx, yy, 70);
    g.addColorStop(0, 'rgba(200,200,215,0.14)'); g.addColorStop(1, 'rgba(200,200,215,0)');
    ctx.fillStyle = g; ctx.fillRect(xx - 70, yy - 70, 140, 140);
  }
  ctx.fillStyle = 'rgba(210,210,230,0.06)'; ctx.fillRect(x - 12, GROUND - 300, 24, 300);
  ctx.globalCompositeOperation = 'source-over';
}

// Weather & lighting overlays (screen space)
const Weather = {
  drops: [], ash: [],
  init() {
    for (let i = 0; i < 160; i++) this.drops.push({ x: rand(0, W), y: rand(0, H), v: rand(600, 900), l: rand(10, 20) });
    for (let i = 0; i < 70; i++) this.ash.push({ x: rand(0, W), y: rand(0, H), v: rand(15, 45), ph: rand(0, 6), r: rand(1, 2.4), hot: chance(0.35) });
  },
  draw(ctx, dt, playerX, camDX) {
    const zi = zoneIndex(playerX);
    const w = ZONES[zi].weather;
    if (w === 'rain') {
      ctx.strokeStyle = 'rgba(170,170,190,0.22)'; ctx.lineWidth = 1;
      ctx.beginPath();
      for (const d of this.drops) {
        d.y += d.v * dt; d.x -= d.v * 0.18 * dt + camDX * 0.6;
        if (d.y > H) { d.y = -20; d.x = rand(0, W + 100); }
        if (d.x < -20) d.x += W + 40; if (d.x > W + 40) d.x -= W + 60;
        ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - d.l * 0.18, d.y - d.l);
      }
      ctx.stroke();
    } else {
      for (const a of this.ash) {
        a.y += a.v * dt; a.x += Math.sin(a.ph + a.y * 0.02) * 20 * dt - camDX * 0.5;
        if (a.y > H) { a.y = -5; a.x = rand(0, W); }
        if (a.x < -10) a.x += W + 20; if (a.x > W + 10) a.x -= W + 20;
        ctx.fillStyle = a.hot ? `rgba(255,140,60,${0.5 + Math.sin(a.ph + a.y * 0.1) * 0.3})` : 'rgba(150,140,135,0.5)';
        ctx.fillRect(a.x, a.y, a.r, a.r);
      }
    }
  },
};
