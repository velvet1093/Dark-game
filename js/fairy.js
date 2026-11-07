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

  // Chibi fairy, drawn with soft cel shading and a violet outline so she reads at a glance.
  draw(ctx, t) {
    const L = this.look, sc = Mobile.enabled ? 1.25 : 1.1;
    const OL = '#3b2858';                       // outline
    const T = this.t, flap = Math.sin(T * 30), talking = !!this.bubble;
    const sway = Math.sin(T * 2.2) * 1.6 - clamp(this.vx / 70, -3, 3) * this.facing;
    const line = (w = 0.9) => { ctx.strokeStyle = OL; ctx.lineWidth = w; ctx.stroke(); };
    ctx.save();
    ctx.translate(this.x, this.y);
    // soft glow
    ctx.globalCompositeOperation = 'lighter';
    const gr = ctx.createRadialGradient(0, -16, 2, 0, -16, 54);
    gr.addColorStop(0, `rgba(${L.glow},0.42)`); gr.addColorStop(1, `rgba(${L.glow},0)`);
    ctx.fillStyle = gr; ctx.fillRect(-54, -70, 108, 108);
    ctx.globalCompositeOperation = 'source-over';
    ctx.scale(this.facing * sc, sc);
    ctx.rotate(clamp(this.vx / 500, -0.3, 0.3) * this.facing);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';

    // ---------------- wings
    const wing = (ax, ay, ang, len, wid, k) => {
      ctx.save(); ctx.translate(ax, ay); ctx.rotate(ang); ctx.scale(1, k);
      const wg = ctx.createLinearGradient(0, 0, -len, 0);
      wg.addColorStop(0, 'rgba(176,140,240,0.75)'); wg.addColorStop(0.6, 'rgba(210,190,255,0.55)'); wg.addColorStop(1, 'rgba(250,245,255,0.75)');
      ctx.fillStyle = wg;
      ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-len * 0.3, -wid * 1.2, -len * 0.9, -wid, -len, -wid * 0.1);
      ctx.bezierCurveTo(-len * 0.85, wid * 0.8, -len * 0.3, wid * 0.7, 0, 0);
      ctx.fill();
      ctx.strokeStyle = 'rgba(120,90,190,0.9)'; ctx.lineWidth = 0.8; ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(-2, 0); ctx.quadraticCurveTo(-len * 0.5, -wid * 0.3, -len * 0.92, -wid * 0.1);
      ctx.moveTo(-len * 0.35, -wid * 0.15); ctx.lineTo(-len * 0.55, -wid * 0.75);
      ctx.moveTo(-len * 0.55, -wid * 0.2); ctx.lineTo(-len * 0.75, wid * 0.45); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath(); ctx.arc(-len * 0.7, -wid * 0.35, 0.9, 0, Math.PI * 2); ctx.arc(-len * 0.45, wid * 0.25, 0.6, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    };
    const wk = 0.45 + Math.abs(flap) * 0.55;
    wing(-3, -17, 0.75, 30, 10, wk); wing(-3, -14, -0.15, 21, 7, wk);       // far pair
    // ---------------- back hair (long, flowing)
    const hg = ctx.createLinearGradient(0, -36, 0, 0);
    hg.addColorStop(0, '#ffffff'); hg.addColorStop(0.6, '#f0ecfa'); hg.addColorStop(1, '#cdbff0');
    ctx.fillStyle = hg;
    ctx.beginPath();
    ctx.moveTo(6, -33);
    ctx.bezierCurveTo(-6, -38, -14, -30, -12, -20);
    ctx.bezierCurveTo(-13 + sway, -12, -15 + sway * 1.4, -6, -12 + sway * 1.8, 1);
    ctx.lineTo(-9 + sway * 1.5, -3); ctx.lineTo(-7 + sway * 1.5, 2);
    ctx.lineTo(-5 + sway * 1.2, -4); ctx.lineTo(-2 + sway, 0);
    ctx.bezierCurveTo(-2, -10, 2, -16, 4, -20);
    ctx.closePath(); ctx.fill(); line();
    ctx.strokeStyle = 'rgba(150,130,200,0.55)'; ctx.lineWidth = 0.45;
    for (const [a, b] of [[-8, -1], [-10.5, -3], [-5, -2], [-12, -6]]) { ctx.beginPath(); ctx.moveTo(-6, -28); ctx.quadraticCurveTo(a - 3 + sway * 0.5, -14, b + a * 0.2 + sway * 1.5 + 4, b); ctx.stroke(); }

    // ---------------- legs
    const kick = Math.sin(T * 3.2) * 0.35;
    ctx.save(); ctx.translate(-1.5, -3); ctx.rotate(0.25 + kick);
    ctx.fillStyle = '#fbf8ff'; ctx.fillRect(-1.1, 0, 2.2, 6); ctx.strokeStyle = OL; ctx.lineWidth = 0.6; ctx.strokeRect(-1.1, 0, 2.2, 6);
    ctx.fillStyle = L.dressDark; ctx.beginPath(); ctx.ellipse(0.6, 6.6, 1.9, 1.2, 0, 0, Math.PI * 2); ctx.fill(); line(0.6);
    ctx.restore();
    ctx.save(); ctx.translate(2, -3); ctx.rotate(-0.2 - kick * 0.6);
    ctx.fillStyle = '#fbf8ff'; ctx.fillRect(-1.1, 0, 2.2, 6.5); ctx.strokeStyle = OL; ctx.lineWidth = 0.6; ctx.strokeRect(-1.1, 0, 2.2, 6.5);
    ctx.fillStyle = L.dressDark; ctx.beginPath(); ctx.ellipse(0.8, 7, 1.9, 1.2, 0, 0, Math.PI * 2); ctx.fill(); line(0.6);
    ctx.restore();

    // ---------------- dress: white petticoat frill, bell skirt, apron, bodice
    ctx.fillStyle = '#fbf8ff';
    ctx.beginPath(); for (let i = -9; i <= 9; i += 2.25) ctx.arc(i, -2.6 + Math.abs(i) * 0.06, 1.6, 0, Math.PI * 2); ctx.fill();
    const dg = ctx.createLinearGradient(-9, 0, 9, 0);
    dg.addColorStop(0, L.dressDark); dg.addColorStop(0.55, L.dress); dg.addColorStop(1, L.dressDark);
    ctx.fillStyle = dg;
    ctx.beginPath(); ctx.moveTo(-3.6, -17); ctx.lineTo(3.8, -17);
    ctx.bezierCurveTo(5, -12, 9, -7, 9.5, -3.4);
    ctx.quadraticCurveTo(0, -1.2, -9.5, -3.4);
    ctx.bezierCurveTo(-9, -7, -5, -12, -3.6, -17);
    ctx.closePath(); ctx.fill(); line();
    // apron with a frilled edge
    ctx.fillStyle = '#fdfbff';
    ctx.beginPath(); ctx.moveTo(-1, -12.5); ctx.lineTo(4.4, -12.5); ctx.quadraticCurveTo(7, -7, 6.4, -4.2); ctx.quadraticCurveTo(2, -3, -2.4, -4.4); ctx.quadraticCurveTo(-2.6, -8, -1, -12.5); ctx.fill(); line(0.6);
    ctx.fillStyle = '#ffffff';
    for (let i = -2; i <= 6; i += 1.6) { ctx.beginPath(); ctx.arc(i, -4 + (i - 2) * (i - 2) * 0.02, 0.8, 0, Math.PI); ctx.fill(); }
    // bodice, collar and bow
    ctx.fillStyle = L.dress; ctx.beginPath(); ctx.moveTo(-3.6, -17); ctx.lineTo(3.8, -17); ctx.lineTo(4.4, -12.4); ctx.lineTo(-3.2, -12.4); ctx.closePath(); ctx.fill(); line(0.6);
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(-3.4, -17.6); ctx.quadraticCurveTo(0.4, -14.4, 4.2, -17.6); ctx.lineTo(3.4, -18.6); ctx.lineTo(-2.6, -18.6); ctx.closePath(); ctx.fill(); line(0.5);
    ctx.fillStyle = L.ribbon;
    ctx.beginPath(); ctx.moveTo(0.4, -16); ctx.lineTo(-2.2, -17.4); ctx.lineTo(-2, -14.6); ctx.closePath(); ctx.fill(); line(0.4);
    ctx.beginPath(); ctx.moveTo(0.4, -16); ctx.lineTo(3, -17.4); ctx.lineTo(2.8, -14.6); ctx.closePath(); ctx.fill(); line(0.4);
    ctx.beginPath(); ctx.moveTo(0, -15.6); ctx.lineTo(-1, -12.2); ctx.lineTo(0.4, -13.4); ctx.lineTo(1.6, -12.2); ctx.lineTo(0.8, -15.6); ctx.fill();

    // ---------------- near pair of wings
    wing(-2.5, -16, 0.95, 28, 9.5, wk * 0.95); wing(-2.5, -13, 0.05, 19, 6.5, wk * 0.95);

    // ---------------- arms: puffed sleeves with white cuffs, the front one waving
    const arm = (ox, ang, front) => {
      ctx.save(); ctx.translate(ox, -16.2); ctx.rotate(ang);
      ctx.fillStyle = front ? L.dress : L.dressDark; ctx.beginPath(); ctx.ellipse(0, 2, 2.6, 2.9, 0, 0, Math.PI * 2); ctx.fill(); line(0.6);
      ctx.fillStyle = '#f6e2d8'; ctx.fillRect(-0.9, 4.2, 1.8, 4.2); ctx.strokeStyle = OL; ctx.lineWidth = 0.5; ctx.strokeRect(-0.9, 4.2, 1.8, 4.2);
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.ellipse(0, 4.6, 1.8, 0.9, 0, 0, Math.PI * 2); ctx.fill(); line(0.4);
      ctx.fillStyle = '#f6e2d8'; ctx.beginPath(); ctx.arc(0, 9.2, 1.3, 0, Math.PI * 2); ctx.fill(); line(0.5);
      ctx.restore();
    };
    arm(-2.8, 0.45, false);
    arm(3.2, talking ? -2.6 + Math.sin(T * 11) * 0.45 : -0.5 + Math.sin(T * 1.6) * 0.15, true);

    // ---------------- head
    const hx = 1, hy = -27, R = 8.6;
    ctx.fillStyle = '#f8e4d8'; ctx.beginPath(); ctx.ellipse(hx, hy, R, R * 0.96, 0, 0, Math.PI * 2); ctx.fill(); line();
    // pointed elf ear
    ctx.fillStyle = '#f8e4d8'; ctx.beginPath(); ctx.moveTo(hx + 5.5, hy - 1); ctx.lineTo(hx + 12, hy - 6.5); ctx.lineTo(hx + 7, hy + 2.5); ctx.closePath(); ctx.fill(); line(0.6);
    ctx.fillStyle = 'rgba(240,150,170,0.5)'; ctx.beginPath(); ctx.moveTo(hx + 6.4, hy - 0.6); ctx.lineTo(hx + 10.4, hy - 4.6); ctx.lineTo(hx + 7.2, hy + 1.2); ctx.fill();
    // eyes (3/4 view: near eye larger), blinking every few seconds
    const blink = (T % 4.1) < 0.12;
    const eye = (ex, ey, w, h) => {
      if (blink) { ctx.strokeStyle = OL; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(ex, ey - 0.3, w, 0.15, Math.PI - 0.15); ctx.stroke(); return; }
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.ellipse(ex, ey, w, h, 0, 0, Math.PI * 2); ctx.fill();
      const ig = ctx.createLinearGradient(0, ey - h, 0, ey + h);
      ig.addColorStop(0, '#2e1658'); ig.addColorStop(0.5, L.eye); ig.addColorStop(1, '#e2d2ff');
      ctx.fillStyle = ig; ctx.beginPath(); ctx.ellipse(ex + w * 0.12, ey + h * 0.05, w * 0.82, h * 0.9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1a0c30'; ctx.beginPath(); ctx.ellipse(ex + w * 0.15, ey, w * 0.36, h * 0.42, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.ellipse(ex - w * 0.25, ey - h * 0.4, w * 0.32, h * 0.26, -0.4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(ex + w * 0.4, ey + h * 0.45, w * 0.14, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#24123a'; ctx.lineWidth = 1.1; // thick upper lash with a flick
      ctx.beginPath(); ctx.moveTo(ex - w * 1.1, ey - h * 0.55); ctx.quadraticCurveTo(ex, ey - h * 1.35, ex + w * 1.15, ey - h * 0.6); ctx.lineTo(ex + w * 1.5, ey - h * 0.9); ctx.stroke();
    };
    eye(hx + 4.4, hy + 0.6, 2.4, 3.3);
    eye(hx - 1.4, hy + 0.4, 1.8, 3.0);
    ctx.strokeStyle = 'rgba(180,160,215,0.9)'; ctx.lineWidth = 0.5; // brows
    ctx.beginPath(); ctx.moveTo(hx + 2.6, hy - 4.6); ctx.quadraticCurveTo(hx + 4.6, hy - 5.4, hx + 6.6, hy - 4.6); ctx.moveTo(hx - 2.8, hy - 4.4); ctx.lineTo(hx - 0.4, hy - 4.8); ctx.stroke();
    ctx.fillStyle = 'rgba(245,140,170,0.55)'; // blush
    ctx.beginPath(); ctx.ellipse(hx + 5.2, hy + 4.6, 1.8, 0.9, 0, 0, Math.PI * 2); ctx.ellipse(hx - 2.4, hy + 4.4, 1.3, 0.8, 0, 0, Math.PI * 2); ctx.fill();
    if (talking && Math.sin(T * 14) > -0.3) { // happy open mouth while she speaks
      ctx.fillStyle = '#8a2a40'; ctx.beginPath(); ctx.moveTo(hx + 1.2, hy + 4.8); ctx.quadraticCurveTo(hx + 2.4, hy + 7.4, hx + 3.8, hy + 4.8); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#f08aa0'; ctx.beginPath(); ctx.ellipse(hx + 2.5, hy + 6.2, 0.9, 0.5, 0, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.strokeStyle = '#8a3a50'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(hx + 1.4, hy + 5); ctx.quadraticCurveTo(hx + 2.5, hy + 6, hx + 3.6, hy + 5); ctx.stroke();
    }
    // ---------------- bangs, crown and side locks
    ctx.fillStyle = hg;
    ctx.beginPath();
    ctx.moveTo(hx - R - 0.6, hy + 2);
    ctx.bezierCurveTo(hx - R - 1.5, hy - R - 2, hx + R * 0.6, hy - R - 4, hx + R + 0.8, hy - 1.5);
    ctx.lineTo(hx + 7.2, hy - 2.4); ctx.lineTo(hx + 6.6, hy + 0.4); ctx.lineTo(hx + 5, hy - 3.6);
    ctx.lineTo(hx + 3.4, hy - 0.6); ctx.lineTo(hx + 2, hy - 4.4); ctx.lineTo(hx + 0.2, hy - 1.2);
    ctx.lineTo(hx - 1.4, hy - 4.2); ctx.lineTo(hx - 3.2, hy - 1.4); ctx.lineTo(hx - 4.6, hy - 4);
    ctx.lineTo(hx - 6.4, hy + 1);
    ctx.closePath(); ctx.fill(); line();
    ctx.strokeStyle = 'rgba(160,140,205,0.6)'; ctx.lineWidth = 0.45;
    for (const bx of [-3.6, -0.6, 2.6, 5.6]) { ctx.beginPath(); ctx.moveTo(hx + bx - 1, hy - R + 0.5); ctx.lineTo(hx + bx + 0.4, hy - 2.4); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(255,255,255,1)'; ctx.lineWidth = 1; // angel-ring sheen
    ctx.beginPath(); ctx.arc(hx, hy - 1, R - 1.6, Math.PI * 1.15, Math.PI * 1.6); ctx.stroke();
    // side lock framing the face, falling to the chest
    ctx.fillStyle = hg;
    ctx.beginPath(); ctx.moveTo(hx - 6.4, hy - 1); ctx.bezierCurveTo(hx - 8.4, hy + 6, hx - 5.4 + sway * 0.3, hy + 11, hx - 6.6 + sway * 0.4, hy + 15);
    ctx.lineTo(hx - 4.2 + sway * 0.4, hy + 12.5); ctx.bezierCurveTo(hx - 4.2, hy + 7, hx - 4.6, hy + 3, hx - 4.6, hy - 1); ctx.closePath(); ctx.fill(); line(0.7);
    // ahoge: one stubborn strand on top
    ctx.strokeStyle = OL; ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.moveTo(hx + 1, hy - R - 2); ctx.quadraticCurveTo(hx + 4 + Math.sin(T * 4) * 1.5, hy - R - 9, hx + 7 + Math.sin(T * 4) * 2, hy - R - 6); ctx.stroke();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 0.5; ctx.stroke();
    // ---------------- frilled headband with lavender ribbons
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(hx, hy, R + 1.4, Math.PI * 1.1, Math.PI * 1.84); ctx.arc(hx, hy, R - 0.4, Math.PI * 1.84, Math.PI * 1.1, true); ctx.closePath(); ctx.fill(); line(0.6);
    for (let a = 1.12; a < 1.85; a += 0.09) { ctx.beginPath(); ctx.arc(hx + Math.cos(a * Math.PI) * (R + 1.8), hy + Math.sin(a * Math.PI) * (R + 1.8), 1.15, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = L.ribbon;
    ctx.beginPath(); ctx.moveTo(hx - R + 0.5, hy - 4); ctx.lineTo(hx - R - 4.5, hy - 7.5); ctx.lineTo(hx - R - 3.6, hy - 2.6); ctx.closePath(); ctx.fill(); line(0.5);
    ctx.beginPath(); ctx.moveTo(hx - R + 0.5, hy - 4); ctx.lineTo(hx - R - 3 + sway * 0.4, hy + 3); ctx.lineTo(hx - R - 1, hy + 2.4); ctx.closePath(); ctx.fill(); line(0.5);
    ctx.restore();
  }

  drawBubble(ctx) {
    const b = this.bubble; if (!b) return;
    const a = b.t < 0.2 ? b.t / 0.2 : b.t > b.life - 0.4 ? (b.life - b.t) / 0.4 : 1;
    ctx.globalAlpha = clamp(a, 0, 1);
    ctx.font = `12px ${BODY_FONT}`;
    const lines = wrapText(ctx, b.text, 190);
    const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + 18, h = lines.length * 15 + 22;
    const x = clamp(this.x - w / 2, Game.viewL + 6, Game.viewR - w - 6), y = this.y - 60 - h;
    ctx.fillStyle = 'rgba(28,18,42,0.88)';
    rr(ctx, x, y, w, h, 6); ctx.fill();
    ctx.strokeStyle = 'rgba(200,175,255,0.75)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(this.x - 4, y + h); ctx.lineTo(this.x, y + h + 9); ctx.lineTo(this.x + 4, y + h); ctx.closePath();
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
  zone_town: () => 'Brackenford! Real people, with real hearths. The Sisters\' chapel is at the far end of town.',
  zone_village: () => 'Hallowmere... it was so pretty once. Mind the fires.',
  zone_mire: () => 'The Mire. Even the air feels sick. Don\'t let them bite you, and stay away from the fat ones when they fall.',
  zone_cathedral: () => 'The cathedral. I can feel the Heart beating from here. Every beat makes more of them.',
  infect: () => 'That red under your skin... it\'s spreading. The Sisters can draw it out. Please don\'t wait too long.',
  turning: () => 'No, no, no, it\'s taking you! Drink a tonic or get to a Sister, NOW!',
  gate: () => "That fog... he's behind it. I can't follow you in there. Come back to me, alright?",
  respawn: () => 'Up you get! Your embers are still glowing where you fell.',
  bossdead: () => 'You did it! ...Oh, Gaul. Rest now.',
  shield: () => 'That one hides behind a shield. A heavy blow will break his guard!',
  help: () => "Someone's being attacked! Hurry, Sir Knight!",
  cripple: () => 'Ooh, he lost a leg. Now he can only crawl. Finish him!',
};
