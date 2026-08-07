export interface Game {
  title: string;
  system: string;
  image: string;
  description: string;
  warhornUrl: string;
  gm?: string;
  level?: string;
  tags?: string[];
  /** The agenda session this game runs in, matched against an
   *  `AgendaRow.sessionNumber`. Replaces the rigid `slot: 1 | 2 | 3`. */
  session: number;
}

// Games attach to an Event by reference: this per-event array is held on the
// Event (`games: adelaide2026Games`) and consumers read `currentEvent.games`.
// See docs/agent/CONTEXT.md (Game, Session).
export const adelaide2026Games: Game[] = [
  {
    title: 'Against the Cult of the Reptile God: The Swamp Dungeon',
    system: 'Basic Fantasy Role-Playing Game',
    level: '3',
    image:
      '/images/games/against-the-cult-of-the-reptile-god-the-swamp-dung.webp',
    description:
      "The village of Orlane suffers under the oppressive presence of a secret cult dedicated to the Reptile God. The dying wizard Ramne has discovered this hidden evil and tasks you with infiltrating the cult's swamp stronghold to destroy the entity once and for all.",
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/a848938c-0190-499d-a0e5-012e8d8ae123',
    gm: 'Doug',
    tags: ['Classic Module', 'Horror', 'Dungeon Crawl'],
    session: 2,
  },
  {
    title: 'A Windswept Scene',
    system: 'Forbidden Lands',
    image: '/images/games/a-windswept-scene.webp',
    description:
      "A noble's runaway son is trapped in a tower encircled by a magical storm for several days. Armed with knowledge of a secret passageway, your party must venture inside to rescue him before time runs out.",
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/f9a92770-9a8a-4198-81b7-25235d1cd7e0',
    gm: 'Tim',
    tags: ['Dungeon Crawl', 'Dark Fantasy'],
    session: 3,
  },
  {
    title: "Beneath the Dragon's Wing",
    system: 'Adventurer Conqueror King',
    level: '5-7',
    image: '/images/games/beneath-the-dragon-s-wing.webp',
    description:
      "Two centuries after the fall of Cyfandir, the ancient green dragon Aisoth still guards its shattered halls and hoarded treasures. A band of elven heroes dares to return and reclaim the sacred Bow of Great Eagles, risking everything to restore their people's honor or die trying.",
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/a60001ae-e0ad-49b8-bec2-3b58d7edab53',
    gm: 'Josh',
    tags: [],
    session: 1,
  },
  {
    title: 'Cult of the Devouring Maw',
    system: "Hero's Gambit",
    image: '/images/games/cult-of-the-devouring-maw.webp',
    description:
      "Master Orven, a merchant from Dunwarren, is desperate for news of his daughter, Elira. Weeks ago she travelled to visit a new Druidic temple and there has been no word since. Did she even make it to the temple? Has she joined their cult? Or is she their prisoner? The story begins with the party approaching the temple's entrance...",
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/3a8cf09d-b7b6-4590-9a16-be0b99143808',
    gm: 'Steven',
    tags: ['Mystery/Investigation', 'NSR'],
    session: 2,
  },
  {
    title: "DEBTOR'S RUN",
    system: 'CY_BORG',
    image: '/images/games/debtor-s-run.webp',
    description:
      'Gutterpunks, nano-rejects, and chrome-junkies infiltrate the Arakawa Logistics Hub on a near-suicide strike to steal black-budget tech and wipe their slates clean. Kill-bots buzz in the fog, synth-hounds hunt through acid rain, and hyper-tuned corp security stalks every shadow as you race to grab the loot and vanish before the sprawl erases you first.',
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/9c234b91-fbb7-4d32-85f6-6f78f3c2e23e',
    gm: 'Travis',
    tags: ['Cyberpunk', 'Heist'],
    session: 1,
  },
  {
    title: 'Goat Quest',
    system: 'Elfmaids & Octopi',
    level: '1',
    image: '/images/games/goat-quest.webp',
    description:
      "You are sentient talking goats taught secret magic by Nanny Binx, tasked with protecting your farm and village from chaos cults bent on unraveling reality into primordial disorder. Beware the minions of the Chaos Goat, and whatever you do, don't let the humans discover what you're up to.",
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/826ee2b7-05e4-4d52-a407-ef6ae00e646f',
    gm: 'Chris',
    tags: ['Comedy/Lighthearted'],
    session: 1,
  },
  {
    title: 'Pass through Baraz-Varr',
    system: 'OD&D',
    level: '1-10',
    image: '/images/games/pass-through-baraz-varr.webp',
    description:
      'Your quest has led you to a dead end - every mountain pass blocked by winter snows or patrolled by enemies. Only one route remains: Baraz-Varr, an ancient dwarven hold carved deep beneath the mountains.',
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/08d67b1f-8621-45dd-a525-395ea857194d',
    gm: 'Riley Lum',
    tags: ['New Player Friendly', 'Dungeon Crawl'],
    session: 3,
  },
  {
    title: 'Technu',
    system: 'Cthulhu Now',
    image: '/images/games/technu.webp',
    description:
      "The viral social media app Technu is causing an epidemic of mental illness, violent riots, and mysterious disappearances across the world. Your team of investigators has tracked down the app developer's location and must raid the site to stop them before they upload a promised upgrade that could have devastating consequences for humanity.",
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/1965d799-ed3c-412a-95f5-58525900af40',
    gm: 'Marcus',
    tags: ['Cosmic Horror', 'Mystery/Investigation'],
    session: 3,
  },
  {
    title: 'The Harvest of Sommerton',
    system: 'Old School Essentials',
    level: '3',
    image: '/images/games/the-harvest-of-sommerton.webp',
    description:
      'Players seek to join the Caryoptic Rangers, who defend the Caryoptic Plains against Chaos warband incursions from across the Wisterwal Ranges. Defend the village of Sommerton against agents of the enigmatic Sorceress-Queen Adastra and worse threats in this introductory scenario.',
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/658bac38-4fbb-4245-9e5c-eb1f2d1b73c0',
    gm: 'Dallas',
    tags: ['Wilderness', 'Dark Fantasy'],
    session: 2,
  },
  {
    title: 'The Sinking Tower',
    system: 'Dragonbane',
    image: '/images/games/the-sinking-tower.webp',
    description:
      "An enchanted stone tower built by a mad mage rises from the sea once every twenty years and stays above water for only two hours before sinking back into the deep with its treasures. Race against time to reach the ghostly green light at the tower's peak where the sorcerer's emerald awaits.",
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/d89328fb-efe0-4c9b-9a37-1fd480c5a8a8',
    gm: 'Shaun',
    tags: ['Dungeon Crawl', 'Exploration'],
    session: 1,
  },
  {
    title: 'To Slay A Dragon',
    system: 'Basic Fantasy Role-Playing Game',
    level: '10-13',
    image: '/images/games/to-slay-a-dragon.webp',
    description:
      'The vile dragon Veilnir has been raiding the countryside, destroying villages and armies before retreating to his mountain fastness where he believes the terrain makes him invincible. Through bribes and pleas, a party of the finest adventurers in the land has been assembled to assault his lair and take him down once and for all.',
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/c1fd8215-1c93-47ab-97e3-2969f0ecc181',
    gm: 'Archon',
    tags: ['Dungeon Crawl', 'High Level'],
    session: 2,
  },
  {
    title: "What's With the Goblins??",
    system: 'Basic Fantasy Role-Playing Game',
    level: '2-3',
    image: '/images/games/what-s-with-the-goblins.webp',
    description:
      "A normally quiet and cowardly goblin tribe has suddenly become confident and aggressive, attacking travelers and locals. Your job is to investigate and discover what's causing this dramatic change in their behavior.",
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/137aa7cd-7351-4bf8-bcb1-619b4cdaa656',
    gm: 'Doug',
    tags: ['Mystery/Investigation'],
    session: 1,
  },
  {
    title: 'Lair of the Lamb',
    system: 'GLOG',
    image: '/images/games/lair-of-the-lamb.webp',
    description:
      'You are level zero peasants with no hit points who awake in a dark room with only your wits and a desire to live. Control a dwindling stable of easily killed peasants and improvise, scavenge, and sneak your way out of the dungeon in this beginner-friendly OSR character funnel that teaches exploration, problem solving, and creativity through the lightweight GLOG system.',
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/deffed52-df72-45ca-934d-7ff8d2c87822',
    gm: 'Nick',
    tags: ['Character Funnel', 'New Player Friendly', 'Dungeon Crawl'],
    session: 2,
  },
  {
    title: 'Into the Mansion of Baron Thrasp',
    system: 'Swyvers',
    image: '/images/games/into-the-mansion-of-baron-thrasp.webp',
    description:
      'Baron Thrasp and his retinue have left the city to go on holiday - and left their home practically undefended. How much loot can your band of scallywags carry out of the mansion before the owner gets back? Race against rival swyvering bands in this medium-sized dungeoncrawl filled with puzzles, traps, and treasure.',
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/4aa5c522-9d84-4478-9107-1ce81a7bf5f1',
    gm: 'Alex',
    tags: ['Heist', 'Dungeon Crawl'],
    session: 3,
  },
];

