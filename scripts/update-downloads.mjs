import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GAMES_JSON_PATH = path.resolve(__dirname, "..", "games.json");

// ── itch.io API ──────────────────────────────────────────────
async function fetchItchDownloads(apiKey) {
  if (!apiKey) {
    console.warn("⚠  ITCH_API_KEY not set — skipping itch.io downloads.");
    return {};
  }

  const res = await fetch(`https://itch.io/api/1/${apiKey}/my-games`);
  if (!res.ok) {
    console.error(`✗  itch.io API error: ${res.status} ${res.statusText}`);
    return {};
  }

  const data = await res.json();
  const map = {};

  for (const game of data.games) {
    // Key by the full itch.io URL so we can match against itch_link
    map[game.url] = game.downloads_count ?? 0;
  }

  console.log(`✓  Fetched itch.io data for ${Object.keys(map).length} game(s).`);
  return map;
}

// ── Google Play Store ────────────────────────────────────────
async function fetchPlayStoreDownloads(packageId) {
  if (!packageId) return null;

  try {
    // Dynamic import — installed as a workflow dependency
    const gplay = await import("google-play-scraper");
    const app = await gplay.default.app({ appId: packageId });
    console.log(`✓  Play Store: ${packageId} → ${app.maxInstalls ?? app.minInstalls ?? 0} installs`);
    return app.maxInstalls ?? app.minInstalls ?? 0;
  } catch (err) {
    console.error(`✗  Play Store lookup failed for ${packageId}: ${err.message}`);
    return null;
  }
}

function extractPackageId(playLink) {
  if (!playLink) return null;
  try {
    const url = new URL(playLink);
    return url.searchParams.get("id");
  } catch {
    return null;
  }
}

// ── Main ─────────────────────────────────────────────────────
async function main() {
  const raw = fs.readFileSync(GAMES_JSON_PATH, "utf-8");
  const data = JSON.parse(raw);

  const itchKey = process.env.ITCH_API_KEY || "";
  const itchMap = await fetchItchDownloads(itchKey);

  let updated = false;

  for (const game of data.games) {
    // itch.io
    if (game.itch_link && itchMap[game.itch_link] !== undefined) {
      const newCount = itchMap[game.itch_link];
      if (newCount !== game.itch_downloads) {
        console.log(`  ${game.name}: itch downloads ${game.itch_downloads ?? 0} → ${newCount}`);
        game.itch_downloads = newCount;
        updated = true;
      }
    }

    // Play Store
    const pkgId = extractPackageId(game.play_link);
    if (pkgId) {
      const newCount = await fetchPlayStoreDownloads(pkgId);
      if (newCount !== null && newCount !== game.playstore_downloads) {
        console.log(`  ${game.name}: playstore downloads ${game.playstore_downloads ?? 0} → ${newCount}`);
        game.playstore_downloads = newCount;
        updated = true;
      }
    }
  }

  if (updated) {
    fs.writeFileSync(GAMES_JSON_PATH, JSON.stringify(data, null, 2) + "\n", "utf-8");
    console.log("\n✓  games.json updated.");
  } else {
    console.log("\n—  No changes needed.");
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
