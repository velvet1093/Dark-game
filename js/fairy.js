'use strict';
// ---------------------------------------------------------------------------
// Fairy guides. Each NPC is kept company by a tiny lavender fairy with long
// white hair, four dragonfly wings, a frilled headband and a long lavender
// dress with puffed sleeves. Lumi joins the knight after Brother Osric's
// story and offers advice along the road.
// ---------------------------------------------------------------------------
const FAIRY_LOOKS = {
  lumi: { dress: '#b9a2ea', dressDark: '#8f78cf', trim: '#f6f2ff', ribbon: '#7a5fc0', glow: '196,168,255', eye: '#7d5cc4' },
  pip: { dress: '#a58ddf', dressDark: '#7c64c2', trim: '#f2ecff', ribbon: '#c9a8ff', glow: '186,160,250', eye: '#6a4cb4' },
};

class Fairy {
  constructor(id, name, home) {
    this.id = id; this.name = name; this.look = FAIRY_LOOKS[id];
    this.home = home;               // NPC she keeps company with (or null when following)
    this.x = home ? home.x + 30 : 0; this.y = GROUND - 100;
    this.vx = 0; this.vy = 0; this.facing = -1;
    this.mode = home ? 'npc' : 'follow';
    this.t = Math.random() * 10;
    this.bubble = null;             // { text, t, life }
    this.greeted = false; this.greetT = 0;
    this.hintCd = 0;
  }

  say(text, life = 4.5, quiet = false) {
    this.bubble = { text, t: 0, life };
    if (!quiet) Sfx.play('fairy');
  }

  update(dt, g) {
    this.t += dt;
    if (this.bubble) { this.bubble.t += dt; if (this.bubble.t > this.bubble.life) this.bubble = null; }
    this.hintCd -= dt;
    const p = g.player;
    let tx, ty;
    if (this.mode === 'npc') {
      const h = this.home;
      tx = h.x + Math.sin(this.t * 0.8) * 34 + 6;
      ty = GROUND - 92 + Math.sin(this.t * 1.7) * 10;
      const near = Math.abs(p.x - h.x) < 230 && !p.dead;
      if (near && !this.greeted && !g.flags[h.id]) {
        this.greeted = true; this.greetT = 3.5;
        this.say(this.greeting(), 4.5);
      }
      if (this.greetT > 0) { // fly over to the knight to wave him down
        this.greetT -= dt;
        tx = p.x - p.facing * 10 + Math.sin(this.t * 3) * 10; ty = GROUND - 128 + Math.sin(this.t * 4) * 5;
      }
    } else {
      // following: hover behind the knight's shoulder, higher when blades are out
      const danger = g.enemies.some(e => !e.dead && Math.abs(e.x - p.x) < 200 && e.state !== 'dormant' && e.state !== 'idle');
      tx = p.x - p.facing * (danger ? 60 : 34) + Math.sin(this.t * 1.1) * 8;
      ty = GROUND - (danger ? 158 : 112) + Math.sin(this.t * 2.2) * 7;
      if (g.bossActive) { tx = LEVEL.bossGate - 46 + Math.sin(this.t) * 10; ty = GROUND - 120 + Math.sin(this.t * 2) * 8; }
    }
    // springy flight
    const k = 7, damp = 4.5;
    this.vx += ((tx - this.x) * k - this.vx * damp) * dt;
    this.vy += ((ty - this.y) * k - this.vy * damp) * dt;
    this.x += this.vx * dt; this.y += this.vy * dt;
    if (Math.abs(this.vx) > 12) this.facing = Math.sign(this.vx);
    else if (this.mode === 'follow') this.facing = p.facing;
    else this.facing = Math.sign(p.x - this.x) || -1;
    if (chance(dt * 16)) FX.add({ k: 'fy', x: this.x + rand(-6, 6), y: this.y + rand(-4, 10), vx: rand(-10, 10) - this.vx * 0.1, vy: rand(5, 30), t: 0, life: rand(0.5, 1.1), ph: rand(0, 6) });
  }

  greeting() {
    if (this.id === 'lumi') return 'Sir Knight! Over here! Brother Osric is hurt. Please, talk to him!';
    return 'Careful, she bites. ...Wren, I mean. Not me.';
  }

