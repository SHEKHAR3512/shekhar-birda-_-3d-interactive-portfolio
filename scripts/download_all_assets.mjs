import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const CREDITS_FILE = path.join(ROOT_DIR, 'ASSET_CREDITS.md');
const API_TOKEN = process.argv[2] || process.env.SKETCHFAB_API_TOKEN || 'bf5c80017d154e0d9182d078d59b5335';

const ASSETS_TO_DOWNLOAD = [
  // PLANETS
  { id: 'earth', category: 'planets', name: 'Earth', uid: '072ccdc6820c4cb698349d9b71089269', dest: 'public/assets/space/planets/earth/model.glb' },
  { id: 'mercury', category: 'planets', name: 'Mercury', uid: 'cfbcea0971c64c3d8dbfa0de2dc9f320', dest: 'public/assets/space/planets/mercury/model.glb' },
  { id: 'venus', category: 'planets', name: 'Venus', uid: 'd497ce25553447f3b7b679110c85cfa1', dest: 'public/assets/space/planets/venus/model.glb' },
  { id: 'mars', category: 'planets', name: 'Mars', uid: 'f98432cf20aa426fb3bd299f699ffd51', dest: 'public/assets/space/planets/mars/model.glb' },
  { id: 'jupiter', category: 'planets', name: 'Jupiter', uid: 'b23739bf6154492eb30fcd2e758dff08', dest: 'public/assets/space/planets/jupiter/model.glb' },
  { id: 'saturn', category: 'planets', name: 'Saturn', uid: '9a279abdabc740419474d2b03dbadb59', dest: 'public/assets/space/planets/saturn/model.glb' },
  { id: 'uranus', category: 'planets', name: 'Uranus', uid: '0009a69dbace44608c0bd09af9ba20db', dest: 'public/assets/space/planets/uranus/model.glb' },
  { id: 'neptune', category: 'planets', name: 'Neptune', uid: '7e7632f6e16b4aaaa7597b9ff91b47b2', dest: 'public/assets/space/planets/neptune/model.glb' },
  { id: 'pluto', category: 'planets', name: 'Pluto', uid: '82bec3a4536c4a608c3b6e219b16a824', dest: 'public/assets/space/planets/pluto/model.glb' },
  { id: 'moon', category: 'planets', name: 'Moon', uid: '26cc0b7878bb4d919b68e2be399db466', dest: 'public/assets/space/planets/moon/model.glb' },

  // ASTEROIDS
  { id: 'asteroid-low', category: 'asteroids', name: '100 Low Poly Asteroids', uid: '24572b5eec404dd7888a76098054cd7a', dest: 'public/assets/space/asteroids/low_poly/model.glb' },
  { id: 'asteroid-med', category: 'asteroids', name: '100 Medium Poly Asteroids', uid: '2dc6d949b60a4128a86d5c34f53b136c', dest: 'public/assets/space/asteroids/medium_poly/model.glb' },

  // STATIONS
  { id: 'station-01', category: 'stations', name: 'Space Station', uid: '0da4a24e7edd49159737675ffcc06228', dest: 'public/assets/space/stations/station_01/model.glb' },
  { id: 'station-03', category: 'stations', name: 'Space Station 3', uid: 'a7a6ad10261149cab31aa394bfcf8940', dest: 'public/assets/space/stations/station_03/model.glb' },
  { id: 'station-modules', category: 'stations', name: 'Space Station Modules', uid: 'e3ba39a1c78540448542cf937b11feab', dest: 'public/assets/space/stations/modules/model.glb' },

  // SHIPS
  { id: 'ship-player', category: 'ships', name: 'Player Light Fighter', uid: '51616ef53af84fe595c5603cd3e0f3e1', dest: 'public/assets/space/ships/player/light_fighter.glb' },
  { id: 'ship-npc', category: 'ships', name: 'NPC Spaceship', uid: '9a81a5167c474530881e55127e275c6c', dest: 'public/assets/space/ships/npc/spaceship.glb' },

  // SPECIAL
  { id: 'special-meteorite', category: 'special', name: 'Meteorite', uid: '0a503e5bec784cbc9082e2f6b2d9f701', dest: 'public/assets/space/special/meteorite/model.glb' },
  { id: 'special-meteor', category: 'special', name: 'Meteor', uid: 'd3a5a7e9a7d24b76841bf0f49d56a5f3', dest: 'public/assets/space/special/meteor/model.glb' },
];

