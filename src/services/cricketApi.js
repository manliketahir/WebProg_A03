import axios from 'axios';
import playersLocal from '../data/players.json';
import fixturesLocal from '../data/fixtures.json';

/*
  Robust fetch helpers:
  - Try remote public raw GitHub URLs first (no signup).
  - On any error or unexpected shape, fallback to local JSON in src/data.
  - Returns the raw JSON shape from the source so calling code can adapt.
*/

const PLAYERS_URL = 'https://raw.githubusercontent.com/azharimm/Cricket-API/master/players.json';
const MATCHES_URL = 'https://raw.githubusercontent.com/azharimm/Cricket-API/master/matches.json';

async function tryGet(url) {
  try {
    const res = await axios.get(url, { timeout: 8000 });
    return res.data;
  } catch (err) {
    console.warn(`[cricketApi] remote fetch failed for ${url}:`, err.message || err);
    return null;
  }
}

export async function fetchPlayersFromPublic() {
  const remote = await tryGet(PLAYERS_URL);
  if (remote) {
    // Remote may be an object containing players or an array — return as-is for calling code to adapt.
    return remote;
  }
  console.info('[cricketApi] falling back to local players.json');
  return playersLocal;
}

export async function fetchFixturesFromPublic() {
  const remote = await tryGet(MATCHES_URL);
  if (remote) {
    return remote;
  }
  console.info('[cricketApi] falling back to local fixtures.json');
  return fixturesLocal;
}