export const adelaideSep2026Games: Game[] = [
  {
    title: 'Another Bug Hunt',
    system: 'Mothership RPG',
    image: '/images/games/another-bug-hunt.webp',
    description:
      'Mothership is a horror sci-fi game that can evoke the style of Alien, Dead Space, The Thing and the like. Another Bug Hunt is the introductory pre-written scenario for Mothership. The characters get the job to investigate a research base on a remote planet. When they arrive they find some bugs that need hunting.',
    warhornUrl:
      'https://warhorn.net/events/ozorc-adelaide-september-2026/schedule/sessions/adc70f25-cc1b-4705-aaa0-b1f22fbb9d6c',
    gm: 'Max Weeden',
    session: 1,
  },
  {
    title: 'Mörk Råtta',
    system: 'Mörk Råtta (Mörk Borg hack)',
    image: '/images/games/mork-ratta.webp',
    description:
      'In Mörk Råtta, you are a rat venturing into the lightless depths of an endless sewer. Navigate twisting tunnels, brave forgotten places, and outwit the strange horrors lurking beneath the streets. Every journey promises new dangers, hidden wonders, and the chance to survive another day in the darkness.',
    warhornUrl:
      'https://warhorn.net/events/ozorc-adelaide-september-2026/schedule/sessions/5834ed6c-09b6-490a-9f59-918bdaf0c6b2',
    gm: 'Charlie',
    session: 1,
  },
  {
    title: 'Secret Wars II',
    system: 'Marvel Super Heroes',
    image: '/images/games/secret-wars-ii.webp',
    description:
      'This is a battle royale game where you can play various marvel heroes as they were in 1985 who have come to Los Angeles seeking the Beyonder. It is a simply intuitive game with sample characters provided. If you go down take another hero. Spot instant karma awards for good roleplaying and bold deeds that reflect your character.',
    warhornUrl:
      'https://warhorn.net/events/ozorc-adelaide-september-2026/schedule/sessions/a466e839-56ad-4619-a9b7-704fe31d8afa',
    gm: 'Chris Tamm',
    session: 1,
  },
  {
    title: 'The Treachery of the Bishop',
    system: 'Basic Fantasy Role-Playing Game',
    image: '/images/games/the-treachery-of-the-bishop.webp',
    description:
      "A treacherous bishop has dosed you all with a poison that will kill you in three hours, and says that he will only grant the antidote if you retrieve the skull of an ancient 'saint' from the tomb he's locked you into. The only way out is through; can you retrieve the skull and survive to get your revenge?",
    warhornUrl:
      'https://warhorn.net/events/ozorc-adelaide-september-2026/schedule/sessions/a6275250-fd95-4fd2-b600-fb8fb3688599',
    gm: 'James',
    session: 1,
  },
  {
    title: 'Urmalk the Boundless',
    system: 'Original Dungeons & Dragons',
    level: '3-5',
    image: '/images/games/urmalk-the-boundless.webp',
    description:
      'The necropolis on the hill next to the city-state of Pentastadion is timeless: it has been welcoming the dead since time immemorial, and many dangers and treasures are hidden in its dilapidated crypts. Among them is Urmalk the Boundless, who is known to have been one of the richest magnates of the city – although they say his treasures are easier to see than reach, and easier to reach than obtain. After a few cups of wine too many and an irresponsible bet, YOU may be the next to try!',
    warhornUrl:
      'https://warhorn.net/events/ozorc-adelaide-september-2026/schedule/sessions/260aee80-4eb9-4e15-b65a-55ed3ccfb7f4',
    gm: 'Riley Lum',
    session: 1,
  },
  {
    title: 'Bank Robbery',
    system: 'Cowpunchers Reloaded',
    level: '1',
    image: '/images/games/bank-robbery.webp',
    description:
      "The town of Steeptrail is under attack by bandits! They are robbing the bank! They have taken hostages! Are you a bad enough Cowboy to take on Quickgun's gang of no-good rustlers? Or maybe your gang is out to steal Steeptrail's riches, too. Ye haw. Cowpunchers is a rules-light game that uses a d6 dicepool system and features deadly combat where every character acts at the same time.",
    warhornUrl:
      'https://warhorn.net/events/ozorc-adelaide-september-2026/schedule/sessions/8ebda2c2-df5d-4caf-8e49-6fbc3cd11c81',
    gm: 'Alex',
    session: 2,
  },
  {
    title: 'Doom of the Savage Kings',
    system: 'Dungeon Crawl Classics RPG',
    level: '1',
    image: '/images/games/doom-of-the-savage-kings.webp',
    description:
      'High above the windswept moors and darksome woods, the village of Hirot is under siege. Each night, as the sun sinks beneath the western mountains and the candles burn low, a devil-hound stalks the village streets, unleashing its savage fury on the living. This is a small sandbox adventure by Harley Stroh, designed for first level characters.',
    warhornUrl:
      'https://warhorn.net/events/ozorc-adelaide-september-2026/schedule/sessions/85d4faa4-256c-4a31-afc3-17bfdb510b43',
    gm: 'Jeremy Watkinson',
    session: 2,
  },
  {
    title: 'Goatquest 2',
    system: 'Elfmaids & Octopi',
    image: '/images/games/goatquest-2.webp',
    description:
      "A sequel to my last Goatquest con game. You play magical talking goats disguised among normal farm animals. Nanny Binx made you smart and taught you got magic so you can be alert for the threat of the dreaded Anti-Goat and its dreadful chaos goat minions. Protect your village from evil cults and don't let humans know your secrets.",
    warhornUrl:
      'https://warhorn.net/events/ozorc-adelaide-september-2026/schedule/sessions/239b2878-f210-40b3-85db-83738f7588d5',
    gm: 'Chris Tamm',
    session: 2,
  },
  {
    title: 'N1: Against the Cult of the Reptile God: The Swamp Dungeon',
    system: 'Basic Fantasy Role-Playing Game',
    level: '1-3',
    image: '/images/games/n1-against-the-cult-of-the-reptile-god.webp',
    description:
      "The village of Orlane has been suffering under the oppressive presence of a secret cult dedicated to the hideous 'Reptile God'. This hidden evil has been discovered by the aged wizard Ramne, who lies dying after living a magically prolonged life. You have accepted his mission to find and destroy this 'Reptile God' once and for all... in the evil cult's swamp stronghold!",
    warhornUrl:
      'https://warhorn.net/events/ozorc-adelaide-september-2026/schedule/sessions/6de2ef7d-94f2-464f-9d80-58b6cdc05bea',
    gm: 'Doug Irwin',
    session: 2,
  },
  {
    title: 'Trial of the Slime Lord',
    system: 'ShadowDark',
    image: '/images/games/trial-of-the-slime-lord.webp',
    description:
      "'Trial of the Slime Lord' is a much-loved gauntlet adventure for zero-level Shadowdark characters. This cursed dungeon serves as a sort of crucible for an ooze-worshiping cult. Those who survive are granted a boon from the Slime Lord. Those who do not, wander the halls as the unquiet dead, doomed to serve the ooze for eternity. The player characters have just been kidnapped from their village and thrown in a pit to face the Trial of the Slime Lord.",
    warhornUrl:
      'https://warhorn.net/events/ozorc-adelaide-september-2026/schedule/sessions/d99e42b6-d9f4-4918-8231-4d5e49945a3f',
    gm: 'Roy Ananda',
    session: 2,
  },
  {
    title: 'Wormjuice',
    system: 'Cairn',
    image: '/images/games/wormjuice.webp',
    description:
      "Your head hurts. It's dark and stinks in here. You're bound to the other lost souls in this cell... and something big is feeding in the room below you. Come on over to the little hut deep in Dankwood... maybe you can get out, but then you have to get home. Exploration, deadly combat, and competitive factions will be found in the damp, soggy forest of Dankwood.",
    warhornUrl:
      'https://warhorn.net/events/ozorc-adelaide-september-2026/schedule/sessions/14e43bfc-2f59-4d3a-8036-7c39c8168139',
    gm: 'Stuart',
    session: 2,
  },
  {
    title: 'B1: In Search of the Unknown',
    system: 'ShadowDark',
    level: '2-3',
    image: '/images/games/b1-in-search-of-the-unknown.webp',
    description:
      'The Caverns of Quasqueton is a dungeon complex that was excavated and settled by the legendary heroes Zelligar and Rogahn. These two heroes disappeared nearly 30 years ago. There have been reports of strange goings on in the vicinity of the caverns in the past month. Now the Duke sends brave and skilled adventurers to more fully investigate the Caverns of Quasqueton.',
    warhornUrl:
      'https://warhorn.net/events/ozorc-adelaide-september-2026/schedule/sessions/69c335d5-f4c2-4d29-8032-9c72ed7ab9fe',
    gm: 'Garry Hale',
    session: 3,
  },
  {
    title: 'Cult of the Maw',
    system: "Hero's Gambit",
    image: '/images/games/cult-of-the-maw.webp',
    description:
      "Master Orven, a merchant from Dunwarren, is desperate for news of his daughter, Elira. Weeks ago she travelled to visit a new Druidic temple and there has been no word since. Did she even make it to the temple? Has she joined their cult? Or is she their prisoner? The story begins with the party approaching the temple's entrance...",
    warhornUrl:
      'https://warhorn.net/events/ozorc-adelaide-september-2026/schedule/sessions/45cbea91-1b4c-46f4-95f4-1ebf03a89718',
    gm: 'Steven Pemberton',
    session: 3,
  },
  {
    title: 'Down Into the Long Stairs',
    system: 'Elfmaids & Octopi',
    image: '/images/games/down-into-the-long-stairs.webp',
    description:
      'The Long Stairs was a shared fan setting developed on forums 20 years ago. You play modern Australian military special forces and civilian specialists versus ultra-terrestrial dungeon entities from beyond. Through a portal in an underground base in Emu Flats, the other side is a dreadful eternal self-aware dungeon dimension. Gather intelligence on the hostile xenoforms found within...',
    warhornUrl:
      'https://warhorn.net/events/ozorc-adelaide-september-2026/schedule/sessions/903f22b5-c95d-4d34-b439-1f7e432bbcf7',
    gm: 'Chris Tamm',
    session: 3,
  },
  {
    title: 'S1: Tomb of Horrors',
    system: 'Basic Fantasy Role-Playing Game',
    level: '10-14',
    image: '/images/games/s1-tomb-of-horrors.webp',
    description:
      'Beneath a desolate hill in the far wilds of the world hides the labyrinthine vault of the demilich Acererak. Guarded by merciless traps, false doors and insidious magic, it stands as the ultimate testing ground for adventurers who believe they have mastered the art of defeating dungeons. This high-speed tournament run applies the lean 1975 typescript to the iconic S1 module — an unforgiving meat grinder where survival depends on player skill, not character stats.',
    warhornUrl:
      'https://warhorn.net/events/ozorc-adelaide-september-2026/schedule/sessions/29202987-03db-4103-b5e8-5f3a67404f2f',
    gm: 'Doug Irwin',
    session: 3,
  },
  {
    title: 'Technu',
    system: 'Cthulhu Now',
    image: '/images/games/technu-sep2026.webp',
    description:
      "The new social media App 'Technu' has, in your opinion (after careful investigation) – been responsible for the recent epidemic of mental illness breaking out in cities in America, Europe, and other parts of the world. Your team of investigators, ICT technicians, mental health experts, and security specialists have tracked down the App developer's location. It's time to raid the site and stop them before they upload the promised 'upgrade'...",
    warhornUrl:
      'https://warhorn.net/events/ozorc-adelaide-september-2026/schedule/sessions/de3e2f76-2c77-444b-98e3-addc32f06783',
    gm: 'Marcus Smith',
    session: 3,
  },
  {
    title: 'Veiled Vaults of the Onyx Queen',
    system: 'Dungeon Crawl Classics RPG',
    level: '0',
    image: '/images/games/veiled-vaults-of-the-onyx-queen.webp',
    description:
      "Queen Yoros' Onyx Jubilee is fast approaching, and royal courtiers have combed the realm for subjects of uncommon skill to ply their talents at the palace in preparation for the great celebration. The game begins in media res as you — a gaggle of hapless peasants — attempt to escape the clutches of a demonic cult. Experience the awe and terror of the signature Dungeon Crawl Classics 0-level funnel; pre-generated characters will be provided.",
    warhornUrl:
      'https://warhorn.net/events/ozorc-adelaide-september-2026/schedule/sessions/e6815d2e-be33-4231-a5d9-3c252fbaf624',
    gm: 'Jeremy Watkinson',
    session: 3,
  },
];
