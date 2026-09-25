// Haalt poster- en backdrop-URL's op bij TMDB en schrijft ze terug naar assets/films.json.
// Wordt uitsluitend uitgevoerd binnen de GitHub Action (fetch-posters.yml), zodat de
// TMDB_KEY nooit in client-side code of in de repository zelf terechtkomt.
//
// Vereist: environment variable TMDB_KEY (TMDB "API Read Access Token", v4, of de v3 API key).

import { readFile, writeFile } from "node:fs/promises";

const DATA_PATH = new URL("../assets/films.json", import.meta.url);
const TMDB_KEY = process.env.TMDB_KEY;

if (!TMDB_KEY) {
  console.error("TMDB_KEY ontbreekt. Stel de repository secret TMDB_KEY in en geef hem door als environment variable.");
  process.exit(1);
}

const IMG_BASE = "https://image.tmdb.org/t/p";

function tmdbFetch(path) {
  const url = `https://api.themoviedb.org/3${path}`;
  const isBearer = TMDB_KEY.length > 40; // v4 read access tokens zijn lange JWT's
  return fetch(url, {
    headers: isBearer ? { Authorization: `Bearer ${TMDB_KEY}`, accept: "application/json" } : { accept: "application/json" }
  }).then(res => {
    if (!res.ok) throw new Error(`TMDB-fout ${res.status} voor ${path}`);
    return res.json();
  });
}

function appendKeyIfNeeded(path) {
  const isBearer = TMDB_KEY.length > 40;
  if (isBearer) return path;
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}api_key=${TMDB_KEY}`;
}

async function findMedia(film) {
  // film.tmdb_id is al bekend voor alle acht producties; movie voor films, tv voor de serie.
  const kind = film.type === "tv-serie" ? "tv" : "movie";
  const detail = await tmdbFetch(appendKeyIfNeeded(`/${kind}/${film.tmdb_id}`));
  return {
    poster_url: detail.poster_path ? `${IMG_BASE}/w500${detail.poster_path}` : null,
    backdrop_url: detail.backdrop_path ? `${IMG_BASE}/w1280${detail.backdrop_path}` : null
  };
}

async function main() {
  const raw = await readFile(DATA_PATH, "utf-8");
  const data = JSON.parse(raw);

  for (const film of data.films) {
    try {
      const media = await findMedia(film);
      film.poster_url = media.poster_url;
      film.backdrop_url = media.backdrop_url;
      console.log(`OK  ${film.titel}: ${media.poster_url ?? "geen poster gevonden"}`);
    } catch (err) {
      console.warn(`WAARSCHUWING  ${film.titel}: ${err.message}`);
    }
  }

  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + "\n", "utf-8");
  console.log("assets/films.json bijgewerkt.");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
