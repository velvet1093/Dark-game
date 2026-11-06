# Ashen Oath

*A Tale of the Red Weeping — Chapter One*

A dark, bloody, story-driven 2D action game set in the Dark Ages, inspired by souls-like
games. You play **Sir Aldric of Vael**, the last knight of the Order of the Grey Lantern,
returning home in the year 1093 to a valley drowned in a blood plague.

Everything — characters, gore, scenery, music and sound — is drawn and synthesized
procedurally in the browser. There are no asset files and no build step.

## Play

Open `index.html` in any modern browser. Or serve the folder:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

Progress is saved automatically (in `localStorage`) whenever you rest at a lantern shrine.

## Controls

| Action | Keys |
| --- | --- |
| Move | `A` / `D` (or arrows) |
| Sprint | `Shift` |
| Roll (invulnerable mid-roll) | `Space` |
| Attack (3-hit chain) | `J` / Left Click |
| Heavy attack | `K` / Right Click |
| Hamstring Cut (aims at the legs) | `S` + Attack |
| Guard (tap right before a hit to **parry**) | hold `L` or `C` |
| **Execute** a weakened foe | `F` |
| Drink a vial | `Q` |
| Speak / read / rest | `E` |
| Pause · Mute | `Esc` · `M` |

## Mechanics

- **Stamina combat.** Attacks, rolls, sprinting and guarding all spend stamina.
- **Bleeding.** Every cut builds a bleed gauge (thin orange bar under the enemy's health).
  When it fills, the foe **hemorrhages** and loses a large chunk of health at once. Badly
  wounded enemies drip blood, and blood pools stay on the ground.
- **Dismemberment.** Each limb has its own health. Arms, legs and heads come off and fly
  away under physics, and the stumps keep bleeding the enemy out.
  - Lose the **sword arm**: they drop their weapon and claw weakly at you.
  - Lose the **shield arm**: they can no longer block.
  - Lose a **leg**: they collapse and crawl after you.
  - Killing blows often take a limb or the head with them.
- **Executions.** Staggered (posture broken or parried), crippled, or nearly dead
  foes show a red sigil. Press `F` for a slow-motion finisher: a decapitation, an
  impalement, or a downward stab into a crawling enemy. Executions heal you a little and
  pay 25% more embers. Against the boss, an impalement deals heavy damage, and on a nearly
  dead Headsman it becomes a beheading.
- **Posture & parry.** Hits fill an enemy's posture. A full posture leaves them staggered.
  Footmen raise shields, and heavy attacks break their guard.
- **Embers.** Slain foes give embers. Spend them at shrines on Vigor, Endurance or
  Strength. When you die you drop them where you fell. Get back there to recover them,
  because if you die again first, they are lost.
- **Shrines.** Resting heals you and refills your vials, but every enemy rises again.

## Story

Three regions lead to a boss:

1. **The Weeping Road.** Gallows, corpses and the dying monk Brother Osric.
2. **Hallowmere, That Was.** A burning village, the fallen garrison, and Wren the gravedigger.
3. **The Steps of Saint Varn.** The cathedral, and **Gaul, the Penitent Headsman**, Aldric's
   former brother-in-arms. He gets a second phase at half health.

Four lore notes are hidden along the way, plus one more if you behead the Headsman.

## Project layout

```
index.html        canvas + script loading
js/util.js        constants, math helpers, input (with press buffering)
js/audio.js       WebAudio synthesized sound effects + ambience
js/rig.js         procedural skeleton, body/head/weapon drawing, severed parts
js/weapons.js     WEAPON REGISTRY: movesets, executions, weapon art
js/fx.js          blood particles, stains, gibs, sparks, fire, floating text
js/player.js      the knight: movement, combat, guard/parry, rolls, vials
js/enemies.js     enemy types, AI, damage, bleeding, dismemberment, the boss
js/world.js       level layout, zones, parallax scenery, props, weather
js/story.js       narration, dialogue and lore notes
js/ui.js          HUD, menus, dialogue box, title & death screens
js/game.js        state machine, camera, executions, saving, rendering
```

## Adding a new weapon (future updates)

Weapons are pure data. To add one, call `registerWeapon({...})` in `js/weapons.js`
with the same shape as the longsword:

```js
registerWeapon({
  id: 'greataxe', name: 'Penitent Axe', kind: 'Greataxe', bladeLen: 70,
  light: [ /* chained light moves */ ],
  heavy: [ /* chained heavy moves */ ],
  low:   { /* S + attack */ },
  executions: { decap: {...}, impale: {...}, downstab: {...} },
  draw(ctx, blood) { /* draw it along +y from the hand */ },
});
```

Each move defines its stamina cost, damage, posture damage, bleed buildup, limb-sever
multiplier, timings, lunge, hitbox, the limbs it tends to cut (`targets`), and two
partial poses (`wind`, `strike`) that drive the animation. Equip it with
`player.weaponId = 'greataxe'`. The HUD, shrine menu, combat and executions pick it up
automatically.