async function fetchMetadata(uid) {
  try {
    const res = await fetch(`https://api.sketchfab.com/v3/models/${uid}`, {
      headers: { Authorization: `Token ${API_TOKEN}` },
    });
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

function updateCredits(metadata, item, finalPath) {
  const title = metadata?.name || item.name;
  const author = metadata?.user?.displayName || metadata?.user?.username || 'Sketchfab Creator';
  const authorUrl = metadata?.user?.profileUrl || 'https://sketchfab.com';
  const license = metadata?.license?.label || 'Sketchfab Standard License';
  const modelUrl = metadata?.viewerUrl || `https://sketchfab.com/3d-models/${item.uid}`;
  const relPath = path.relative(ROOT_DIR, finalPath).replace(/\\/g, '/');

  const entry = `
### ${title}
- **Category / Target**: \`${relPath}\`
- **Creator**: [${author}](${authorUrl})
- **License**: ${license}
- **Sketchfab Model UID**: \`${item.uid}\`
- **Source Link**: [${title} on Sketchfab](${modelUrl})
- **Added Date**: ${new Date().toISOString().split('T')[0]}
`;

  try {
    let content = fs.existsSync(CREDITS_FILE) ? fs.readFileSync(CREDITS_FILE, 'utf8') : '';
    if (!content.includes(item.uid)) {
      content += entry;
      fs.writeFileSync(CREDITS_FILE, content, 'utf8');
    }
  } catch {}
}

async function downloadSingleAsset(item) {
  const targetGlb = path.resolve(ROOT_DIR, item.dest);
  const destDir = path.dirname(targetGlb);

  if (fs.existsSync(targetGlb) && fs.statSync(targetGlb).size > 1000) {
    console.log(`[SKIP] Already exists: ${item.name} (${Math.round(fs.statSync(targetGlb).size / 1024)} KB)`);
    return { success: true, item, skipped: true };
  }

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  console.log(`\n[FETCHING] ${item.name} (UID: ${item.uid})...`);
  const meta = await fetchMetadata(item.uid);
  if (meta) {
    console.log(`  Title   : "${meta.name}" by @${meta.user?.username}`);
    console.log(`  License : ${meta.license?.label || 'Standard'}`);
  }

  const res = await fetch(`https://api.sketchfab.com/v3/models/${item.uid}/download`, {
    headers: { Authorization: `Token ${API_TOKEN}` },
  });

  if (!res.ok) {
    console.warn(`  [WARN] Download link not authorized: HTTP ${res.status} ${res.statusText}`);
    return { success: false, item, status: res.status };
  }

  const data = await res.json();
  const glbUrl = data.glb?.url;
  const gltfUrl = data.gltf?.url || data.source?.url;
  const tempZip = path.join(destDir, `temp_${item.uid}.zip`);

  if (glbUrl) {
    console.log(`  Downloading native GLB...`);
    const fileRes = await fetch(glbUrl);
    const buffer = Buffer.from(await fileRes.arrayBuffer());

    if (buffer[0] === 0x50 && buffer[1] === 0x4b) {
      fs.writeFileSync(tempZip, buffer);
      execSync(`powershell -Command "Expand-Archive -Path '${tempZip}' -DestinationPath '${destDir}' -Force"`);
      if (fs.existsSync(tempZip)) fs.unlinkSync(tempZip);

      const foundFiles = fs.readdirSync(destDir);
      const glbMatch = foundFiles.find(f => f.endsWith('.glb'));
      if (glbMatch && path.join(destDir, glbMatch) !== targetGlb) {
        fs.copyFileSync(path.join(destDir, glbMatch), targetGlb);
      }
    } else {
      fs.writeFileSync(targetGlb, buffer);
    }
    console.log(`  [OK] Saved to: ${targetGlb} (${Math.round(fs.statSync(targetGlb).size / 1024)} KB)`);
  } else if (gltfUrl) {
    console.log(`  Downloading glTF archive...`);
    const fileRes = await fetch(gltfUrl);
    const buffer = Buffer.from(await fileRes.arrayBuffer());

    fs.writeFileSync(tempZip, buffer);
    execSync(`powershell -Command "Expand-Archive -Path '${tempZip}' -DestinationPath '${destDir}' -Force"`);
    if (fs.existsSync(tempZip)) fs.unlinkSync(tempZip);
    console.log(`  [OK] glTF package extracted to: ${destDir}`);
  } else {
    console.warn(`  [WARN] No GLB/glTF download url in response:`, Object.keys(data));
    return { success: false, item };
  }

  updateCredits(meta, item, targetGlb);
  return { success: true, item };
}

async function run() {
  console.log(`=======================================================`);
  console.log(`BATCH DOWNLOADING ${ASSETS_TO_DOWNLOAD.length} SKETCHFAB ASSETS`);
  console.log(`Token: ${API_TOKEN.slice(0, 6)}...`);
  console.log(`=======================================================`);

  const results = [];
  for (const item of ASSETS_TO_DOWNLOAD) {
    try {
      const res = await downloadSingleAsset(item);
      results.push(res);
    } catch (err) {
      console.error(`  [ERROR] Failed to download ${item.name}:`, err.message);
      results.push({ success: false, item, error: err.message });
    }
  }

  console.log(`\n=======================================================`);
  console.log(`DOWNLOAD SUMMARY`);
  console.log(`=======================================================`);
  const successCount = results.filter(r => r.success).length;
  console.log(`Total: ${results.length} | Success: ${successCount} | Failed: ${results.length - successCount}`);
  for (const r of results) {
    console.log(`- [${r.success ? 'SUCCESS' : 'FAILED'}] ${r.item.name} (${r.item.dest})`);
  }
}

run();
