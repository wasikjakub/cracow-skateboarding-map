/**
 * Google Apps Script — Formspree email → GitHub Actions
 *
 * Paste this entire file into script.google.com, set up a time trigger,
 * and new spot submissions will automatically deploy to the map.
 *
 * SETUP (one time):
 *  1. Go to https://script.google.com and create a new project.
 *  2. Paste this code, save.
 *  3. Go to Project Settings → Script Properties → Add property:
 *       Key:   GITHUB_TOKEN
 *       Value: <your GitHub fine-grained PAT — see instructions below>
 *  4. Run processFormspreeEmails() once manually to grant Gmail permission.
 *  5. Add a time trigger: Triggers → Add Trigger →
 *       Function: processFormspreeEmails
 *       Event source: Time-driven
 *       Type: Minutes timer, every 10 minutes
 *
 * GITHUB TOKEN:
 *  - Go to github.com → Settings → Developer settings →
 *    Fine-grained personal access tokens → Generate new token
 *  - Repository access: only "cracow-skateboarding-map"
 *  - Permissions: Actions → Read and write
 *  - Copy the token and paste it into Script Properties above.
 */

const REPO = 'wasikjakub/cracow-skateboarding-map';
const WORKFLOW = 'add-spot.yml';
const PROCESSED_LABEL = 'spot-processed';

// ---------------------------------------------------------------------------
// Web App entry point — receives submissions directly from the React form
// Deploy this script as a Web App (Execute as: Me, Access: Anyone) and paste
// the URL into src/constants/formOptions.js as GAS_ENDPOINT.
//
// Required Script Property:
//   IMAGES_FOLDER_ID — Google Drive folder ID where spot photos are stored.
//   Create a folder in Drive, share it as "Anyone with the link can view",
//   then copy the ID from its URL: drive.google.com/drive/folders/<ID>
// ---------------------------------------------------------------------------

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
    const folderId = PropertiesService.getScriptProperties().getProperty('IMAGES_FOLDER_ID');

    if (!token) return jsonResponse({ ok: false, error: 'GITHUB_TOKEN not set' });
    if (!folderId) return jsonResponse({ ok: false, error: 'IMAGES_FOLDER_ID not set' });
    if (!data.name || !data.lat || !data.lng) {
      return jsonResponse({ ok: false, error: 'Missing required fields' });
    }

    // Upload images to Google Drive and collect public URLs
    const imageUrls = [];
    if (Array.isArray(data.images) && data.images.length > 0) {
      const folder = DriveApp.getFolderById(folderId);
      data.images.forEach(img => {
        const bytes = Utilities.base64Decode(img.base64);
        const blob = Utilities.newBlob(bytes, img.mimeType, img.name);
        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        imageUrls.push('https://lh3.googleusercontent.com/d/' + file.getId());
      });
    }

    const spot = {
      name:   data.name.trim(),
      note:   (data.note || '').trim(),
      lat:    String(data.lat),
      lng:    String(data.lng),
      type:   normaliseType(data.type || ''),
      city:   normaliseCity(data.city || ''),
      author: (data.author || 'anonymous').trim(),
      images: imageUrls.join(', '),
    };

    const ok = triggerWorkflow(token, spot);
    return jsonResponse({ ok });

  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function processFormspreeEmails() {
  const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  if (!token) {
    console.error('GITHUB_TOKEN not set in Script Properties.');
    return;
  }

  ensureLabelExists(PROCESSED_LABEL);

  // Search for unread Formspree submission emails not yet processed
  const threads = GmailApp.search(
    `from:formspree is:unread -label:${PROCESSED_LABEL}`,
    0,
    20
  );

  if (threads.length === 0) {
    console.log('No new Formspree submissions.');
    return;
  }

  threads.forEach(thread => {
    thread.getMessages().forEach(message => {
      if (!message.isUnread()) return;

      const body = message.getPlainBody();
      const spot = parseSpot(body);

      if (!spot.name || !spot.lat || !spot.lng) {
        console.warn('Could not parse spot from email — skipping.', body.slice(0, 200));
        return;
      }

      const ok = triggerWorkflow(token, spot);
      if (ok) {
        message.markRead();
        GmailApp.getUserLabelByName(PROCESSED_LABEL).addToThread(thread);
        console.log(`Triggered workflow for: ${spot.name} (${spot.city})`);
      }
    });
  });
}

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

function parseSpot(body) {
  const get = (key) => {
    // Matches "key: value" (case-insensitive, trims whitespace)
    const m = body.match(new RegExp(`^${key}:\\s*(.+)`, 'im'));
    return m ? m[1].trim() : '';
  };

  const type = normaliseType(get('type'));
  const city = normaliseCity(get('city'));

  return {
    name:   get('name'),
    note:   get('note'),
    lat:    get('lat'),
    lng:    get('lng'),
    type:   type,
    city:   city,
    author: get('author') || 'anonymous',
    images: get('images'),
  };
}

function normaliseType(raw) {
  const t = raw.toLowerCase();
  if (t.includes('skatepark')) return 'Skatepark';
  if (t.includes('diy'))       return 'DIY';
  return 'Street';
}

function normaliseCity(raw) {
  const valid = ['Cracow', 'Warsaw', 'Wroclaw', 'Trojmiasto', 'Słupsk'];
  const match = valid.find(c => c.toLowerCase() === raw.toLowerCase());
  return match || raw || 'Other';
}

// ---------------------------------------------------------------------------
// GitHub API
// ---------------------------------------------------------------------------

function triggerWorkflow(token, spot) {
  const url = `https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}/dispatches`;

  const payload = JSON.stringify({
    ref: 'main',
    inputs: {
      name:   spot.name,
      note:   spot.note,
      lat:    spot.lat,
      lng:    spot.lng,
      type:   spot.type,
      city:   spot.city,
      author: spot.author,
      images: spot.images,
    },
  });

  const response = UrlFetchApp.fetch(url, {
    method: 'POST',
    headers: {
      'Authorization':        `Bearer ${token}`,
      'Accept':               'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type':         'application/json',
    },
    payload: payload,
    muteHttpExceptions: true,
  });

  const code = response.getResponseCode();
  if (code === 204) return true;

  console.error(`GitHub API error ${code}: ${response.getContentText()}`);
  return false;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ensureLabelExists(name) {
  if (!GmailApp.getUserLabelByName(name)) {
    GmailApp.createLabel(name);
  }
}
