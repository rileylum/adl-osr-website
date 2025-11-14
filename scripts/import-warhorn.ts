#!/usr/bin/env -S npx tsx

import * as fs from 'fs';

interface WarhornScenario {
  name: string;
  campaign: string | null;
  game_system: string;
  author: string | null;
  min_level: number | null;
  max_level: number | null;
  table_size: number | null;
  factions: string[];
  blurb: string;
}

interface WarhornExport {
  scenarios: WarhornScenario[];
}

interface Game {
  title: string;
  system: string;
  image: string;
  description: string;
  warhornUrl: string;
  gm?: string;
  level?: string;
  tags?: string[];
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}

function formatLevel(min: number | null, max: number | null): string | undefined {
  if (min === null && max === null) return undefined;
  if (min === max) return String(min);
  if (min !== null && max !== null) return `${min}-${max}`;
  if (min !== null) return String(min);
  if (max !== null) return String(max);
  return undefined;
}

function convertScenario(scenario: WarhornScenario, eventUrl: string): Game {
  const game: Game = {
    title: scenario.name,
    system: scenario.game_system,
    image: '',
    description: stripHtml(scenario.blurb),
    warhornUrl: eventUrl,
  };

  const level = formatLevel(scenario.min_level, scenario.max_level);
  if (level) {
    game.level = level;
  }

  return game;
}

function generateGamesFile(games: Game[]): string {
  let output = `export interface Game {
  title: string;
  system: string;
  image: string;
  description: string;
  warhornUrl: string;
  gm?: string;
  level?: string;
  tags?: string[];
}

export const games: Game[] = [\n`;

  games.forEach((game, index) => {
    output += '  {\n';
    output += `    title: ${JSON.stringify(game.title)},\n`;
    output += `    gm: '',\n`;
    output += `    system: ${JSON.stringify(game.system)},\n`;
    if (game.level) {
      output += `    level: ${JSON.stringify(game.level)},\n`;
    }
    output += `    image: '',\n`;
    output += `    description: ${JSON.stringify(game.description)},\n`;
    output += `    warhornUrl: ${JSON.stringify(game.warhornUrl)},\n`;
    output += `    tags: [],\n`;
    output += '  }';
    if (index < games.length - 1) {
      output += ',';
    }
    output += '\n';
  });

  output += '];\n';
  return output;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: npx tsx scripts/import-warhorn.ts <input.json> <event-url>');
    console.error('');
    console.error('Example:');
    console.error('  npx tsx scripts/import-warhorn.ts \\');
    console.error('    ~/Downloads/scenarios.json \\');
    console.error('    https://warhorn.net/events/oz-orc-adelaide-feb-2026');
    console.error('');
    console.error('This will overwrite src/data/games.ts');
    process.exit(1);
  }

  const inputFile = args[0];
  const eventUrl = args[1];
  const outputFile = 'src/data/games.ts';

  // Read input file
  const jsonContent = fs.readFileSync(inputFile, 'utf-8');
  const warhornData: WarhornExport = JSON.parse(jsonContent);

  // Convert scenarios
  const games: Game[] = warhornData.scenarios.map((scenario) =>
    convertScenario(scenario, eventUrl)
  );

  // Generate games.ts content
  const output = generateGamesFile(games);

  // Write to output file
  fs.writeFileSync(outputFile, output, 'utf-8');

  console.log(`✓ Generated ${games.length} games`);
  console.log(`✓ Written to: ${outputFile}`);
  console.log('');
  console.log('Next steps:');
  console.log('  1. Fill in image URLs');
  console.log('  2. Fill in tags arrays');
  console.log('  3. Update warhornUrl fields with specific session URLs');
  console.log('  4. Shorten descriptions if needed');
}

main();
