import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const CREDITS_FILE = path.join(ROOT_DIR, 'ASSET_CREDITS.md');

// Default fallback token from user configuration
const DEFAULT_TOKEN = 'bf5c80017d154e0d9182d078d59b5335';
const DEFAULT_MODEL_UID = '51616ef53af84fe595c5603cd3e0f3e1'; // Light Fighter Spaceship Free
const DEFAULT_DEST = 'public/assets/space/ships/player/light_fighter.glb';

// Parse CLI arguments:
// node scripts/download_sketchfab.mjs [MODEL_UID] [DEST_PATH] [API_TOKEN]
// Or: node scripts/download_sketchfab.mjs <API_TOKEN> (legacy backward compatibility)
const args = process.argv.slice(2);

let modelUid = DEFAULT_MODEL_UID;
let destPath = DEFAULT_DEST;
let apiToken = process.env.SKETCHFAB_API_TOKEN || DEFAULT_TOKEN;

if (args.length === 1) {
  // If argument is 32 hex chars, treat as token or model UID
  if (/^[a-f0-9]{32}$/i.test(args[0])) {
    if (args[0] === DEFAULT_MODEL_UID) {
      modelUid = args[0];
    } else {
      // Could be token
      apiToken = args[0];
    }
  } else {
    modelUid = args[0];
  }
} else if (args.length >= 2) {
  modelUid = args[0];
  destPath = args[1];
  if (args[2]) {
    apiToken = args[2];
  }
}

const resolvedDest = path.isAbsolute(destPath) ? destPath : path.resolve(ROOT_DIR, destPath);
const destDir = path.extname(resolvedDest) ? path.dirname(resolvedDest) : resolvedDest;
const targetGlb = path.extname(resolvedDest) === '.glb' ? resolvedDest : path.join(destDir, 'model.glb');
const tempZip = path.join(destDir, 'sketchfab_download.zip');

console.log(`=======================================================`);
console.log(`SKETCHFAB UNIVERSAL ASSET DOWNLOADER`);
console.log(`Model UID   : ${modelUid}`);
console.log(`Destination : ${resolvedDest}`);
console.log(`=======================================================`);

