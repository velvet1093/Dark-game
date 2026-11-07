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

## Mobile (main experience)

Play in **landscape**. On a phone the game goes fullscreen on your first touch where the
browser allows it, and a ⛶ button toggles it. In portrait you get a "turn your device" screen.

| Control | Action |
| --- | --- |
| Drag anywhere on the left half | Walk (push to the rim to sprint, hold down for the Hamstring Cut) |
| ⚔ ATTACK · ✦ HEAVY | Light chain · heavy attack |
| ⟳ ROLL · ⛨ GUARD | Dodge roll · hold to block, tap just before a hit to parry |
| ⚱ VIAL | Drink a vial (shows how many are left) |
| ☠ EXECUTE | Appears and pulses red when a foe can be finished |
| ✋ | Appears near people, notes and shrines (Speak / Read / Rest) |
| ❚❚ | Pause; also leaves shrine menus and skips story screens |
| ♪ | Sound on/off |
| Tap the screen | Continue dialogue and pick menu options |

Hits and executions vibrate on phones that support it. On iPhone, Safari can't make a web
page fullscreen. Use Share → Add to Home Screen to run it fullscreen from the home screen.
Desktop browsers can force touch controls with `index.html?touch`.

## Keyboard controls

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
| Drink a vial · drink a tonic | `Q` · `T` |
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

## Quests

A tracker on screen (top-right on desktop, under the vials on mobile) shows your current
steps, and an arrow at the screen edge points to the next objective. Open **Pause → Journal**
for every quest, with finished steps ticked. A `!` over a survivor means they have a quest;
a `?` means it's ready to hand in.

| Quest | Giver | Steps | Reward |
| --- | --- | --- | --- |
| **The Ashen Oath** (main) | — | Speak with the dying monk → reach Brackenford → speak with the Reeve → seek Mother Agathe at the chapel → reach Hallowmere → find the gravedigger → cross the Mire → climb to the cathedral → defeat Gaul → descend into the crypt | The ending |
| **Last of the Watch** | Sergeant Bram | Clear 3 hollowed from the road → return | 300 embers |
| **The Widow at the Barricade** | Hedda | Slay the 2 flagellants hunting her → return | +1 vial |
| **A Sellsword's Price** | Odo | Cut down 2 turned garrison men with Odo → return | 500 embers |
| **The Lost Sister** | Sister Ysane | Give rest to the 2 Weeping Sisters → return | 2 tonics, and Ysane purifies you in the Mire |
| **The Torn Page** | Brother Anselm | Find the torn scripture page → bring it back | 400 embers |

## Survivors

Living NPCs out on the map can be attacked. Once you're close enough to see it happen,
enemies go after whoever is nearest, you or them.

- **Fighters** (Sergeant Bram with spear and shield, Odo the sellsword) attack nearby enemies,
  sometimes block, and recover between fights.
- **Civilians** (Hedda, Brother Anselm) can't fight. They cower, tremble, back away and cry
  for help, and they will be killed if you don't reach them in time.

Death is permanent. A slain survivor stays a corpse on later visits, their quest fails, and
Lumi mourns them. Brother Osric and Wren are in safe places and can't be attacked.

## Enemies

| Enemy | Notes |
| --- | --- |
| Infected Villager | Slow club swings; some feed on corpses or kneel in prayer |
| Grave Crawler | Legless; drags itself along and claws at your ankles |
| Fallen Garrison | Sword and shield; blocks light attacks |
| Red Flagellant | Fast knife flurries and a leaping pounce |
| Beaked Physician | Plague-doctor mask; long reach with a hooked cane and censer |
| Sackhead Butcher | Huge, armoured against flinching, crushing maul blows |
| Templar of the Red Lantern | Great helm and cross shield; chained mace combos, blocks often |
| Bloated Carrier | Swollen with the Weeping; bursts on death, spraying infected bile on anyone close |
| Weeping Sister | A Sister of Saint Ysolde who turned; fast twin-knife flurries and a lunge |
| Gaul, the Penitent Headsman | The boss |

## Fairy guides

