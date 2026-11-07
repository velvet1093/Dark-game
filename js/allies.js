'use strict';
// ---------------------------------------------------------------------------
// Survivors: living NPCs out on the map. Enemies hunt them once the knight is
// close enough to see it happen. Fighters stand their ground and strike back;
// civilians can only cower, and they die if nobody saves them.
// A dead survivor stays dead (saved), and their quest fails.
// ---------------------------------------------------------------------------
const ALLY_DEFS = {
  bram: {
    name: 'Sergeant Bram', fighter: true, hp: 170, dmg: 15, reach: 78, scale: 1.02, weapon: 'spear', shield: true, quest: 'bram',
    idle: { lean: 0.05, armF: 0.85, elbowF: 0.8, weap: 2.2, armB: 1.15, elbowB: 0.55, legF: 0.35, kneeF: 0.3, legB: -0.3, kneeB: 0.15 },
    style: {
      helm: 'kettle', helmCol: '#6a675e', skin: '#c79a7e', eye: '#1a1210', armor: '#5d5a52', armorDark: '#45423c', armorLight: '#7a776e',
      body: '#4a4842', tabard: '#2b4a6b', tabardLen: 16, leg: '#3e3b35', legDark: '#2d2b27', boot: '#221e1a', bootDark: '#181512',
      hand: '#3a3833', limbW: 7, hipW: 8.5, shW: 10.5, belt: '#2a1d14', shield: '#2b4a6b', shieldRim: '#7a776e', emblemCol: '#c9b77a',
    },
    voice: 140,
  },
  odo: {
    name: 'Odo the Sellsword', fighter: true, hp: 210, dmg: 19, reach: 72, scale: 1.08, weapon: 'falchion', quest: 'odo',
    idle: { lean: 0.12, armF: 0.7, elbowF: 0.9, weap: 2.0, armB: 0.2, elbowB: 0.9, legF: 0.4, kneeF: 0.35, legB: -0.35, kneeB: 0.2 },
    style: {
      helm: 'man', skin: '#b8866a', hair: '#3a2416', beard: '#4a2c18', scar: true, armor: '#5a4030', armorDark: '#46321f', armorLight: '#6e5240',
      body: '#4a3626', tabard: '#7a1a18', tabardLen: 14, leg: '#3a2e24', legDark: '#2b221a', boot: '#1e1712', bootDark: '#15100c',
      hand: '#b8866a', limbW: 8, hipW: 9.5, shW: 12, belt: '#1d140c', pauldron: false,
    },
    voice: 110,
  },
  hedda: {
    name: 'Hedda', fighter: false, hp: 95, scale: 0.9, quest: 'hedda',
    idle: { lean: 0.1, armF: 0.6, elbowF: 1.6, armB: 0.5, elbowB: 1.7, legF: 0.15, kneeF: 0.1, legB: -0.12, kneeB: 0.1, head: 0.2 },
    style: {
      helm: 'kerchief', kerchief: '#5a3a4a', hair: '#7a5030', skin: '#d0ad92', armor: '#6b5560', armorDark: '#56434d', armorLight: '#7e6672',
      body: '#6b5560', tabard: '#4a3a40', tabardLen: 30, leg: '#4a3a40', legDark: '#3a2e33', boot: '#241b18', bootDark: '#1b1412',
      hand: '#d0ad92', limbW: 5.5, hipW: 8, shW: 8.5,
    },
    voice: 260,
  },
  anselm: {
    name: 'Brother Anselm', fighter: false, hp: 85, scale: 0.98, quest: 'anselm',
    idle: { lean: 0.2, armF: 1.7, elbowF: 1.7, armB: 1.6, elbowB: 1.8, legF: 0.2, kneeF: 0.15, legB: -0.15, kneeB: 0.1, head: 0.3 },
    style: {
      helm: 'cowl', hood: '#58554f', skin: '#c2a690', armor: '#6a675f', armorDark: '#55524b', armorLight: '#7c7970',
      body: '#6a675f', tabard: '#55524b', tabardLen: 30, leg: '#6a675f', legDark: '#55524b', boot: '#201c18', bootDark: '#18150f',
      hand: '#c2a690', limbW: 6.5, hipW: 9, shW: 10, belt: '#a08a50',
    },
    voice: 170,
  },
};