  draw(ctx, t) {
    const L = this.look, s = Mobile.enabled ? 1.5 : 1.35;
    const flap = Math.sin(this.t * 32);
    ctx.save();
    ctx.translate(this.x, this.y);
    // glow
    ctx.globalCompositeOperation = 'lighter';
    const gr = ctx.createRadialGradient(0, -8, 1, 0, -8, 40);
    gr.addColorStop(0, `rgba(${L.glow},0.38)`); gr.addColorStop(1, `rgba(${L.glow},0)`);
    ctx.fillStyle = gr; ctx.fillRect(-40, -48, 80, 80);
    ctx.globalCompositeOperation = 'source-over';
    ctx.scale(this.facing * s, s);
    const tilt = clamp(this.vx / 400, -0.35, 0.35) * this.facing;
    ctx.rotate(tilt);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // --- four dragonfly wings (behind the body)
    const wing = (ang, len, wid, sc) => {
      ctx.save(); ctx.translate(-2, -15); ctx.rotate(ang); ctx.scale(1, sc);
      ctx.fillStyle = 'rgba(205,182,255,0.42)';
      ctx.beginPath(); ctx.ellipse(-len / 2, 0, len / 2, wid, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(245,238,255,0.85)'; ctx.lineWidth = 0.7; ctx.stroke();
      ctx.strokeStyle = 'rgba(170,140,240,0.7)'; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-len * 0.95, 0);
      ctx.moveTo(-len * 0.3, 0); ctx.lineTo(-len * 0.55, -wid * 0.7); ctx.moveTo(-len * 0.5, 0); ctx.lineTo(-len * 0.75, wid * 0.6); ctx.stroke();
      ctx.restore();
    };
    const sc = 0.55 + Math.abs(flap) * 0.45;
    wing(0.55, 26, 6, sc); wing(-0.25, 20, 4.5, sc); // far pair
    // --- long white hair flowing behind: layered locks with strand texture
    const sway = Math.sin(this.t * 2.4) * 2 - clamp(this.vx / 60, -4, 4) * this.facing;
    const hg = ctx.createLinearGradient(0, -28, 0, 4);
    hg.addColorStop(0, '#ffffff'); hg.addColorStop(0.55, '#f1edfa'); hg.addColorStop(1, '#d9cff2'); // tips catch the lavender glow
    const lock = (x0, y0, cx, cy, ex, ey, w, col) => {
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.moveTo(x0 - w, y0);
      ctx.quadraticCurveTo(cx - w, cy, ex, ey);
      ctx.quadraticCurveTo(cx + w * 0.6, cy, x0 + w, y0);
      ctx.closePath(); ctx.fill();
    };
    // back layer (shadowed), then the main mass
    lock(-1, -25, -10 + sway * 0.4, -12, -9 + sway * 1.4, 4, 3.4, '#cfc6e6');
    lock(-2, -26, -11 + sway * 0.5, -14, -12 + sway * 1.6, 0, 3.0, '#ddd6ef');
    lock(0, -26, -8 + sway * 0.4, -12, -6 + sway * 1.2, 5, 3.6, hg);
    lock(-1, -27, -9 + sway * 0.3, -16, -10 + sway, -3, 3.2, hg);
    lock(1, -25, -5 + sway * 0.3, -10, -3 + sway, 3, 2.4, hg);
    // strand lines
    ctx.strokeStyle = 'rgba(160,145,200,0.55)'; ctx.lineWidth = 0.35;
    for (const [ox, ex, ey] of [[-2, -8.5, 3], [-3.5, -10.5, 0], [-0.5, -6, 4], [-4.5, -11.5, -2], [0.5, -4, 2]]) {
      ctx.beginPath(); ctx.moveTo(ox, -24); ctx.quadraticCurveTo(ox - 5 + sway * 0.3, -13, ex + sway * 1.3, ey); ctx.stroke();
    }
    // sheen
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.moveTo(-3, -21); ctx.quadraticCurveTo(-6 + sway * 0.2, -15, -6 + sway * 0.6, -10); ctx.stroke();

    // --- legs (white stockings, lavender shoes) peeking under the dress
    const kick = Math.sin(this.t * 3) * 0.3;
    ctx.strokeStyle = '#f4f0fa'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(-1, -3); ctx.lineTo(-2 - kick * 3, 3); ctx.moveTo(1.5, -3); ctx.lineTo(3 + kick * 2, 2.5); ctx.stroke();
    ctx.fillStyle = L.dressDark; ctx.beginPath(); ctx.arc(-2.2 - kick * 3, 3.6, 1.2, 0, Math.PI * 2); ctx.arc(3.2 + kick * 2, 3, 1.2, 0, Math.PI * 2); ctx.fill();

    // --- long dress: fitted bodice, flared skirt with lace hem
    ctx.fillStyle = L.dress;
    ctx.beginPath();
    ctx.moveTo(-2.4, -19); ctx.lineTo(2.6, -19);
    ctx.quadraticCurveTo(3.4, -13, 7, -2.5);
    ctx.quadraticCurveTo(0.5, 0.5, -6.5, -2.5);
    ctx.quadraticCurveTo(-3.4, -13, -2.4, -19);
    ctx.fill();
    ctx.fillStyle = L.dressDark; // fold shading
    ctx.beginPath(); ctx.moveTo(0, -12); ctx.quadraticCurveTo(-2, -6, -4.5, -2.2); ctx.lineTo(-2, -1.5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = L.trim; // scalloped lace hem
    for (let i = -6; i <= 6; i += 2.2) { ctx.beginPath(); ctx.arc(i + 0.4, -2.1 + Math.abs(i) * 0.05, 1.25, 0, Math.PI); ctx.fill(); }
    ctx.fillRect(-2.6, -19.6, 5.3, 1.4);            // white collar
    ctx.fillStyle = L.ribbon;                         // bow at the chest
    ctx.beginPath(); ctx.moveTo(0.2, -16.6); ctx.lineTo(-2, -17.8); ctx.lineTo(-2, -15.4); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0.2, -16.6); ctx.lineTo(2.4, -17.8); ctx.lineTo(2.4, -15.4); ctx.closePath(); ctx.fill();
    ctx.fillRect(-2.3, -13.2, 4.8, 1.1);              // sash

    // --- near pair of wings (in front of the hair, behind the arms)
    wing(0.75, 24, 5.5, sc * 0.95); wing(-0.05, 17, 4, sc * 0.95);

    // --- arms in puffed sleeves, one waving
    const wave = this.bubble ? Math.sin(this.t * 10) * 0.5 : Math.sin(this.t * 1.5) * 0.15;
    const arm = (ang, front) => {
      ctx.save(); ctx.translate(front ? 1.6 : -1.6, -17.8); ctx.rotate(ang);
      ctx.fillStyle = front ? L.dress : L.dressDark; ctx.beginPath(); ctx.ellipse(0, 1.8, 2, 2.4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = front ? L.dress : L.dressDark; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, 3); ctx.lineTo(0, 7.5); ctx.stroke();
      ctx.fillStyle = L.trim; ctx.fillRect(-1, 7, 2, 1);
      ctx.fillStyle = '#f2dccd'; ctx.beginPath(); ctx.arc(0, 9, 1, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    };
    arm(0.5, false);
    arm(-2.4 + wave, true);

    // --- head
    ctx.fillStyle = '#f3ddd0'; ctx.beginPath(); ctx.arc(0.6, -23.6, 4.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(200,150,150,0.25)'; ctx.beginPath(); ctx.arc(-0.6, -22.4, 3.6, Math.PI * 0.5, Math.PI * 1.2); ctx.fill(); // cheek shade
    ctx.fillStyle = '#f3ddd0';
    ctx.beginPath(); ctx.moveTo(3, -24.5); ctx.lineTo(7.2, -27.5); ctx.lineTo(3.6, -22.6); ctx.fill(); // pointed ear
    ctx.fillStyle = 'rgba(220,150,150,0.5)'; ctx.beginPath(); ctx.moveTo(3.6, -24.2); ctx.lineTo(6.2, -26.6); ctx.lineTo(3.9, -23.2); ctx.fill();
    // crown of the hair with a soft halo of sheen
    const cg = ctx.createLinearGradient(0, -29, 0, -21);
    cg.addColorStop(0, '#ffffff'); cg.addColorStop(1, '#e9e4f6');
    ctx.fillStyle = cg;
    ctx.beginPath(); ctx.arc(0.2, -24.4, 4.9, Math.PI * 0.92, Math.PI * 2.05); ctx.closePath(); ctx.fill();
    // bangs: separate pointed locks
    ctx.beginPath();
    ctx.moveTo(-4.4, -24.6);
    ctx.quadraticCurveTo(-3.6, -22, -3.9, -20.8);   // side lock tip
    ctx.lineTo(-2.2, -23.6);
    ctx.lineTo(-1.1, -21.4); ctx.lineTo(0.1, -24.4);
    ctx.lineTo(1.3, -21.9); ctx.lineTo(2.2, -24.6);
    ctx.lineTo(3.4, -22.6); ctx.lineTo(4.3, -24.6);
    ctx.lineTo(4.9, -24.8);
    ctx.lineTo(4.6, -26.6); ctx.lineTo(-4.2, -26.6);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(170,155,205,0.6)'; ctx.lineWidth = 0.3;
    for (const [a, b] of [[-0.6, -21.8], [0.9, -22.3], [2.8, -23], [-2.5, -22.8]]) { ctx.beginPath(); ctx.moveTo(a - 0.6, -26.4); ctx.lineTo(a, b); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.lineWidth = 0.55; // angel ring sheen
    ctx.beginPath(); ctx.arc(0.2, -24.4, 4, Math.PI * 1.2, Math.PI * 1.65); ctx.stroke();
    // eye: sclera, gradient iris, pupil, highlights, lashes; blinks now and then
    const blink = (this.t % 3.7) < 0.12;
    const ex = 2.75, ey = -22.7;
    if (blink) {
      ctx.strokeStyle = '#4a3050'; ctx.lineWidth = 0.55;
      ctx.beginPath(); ctx.arc(ex, ey - 0.2, 1.2, 0.2, Math.PI - 0.2); ctx.stroke();
    } else {
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.ellipse(ex, ey, 1.25, 1.7, 0, 0, Math.PI * 2); ctx.fill();
      const ig = ctx.createLinearGradient(0, ey - 1.6, 0, ey + 1.6);
      ig.addColorStop(0, '#3e2470'); ig.addColorStop(0.55, L.eye); ig.addColorStop(1, '#d6c2ff');
      ctx.fillStyle = ig; ctx.beginPath(); ctx.ellipse(ex + 0.25, ey + 0.1, 1.0, 1.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1e1030'; ctx.beginPath(); ctx.ellipse(ex + 0.3, ey + 0.05, 0.42, 0.7, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(ex - 0.05, ey - 0.6, 0.38, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(ex + 0.65, ey + 0.65, 0.18, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#2a1830'; ctx.lineWidth = 0.6; // upper lash line with a flick
      ctx.beginPath(); ctx.moveTo(ex - 1.35, ey - 1.0); ctx.quadraticCurveTo(ex, ey - 2.2, ex + 1.5, ey - 1.1); ctx.lineTo(ex + 1.95, ey - 1.6); ctx.stroke();
      ctx.strokeStyle = 'rgba(80,50,90,0.5)'; ctx.lineWidth = 0.3;
      ctx.beginPath(); ctx.moveTo(ex - 0.6, ey + 1.65); ctx.lineTo(ex + 0.9, ey + 1.5); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(190,175,215,0.8)'; ctx.lineWidth = 0.35; // pale brow
    ctx.beginPath(); ctx.moveTo(ex - 1, ey - 3.1); ctx.quadraticCurveTo(ex + 0.3, ey - 3.6, ex + 1.6, ey - 3.0); ctx.stroke();
    ctx.fillStyle = 'rgba(240,140,170,0.5)'; ctx.beginPath(); ctx.ellipse(1.5, -20.6, 1.1, 0.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#a0607a'; ctx.lineWidth = 0.45; ctx.beginPath(); ctx.arc(3.5, -20.4, 0.7, 0.2, Math.PI * 0.9); ctx.stroke();
    // a side lock falling in front of the shoulder
    ctx.fillStyle = hg;
    ctx.beginPath(); ctx.moveTo(-0.5, -25); ctx.quadraticCurveTo(-3.6, -20, -2.6 + sway * 0.3, -13.5); ctx.lineTo(-1.4 + sway * 0.3, -14.5); ctx.quadraticCurveTo(-1.6, -20, 0.6, -24); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(160,145,200,0.5)'; ctx.lineWidth = 0.3;
    ctx.beginPath(); ctx.moveTo(-0.6, -23.5); ctx.quadraticCurveTo(-2.6, -19, -2.1 + sway * 0.3, -14.3); ctx.stroke();
    // frilled white headband with lavender ribbons
    ctx.fillStyle = L.trim;
    ctx.beginPath(); ctx.arc(0.3, -24.2, 5.4, Math.PI * 1.08, Math.PI * 1.85); ctx.arc(0.3, -24.2, 4.4, Math.PI * 1.85, Math.PI * 1.08, true); ctx.fill();
    for (let a = 1.1; a < 1.86; a += 0.13) { ctx.beginPath(); ctx.arc(0.3 + Math.cos(a * Math.PI) * 5.6, -24.2 + Math.sin(a * Math.PI) * 5.6, 0.9, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = L.ribbon;
    ctx.beginPath(); ctx.moveTo(-4.2, -26); ctx.lineTo(-7, -27.5); ctx.lineTo(-6.6, -24.6); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-4.2, -26); ctx.lineTo(-6.4, -22.4 + sway * 0.3); ctx.lineTo(-5, -22.8); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  drawBubble(ctx) {
    const b = this.bubble; if (!b) return;
    const a = b.t < 0.2 ? b.t / 0.2 : b.t > b.life - 0.4 ? (b.life - b.t) / 0.4 : 1;
    ctx.globalAlpha = clamp(a, 0, 1);
    ctx.font = `12px ${BODY_FONT}`;
    const lines = wrapText(ctx, b.text, 190);
    const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + 18, h = lines.length * 15 + 22;
    const x = clamp(this.x - w / 2, Game.viewL + 6, Game.viewR - w - 6), y = this.y - 50 - h;
    ctx.fillStyle = 'rgba(28,18,42,0.88)';
    rr(ctx, x, y, w, h, 6); ctx.fill();
    ctx.strokeStyle = 'rgba(200,175,255,0.75)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(this.x - 4, y + h); ctx.lineTo(this.x, y + h + 7); ctx.lineTo(this.x + 4, y + h); ctx.closePath();
    ctx.fillStyle = 'rgba(28,18,42,0.88)'; ctx.fill();
    ctx.fillStyle = '#c9b3ff'; ctx.font = `bold 9px ${TITLE_FONT}`; ctx.textAlign = 'left';
    ctx.fillText(this.name.toUpperCase(), x + 9, y + 12);
    ctx.font = `12px ${BODY_FONT}`; ctx.fillStyle = '#efe8ff';
    lines.forEach((l, i) => ctx.fillText(l, x + 9, y + 27 + i * 15));
    ctx.globalAlpha = 1;
  }
}

// Lumi's advice once she travels with the knight. Each fires once (or on a cooldown).
const FAIRY_HINTS = {
  shrine: () => 'A lantern shrine! Rest there. It will remember you when you fall.',
  exec: () => Mobile.enabled ? "It's staggering! Tap the red skull to finish it!" : "It's staggering! Press F to finish it!",
  lowhp: () => Mobile.enabled ? "You're bleeding everywhere! Drink a vial, the little jar button!" : "You're bleeding everywhere! Drink a vial! (Q)",
  novial: () => 'No vials left... Get back to a shrine, please!',
  note: () => "Something's written there. Read it?",
  zone1: () => 'Hallowmere... it was so pretty once. Mind the fires.',
  zone2: () => 'The cathedral. I can feel the Heart beating from here. I hate it.',
  gate: () => "That fog... he's behind it. I can't follow you in there. Come back to me, alright?",
  respawn: () => 'Up you get! Your embers are still glowing where you fell.',
  bossdead: () => 'You did it! ...Oh, Gaul. Rest now.',
  shield: () => 'That one hides behind a shield. A heavy blow will break his guard!',
  help: () => "Someone's being attacked! Hurry, Sir Knight!",
  cripple: () => 'Ooh, he lost a leg. Now he can only crawl. Finish him!',
};
