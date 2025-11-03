export interface Game {
  title: string;
  system: string;
  image: string;
  description: string;
  warhornUrl: string;
  gm?: string;
  level?: string;
  tags?: string[];
}

export const games: Game[] = [
  {
    title: 'Against the Cult of the Reptile God: The Swamp Dungeon',
    gm: 'Douglas Niles',
    system: 'Basic Fantasy Role-Playing Game',
    level: '3',
    image: 'https://i.imgur.com/KJaYOjq.jpeg',
    description:
      'The adventure begins in Orlane, a small village nestled in the heart of a fetid swamp. The villagers have been acting strangely, and rumors of a sinister cult have been circulating. The party must investigate the mysterious goings-on and put a stop to the nefarious plans of the Cult of the Reptile God.',
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/a848938c-0190-499d-a0e5-012e8d8ae123',
    tags: ['Mystery/Investigation', 'Classic Module', 'Wilderness', 'Dungeon Crawl'],
  },
  {
    title: 'A Windswept Scene',
    system: 'Forbidden Lands',
    image:
      'https://freeleaguepublishing.com/wp-content/uploads/2023/09/Forbidden-Lands-cover-art_square.jpg',
    description:
      'A tale of adventure in the Forbidden Lands, where ancient ruins and forgotten magic await those brave enough to explore them.',
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/f9a92770-9a8a-4198-81b7-25235d1cd7e0',
    tags: ['Exploration/Hex Crawl', 'Sandbox', 'Dark Fantasy'],
  },
  {
    title: "Beneath the Dragon's Wing",
    gm: 'Alexander Macris',
    system: 'Adventurer Conqueror King',
    level: '5-7',
    image: 'https://i.imgur.com/0U699nP.png',
    description:
      'A high-level adventure in the Adventurer Conqueror King system, where heroes must venture beneath the wing of a mighty dragon.',
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/a60001ae-e0ad-49b8-bec2-3b58d7edab53',
    tags: ['Dungeon Crawl', 'Complex System'],
  },
  {
    title: "DEBTOR'S RUN",
    gm: 'Travis Morgan',
    system: 'CY_BORG',
    image: 'https://i.imgur.com/yytSkbB.jpeg',
    description:
      "In the neon-soaked, chrome-plated dystopia of CY, you owe the wrong people. Now it's time to run, fight, or pay up in blood and credits.",
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/9c234b91-fbb7-4d32-85f6-6f78f3c2e23e',
    tags: ['Cyberpunk', 'Horror', 'Rules Light'],
  },
  {
    title: 'Goat Quest',
    gm: 'Chris Tamm',
    system: 'Elfmaids & Octopi',
    level: '1',
    image: 'https://i.imgur.com/t1LQz5a.jpeg',
    description:
      'A whimsical first-level adventure where heroes embark on a quest involving goats. What could possibly go wrong?',
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/826ee2b7-05e4-4d52-a407-ef6ae00e646f',
    tags: ['New Player Friendly', 'Comedy/Lighthearted', 'Rules Light'],
  },
  {
    title: 'Greatest Thieves in Lankhmar',
    gm: 'Michael Curtis',
    system: 'DCC Lankhmar',
    level: '3-4',
    image:
      'https://goodman-games.com/store/wp-content/uploads/sites/10/2021/06/GTIL_frontCover-600x769.jpg',
    description:
      "Lankhmar the Imperishable, the City of the Black Toga, Sevenscore Thousand Smokes and The greatest metropolis in Nehwon, its maze-alleys of streets lined with a warren of inns, guild houses, and dens sprawls out before you and your companions. Thick with rogues, lean-framed magicians, and fat-bellied merchants, you have been once again called upon by your patron, Ningauble of the Seven Eyes, now tasked with your most daring—and dangerous—errand yet: to delve into the very catacombs under the thieves guild itself and steal the Skull Hristomilo, relic of the most cunning master thief to pad the cobbled streets of this accursed city.",
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/725f10f8-ff8a-4537-b016-8803cd7def9d',
    tags: ['New Player Friendly', 'Urban Adventure', 'Heist', 'Classic Module'],
  },
  {
    title: "Shadow Under Devil's Reef",
    gm: 'Jon Hook',
    system: 'Dungeon Crawl Classics RPG',
    level: '0-1',
    image:
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi3ltgq8tYPuvt4UIDvM3XjAD54S2buvEQ3y0YOVkU5pS5MOMhRDJSFaD5wonOrfW3Cz_jimi8BweKfvnXyWFwqKxRYt9_QDg-qBeAuf5LgcgyIkozWH5VumjiJAr4P9_0Ln9337cxIpSQIzoupxluhSM_7wvZT2HbbnP-udEmneq7VYJqoJzAMilQmKwlT/s777/Dungeon%20Crawl%20Classics%202017%20Halloween%20Module%20-%20Shadow%20Under%20Devil%E2%80%99s%20Reef.png',
    description:
      "A Halloween horror adventure for DCC. Something sinister lurks beneath Devil's Reef, and only the bravest—or most foolish—will dare to uncover its secrets.",
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/20b363a7-53ef-45f3-a9f8-455042b3c3a8',
    tags: ['Horror', 'Cosmic Horror', 'High Lethality', 'Character Funnel'],
  },
  {
    title: '[TBA] A Cthulhu Now scenario',
    system: 'Cthulhu Now',
    image:
      'https://placehold.co/77x100/201e1f/a1a1a1?font=roboto&text=No%20cover%20art',
    description:
      'A contemporary Lovecraftian horror scenario. Details to be announced.',
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/1965d799-ed3c-412a-95f5-58525900af40',
    tags: ['Cosmic Horror', 'Horror', 'Mystery/Investigation', 'Roleplay Heavy'],
  },
  {
    title: '[TBA] High Level Adventure',
    system: 'D&D Basic Set',
    image:
      'https://placehold.co/77x100/201e1f/a1a1a1?font=roboto&text=No%20cover%20art',
    description:
      'A high-level adventure using the classic D&D Basic Set rules. Details to be announced.',
    warhornUrl: 'https://warhorn.net/events/oz-orc-adelaide-feb-2026',
    tags: ['Classic Module', 'Dungeon Crawl'],
  },
  {
    title: 'The Harvest of Sommerton',
    gm: 'Dallas',
    system: 'Old School Essentials',
    level: '3',
    image: '/images/harvest-of-sommerton.jpg',
    description:
      'The village of Sommerton is known for its bountiful harvests, but this year something has gone terribly wrong. The crops are withering, and the villagers speak in hushed tones of dark omens.',
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/658bac38-4fbb-4245-9e5c-eb1f2d1b73c0',
    tags: ['Mystery/Investigation', 'Wilderness'],
  },
  {
    title: 'The Sinking Tower',
    gm: 'Tomas Härenstam',
    system: 'Dragonbane',
    image:
      'https://jeffsgamebox.blog/wp-content/uploads/2025/01/dragonbaneqstower.jpg',
    description:
      'A crumbling tower slowly sinks into the earth, and with it, ancient secrets and terrible dangers. Can you explore its depths before it vanishes forever?',
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/d89328fb-efe0-4c9b-9a37-1fd480c5a8a8',
    tags: ['Dungeon Crawl', 'Exploration', 'Rules Light'],
  },
  {
    title: "What's With the Goblins??",
    gm: 'Doug Irwin',
    system: 'Basic Fantasy Role-Playing Game',
    level: '2-3',
    image: 'https://d1vzi28wh99zvq.cloudfront.net/images/5146/531499.webp',
    description:
      'The goblins in the nearby hills have been acting strangely. Instead of their usual raids and mischief, they seem to be up to something far more organized and sinister.',
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/137aa7cd-7351-4bf8-bcb1-619b4cdaa656',
    tags: ['New Player Friendly', 'Mystery/Investigation', 'Wilderness', 'Dungeon Crawl'],
  },
  {
    title: 'WormJuice',
    gm: 'Stuart Watkinson',
    system: 'Cairn',
    image: 'https://m.media-amazon.com/images/I/710ZNPvEfqL._SL1500_.jpg',
    description:
      'A Cairn adventure involving mysterious substances, dangerous creatures, and the kind of trouble that adventurers always seem to find themselves in.',
    warhornUrl:
      'https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/9df1b914-e20e-4604-a522-c28573bc915c',
    tags: ['Rules Light', 'Horror', 'Exploration'],
  },
];