const ALLY_TALK = {
  bram: {
    intro: [
      { who: 'Sergeant Bram', text: 'Stay back, they— oh. A knight. A real one. Thank God.' },
      { who: 'Sergeant Bram', text: 'Bram, sergeant of the road watch. What\'s left of it. The rest of my lads are hanging from those gallows.' },
      { who: 'Sergeant Bram', text: 'The hollowed keep crawling up this road. I can hold them a while, not forever. Help me clear them and I\'ll make it worth your while.' },
    ],
    progress: [{ who: 'Sergeant Bram', text: 'There\'s more of them down the road. Watch the ones on the ground. They\'re not dead, just patient.' }],
    complete: [
      { who: 'Sergeant Bram', text: 'That\'s the last of them. You fight like the old Order, sir.' },
      { who: 'Sergeant Bram', text: 'Take this. Wages I\'ll never get to spend. (+300 Embers)' },
    ],
    after: [{ who: 'Sergeant Bram', text: 'I\'ll hold the road now. Go on to Hallowmere. Someone there might still be breathing.' }],
  },
  hedda: {
    intro: [
      { who: 'Hedda', text: 'Please! Please, they\'re coming back, the singing ones, with the knives!' },
      { who: 'Hedda', text: 'I\'m Hedda. My husband kept the mill. They whipped him to death in the square and called it a blessing.' },
      { who: 'Hedda', text: 'Two of them are still hunting me. Please, sir... kill them before they find me.' },
    ],
    progress: [{ who: 'Hedda', text: 'They\'re close, I can hear them singing! Please hurry!' }],
    complete: [
      { who: 'Hedda', text: 'They\'re... gone? Truly?' },
      { who: 'Hedda', text: 'My husband carved this charm for me. It was blessed at the old chapel, before all this. Take it. It\'s all I have.' },
      { who: '', text: 'Received: Mill-Wife\'s Charm. Your vials increase by one.' },
    ],
    after: [{ who: 'Hedda', text: 'I\'ll wait here until dawn. If dawn still comes.' }],
  },
  odo: {
    intro: [
      { who: 'Odo', text: 'Ha! Another fool with a sword. Name\'s Odo. I fight for coin, and the garrison owes me three months of it.' },
      { who: 'Odo', text: 'They turned, see. Weeping and all. Still wearing my pay on their belts.' },
      { who: 'Odo', text: 'Help me cut down the garrison men by the old houses and we split the purse. Fair?' },
    ],
    progress: [{ who: 'Odo', text: 'Keep swinging, knight! Coin doesn\'t loot itself.' }],
    complete: [
      { who: 'Odo', text: 'Now THAT\'s a payday. Here\'s your half, as promised. (+500 Embers)' },
      { who: 'Odo', text: 'If you see a bishop, tell him Odo sends his regards. With a blade.' },
    ],
    after: [{ who: 'Odo', text: 'Don\'t look at me like that. Somebody\'s got to profit from the end of the world.' }],
  },
  anselm: {
    intro: [
      { who: 'Brother Anselm', text: 'Sir knight... do not look at the statues. They weep because they remember.' },
      { who: 'Brother Anselm', text: 'I am Anselm, keeper of the cathedral library. The Bishop tore a page from the Book of Varn before he sealed the doors.' },
      { who: 'Brother Anselm', text: 'It lies somewhere near the doors, past the templars. If you find it, bring it to me. I must know what he hid.' },
    ],
    progress: [{ who: 'Brother Anselm', text: 'The page... it should be further up the steps. Please, find it.' }],
    complete: [
      { who: 'Brother Anselm', text: '"What is a door, if not a thing that opens both ways..." Oh. Oh, Varn forgive us.' },
      { who: 'Brother Anselm', text: 'The Heart is not a relic. It is a gate. Malachar means to open it. Take these, and hurry. (+400 Embers)' },
    ],
    after: [{ who: 'Brother Anselm', text: 'I will pray for you, knight. I fear I pray to something that no longer listens.' }],
  },
};