async function fetchModelMetadata(uid, token) {
  try {
    const res = await fetch(`https://api.sketchfab.com/v3/models/${uid}`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Non-fatal if metadata fetch fails
  }
  return null;
}

function updateCreditsFile(metadata, uid, finalPath) {
  const title = metadata?.name || 'Sketchfab 3D Model';
  const author = metadata?.user?.displayName || metadata?.user?.username || 'Unknown Artist';
  const authorUrl = metadata?.user?.profileUrl || 'https://sketchfab.com';
  const license = metadata?.license?.label || 'Sketchfab Free Standard License';
  const modelUrl = metadata?.viewerUrl || `https://sketchfab.com/3d-models/${uid}`;
  const relPath = path.relative(ROOT_DIR, finalPath).replace(/\\/g, '/');

  const entry = `
### ${title}
- **Category / File**: \`${relPath}\`
- **Creator**: [${author}](${authorUrl})
- **License**: ${license}
- **Sketchfab Model UID**: \`${uid}\`
- **Source Link**: [${title} on Sketchfab](${modelUrl})
- **Added Date**: ${new Date().toISOString().split('T')[0]}
`;

  try {
    let content = '';
    if (fs.existsSync(CREDITS_FILE)) {
      content = fs.readFileSync(CREDITS_FILE, 'utf8');
    } else {
      content = `# 3D Asset Credits & Licensing Ledger\n\nAll external 3D models used in this Babylon.js space cosmos experience comply with their respective licenses.\n`;
    }

    if (!content.includes(uid)) {
      content += entry;
      fs.writeFileSync(CREDITS_FILE, content, 'utf8');
      console.log(`Updated ASSET_CREDITS.md with attribution for: ${title}`);
    }
  } catch (err) {
    console.warn('Could not update ASSET_CREDITS.md:', err.message);
  }
}

async function run() {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // 1. Fetch metadata
  console.log(`Fetching model details from Sketchfab...`);
  const metadata = await fetchModelMetadata(modelUid, apiToken);
  if (metadata) {
    console.log(`Model Title : "${metadata.name}" by @${metadata.user?.username}`);
    console.log(`License     : ${metadata.license?.label || 'Standard'}`);
  }

  // 2. Fetch download link
  console.log(`Requesting download authorization...`);
  const res = await fetch(`https://api.sketchfab.com/v3/models/${modelUid}/download`, {
    headers: {
      Authorization: `Token ${apiToken}`,
    },
  });

  if (!res.ok) {
    console.error(`Download request failed: HTTP ${res.status} ${res.statusText}`);
    const errText = await res.text();
    console.error(errText);
    process.exit(1);
  }

  const data = await res.json();
  console.log('Available formats:', Object.keys(data).filter(k => data[k]?.url));

  const glbUrl = data.glb?.url;
  const gltfUrl = data.gltf?.url || data.source?.url;

  if (glbUrl) {
    console.log('Downloading native binary GLB...');
    const fileRes = await fetch(glbUrl);
    const buffer = Buffer.from(await fileRes.arrayBuffer());

    // Check if buffer is PK zip or direct GLB
    if (buffer[0] === 0x50 && buffer[1] === 0x4b) {
      console.log('Archive detected. Extracting via PowerShell...');
      fs.writeFileSync(tempZip, buffer);
      execSync(`powershell -Command "Expand-Archive -Path '${tempZip}' -DestinationPath '${destDir}' -Force"`);
      if (fs.existsSync(tempZip)) fs.unlinkSync(tempZip);

      // Locate extracted .glb
      const foundFiles = fs.readdirSync(destDir);
      const glbMatch = foundFiles.find(f => f.endsWith('.glb'));
      if (glbMatch && path.join(destDir, glbMatch) !== targetGlb) {
        fs.copyFileSync(path.join(destDir, glbMatch), targetGlb);
      }
    } else {
      fs.writeFileSync(targetGlb, buffer);
    }
    console.log(`Saved GLB to: ${targetGlb} (${Math.round(fs.statSync(targetGlb).size / 1024)} KB)`);
  } else if (gltfUrl) {
    console.log('Downloading glTF archive package...');
    const fileRes = await fetch(gltfUrl);
    const buffer = Buffer.from(await fileRes.arrayBuffer());

    fs.writeFileSync(tempZip, buffer);
    console.log(`Extracting glTF archive into ${destDir}...`);
    execSync(`powershell -Command "Expand-Archive -Path '${tempZip}' -DestinationPath '${destDir}' -Force"`);
    if (fs.existsSync(tempZip)) fs.unlinkSync(tempZip);
    console.log('Extracted glTF package successfully.');
  } else {
    console.error('No suitable GLB/glTF download link found in response:', data);
    process.exit(1);
  }

  // 3. Update credits
  updateCreditsFile(metadata, modelUid, targetGlb);

  // Also maintain backward-compatible copy in public/assets/ships/light_fighter.glb if it's the player ship
  if (modelUid === DEFAULT_MODEL_UID) {
    const legacyDir = path.resolve(ROOT_DIR, 'public/assets/ships');
    if (!fs.existsSync(legacyDir)) fs.mkdirSync(legacyDir, { recursive: true });
    const legacyGlb = path.join(legacyDir, 'light_fighter.glb');
    if (fs.existsSync(targetGlb) && targetGlb !== legacyGlb) {
      fs.copyFileSync(targetGlb, legacyGlb);
    }
  }

  console.log(`\nModel download and setup complete! Target: ${targetGlb}\n`);
}

run().catch((err) => {
  console.error('Download execution error:', err);
  process.exit(1);
});
