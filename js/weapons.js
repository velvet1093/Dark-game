'use strict';
// ---------------------------------------------------------------------------
// WEAPON REGISTRY
// Every weapon is pure data + a draw function. To add a new weapon in a
// future update, call registerWeapon({...}) with the same shape as the
// longsword below, then give it to the player (Player.weaponId = 'id').
//
// Move fields:
//   stamina, damage, poise (posture dmg), bleed (bleed buildup), sever (limb dmg mult)
//   windup / active / recover   timings in seconds
//   lunge                      forward velocity during the active frames
//   box {x0,x1,y0,y1}          hitbox relative to the player's feet (facing right)
//   targets {limb: weight}     which limbs this swing tends to cut
//   wind / strike              partial poses (see rig.js) for the animation
// ---------------------------------------------------------------------------
const PLAYER_IDLE = { lean: 0.05, legF: 0.28, kneeF: 0.3, legB: -0.25, kneeB: 0.12, armF: 0.55, elbowF: 1.05, armB: 0.05, elbowB: 0.5, weap: 2.35, head: 0 };

const WEAPONS = {};

function registerWeapon(def) {
  const norm = m => {
    m.windP = basePose(Object.assign({}, PLAYER_IDLE, m.wind));
    m.strikeP = basePose(Object.assign({}, PLAYER_IDLE, m.strike));
    return m;
  };
  def.light.forEach(norm);
  def.heavy.forEach(norm);
  norm(def.low);
  for (const k in def.executions) {
    const e = def.executions[k];
    e.windP = basePose(Object.assign({}, PLAYER_IDLE, e.wind));
    e.strikeP = basePose(Object.assign({}, PLAYER_IDLE, e.strike));
  }
  WEAPONS[def.id] = def;
  return def;
}