class Ally {
  constructor(id, spawn, dead) {
    const d = ALLY_DEFS[id];
    this.id = id; this.def = d; this.name = d.name;
    this.homeX = spawn.x; this.x = spawn.x; this.y = GROUND; this.vx = 0;
    this.facing = 1; this.s = d.scale;
    this.maxHp = d.hp; this.hp = d.hp;
    this.state = 'idle'; this.st = 0; this.phase = ''; this.cool = 0.5; this.t = rand(0, 5);
    this.parts = { head: true, armF: true, armB: true, legF: true, legB: true };
    this.pose = basePose(d.idle); this.joints = solveRig(this.pose);
    this.body = { ox: 0, oy: 0, rot: 0 };
    this.dead = false; this.landed = false; this.hurtFlash = 0; this.lastHurt = 99;
    if (dead) { // already slain on an earlier visit: just a corpse
      this.dead = true; this.landed = true; this.body.rot = -Math.PI / 2; this.body.oy = -5; this.state = 'dead';
      this.parts.head = dead !== 'head';
    }
  }

  get fighter() { return this.def.fighter; }

  hurtbox() {
    if (this.dead) return { x: this.x, y: GROUND, w: 0, h: 0 };
    const h = (this.state === 'cower' ? 62 : 95) * this.s;
    return { x: this.x - 13 * this.s, y: GROUND - h, w: 26 * this.s, h };
  }

  worldPoint(p) {
    const c = Math.cos(this.body.rot), s = Math.sin(this.body.rot);
    const rx = p.x * c - p.y * s + this.body.ox, ry = p.x * s + p.y * c + this.body.oy;
    return { x: this.x + rx * this.s * this.facing, y: this.y + ry * this.s };
  }

  nearestFoe(g, range) {
    let best = null, bd = range;
    for (const e of g.enemies) {
      if (e.dead || e.boss || e.state === 'executed' || e.state === 'dormant') continue;
      const d = Math.abs(e.x - this.x);
      if (d < bd) { bd = d; best = e; }
    }
    return best;
  }

  update(dt, g) {
    this.t += dt; this.st += dt; this.lastHurt += dt;
    if (this.hurtFlash > 0) this.hurtFlash -= dt;
    if (this.dead) { this.updateDead(dt); return; }
    const p = g.player;
    const foe = this.nearestFoe(g, this.fighter ? 290 : 230);
    if (!foe && this.lastHurt > 4) this.hp = Math.min(this.maxHp, this.hp + this.maxHp * 0.06 * dt);
    const lo = this.homeX - (this.fighter ? 220 : 70), hi = this.homeX + (this.fighter ? 220 : 70);
    switch (this.state) {
      case 'idle':
      case 'return': {
        const hd = this.homeX - this.x;
        if (Math.abs(hd) > 6) { this.facing = Math.sign(hd); this.vx = this.facing * 70; this.state = 'return'; }
        else { this.vx = 0; this.state = 'idle'; this.facing = Math.sign(p.x - this.x) || 1; }
        if (foe) { this.state = this.fighter ? 'engage' : 'cower'; this.st = 0; }
        break;
      }
      case 'engage': {
        if (!foe) { this.state = 'idle'; break; }
        const dx = foe.x - this.x, dist = Math.abs(dx);
        this.facing = Math.sign(dx) || this.facing;
        if (dist > this.def.reach * 0.75) this.vx = this.facing * 105; else this.vx = 0;
        this.cool -= dt;
        if (dist < this.def.reach && this.cool <= 0) {
          this.state = 'windup'; this.st = 0; this.phase = 'wind'; this.vx = 0; this.hitDone = false;
          this.motion = pick(['over', 'thrust']);
          this.from = Object.assign({}, this.pose);
          const m = MOTIONS[this.motion];
          this.wind = basePose(Object.assign({}, this.def.idle, m.wind));
          this.strike = basePose(Object.assign({}, this.def.idle, m.strike));
          if (chance(0.3)) Sfx.voice && Sfx.ctx && !Sfx.muted && Sfx.voice(this.def.voice, 0.2, 0.15, [650, 1100]);
        }
        break;
      }
      case 'windup':
        this.vx = 0;
        if (this.st >= 0.5) { this.state = 'attack'; this.st = 0; this.phase = 'active'; Sfx.play('swing'); this.vx = this.facing * 90; }
        break;
      case 'attack': {
        this.vx *= Math.exp(-dt * 8);
        if (!this.hitDone) {
          const box = { x: this.facing > 0 ? this.x : this.x - this.def.reach, y: GROUND - 115, w: this.def.reach, h: 110 };
          for (const e of g.enemies) {
            if (e.dead || e.boss || e.state === 'executed') continue;
            if (overlap(box, e.hurtbox())) {
              this.hitDone = true;
              const r = e.takeHit({ dmg: this.def.dmg, poise: 16, bleed: 18, sever: 0.8, heavy: false, targets: { armF: 2, armB: 2, legF: 1 } }, this, g);
              if (r === 'blocked') { this.state = 'hurt'; this.st = 0; this.vx = -this.facing * 90; }
              break;
            }
          }
        }
        if (this.st >= 0.13 && this.state === 'attack') { this.state = 'recover'; this.st = 0; this.phase = 'recover'; }
        break;
      }
      case 'recover':
        this.vx *= Math.exp(-dt * 8);
        if (this.st >= 0.6) { this.state = 'engage'; this.phase = ''; this.cool = rand(0.5, 1.2); }
        break;
      case 'cower': {
        // civilians shrink away from danger as far as they dare
        if (!foe) { if (this.st > 1) { this.state = 'idle'; } this.vx = 0; break; }
        this.st = 0;
        const dir = Math.sign(this.x - foe.x) || 1;
        this.facing = -dir;
        this.vx = Math.abs(foe.x - this.x) < 130 ? dir * 55 : 0;
        if (chance(dt * 0.6) && !this.screamed) { this.screamed = true; this.scream(); }
        break;
      }
      case 'hurt':
        this.vx *= Math.exp(-dt * 8);
        if (this.st >= 0.4) { this.state = this.fighter ? 'engage' : 'cower'; this.st = 0; this.phase = ''; }
        break;
    }
    this.x += this.vx * dt;
    this.x = clamp(this.x, lo, hi);
    this.computePose(dt);
    this.joints = solveRig(this.pose);
  }