Each NPC is kept company by a tiny lavender fairy with long white hair, four dragonfly
wings, a frilled headband and a long lavender dress. **Pip** stays with Wren the gravedigger.
**Lumi** waves you over to Brother Osric, then joins you after his story. She follows at your
shoulder and calls out advice: rest at a new shrine, finish a staggering foe, drink a vial when
you're bleeding out, break a shield with a heavy attack, recover your dropped embers. She won't
follow you through the boss's fog wall and waits for you outside it.

## Music & sound

All music is composed in code and played through a small WebAudio sequencer with hall reverb.
Tracks crossfade as you move through the game:

| Track | Where |
| --- | --- |
| Lament (choir, bells) | Title & story screens |
| Lonely harp over a drone | The Weeping Road |
| Tremolo strings, a distant bell | Burning Hallowmere |
| Slow choir & organ | Cathedral steps |
| Taiko, ostinato bass, choir stabs | The Headsman fight (it gets louder in his second phase) |
| Warm harp | Near lit shrines & in the shrine menu |
| Requiem | After the Headsman falls |

Sound effects include sword swings, flesh hits, bone-crack severs, arterial spurts,
parry rings, armour rattles on rolls, footsteps on mud or stone, enemy grunts before they
strike, hollowed villagers groaning, limbs thudding to the ground, fire crackle, rain, fairy
chimes, pages and the cathedral doors. `M` (or the ♪ button on mobile) mutes everything.

## The Red Weeping (infection)

The Weeping is a sickness of the blood. Every wound dealt by the infected feeds your
**INFECTION** bar (under stamina). Crawlers, carriers and Weeping Sisters carry the most;
blocking lets only a trickle through. Above 50% your stamina recovers more slowly; above 75%
your heart pounds and the edges of your sight go red.

When the bar fills, **the Weeping takes hold**: a 90-second countdown starts. While turning you
hit 25% harder, but if the timer runs out you **turn**. Your embers are lost for good, and you
wake at your last shrine with the infection at 50%.

Cures:
- **The Rite of Saint Ysolde.** Sister Elowen at the chapel in Brackenford (and Sister Ysane in
  the Mire, once you help her) purifies you completely, free, any number of times.
- **Purging Tonics** (`T`, or the ✚ TONIC button on mobile). Each one removes 45% infection, or
  halts a turning. Sister Maelis sells them for 120 embers; you can carry 3.
- Lantern shrines heal you but do **not** cure the Weeping.

## The valley

The map is now five regions, about 15,500 px wide:

| Region | What's there |
| --- | --- |
| I. The Weeping Road | Gallows, the dying monk, Sergeant Bram |
| II. **Brackenford** (town) | Walled and safe. Gate guards, Reeve Aldous, Garrick the Smith (hones your sword, +10% per level up to +5), townsfolk, a shrine, and the **Chapel of Saint Ysolde** with Mother Agathe and Sisters Elowen and Maelis |
| III. Hallowmere, That Was | The burning village, Wren, Hedda, Odo |
| IV. **The Weeping Mire** | Bog, reeds, the Drowned Chapel shrine, Sister Ysane, Ferryman Holt, carriers and fallen sisters |
| V. The Steps of Saint Varn | Templars, Brother Anselm, and Gaul the Headsman |

Save data moved to a new slot for this version, so start a New Game.

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
js/audio.js       synthesized sound effects, ambience and the music sequencer
js/mobile.js      touch buttons, joystick, fullscreen, landscape lock, haptics
js/rig.js         procedural skeleton, body/head/weapon drawing, severed parts
js/weapons.js     WEAPON REGISTRY: movesets, executions, weapon art
js/fx.js          blood particles, stains, gibs, sparks, fire, floating text
js/player.js      the knight: movement, combat, guard/parry, rolls, vials
js/enemies.js     enemy types, AI, damage, bleeding, dismemberment, the boss
js/world.js       level layout, zones, parallax scenery, props, weather
js/story.js       narration, dialogue and lore notes
js/fairy.js       fairy guide companions and Lumi's hints
js/allies.js      survivor NPCs: fighters and civilians, their AI and dialogue
js/quests.js      quest definitions, progress, tracker, objective arrow, journal
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
