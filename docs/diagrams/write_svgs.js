const fs = require('fs');
const dir = 'C:/Users/Mostafa/DaysToCitizen/docs/diagrams/';

// ─── shared defs builder ────────────────────────────────────────────────────
function defs(gradients, markers) {
  const grad = gradients.map(([id, c1, c2]) => `
    <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>`).join('');

  const mark = markers.map(([id, color]) => `
    <marker id="${id}" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${color}"/>
    </marker>`).join('');

  return `<defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>${grad}
    <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.5"/>
    </filter>${mark}
  </defs>`;
}

function bg(w, h) {
  return `<rect width="${w}" height="${h}" fill="url(#bg)"/>`;
}

function grid(w, h, step) {
  let lines = '';
  for (let y = step; y < h; y += step) lines += `<line x1="0" y1="${y}" x2="${w}" y2="${y}"/>`;
  for (let x = step; x < w; x += step) lines += `<line x1="${x}" y1="0" x2="${x}" y2="${h}"/>`;
  return `<g opacity="0.05" stroke="#ffffff" stroke-width="1">${lines}</g>`;
}

function title(text, x, y, w) {
  const cx = x !== undefined ? x : Math.round(w / 2);
  return `<text x="${cx}" y="${y}" text-anchor="middle" font-size="20" font-weight="700" fill="#FFFFFF">${text}</text>`;
}

function box(x, y, w, h, rx, gradId, label, sub, extra) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="url(#${gradId})" filter="url(#sh)"/>
  <text x="${x + w/2}" y="${y + h/2 - (sub ? 10 : 0)}" text-anchor="middle" font-size="15" font-weight="700" fill="#FFFFFF">${label}</text>
  ${sub ? `<text x="${x + w/2}" y="${y + h/2 + 12}" text-anchor="middle" font-size="11" fill="#FFFFFF" opacity="0.8">${sub}</text>` : ''}
  ${extra || ''}`;
}

function panel(x, y, w, h, color, text) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="#00000025"/>
  <text x="${x + w/2}" y="${y + h/2 + 5}" text-anchor="middle" font-size="11" fill="#FFFFFF">${text}</text>`;
}

