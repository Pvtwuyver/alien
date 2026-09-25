# Alien — tijdlijn

Statische pagina (`index.html`) met een chronologisch overzicht van de Alien-filmreeks: verhaaltijdlijn, personages, bedrijven en plotverbanden. Geschikt voor GitHub Pages.

## Publiceren op GitHub Pages

1. Push deze bestanden naar de repository (root, of een map die je als Pages-bron instelt).
2. Settings → Pages → Source: de branch/map met `index.html`.
3. De pagina is direct bruikbaar zonder posters; die worden los gekoppeld (zie hieronder).

## Posters koppelen via TMDB

`index.html` laadt filmdata uit `assets/films.json` en toont per film een lege posterplek totdat dat bestand een `poster_url` bevat. Filmposters zijn auteursrechtelijk beschermd, dus dit project bevat er zelf geen, en de TMDB-sleutel wordt nooit in de browser gebruikt — alleen server-side, binnen een GitHub Action.

1. Repository secret `TMDB_KEY` staat al klaar (Settings → Secrets and variables → Actions).
2. `.github/workflows/fetch-posters.yml` en `scripts/fetch-posters.mjs` zijn onderdeel van deze repository.
3. Draai de workflow eenmalig: Actions → **Fetch TMDB posters** → **Run workflow**.
4. Het script haalt per film de poster- en backdrop-URL op bij TMDB en commit het resultaat terug naar `assets/films.json`. De workflow draait daarna automatisch maandelijks opnieuw.

## Bestanden

- `index.html` — de pagina zelf (structuur, opmaak en rendering).
- `assets/films.json` — alle inhoudelijke data: tijdlijn, personages, bedrijven, synopsis, plotverbanden.
- `scripts/fetch-posters.mjs` — haalt posterlinks op bij TMDB (server-side).
- `.github/workflows/fetch-posters.yml` — voert het script uit met de repository-secret.

## Inhoud bijwerken

Pas `assets/films.json` aan; de pagina genereert de tijdlijn en het bedrijvenoverzicht automatisch uit dat bestand.
