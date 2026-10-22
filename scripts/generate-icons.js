import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Simple CRC32 implementation
function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
}

const crcTable = makeCrcTable();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const toCrc = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(toCrc);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function generatePng(width, height, isMaskable = false) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // deflate
  ihdrData[11] = 0; // standard filter
  ihdrData[12] = 0; // no interlace

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw image data: height scanlines, each (1 + width * 4) bytes
  const rawData = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;

  const cx = width / 2;
  const cy = height / 2;
  const rBg = width * 0.46; // background circle radius
  const rIcon = width * (isMaskable ? 0.28 : 0.35);

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Nocturnal dark gradient background: #1c1e22 to #232730
      let r = 28;
      let g = 30;
      let b = 34;
      let a = 255;

      if (!isMaskable) {
        // Rounded app icon shape
        if (dist > rBg) {
          // outer anti-alias / transparent
          if (dist > rBg + 1) {
            a = 0;
            r = 0;
            g = 0;
            b = 0;
          } else {
            a = Math.floor(255 * (1 - (dist - rBg)));
          }
        }
      }

      if (a > 0) {
        // Inner amber rain cloud motif
        // Cloud body / rain drop in center
        const inCloud = (dy > -rIcon * 0.4 && dy < rIcon * 0.3 && Math.abs(dx) < rIcon * 0.7);
        const inLeftPuff = Math.sqrt((dx + rIcon * 0.3) ** 2 + (dy + rIcon * 0.1) ** 2) < rIcon * 0.4;
        const inRightPuff = Math.sqrt((dx - rIcon * 0.3) ** 2 + (dy + rIcon * 0.05) ** 2) < rIcon * 0.35;
        const inTopPuff = Math.sqrt(dx ** 2 + (dy + rIcon * 0.2) ** 2) < rIcon * 0.45;

        // Raindrops falling beneath
        const inDrop1 = dy > rIcon * 0.45 && dy < rIcon * 0.85 && Math.abs(dx + rIcon * 0.3 + (dy - rIcon * 0.5) * 0.4) < width * 0.025;
        const inDrop2 = dy > rIcon * 0.55 && dy < rIcon * 0.95 && Math.abs(dx + (dy - rIcon * 0.5) * 0.4) < width * 0.025;
        const inDrop3 = dy > rIcon * 0.45 && dy < rIcon * 0.85 && Math.abs(dx - rIcon * 0.3 + (dy - rIcon * 0.5) * 0.4) < width * 0.025;

        if (inCloud || inLeftPuff || inRightPuff || inTopPuff) {
          // Soft Slate Blue-Grey Cloud
          r = 180;
          g = 195;
          b = 220;
        } else if (inDrop1 || inDrop2 || inDrop3) {
          // Warm Amber Rain Streak (#c89254)
          r = 200;
          g = 146;
          b = 84;
        } else {
          // Subtle glow
          const glow = Math.max(0, 1 - dist / (rBg * 0.85));
          r = Math.min(255, Math.floor(r + glow * 25));
          g = Math.min(255, Math.floor(g + glow * 20));
          b = Math.min(255, Math.floor(b + glow * 15));
        }
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  // Compress
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Generate PNGs
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePng(180, 180, false));

// 2. Generate SVG
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#282d37" />
      <stop offset="100%" stop-color="#181a1f" />
    </radialGradient>
    <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e2e8f0" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>
    <linearGradient id="rainGrad" x1="0%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#c89254" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)" />
  <!-- Cloud -->
  <path d="M180 270 A45 45 0 0 1 216 200 A60 60 0 0 1 310 185 A50 50 0 0 1 352 250 A42 42 0 0 1 332 295 L180 295 A40 40 0 0 1 180 270 Z" fill="url(#cloudGrad)" />
  <!-- Rain Drops -->
  <line x1="200" y1="330" x2="185" y2="380" stroke="url(#rainGrad)" stroke-width="12" stroke-linecap="round" />
  <line x1="256" y1="335" x2="241" y2="395" stroke="url(#rainGrad)" stroke-width="12" stroke-linecap="round" />
  <line x1="312" y1="330" x2="297" y2="380" stroke="url(#rainGrad)" stroke-width="12" stroke-linecap="round" />
  <!-- Subtle Moon Crescent -->
  <path d="M340 130 A45 45 0 1 1 300 200 A35 35 0 0 0 340 130 Z" fill="#fbbf24" opacity="0.9" />
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon.trim());

console.log('Icons generated successfully in public/');
