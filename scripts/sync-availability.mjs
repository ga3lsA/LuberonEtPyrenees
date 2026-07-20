// ==============================================================================
// Synchronise les disponibilités depuis les calendriers iCal Airbnb et Booking,
// et écrit le résultat dans data/availability.json.
//
// Ce script est conçu pour tourner dans GitHub Actions (voir
// .github/workflows/sync-availability.yml), qui l'exécute chaque jour et
// republie le fichier JSON automatiquement. Il peut aussi être lancé à la
// main avec Node 18+ :
//
//   AIRBNB_GORDES_ICAL=... BOOKING_GORDES_ICAL=... \
//   AIRBNB_MARQUIXANES_ICAL=... BOOKING_MARQUIXANES_ICAL=... \
//   node scripts/sync-availability.mjs
// ==============================================================================

import { writeFile } from "node:fs/promises";

const SOURCES = {
  gordes: {
    airbnb: process.env.AIRBNB_GORDES_ICAL,
    booking: process.env.BOOKING_GORDES_ICAL,
  },
  marquixanes: {
    airbnb: process.env.AIRBNB_MARQUIXANES_ICAL,
    booking: process.env.BOOKING_MARQUIXANES_ICAL,
  },
};

async function fetchIcs(url, label) {
  if (!url) {
    console.log(`(pas d'URL configurée pour ${label}, ignoré)`);
    return "";
  }
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`ÉCHEC ${label} : HTTP ${res.status}`);
    return "";
  }
  return await res.text();
}

// Déplie les lignes iCal repliées (une ligne continuée commence par une espace)
function unfold(ics) {
  return ics.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "");
}

// Extrait les paires DTSTART/DTEND de chaque VEVENT, au format YYYY-MM-DD
function parseEvents(ics) {
  const text = unfold(ics);
  const events = [];
  const blocks = text.split("BEGIN:VEVENT").slice(1);
  for (const block of blocks) {
    const startMatch = block.match(/DTSTART[^:\n]*:(\d{8})/);
    const endMatch = block.match(/DTEND[^:\n]*:(\d{8})/);
    if (!startMatch || !endMatch) continue;
    events.push({
      start: toIsoDate(startMatch[1]),
      end: toIsoDate(endMatch[1]),
    });
  }
  return events;
}

function toIsoDate(yyyymmdd) {
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
}

// Fusionne les plages qui se chevauchent ou se touchent, pour un JSON compact
function mergeRanges(ranges) {
  const sorted = [...ranges].sort((a, b) => a.start.localeCompare(b.start));
  const merged = [];
  for (const r of sorted) {
    const last = merged[merged.length - 1];
    if (last && r.start <= addDays(last.end, 1)) {
      if (r.end > last.end) last.end = r.end;
    } else {
      merged.push({ ...r });
    }
  }
  return merged;
}

function addDays(isoDate, days) {
  const d = new Date(isoDate + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

async function run() {
  const result = { updatedAt: new Date().toISOString(), houses: {} };

  for (const [house, urls] of Object.entries(SOURCES)) {
    const [airbnbIcs, bookingIcs] = await Promise.all([
      fetchIcs(urls.airbnb, `Airbnb ${house}`),
      fetchIcs(urls.booking, `Booking ${house}`),
    ]);
    const events = [...parseEvents(airbnbIcs), ...parseEvents(bookingIcs)];
    result.houses[house] = mergeRanges(events);
    console.log(`${house} : ${result.houses[house].length} période(s) bloquée(s)`);
  }

  await writeFile("data/availability.json", JSON.stringify(result, null, 2) + "\n");
  console.log("data/availability.json mis à jour.");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