  scream() {
    if (!Sfx.ctx || Sfx.muted) return;
    try { Sfx.voice(this.def.voice * 1.3, 0.5, 0.18, [800, 1400]); } catch (e) { /* ignore */ }
    const c = this.worldPoint(this.joints.head);
    FX.text(c.x, c.y - 24, 'Help!', '#e8d0b0', 13);
  }

  // called by enemies; mirrors Player.hurt
  hurt(dmg, src) {
    if (this.dead) return false;
    const fromDir = Math.sign(src.x - this.x) || 1;
    // fighters raise their guard against some blows
    if (this.fighter && this.state !== 'attack' && this.state !== 'windup' && fromDir === this.facing && chance(0.35)) {
      Sfx.play('clang');
      const c = this.worldPoint(this.joints.chest); FX.sparks(c.x + this.facing * 14, c.y, 8);
      return 'block';
    }
    dmg *= 0.7;
    this.hp -= dmg; this.lastHurt = 0; this.hurtFlash = 0.2;
    const c = this.worldPoint(this.joints.chest);
    FX.slash(c.x, c.y, -fromDir, 12 + dmg * 0.4);
    Sfx.play('splat');
    if (Sfx.ctx && !Sfx.muted) { try { Sfx.voice(this.def.voice, 0.25, 0.2, [700, 1200]); } catch (e) { /* ignore */ } }
    if (this.hp <= 0) { this.die(src, dmg > 18); return 'hit'; }
    this.state = 'hurt'; this.st = 0; this.vx = -fromDir * 110; this.phase = '';
    return 'hit';
  }

