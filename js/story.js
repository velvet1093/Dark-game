'use strict';
// ---------------------------------------------------------------------------
// ASHEN OATH — story, dialogue and lore
// ---------------------------------------------------------------------------
const STORY = {
  intro: [
    'In the year of Our Lord 1093, the Red Weeping came to the valley of Vael.',
    'It began with tears of blood. Then fever. Then the dead would not stay in the earth.',
    'The Order of the Grey Lantern rode out to hold the plague at the river ford.\nNone returned.\n\n...Save one.',
    'Sir Aldric of Vael. Oathsworn knight. Last of his order.',
    'He swore two oaths. To hold the river, whatever the cost.\nAnd to guard the Heart of Saint Varn, the relic that kept the valley holy.',
    'The river is lost. He has come home to Hallowmere to learn what became of the other.',
  ],

  ending: [
    'The great doors of Saint Varn groan open.\nBelow the nave, something vast is beating.',
    'Each beat draws the blood of the valley down through the stones.\nThe Heart is not dying. It is feeding.',
    'Sir Aldric descends into the crypt, his sword red to the hilt.\nThe Bishop is waiting.',
    'END OF CHAPTER ONE\n\nThe Ashen Oath will continue.',
  ],

  osric: [
    { who: 'Dying Monk', text: 'Hold, knight... hold. That sigil... the Grey Lantern? God is cruel, to send a ghost to an old man\'s deathbed.' },
    { who: 'Brother Osric', text: 'I am Osric, of the Cathedral of Saint Varn. I fled when the Bishop sealed the doors... with the townsfolk still inside.' },
    { who: 'Brother Osric', text: 'Bishop Malachar took the Heart from its reliquary. He said the Weeping was a test. That the faithful would rise again.' },
    { who: 'Brother Osric', text: 'They did rise, knight. They rose wrong.' },
    { who: 'Brother Osric', text: 'Take this. Holy water, blessed before the blessing curdled. Drink, and your wounds will close... for a time.' },
    { who: '', text: 'Received: Vial of Saint\'s Tears. Your vials increase by one.', reward: 'flask' },
    { who: 'Lumi', text: 'Hello! I\'m Lumi. Brother Osric found me asleep inside a lantern shrine. He says I talk too much.' },
    { who: 'Brother Osric', text: 'She does. Take her with you, knight. She knows these roads, and she sees what the dead try to hide.' },
    { who: 'Lumi', text: 'I\'ll ride on your shoulder and keep watch. If you start dying, I\'ll yell. Loudly.' },
    { who: 'Brother Osric', text: 'Hallowmere lies east, past the gallows. And Gaul keeps the cathedral steps now... You knew him, didn\'t you?' },
  ],
  osricRepeat: [
    { who: 'Brother Osric', text: 'Go... I will pray while I still remember the words. Rest at the lantern shrines, knight. They are the last holy things in Vael.' },
  ],

  wren: [
    { who: 'Gravedigger', text: 'Don\'t! Don\'t come closer. I\'ve a shovel and I\'m not afraid to use it on knights.' },
    { who: 'Gravedigger', text: '...You\'re not one of them. Their eyes weep. Yours only look tired.' },
    { who: 'Wren', text: 'I\'m Wren. I bury them. Someone has to, or they get up again. A body with no head stays down, sir. Remember that.' },
    { who: 'Wren', text: 'The garrison turned first. Captain\'s orders, they said. Then the flagellants came down from the hills, whipping themselves red, singing for the Bishop.' },
    { who: 'Wren', text: 'The Headsman guards the cathedral now. Gaul. He used to give us apples at harvest. Now he gives everyone the axe.' },
    { who: 'Wren', text: 'If you\'re going up there... cut deep. They don\'t feel pain any more. But they still bleed out.' },
    { who: 'Pip', text: 'Wren\'s too proud to say it, but she\'s glad you came. I\'m Pip. I keep the crows off the graves.' },
    { who: 'Wren', text: 'Pip! ...Fine. Yes. I\'m glad. Pip says the lantern fairies have been watching over you since the river.' },
    { who: '', text: 'Wren presses a pouch of tarnished grave-coins into your palm. (+200 Embers)', reward: 'embers' },
  ],
  wrenRepeat: [
    { who: 'Wren', text: 'I\'ll dig one more, sir. Just in case. No offence meant.' },
  ],

  bossIntro: [
    { who: 'Gaul', text: 'Aldric. I prayed it would not be you.' },
    { who: 'Gaul', text: 'Four hundred heads I\'ve taken on these steps. The Bishop says each one is a soul set free.' },
    { who: 'Gaul', text: 'Lay down your sword, brother. Kneel. I\'ll make it clean. I owe you that much.' },
    { who: 'Aldric', text: 'I swore an oath, Gaul. So did you.' },
    { who: 'Gaul', text: 'Then let us see whose oath bleeds first.' },
  ],
  bossIntroShort: [
    { who: 'Gaul', text: 'Back again, brother? Kneel, then.' },
  ],
  bossDeath: [
    { who: 'Gaul', text: 'Ah... there it is. The cold. I\'d forgotten it.' },
    { who: 'Gaul', text: 'Malachar is below... in the crypt. He feeds the Heart with the blood of the valley. Every death makes it beat louder.' },
    { who: 'Gaul', text: 'I was weak, brother. I told myself the axe was a mercy.' },
    { who: 'Gaul', text: 'End it. Break the Heart. And if you see my daughter among the weeping... don\'t let her suffer.' },
  ],

  notes: {
    letter: {
      title: 'Bloodstained Letter',
      text: 'My dearest Tomas,\n\nMother wept red this morning. The priest says it is a sign of grace and we must not fetch the physician.\n\nHer eyes, Tomas. I have locked her in the cellar. She is singing down there. She never sang a day in her life.\n\nCome home. Please come home.\n\n— Elsbeth',
    },
    order: {
      title: 'Garrison Order',
      text: 'By order of His Grace, Bishop Malachar of Saint Varn:\n\nThe gates of Hallowmere are to be held shut. None shall leave.\n\nThose who weep are blessed and are NOT to be harmed.\n\nThose who resist the blessing are to be brought to the Headsman upon the cathedral steps.\n\n— Roderic, Captain of the Watch',
    },
    hymn: {
      title: 'Flagellant\'s Hymn',
      text: 'Bleed, and be made clean.\nBleed, and be made whole.\nThe Saint\'s Heart beats for the faithful,\nThe faithless feed the soil.\n\nLash for the sinner,\nLash for the lost,\nRed is the river,\nAnd red is the cost.',
    },
    scripture: {
      title: 'Torn Page of Scripture',
      text: '...and Varn did tear out his own heart, that the valley might never again know death.\n\nBut what is a heart, if not a door?\nAnd what is a door, if not a thing that opens both ways?\n\n[The rest of the page has been scratched away by fingernails.]',
    },
    confession: {
      title: 'The Headsman\'s Confession',
      text: 'Found within the Headsman\'s apron, written in a soldier\'s clumsy hand:\n\nMalachar is below, in the crypt. He feeds the Heart with the blood of the valley. Every death makes it beat louder.\n\nI told myself the axe was a mercy. God forgive me, I believed it.\n\nIf Aldric comes home — and he will, he always keeps his word — let him finish what I could not.\n\nMarta, my girl, I am sorry.',
    },
  },
};