function arrow(x1, y1, x2, y2, color, markerId, dashed, label, lx, ly) {
  const dash = dashed ? ` stroke-dasharray="5,4"` : '';
  const line = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2"${dash} marker-end="url(#${markerId})"/>`;
  const lbl = label ? `<text x="${lx}" y="${ly}" text-anchor="middle" font-size="10" fill="${color}">${label}</text>` : '';
  return line + lbl;
}

// ────────────────────────────────────────────────────────────────────────────
// 01.svg — System Architecture
// ────────────────────────────────────────────────────────────────────────────
const svg01 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 500" width="880" height="500" font-family="Segoe UI,system-ui,sans-serif">
  ${defs(
    [
      ['gBrowser','#3B82F6','#1D4ED8'],
      ['gNginx','#10B981','#047857'],
      ['gNextjs','#F59E0B','#B45309'],
      ['gDb','#EC4899','#9D174D'],
      ['gResend','#8B5CF6','#5B21B6'],
      ['gCertbot','#06B6D4','#0E7490'],
      ['gDns','#F97316','#C2410C'],
    ],
    [
      ['arrowBlue','#3B82F6'],
      ['arrowGreen','#10B981'],
      ['arrowAmber','#F59E0B'],
      ['arrowPurple','#8B5CF6'],
      ['arrowTeal','#06B6D4'],
      ['arrowGray','#94A3B8'],
    ]
  )}
  ${bg(880, 500)}
  ${grid(880, 500, 50)}

  <text x="440" y="36" text-anchor="middle" font-size="20" font-weight="700" fill="#FFFFFF">DaysToCitizen - System Architecture</text>

  <!-- EC2 boundary -->
  <rect x="220" y="60" width="620" height="400" rx="16" fill="#ffffff06" stroke="#F97316" stroke-width="1.5" stroke-dasharray="10,6"/>
  <rect x="648" y="44" width="150" height="24" rx="6" fill="#F97316" opacity="0.2"/>
  <text x="723" y="61" text-anchor="middle" font-size="11" font-weight="600" fill="#FB923C">AWS EC2 t3.micro</text>

  <!-- Browser -->
  <rect x="24" y="155" width="160" height="100" rx="14" fill="url(#gBrowser)" filter="url(#sh)"/>
  <text x="104" y="198" text-anchor="middle" font-size="15" font-weight="700" fill="#FFFFFF">Browser</text>
  <text x="104" y="218" text-anchor="middle" font-size="11" fill="#BFDBFE">React / localStorage</text>

  <!-- Nginx -->
  <rect x="264" y="150" width="165" height="110" rx="14" fill="url(#gNginx)" filter="url(#sh)"/>
  <text x="346" y="193" text-anchor="middle" font-size="15" font-weight="700" fill="#FFFFFF">Nginx</text>
  <text x="346" y="213" text-anchor="middle" font-size="11" fill="#A7F3D0">Reverse Proxy / SSL</text>

  <!-- Next.js -->
  <rect x="509" y="115" width="195" height="190" rx="14" fill="url(#gNextjs)" filter="url(#sh)"/>
  <rect x="511" y="117" width="46" height="20" rx="5" fill="#92400E"/>
  <text x="534" y="131" text-anchor="middle" font-size="10" font-weight="700" fill="#FDE68A">PM2</text>
  <text x="606" y="158" text-anchor="middle" font-size="15" font-weight="700" fill="#FFFFFF">Next.js 15</text>
  <text x="606" y="176" text-anchor="middle" font-size="11" fill="#FEF3C7">App Router</text>
  <rect x="521" y="185" width="171" height="24" rx="5" fill="#00000025"/>
  <text x="606" y="201" text-anchor="middle" font-size="11" fill="#FFFFFF">Pages + Components</text>
  <rect x="521" y="215" width="171" height="24" rx="5" fill="#00000025"/>
  <text x="606" y="231" text-anchor="middle" font-size="11" fill="#FFFFFF">API Routes</text>
  <rect x="521" y="245" width="171" height="24" rx="5" fill="#00000025"/>
  <text x="606" y="261" text-anchor="middle" font-size="11" fill="#FFFFFF">Auth + OTP Logic</text>

  <!-- db.json -->
  <rect x="754" y="162" width="102" height="90" rx="14" fill="url(#gDb)" filter="url(#sh)"/>
  <text x="805" y="200" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">db.json</text>
  <text x="805" y="218" text-anchor="middle" font-size="10" fill="#FBCFE8">users / stays</text>
  <text x="805" y="234" text-anchor="middle" font-size="10" fill="#FBCFE8">/ otps</text>

  <!-- Resend -->
  <rect x="509" y="354" width="195" height="75" rx="14" fill="url(#gResend)" filter="url(#sh)"/>
  <text x="606" y="390" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">Resend API</text>
  <text x="606" y="410" text-anchor="middle" font-size="11" fill="#EDE9FE">OTP Email Delivery</text>

  <!-- Certbot -->
  <rect x="278" y="308" width="137" height="65" rx="12" fill="url(#gCertbot)" filter="url(#sh)"/>
  <text x="346" y="337" text-anchor="middle" font-size="13" font-weight="700" fill="#FFFFFF">Lets Encrypt</text>
  <text x="346" y="356" text-anchor="middle" font-size="10" fill="#CFFAFE">Auto-renew 90d</text>

  <!-- DNS -->
  <rect x="24" y="305" width="160" height="75" rx="14" fill="url(#gDns)" filter="url(#sh)"/>
  <text x="104" y="336" text-anchor="middle" font-size="13" font-weight="700" fill="#FFFFFF">Namecheap DNS</text>
  <text x="104" y="356" text-anchor="middle" font-size="10" fill="#FED7AA">A record 3.146.98.97</text>

  <!-- Arrows -->
  <line x1="184" y1="205" x2="260" y2="205" stroke="#3B82F6" stroke-width="2" marker-end="url(#arrowBlue)"/>
  <rect x="192" y="191" width="62" height="14" rx="3" fill="#1E3A5F99"/>
  <text x="223" y="202" text-anchor="middle" font-size="10" fill="#93C5FD">HTTPS :443</text>

  <line x1="429" y1="205" x2="505" y2="205" stroke="#10B981" stroke-width="2" marker-end="url(#arrowGreen)"/>
  <rect x="433" y="191" width="68" height="14" rx="3" fill="#064E3B99"/>
  <text x="467" y="202" text-anchor="middle" font-size="10" fill="#6EE7B7">proxy :3000</text>

  <line x1="704" y1="207" x2="750" y2="207" stroke="#F59E0B" stroke-width="2" marker-end="url(#arrowAmber)"/>
  <line x1="606" y1="305" x2="606" y2="350" stroke="#8B5CF6" stroke-width="2" marker-end="url(#arrowPurple)"/>
  <line x1="346" y1="308" x2="346" y2="262" stroke="#06B6D4" stroke-width="2" stroke-dasharray="5,4" marker-end="url(#arrowTeal)"/>
  <path d="M184,342 Q232,340 264,252" fill="none" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="6,4" marker-end="url(#arrowGray)"/>
  <path d="M509,390 Q340,455 104,255" fill="none" stroke="#8B5CF6" stroke-width="1.5" stroke-dasharray="6,4" marker-end="url(#arrowPurple)"/>
  <rect x="268" y="448" width="124" height="15" rx="3" fill="#2D1B6999"/>
  <text x="330" y="459" text-anchor="middle" font-size="10" fill="#C4B5FD">verification email</text>
</svg>`;

// ────────────────────────────────────────────────────────────────────────────
// 02.svg — Request Flow
// ────────────────────────────────────────────────────────────────────────────
const svg02 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 360" width="820" height="360" font-family="Segoe UI,system-ui,sans-serif">
  ${defs(
    [
      ['gInternet','#3B82F6','#1D4ED8'],
      ['gNginx','#10B981','#047857'],
      ['gPM2','#F59E0B','#B45309'],
      ['gDb','#EC4899','#9D174D'],
      ['gCertbot','#06B6D4','#0E7490'],
    ],
    [
      ['arrowBlue','#3B82F6'],
      ['arrowGreen','#10B981'],
      ['arrowAmber','#F59E0B'],
      ['arrowPink','#EC4899'],
      ['arrowTeal','#06B6D4'],
    ]
  )}
  ${bg(820, 360)}
  ${grid(820, 360, 40)}

  <text x="410" y="34" text-anchor="middle" font-size="20" font-weight="700" fill="#FFFFFF">Request Flow: Internet to Application</text>

  <!-- Step badges -->
  <circle cx="104" cy="76" r="14" fill="#3B82F6"/>
  <text x="104" y="81" text-anchor="middle" font-size="13" font-weight="700" fill="#FFFFFF">1</text>
  <circle cx="307" cy="76" r="14" fill="#10B981"/>
  <text x="307" y="81" text-anchor="middle" font-size="13" font-weight="700" fill="#FFFFFF">2</text>
  <circle cx="517" cy="76" r="14" fill="#F59E0B"/>
  <text x="517" y="81" text-anchor="middle" font-size="13" font-weight="700" fill="#FFFFFF">3</text>
  <circle cx="711" cy="76" r="14" fill="#EC4899"/>
  <text x="711" y="81" text-anchor="middle" font-size="13" font-weight="700" fill="#FFFFFF">4</text>

  <!-- Internet box -->
  <rect x="24" y="90" width="160" height="120" rx="14" fill="url(#gInternet)" filter="url(#sh)"/>
  <text x="104" y="126" text-anchor="middle" font-size="15" font-weight="700" fill="#FFFFFF">Internet</text>
  <text x="104" y="146" text-anchor="middle" font-size="11" fill="#BFDBFE">:80 / :443</text>
  <text x="104" y="163" text-anchor="middle" font-size="11" fill="#BFDBFE">HTTP or HTTPS</text>

  <!-- Nginx box -->
  <rect x="220" y="90" width="175" height="120" rx="14" fill="url(#gNginx)" filter="url(#sh)"/>
  <text x="307" y="116" text-anchor="middle" font-size="15" font-weight="700" fill="#FFFFFF">Nginx</text>
  <rect x="230" y="122" width="155" height="22" rx="5" fill="#00000025"/>
  <text x="307" y="137" text-anchor="middle" font-size="10" fill="#FFFFFF">1  Terminate TLS</text>
  <rect x="230" y="148" width="155" height="22" rx="5" fill="#00000025"/>
  <text x="307" y="163" text-anchor="middle" font-size="10" fill="#FFFFFF">2  HTTP to HTTPS redirect</text>
  <rect x="230" y="174" width="155" height="22" rx="5" fill="#00000025"/>
  <text x="307" y="189" text-anchor="middle" font-size="10" fill="#FFFFFF">3  Proxy to localhost:3000</text>

  <!-- PM2 + Next.js box -->
  <rect x="430" y="90" width="175" height="120" rx="14" fill="url(#gPM2)" filter="url(#sh)"/>
  <text x="517" y="116" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">PM2 + Next.js</text>
  <rect x="440" y="122" width="155" height="22" rx="5" fill="#00000025"/>
  <text x="517" y="137" text-anchor="middle" font-size="10" fill="#FFFFFF">node server.js :3000</text>
  <rect x="440" y="148" width="155" height="22" rx="5" fill="#00000025"/>
  <text x="517" y="163" text-anchor="middle" font-size="10" fill="#FFFFFF">Auto-restart on crash</text>
  <rect x="440" y="174" width="155" height="22" rx="5" fill="#00000025"/>
  <text x="517" y="189" text-anchor="middle" font-size="10" fill="#FFFFFF">Starts on server boot</text>

  <!-- db.json box -->
  <rect x="630" y="90" width="162" height="120" rx="14" fill="url(#gDb)" filter="url(#sh)"/>
  <text x="711" y="128" text-anchor="middle" font-size="15" font-weight="700" fill="#FFFFFF">db.json</text>
  <text x="711" y="150" text-anchor="middle" font-size="11" fill="#FBCFE8">Persistent disk</text>
  <text x="711" y="170" text-anchor="middle" font-size="11" fill="#FBCFE8">users / stays / otps</text>

  <!-- Certbot box -->
  <rect x="230" y="240" width="155" height="70" rx="12" fill="url(#gCertbot)" filter="url(#sh)"/>
  <text x="307" y="268" text-anchor="middle" font-size="13" font-weight="700" fill="#FFFFFF">Certbot</text>
  <text x="307" y="286" text-anchor="middle" font-size="10" fill="#CFFAFE">TLS certificate</text>
  <text x="307" y="302" text-anchor="middle" font-size="10" fill="#CFFAFE">Systemd auto-renewal</text>

  <!-- Dashed line Certbot to Nginx -->
  <line x1="307" y1="240" x2="307" y2="212" stroke="#06B6D4" stroke-width="2" stroke-dasharray="5,4" marker-end="url(#arrowTeal)"/>

  <!-- Horizontal arrows -->
  <line x1="184" y1="150" x2="216" y2="150" stroke="#3B82F6" stroke-width="2" marker-end="url(#arrowBlue)"/>
  <line x1="395" y1="150" x2="426" y2="150" stroke="#10B981" stroke-width="2" marker-end="url(#arrowGreen)"/>
  <line x1="605" y1="150" x2="626" y2="150" stroke="#F59E0B" stroke-width="2" marker-end="url(#arrowAmber)"/>
</svg>`;

// ────────────────────────────────────────────────────────────────────────────
// 03.svg — OTP Auth Sequence
// ────────────────────────────────────────────────────────────────────────────
const svg03 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 500" width="780" height="500" font-family="Segoe UI,system-ui,sans-serif">
  ${defs(
    [
      ['gBrowser','#3B82F6','#1D4ED8'],
      ['gApi','#F59E0B','#B45309'],
      ['gResend','#8B5CF6','#5B21B6'],
      ['gSuccess','#10B981','#047857'],
    ],
    [
      ['arrowBlue','#3B82F6'],
      ['arrowAmber','#F59E0B'],
      ['arrowPurple','#8B5CF6'],
      ['arrowGray','#94A3B8'],
      ['arrowGreen','#10B981'],
    ]
  )}
  ${bg(780, 500)}
  ${grid(780, 500, 50)}

  <text x="390" y="34" text-anchor="middle" font-size="20" font-weight="700" fill="#FFFFFF">OTP Authentication Flow</text>

  <!-- Actor boxes -->
  <rect x="60" y="55" width="130" height="50" rx="12" fill="url(#gBrowser)" filter="url(#sh)"/>
  <text x="125" y="85" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">Browser</text>

  <rect x="325" y="55" width="130" height="50" rx="12" fill="url(#gApi)" filter="url(#sh)"/>
  <text x="390" y="80" text-anchor="middle" font-size="13" font-weight="700" fill="#FFFFFF">Next.js API</text>

  <rect x="590" y="55" width="130" height="50" rx="12" fill="url(#gResend)" filter="url(#sh)"/>
  <text x="655" y="85" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">Resend</text>

  <!-- Lifelines -->
  <line x1="125" y1="105" x2="125" y2="450" stroke="#3B82F6" stroke-width="1" stroke-dasharray="6,4" opacity="0.5"/>
  <line x1="390" y1="105" x2="390" y2="450" stroke="#F59E0B" stroke-width="1" stroke-dasharray="6,4" opacity="0.5"/>
  <line x1="655" y1="105" x2="655" y2="450" stroke="#8B5CF6" stroke-width="1" stroke-dasharray="6,4" opacity="0.5"/>

  <!-- Step number circles -->
  <circle cx="30" cy="148" r="12" fill="#3B82F6" opacity="0.9"/>
  <text x="30" y="153" text-anchor="middle" font-size="11" font-weight="700" fill="#FFFFFF">1</text>
  <circle cx="30" cy="196" r="12" fill="#F59E0B" opacity="0.9"/>
  <text x="30" y="201" text-anchor="middle" font-size="11" font-weight="700" fill="#FFFFFF">2</text>
  <circle cx="30" cy="244" r="12" fill="#8B5CF6" opacity="0.9"/>
  <text x="30" y="249" text-anchor="middle" font-size="11" font-weight="700" fill="#FFFFFF">3</text>
  <circle cx="30" cy="292" r="12" fill="#94A3B8" opacity="0.9"/>
  <text x="30" y="297" text-anchor="middle" font-size="11" font-weight="700" fill="#FFFFFF">4</text>
  <circle cx="30" cy="340" r="12" fill="#3B82F6" opacity="0.9"/>
  <text x="30" y="345" text-anchor="middle" font-size="11" font-weight="700" fill="#FFFFFF">5</text>
  <circle cx="30" cy="388" r="12" fill="#F59E0B" opacity="0.9"/>
  <text x="30" y="393" text-anchor="middle" font-size="11" font-weight="700" fill="#FFFFFF">6</text>
  <circle cx="30" cy="436" r="12" fill="#10B981" opacity="0.9"/>
  <text x="30" y="441" text-anchor="middle" font-size="11" font-weight="700" fill="#FFFFFF">7</text>

  <!-- Step 1: Browser to API -->
  <line x1="125" y1="148" x2="382" y2="148" stroke="#3B82F6" stroke-width="2" marker-end="url(#arrowBlue)"/>
  <rect x="140" y="134" width="222" height="16" rx="4" fill="#1E3A5F99"/>
  <text x="251" y="146" text-anchor="middle" font-size="11" fill="#93C5FD">POST /api/auth/send-otp</text>

  <!-- Step 2: API activation rects -->
  <rect x="383" y="163" width="14" height="50" rx="3" fill="#F59E0B" opacity="0.8"/>
  <rect x="398" y="163" width="90" height="22" rx="4" fill="#92400E"/>
  <text x="443" y="178" text-anchor="middle" font-size="10" fill="#FDE68A">generateOtp()</text>
  <rect x="398" y="190" width="90" height="22" rx="4" fill="#92400E"/>
  <text x="443" y="205" text-anchor="middle" font-size="10" fill="#FDE68A">saveOtp() to DB</text>

  <!-- Step 3: API to Resend -->
  <line x1="390" y1="244" x2="647" y2="244" stroke="#8B5CF6" stroke-width="2" marker-end="url(#arrowPurple)"/>
  <rect x="430" y="230" width="170" height="16" rx="4" fill="#2D1B6999"/>
  <text x="515" y="242" text-anchor="middle" font-size="11" fill="#C4B5FD">sendOtpEmail()</text>

  <!-- Step 4: API back to Browser (dashed) -->
  <line x1="382" y1="292" x2="133" y2="292" stroke="#94A3B8" stroke-width="2" stroke-dasharray="5,4" marker-end="url(#arrowGray)"/>
  <rect x="148" y="278" width="220" height="16" rx="4" fill="#1E293B99"/>
  <text x="258" y="290" text-anchor="middle" font-size="11" fill="#CBD5E1">sent:true / show code input</text>

  <!-- Step 5: Browser to API -->
  <line x1="125" y1="340" x2="382" y2="340" stroke="#3B82F6" stroke-width="2" marker-end="url(#arrowBlue)"/>
  <rect x="140" y="326" width="228" height="16" rx="4" fill="#1E3A5F99"/>
  <text x="254" y="338" text-anchor="middle" font-size="11" fill="#93C5FD">POST /api/auth/verify-otp</text>

  <!-- Step 6: API activation rects -->
  <rect x="383" y="355" width="14" height="50" rx="3" fill="#F59E0B" opacity="0.8"/>
  <rect x="398" y="355" width="108" height="22" rx="4" fill="#92400E"/>
  <text x="452" y="370" text-anchor="middle" font-size="10" fill="#FDE68A">verify + consume</text>
  <rect x="398" y="382" width="108" height="22" rx="4" fill="#92400E"/>
  <text x="452" y="397" text-anchor="middle" font-size="10" fill="#FDE68A">upsertUser(email)</text>

  <!-- Step 7: API to Browser (green) -->
  <line x1="382" y1="436" x2="133" y2="436" stroke="#10B981" stroke-width="2" marker-end="url(#arrowGreen)"/>
  <rect x="140" y="420" width="230" height="16" rx="4" fill="#064E3B99"/>
  <text x="255" y="432" text-anchor="middle" font-size="11" fill="#6EE7B7">httpOnly JWT cookie / logged in</text>

  <!-- Success badge -->
  <rect x="68" y="460" width="114" height="26" rx="10" fill="url(#gSuccess)" filter="url(#sh)"/>
  <text x="125" y="477" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">Authenticated</text>
</svg>`;

// ────────────────────────────────────────────────────────────────────────────
// 04.svg — i18n Architecture
// ────────────────────────────────────────────────────────────────────────────
const svg04 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 480" width="780" height="480" font-family="Segoe UI,system-ui,sans-serif">
  ${defs(
    [
      ['gContext','#8B5CF6','#5B21B6'],
      ['gHook','#06B6D4','#0E7490'],
      ['gComp','#F59E0B','#B45309'],
      ['gLangs','#10B981','#047857'],
    ],
    [
      ['arrowPurple','#8B5CF6'],
      ['arrowTeal','#06B6D4'],
      ['arrowAmber','#F59E0B'],
    ]
  )}
  ${bg(780, 480)}
  ${grid(780, 480, 48)}

  <text x="390" y="34" text-anchor="middle" font-size="20" font-weight="700" fill="#FFFFFF">i18n Architecture - 23 Languages</text>

  <!-- LanguageContext -->
  <rect x="270" y="55" width="240" height="80" rx="14" fill="url(#gContext)" filter="url(#sh)"/>
  <text x="390" y="86" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">LanguageContext</text>
  <text x="390" y="104" text-anchor="middle" font-size="11" fill="#EDE9FE">t, lang, setLang</text>
  <text x="390" y="120" text-anchor="middle" font-size="10" fill="#DDD6FE">sets data-dir on html element</text>

  <!-- Arrow context to hook -->
  <line x1="390" y1="135" x2="390" y2="175" stroke="#8B5CF6" stroke-width="2" marker-end="url(#arrowPurple)"/>

  <!-- useLanguage hook -->
  <rect x="295" y="175" width="190" height="45" rx="10" fill="url(#gHook)" filter="url(#sh)"/>
  <text x="390" y="197" text-anchor="middle" font-size="13" font-weight="700" fill="#FFFFFF">useLanguage() hook</text>
  <text x="390" y="212" text-anchor="middle" font-size="10" fill="#CFFAFE">consumed by every component</text>

  <!-- Arrows hook to components -->
  <line x1="295" y1="197" x2="110" y2="278" stroke="#06B6D4" stroke-width="1.5" marker-end="url(#arrowTeal)"/>
  <line x1="340" y1="220" x2="270" y2="278" stroke="#06B6D4" stroke-width="1.5" marker-end="url(#arrowTeal)"/>
  <line x1="440" y1="220" x2="510" y2="278" stroke="#06B6D4" stroke-width="1.5" marker-end="url(#arrowTeal)"/>
  <line x1="485" y1="197" x2="670" y2="278" stroke="#06B6D4" stroke-width="1.5" marker-end="url(#arrowTeal)"/>

  <!-- Component boxes -->
  <rect x="40" y="278" width="140" height="60" rx="12" fill="url(#gComp)" filter="url(#sh)"/>
  <text x="110" y="303" text-anchor="middle" font-size="13" font-weight="700" fill="#FFFFFF">Navbar</text>
  <text x="110" y="320" text-anchor="middle" font-size="10" fill="#FEF3C7">t.appName t.tagline</text>

  <rect x="200" y="278" width="155" height="60" rx="12" fill="url(#gComp)" filter="url(#sh)"/>
  <text x="277" y="303" text-anchor="middle" font-size="13" font-weight="700" fill="#FFFFFF">CountdownCard</text>
  <text x="277" y="320" text-anchor="middle" font-size="10" fill="#FEF3C7">t.daysNeeded</text>

  <rect x="375" y="278" width="155" height="60" rx="12" fill="url(#gComp)" filter="url(#sh)"/>
  <text x="452" y="303" text-anchor="middle" font-size="13" font-weight="700" fill="#FFFFFF">StatsCards</text>
  <text x="452" y="320" text-anchor="middle" font-size="10" fill="#FEF3C7">t.eligibleDaysOf</text>

  <rect x="550" y="278" width="155" height="60" rx="12" fill="url(#gComp)" filter="url(#sh)"/>
  <text x="627" y="303" text-anchor="middle" font-size="13" font-weight="700" fill="#FFFFFF">ManageStays</text>
  <text x="627" y="320" text-anchor="middle" font-size="10" fill="#FEF3C7">t.backToDashboard</text>

  <!-- Bottom left: 23 Languages -->
  <rect x="30" y="378" width="200" height="80" rx="14" fill="url(#gLangs)" filter="url(#sh)"/>
  <text x="130" y="402" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">23 Languages</text>
  <text x="130" y="420" text-anchor="middle" font-size="10" fill="#A7F3D0">en fr fa ar zh hi pa ur ko</text>
  <text x="130" y="436" text-anchor="middle" font-size="10" fill="#A7F3D0">+14 more</text>
  <text x="130" y="452" text-anchor="middle" font-size="10" fill="#D1FAE5">language files in /locales</text>

  <!-- Bottom right: RTL Support -->
  <rect x="490" y="378" width="260" height="80" rx="14" fill="#0F172A" stroke="#8B5CF6" stroke-width="1.5"/>
  <text x="620" y="402" text-anchor="middle" font-size="14" font-weight="700" fill="#C4B5FD">RTL Support</text>
  <text x="620" y="420" text-anchor="middle" font-size="10" fill="#EDE9FE">Arabic, Farsi, Urdu / data-dir=rtl</text>
  <text x="620" y="436" text-anchor="middle" font-size="10" fill="#DDD6FE">CSS targets text only</text>
  <text x="620" y="452" text-anchor="middle" font-size="10" fill="#DDD6FE">layout direction unchanged</text>
</svg>`;

// ────────────────────────────────────────────────────────────────────────────
// 05.svg — Data Storage
// ────────────────────────────────────────────────────────────────────────────
const svg05 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 400" width="820" height="400" font-family="Segoe UI,system-ui,sans-serif">
  ${defs(
    [
      ['gOrange','#F97316','#C2410C'],
      ['gPink','#EC4899','#9D174D'],
      ['gBlue','#3B82F6','#1D4ED8'],
      ['gPurple','#8B5CF6','#5B21B6'],
      ['gGreen','#10B981','#047857'],
    ],
    [
      ['arrowGreen','#10B981'],
      ['arrowGreenL','#10B981'],
    ]
  )}
  ${bg(820, 400)}
  ${grid(820, 400, 40)}

  <text x="410" y="34" text-anchor="middle" font-size="20" font-weight="700" fill="#FFFFFF">Data Storage - Local-First with Cloud Sync</text>

  <!-- Left panel: Anonymous User -->
  <rect x="20" y="55" width="340" height="320" rx="16" fill="#F97316" fill-opacity="0.06" stroke="#F97316" stroke-width="1.5"/>
  <text x="190" y="84" text-anchor="middle" font-size="14" font-weight="700" fill="#FB923C">Anonymous User</text>

  <!-- localStorage box -->
  <rect x="40" y="96" width="300" height="80" rx="12" fill="url(#gOrange)" filter="url(#sh)"/>
  <text x="190" y="126" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">localStorage</text>
  <text x="190" y="144" text-anchor="middle" font-size="11" fill="#FED7AA">Stays stored in browser only</text>
  <text x="190" y="160" text-anchor="middle" font-size="11" fill="#FED7AA">Lost if cache cleared</text>

  <!-- Info boxes -->
  <rect x="40" y="192" width="300" height="40" rx="10" fill="#F97316" fill-opacity="0.15" stroke="#F97316" stroke-opacity="0.3" stroke-width="1"/>
  <text x="190" y="217" text-anchor="middle" font-size="12" fill="#FED7AA">Full functionality / No account required</text>

  <rect x="40" y="245" width="300" height="40" rx="10" fill="#F97316" fill-opacity="0.15" stroke="#F97316" stroke-opacity="0.3" stroke-width="1"/>
  <text x="190" y="270" text-anchor="middle" font-size="12" fill="#FED7AA">Calculations run entirely client-side</text>

  <!-- Right panel: Authenticated User -->
  <rect x="460" y="55" width="340" height="320" rx="16" fill="#10B981" fill-opacity="0.06" stroke="#10B981" stroke-width="1.5"/>
  <text x="630" y="84" text-anchor="middle" font-size="14" font-weight="700" fill="#34D399">Authenticated User</text>

  <!-- db.json box -->
  <rect x="480" y="96" width="300" height="70" rx="12" fill="url(#gPink)" filter="url(#sh)"/>
  <text x="630" y="122" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">db.json on server</text>
  <text x="630" y="140" text-anchor="middle" font-size="11" fill="#FBCFE8">Persistent across devices</text>
  <text x="630" y="156" text-anchor="middle" font-size="11" fill="#FBCFE8">users / stays / otps tables</text>

  <!-- JWT box -->
  <rect x="480" y="180" width="300" height="55" rx="12" fill="url(#gBlue)" filter="url(#sh)"/>
  <text x="630" y="203" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">JWT Session Cookie</text>
  <text x="630" y="221" text-anchor="middle" font-size="11" fill="#BFDBFE">httpOnly / secure / 90 days</text>

  <!-- API box -->
  <rect x="480" y="250" width="300" height="65" rx="12" fill="url(#gPurple)" filter="url(#sh)"/>
  <text x="630" y="274" text-anchor="middle" font-size="13" font-weight="700" fill="#FFFFFF">GET POST DELETE PATCH</text>
  <text x="630" y="293" text-anchor="middle" font-size="11" fill="#EDE9FE">/api/trips</text>
  <text x="630" y="309" text-anchor="middle" font-size="11" fill="#EDE9FE">/api/trips/:id</text>

  <!-- Migration arrow -->
  <rect x="346" y="175" width="128" height="50" rx="10" fill="url(#gGreen)" filter="url(#sh)"/>
  <text x="410" y="198" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">Sign in</text>
  <text x="410" y="215" text-anchor="middle" font-size="11" fill="#D1FAE5">+ migrate</text>
  <line x1="360" y1="200" x2="344" y2="200" stroke="#10B981" stroke-width="2"/>
  <line x1="476" y1="200" x2="462" y2="200" stroke="#10B981" stroke-width="2" marker-end="url(#arrowGreen)"/>
</svg>`;

fs.writeFileSync(dir + '01.svg', svg01, 'utf8');
fs.writeFileSync(dir + '02.svg', svg02, 'utf8');
fs.writeFileSync(dir + '03.svg', svg03, 'utf8');
fs.writeFileSync(dir + '04.svg', svg04, 'utf8');
fs.writeFileSync(dir + '05.svg', svg05, 'utf8');

['01','02','03','04','05'].forEach(n => {
  const p = dir + n + '.svg';
  console.log(n + '.svg written:', fs.statSync(p).size, 'bytes');
});