  die(src, heavy) {
    this.dead = true; this.hp = 0; this.state = 'dead'; this.st = 0; this.vx = 0;
    const dir = Math.sign(this.x - src.x) || 1;
    this.fallTo = (dir * this.facing > 0 ? 1 : -1) * Math.PI / 2;
    let how = true;
    if (heavy || chance(0.35)) { // a brutal end
      const n = this.worldPoint(this.joints.neck);
      this.parts.head = false; how = 'head';
      FX.addGib({ part: 'head', style: this.def.style, s: this.s, facing: this.facing, x: n.x, y: n.y, vx: dir * rand(80, 200), vy: rand(-620, -420), vr: rand(-12, 12), bleed: 5 });
      FX.gush(n.x, n.y, -Math.PI / 2, 36, 440);
      Sfx.play('sever');
      this.fountain = 2;
    }
    const c = this.worldPoint(this.joints.chest);
    FX.blood(c.x, c.y, -Math.PI / 2, 1.2, 280, 30);
    Sfx.play('enemyDie');
    Game.onAllyDeath(this, how);
  }

  updateDead(dt) {
    if (this.landed && this.st > 1) return;
    const p = clamp(this.st / 0.6, 0, 1);
    this.body.rot = lerp(0, this.fallTo || -Math.PI / 2, easeIn(p));
    this.body.oy = lerp(0, -5, p);
    if (p >= 1 && !this.landed) {
      this.landed = true; FX.dust(this.x, GROUND, 6); Sfx.play('thud');
      const c = this.worldPoint(this.joints.chest); FX.pool(c.x, 34 * this.s);
    }
    if (this.fountain > 0) {
      this.fountain -= dt;
      const n = this.worldPoint(this.joints.neck);
      FX.blood(n.x, n.y, -Math.PI / 2 + this.body.rot * this.facing * 0.9, 0.25, 200 + this.fountain * 120, 2, 1);
    }
  }

  computePose(dt) {
    const d = this.def.idle, s = this.state;
    let tgt, k = 1 - Math.exp(-dt * 12);
    if (s === 'windup') { this.pose = lerpPose(this.from, this.wind, easeOut(clamp(this.st / 0.5, 0, 1))); return; }
    if (s === 'attack') { this.pose = lerpPose(this.wind, this.strike, easeOut(clamp(this.st / 0.13, 0, 1))); return; }
    if (s === 'recover') { this.pose = lerpPose(this.strike, basePose(d), easeInOut(clamp(this.st / 0.6, 0, 1))); return; }
    switch (s) {
      case 'cower':
        tgt = Object.assign({}, d, { lean: 0.55, head: 0.5, armF: 2.6, elbowF: 1.9, armB: 2.4, elbowB: 2.0, legF: 1.0, kneeF: 1.9, legB: 0.2, kneeB: 1.8 });
        tgt.lean += Math.sin(this.t * 22) * 0.03; // trembling
        if (Math.abs(this.vx) > 1) tgt = walkPose(tgt, this.t * 9, 0.35, 0);
        break;
      case 'hurt': tgt = Object.assign({}, d, { lean: -0.4, head: -0.4 }); k = 1 - Math.exp(-dt * 25); break;
      case 'return': case 'engage':
        tgt = Math.abs(this.vx) > 1 ? walkPose(d, this.t * 8, 0.45, 0.05) : d; break;
      default: tgt = Object.assign({}, d, { lean: d.lean + Math.sin(this.t * 2) * 0.03 });
    }
    blendPose(this.pose, tgt, k);
  }

  draw(ctx, t) {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.38)';
    ctx.beginPath(); ctx.ellipse(this.x, GROUND + 3, (this.dead ? 44 : 18) * this.s, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.translate(this.x, this.y);
    ctx.scale(this.facing * this.s, this.s);
    ctx.translate(this.body.ox, this.body.oy);
    ctx.rotate(this.body.rot);
    if (this.hurtFlash > 0) ctx.globalAlpha = 0.75;
    const w = this.def.weapon;
    drawHumanoid(ctx, this.joints, this.pose, this.def.style, this.parts, { weapon: w ? (c => drawWeaponShape(c, w, 0)) : null, shield: !!this.def.shield, t: t + this.t });
    ctx.restore();
    if (!this.dead && this.hp < this.maxHp) {
      const top = GROUND - 120 * this.s, wdt = 40;
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(this.x - wdt / 2 - 1, top - 1, wdt + 2, 5);
      ctx.fillStyle = '#5aa04a'; ctx.fillRect(this.x - wdt / 2, top, wdt * clamp(this.hp / this.maxHp, 0, 1), 3);
    }
  }
}