registerWeapon({
  id: 'longsword',
  name: 'Oathkeeper',
  kind: 'Longsword',
  desc: 'The sword of the Grey Lantern. Its edge was blessed to part the wicked from their sins. Now it mostly parts them from their limbs.',
  bladeLen: 56,

  light: [
    {
      name: 'Descending Cut', stamina: 15, damage: 22, poise: 18, bleed: 24, sever: 1.0,
      windup: 0.15, active: 0.11, recover: 0.3, lunge: 110,
      box: { x0: 4, x1: 84, y0: -118, y1: -18 },
      targets: { head: 1, armF: 3, armB: 2 },
      wind: { armF: 3.4, elbowF: 0.4, weap: 3.9, lean: -0.12, legF: 0.35, legB: -0.3 },
      strike: { armF: 0.9, elbowF: 0.1, weap: 0.65, lean: 0.3, legF: 0.55, kneeF: 0.55, legB: -0.5 },
    },
    {
      name: 'Rising Cut', stamina: 15, damage: 22, poise: 18, bleed: 24, sever: 1.0,
      windup: 0.13, active: 0.11, recover: 0.3, lunge: 100,
      box: { x0: 4, x1: 82, y0: -125, y1: -25 },
      targets: { armF: 3, armB: 3, head: 1 },
      wind: { armF: 0.25, elbowF: 0.2, weap: -0.35, lean: 0.25, legF: 0.45, kneeF: 0.5, legB: -0.35 },
      strike: { armF: 2.7, elbowF: 0.2, weap: 3.05, lean: -0.12, legF: 0.3, legB: -0.4 },
    },
    {
      name: 'Lunging Thrust', stamina: 18, damage: 28, poise: 24, bleed: 34, sever: 0.7,
      windup: 0.18, active: 0.1, recover: 0.4, lunge: 210,
      box: { x0: 10, x1: 96, y0: -95, y1: -45 },
      targets: { head: 1, armF: 1, armB: 1 },
      wind: { armF: 0.45, elbowF: 2.2, weap: 1.6, lean: -0.18, legF: 0.2, legB: -0.5 },
      strike: { armF: 1.55, elbowF: 0.02, weap: 1.57, lean: 0.38, legF: 0.75, kneeF: 0.65, legB: -0.65 },
    },
  ],

  heavy: [
    {
      name: 'Oathbreaker', heavy: true, stamina: 32, damage: 48, poise: 46, bleed: 42, sever: 1.9,
      windup: 0.44, active: 0.13, recover: 0.5, lunge: 150,
      box: { x0: 0, x1: 92, y0: -130, y1: 0 },
      targets: { head: 3, armF: 2, armB: 2 },
      wind: { armF: 3.6, elbowF: 0.6, weap: 4.25, lean: -0.32, legF: 0.15, legB: -0.25 },
      strike: { armF: 0.8, elbowF: 0.0, weap: 0.85, lean: 0.48, legF: 0.75, kneeF: 0.75, legB: -0.7 },
    },
    {
      name: 'Rising Cleave', heavy: true, stamina: 30, damage: 44, poise: 42, bleed: 40, sever: 1.8,
      windup: 0.38, active: 0.13, recover: 0.5, lunge: 130,
      box: { x0: 0, x1: 90, y0: -135, y1: -10 },
      targets: { armF: 3, armB: 3, head: 1 },
      wind: { armF: -0.6, elbowF: 0.3, weap: -0.9, lean: 0.35, legF: 0.6, kneeF: 0.8, legB: -0.3, kneeB: 0.4 },
      strike: { armF: 2.9, elbowF: 0.15, weap: 3.4, lean: -0.2, legF: 0.3, legB: -0.5 },
    },
  ],

  // S + Attack: a crouching cut aimed at the legs
  low: {
    name: 'Hamstring Cut', stamina: 17, damage: 18, poise: 16, bleed: 28, sever: 1.25,
    windup: 0.17, active: 0.11, recover: 0.36, lunge: 120,
    box: { x0: 4, x1: 86, y0: -55, y1: 4 },
    targets: { legF: 4, legB: 1 },
    wind: { armF: 2.1, elbowF: 0.3, weap: 2.6, lean: 0.0, legF: 0.5, kneeF: 0.9, legB: -0.3, kneeB: 0.8 },
    strike: { armF: 1.0, elbowF: 0.05, weap: 1.05, lean: 0.6, legF: 0.95, kneeF: 1.4, legB: -0.25, kneeB: 1.3 },
  },

  // Executions (F on a staggered / crippled / near-dead foe)
  executions: {
    decap: {
      wind: { armF: 3.5, elbowF: 0.5, weap: 4.5, lean: -0.25, legF: 0.2, legB: -0.3 },
      strike: { armF: 1.7, elbowF: 0.05, weap: 1.75, lean: 0.35, legF: 0.7, kneeF: 0.5, legB: -0.6 },
      windT: 0.42, strikeT: 0.52, end: 1.6,
    },
    impale: {
      wind: { armF: 0.4, elbowF: 2.3, weap: 1.57, lean: -0.25, legF: 0.2, legB: -0.5 },
      strike: { armF: 1.5, elbowF: 0.05, weap: 1.57, lean: 0.4, legF: 0.75, kneeF: 0.6, legB: -0.65 },
      windT: 0.38, strikeT: 0.46, ripT: 1.05, end: 1.7,
    },
    downstab: {
      wind: { armF: 3.0, elbowF: 0.6, weap: 3.14, lean: -0.1, legF: 0.3, legB: -0.3 },
      strike: { armF: 1.1, elbowF: 0.1, weap: 0.12, lean: 0.75, legF: 0.9, kneeF: 1.3, legB: -0.4, kneeB: 0.9 },
      windT: 0.4, strikeT: 0.5, end: 1.4,
    },
  },

  draw(ctx, blood) {
    const L = this.bladeLen;
    // grip & pommel
    ctx.fillStyle = '#2b1b12'; ctx.fillRect(-1.6, -10, 3.2, 11);
    ctx.fillStyle = '#7d7a70'; ctx.beginPath(); ctx.arc(0, -11, 2.6, 0, Math.PI * 2); ctx.fill();
    // crossguard
    ctx.fillStyle = '#8c897f'; ctx.fillRect(-8, 1, 16, 2.6);
    ctx.fillStyle = '#5c5a52'; ctx.fillRect(-8, 3, 16, 0.8);
    // blade
    ctx.fillStyle = '#c3c6cc';
    ctx.beginPath(); ctx.moveTo(-2.4, 3.5); ctx.lineTo(2.4, 3.5); ctx.lineTo(1.9, L - 6); ctx.lineTo(0, L); ctx.lineTo(-1.9, L - 6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e9ebef'; ctx.fillRect(-0.4, 5, 0.9, L - 12); // fuller shine
    if (blood > 0.02) {
      const len = L * Math.min(1, 0.25 + blood * 0.8);
      ctx.fillStyle = `rgba(125,6,10,${0.55 + blood * 0.4})`;
      ctx.beginPath(); ctx.moveTo(-2.3, L - len); ctx.lineTo(2.3, L - len * 0.8); ctx.lineTo(1.9, L - 6); ctx.lineTo(0, L); ctx.lineTo(-1.9, L - 6); ctx.closePath(); ctx.fill();
    }
  },
});
