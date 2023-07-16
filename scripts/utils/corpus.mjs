import { promises as fs } from 'node:fs';

export async function parseMinecraftCorpus(path) {
  const jsonSrc = await fs.readFile(path, { encoding: 'utf8' });
  const texts = Object.entries(JSON.parse(jsonSrc));
  return texts;
}
