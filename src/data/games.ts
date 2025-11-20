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
    title: "Against the Cult of the Reptile God: The Swamp Dungeon",
    system: "Basic Fantasy Role-Playing Game",
    level: "3",
    image: "https://i.imgur.com/KJaYOjq.jpeg",
    description: "The village of Orlane suffers under the oppressive presence of a secret cult dedicated to the Reptile God. The dying wizard Ramne has discovered this hidden evil and tasks you with infiltrating the cult's swamp stronghold to destroy the entity once and for all.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/a848938c-0190-499d-a0e5-012e8d8ae123",
    gm: "Doug",
    tags: ["Classic Module", "Horror", "Dungeon Crawl"],
  },
  {
    title: "A Windswept Scene",
    system: "Forbidden Lands",
    image: "https://freeleaguepublishing.com/wp-content/uploads/2023/09/Forbidden-Lands-cover-art_square.jpg",
    description: "A noble's runaway son is trapped in a tower encircled by a magical storm for several days. Armed with knowledge of a secret passageway, your party must venture inside to rescue him before time runs out.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/f9a92770-9a8a-4198-81b7-25235d1cd7e0",
    gm: "Tim",
    tags: ["Dungeon Crawl", "Dark Fantasy"],
  },
  {
    title: "Beneath the Dragon's Wing",
    system: "Adventurer Conqueror King",
    level: "5-7",
    image: "https://i.imgur.com/0U699nP.png",
    description: "Two centuries after the fall of Cyfandir, the ancient green dragon Aisoth still guards its shattered halls and hoarded treasures. A band of elven heroes dares to return and reclaim the sacred Bow of Great Eagles, risking everything to restore their people's honor or die trying.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/a60001ae-e0ad-49b8-bec2-3b58d7edab53",
    gm: "Josh",
    tags: [],
  },
  {
    title: "Cult of the Devouring Maw",
    system: "Hero's Gambit",
    image: "https://imgur.com/cmDDnsG.jpeg",
    description: "Master Orven, a merchant from Dunwarren, is desperate for news of his daughter, Elira. Weeks ago she travelled to visit a new Druidic temple and there has been no word since. Did she even make it to the temple? Has she joined their cult? Or is she their prisoner? The story begins with the party approaching the temple's entrance...",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/3a8cf09d-b7b6-4590-9a16-be0b99143808",
    gm: "Steven",
    tags: ["Mystery/Investigation", "NSR"],
  },
  {
    title: "DEBTOR'S RUN",
    system: "CY_BORG",
    image: "https://i.imgur.com/yytSkbB.jpeg",
    description: "Gutterpunks, nano-rejects, and chrome-junkies infiltrate the Arakawa Logistics Hub on a near-suicide strike to steal black-budget tech and wipe their slates clean. Kill-bots buzz in the fog, synth-hounds hunt through acid rain, and hyper-tuned corp security stalks every shadow as you race to grab the loot and vanish before the sprawl erases you first.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/9c234b91-fbb7-4d32-85f6-6f78f3c2e23e",
    gm: "Travis",
    tags: ["Cyberpunk", "Heist"],
  },
  {
    title: "Goat Quest",
    system: "Elfmaids & Octopi",
    level: "1",
    image: "https://i.imgur.com/t1LQz5a.jpeg",
    description: "You are sentient talking goats taught secret magic by Nanny Binx, tasked with protecting your farm and village from chaos cults bent on unraveling reality into primordial disorder. Beware the minions of the Chaos Goat, and whatever you do, don't let the humans discover what you're up to.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/826ee2b7-05e4-4d52-a407-ef6ae00e646f",
    gm: "Chris",
    tags: ["Comedy/Lighthearted"],
  },
  {
    title: "Pass through Baraz-Varr",
    system: "OD&D",
    level: "1-10",
    image: "https://pressplaynews.net/wp-content/uploads/2024/08/durin.jpg",
    description: "Your quest has led you to a dead end - every mountain pass blocked by winter snows or patrolled by enemies. Only one route remains: Baraz-Varr, an ancient dwarven hold carved deep beneath the mountains.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/08d67b1f-8621-45dd-a525-395ea857194d",
    gm: "Riley Lum",
    tags: ["New Player Friendly", "Dungeon Crawl"],
  },
  {
    title: "Technu",
    system: "Cthulhu Now",
    image: "https://imgur.com/znb7aoX.jpeg",
    description: "The viral social media app Technu is causing an epidemic of mental illness, violent riots, and mysterious disappearances across the world. Your team of investigators has tracked down the app developer's location and must raid the site to stop them before they upload a promised upgrade that could have devastating consequences for humanity.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/1965d799-ed3c-412a-95f5-58525900af40",
    gm: "Marcus",
    tags: ["Cosmic Horror", "Mystery/Investigation"],
  },
  {
    title: "The Harvest of Sommerton",
    system: "old school essentials",
    level: "3",
    image: "https://imgur.com/NFWa83B.jpeg",
    description: "Players seek to join the Caryoptic Rangers, who defend the Caryoptic Plains against Chaos warband incursions from across the Wisterwal Ranges. Defend the village of Sommerton against agents of the enigmatic Sorceress-Queen Adastra and worse threats in this introductory scenario.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/658bac38-4fbb-4245-9e5c-eb1f2d1b73c0",
    gm: "Dallas",
    tags: ["Wilderness", "Dark Fantasy"],
  },
  {
    title: "The Sinking Tower",
    system: "Dragonbane",
    image: "https://jeffsgamebox.blog/wp-content/uploads/2025/01/dragonbaneqstower.jpg",
    description: "An enchanted stone tower built by a mad mage rises from the sea once every twenty years and stays above water for only two hours before sinking back into the deep with its treasures. Race against time to reach the ghostly green light at the tower's peak where the sorcerer's emerald awaits.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/d89328fb-efe0-4c9b-9a37-1fd480c5a8a8",
    gm: "Shaun",
    tags: ["Dungeon Crawl", "Exploration"],
  },
  {
    title: "To Slay A Dragon",
    system: "Basic Fantasy Role-Playing Game",
    level: "10-13",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Dragon-154551.svg",
    description: "The vile dragon Veilnir has been raiding the countryside, destroying villages and armies before retreating to his mountain fastness where he believes the terrain makes him invincible. Through bribes and pleas, a party of the finest adventurers in the land has been assembled to assault his lair and take him down once and for all.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/c1fd8215-1c93-47ab-97e3-2969f0ecc181",
    gm: "Archon",
    tags: ["Dungeon Crawl", "High Level"],
  },
  {
    title: "What's With the Goblins??",
    system: "Basic Fantasy Role-Playing Game",
    level: "2-3",
    image: "https://d1vzi28wh99zvq.cloudfront.net/images/5146/531499.webp",
    description: "A normally quiet and cowardly goblin tribe has suddenly become confident and aggressive, attacking travelers and locals. Your job is to investigate and discover what's causing this dramatic change in their behavior.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/137aa7cd-7351-4bf8-bcb1-619b4cdaa656",
    gm: "Doug",
    tags: ["Mystery/Investigation"],
  },
  {
    title: "Lair of the Lamb",
    system: "GLOG",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhQ000IhRvV7Xr9lRrLeKp4NRYer-MvFFVZ9pOS0HQiq_X3spQFuxgaXZL2C8mMyLECr4SsFpfY9mUqGM3kTlN-XKVnqOLse5CsgRmBgpIGq7ZeEhnwgBcsKesiI-NnEvppZFYQl1gzPtg1/s381/gretchling.jpg",
    description: "You are level zero peasants with no hit points who awake in a dark room with only your wits and a desire to live. Control a dwindling stable of easily killed peasants and improvise, scavenge, and sneak your way out of the dungeon in this beginner-friendly OSR character funnel that teaches exploration, problem solving, and creativity through the lightweight GLOG system.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026/schedule/sessions/deffed52-df72-45ca-934d-7ff8d2c87822",
    gm: "Nick",
    tags: ["Character Funnel", "New Player Friendly", "Dungeon Crawl"],
  }
];

