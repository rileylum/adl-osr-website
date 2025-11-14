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
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026",
    tags: ["Classic Module", "Horror", "Dungeon Crawl"],
  },
  {
    title: "A Windswept Scene",
    system: "Forbidden Lands",
    image: "https://freeleaguepublishing.com/wp-content/uploads/2023/09/Forbidden-Lands-cover-art_square.jpg",
    description: "A noble's runaway son is trapped in a tower encircled by a magical storm for several days. Armed with knowledge of a secret passageway, your party must venture inside to rescue him before time runs out.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026",
    tags: ["Dungeon Crawl", "Dark Fantasy"],
  },
  {
    title: "Beneath the Dragon's Wing",
    system: "Adventurer Conqueror King",
    level: "5-7",
    image: "https://i.imgur.com/0U699nP.png",
    description: "Two centuries after the fall of Cyfandir, the ancient green dragon Aisoth still guards its shattered halls and hoarded treasures. A band of elven heroes dares to return and reclaim the sacred Bow of Great Eagles, risking everything to restore their people's honor or die trying.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026",
    tags: ["Dungeon Crawl", "High Lethality"],
  },
  {
    title: "Cult of the Devouring Maw",
    system: "Hero's Gambit",
    image: "https://placehold.co/77x100/201e1f/a1a1a1?font=roboto&text=No%20cover%20art",
    description: "Master Orven, a merchant from Dunwarren, is desperate for news of his daughter Elira who traveled to visit a new Druidic temple weeks ago and hasn't been heard from since. Did she make it to the temple, join their cult, or become their prisoner? Your investigation begins at the temple's entrance.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026",
    tags: ["Mystery/Investigation", "Horror"],
  },
  {
    title: "DEBTOR'S RUN",
    system: "CY_BORG",
    image: "https://i.imgur.com/yytSkbB.jpeg",
    description: "Gutterpunks, nano-rejects, and chrome-junkies infiltrate the Arakawa Logistics Hub on a near-suicide strike to steal black-budget tech and wipe their slates clean. Kill-bots buzz in the fog, synth-hounds hunt through acid rain, and hyper-tuned corp security stalks every shadow as you race to grab the loot and vanish before the sprawl erases you first.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026",
    tags: ["Cyberpunk", "Heist"],
  },
  {
    title: "Goat Quest",
    system: "Elfmaids & Octopi",
    level: "1",
    image: "https://i.imgur.com/t1LQz5a.jpeg",
    description: "You are sentient talking goats taught secret magic by Nanny Binx, tasked with protecting your farm and village from chaos cults bent on unraveling reality into primordial disorder. Beware the minions of the Chaos Goat, and whatever you do, don't let the humans discover what you're up to.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026",
    tags: ["Comedy/Lighthearted", "New Player Friendly"],
  },
  {
    title: "Pigswill",
    system: "Tabletop Wargame",
    image: "https://placehold.co/77x100/201e1f/a1a1a1?font=roboto&text=No%20cover%20art",
    description: "In the quaint medieval village of Pigswill, rumors swirl that a Great Treasure is set to arrive, but no one knows who will bring it. Each player takes on a unique character with secret goals and objectives, using negotiation, deception, alliances, and backstabbing to achieve them in this chaotic and comedic social wargame.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026",
    tags: ["Comedy/Lighthearted", "Roleplay Heavy"],
  },
  {
    title: "Technu",
    system: "Cthulhu Now",
    image: "https://placehold.co/77x100/201e1f/a1a1a1?font=roboto&text=No%20cover%20art",
    description: "The viral social media app Technu is causing an epidemic of mental illness, violent riots, and mysterious disappearances across the world. Your team of investigators has tracked down the app developer's location and must raid the site to stop them before they upload a promised upgrade that could have devastating consequences for humanity.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026",
    tags: ["Cosmic Horror", "Mystery/Investigation"],
  },
  {
    title: "The Harvest of Sommerton",
    system: "old school essentials",
    level: "3",
    image: "/images/harvest-of-sommerton.jpg",
    description: "Players seek to join the Caryoptic Rangers, who defend the Caryoptic Plains against Chaos warband incursions from across the Wisterwal Ranges. Defend the village of Sommerton against agents of the enigmatic Sorceress-Queen Adastra and worse threats in this introductory scenario.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026",
    tags: ["Wilderness", "Dark Fantasy"],
  },
  {
    title: "The Sinking Tower",
    system: "Dragonbane",
    image: "https://jeffsgamebox.blog/wp-content/uploads/2025/01/dragonbaneqstower.jpg",
    description: "An enchanted stone tower built by a mad mage rises from the sea once every twenty years and stays above water for only two hours before sinking back into the deep with its treasures. Race against time to reach the ghostly green light at the tower's peak where the sorcerer's emerald awaits.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026",
    tags: ["Dungeon Crawl", "Exploration"],
  },
  {
    title: "To Slay A Dragon",
    system: "Basic Fantasy Role-Playing Game",
    level: "10-13",
    image: "https://placehold.co/77x100/201e1f/a1a1a1?font=roboto&text=No%20cover%20art",
    description: "The vile dragon Veilnir has been raiding the countryside, destroying villages and armies before retreating to his mountain fastness where he believes the terrain makes him invincible. Through bribes and pleas, a party of the finest adventurers in the land has been assembled to assault his lair and take him down once and for all.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026",
    tags: ["Dungeon Crawl", "High Lethality"],
  },
  {
    title: "What's With the Goblins??",
    system: "Basic Fantasy Role-Playing Game",
    level: "2-3",
    image: "https://d1vzi28wh99zvq.cloudfront.net/images/5146/531499.webp",
    description: "A normally quiet and cowardly goblin tribe has suddenly become confident and aggressive, attacking travelers and locals. Your job is to investigate and discover what's causing this dramatic change in their behavior.",
    warhornUrl: "https://warhorn.net/events/oz-orc-adelaide-feb-2026",
    tags: ["Mystery/Investigation", "New Player Friendly"],
  }
];

