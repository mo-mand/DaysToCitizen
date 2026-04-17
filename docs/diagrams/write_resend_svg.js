const fs = require('fs');
const dir = 'C:/Users/Mostafa/DaysToCitizen/docs/diagrams/';

// ─── shared defs builder (same pattern as write_svgs.js) ────────────────────
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

function bg(w, h)  { return `<rect width="${w}" height="${h}" fill="url(#bg)"/>`; }

function grid(w, h, step) {
  let lines = '';
  for (let y = step; y < h; y += step) lines += `<line x1="0" y1="${y}" x2="${w}" y2="${y}"/>`;
  for (let x = step; x < w; x += step) lines += `<line x1="${x}" y1="0" x2="${x}" y2="${h}"/>`;
  return `<g opacity="0.05" stroke="#ffffff" stroke-width="1">${lines}</g>`;
}

// ────────────────────────────────────────────────────────────────────────────
// Resend Integration Architecture Diagram
// Layout: User → [EC2: Nginx → Next.js] → [Resend: API → SMTP] ⤵ back to User
//         DNS records box connected (dashed) to Resend boundary
// ────────────────────────────────────────────────────────────────────────────
const svgResend = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 450" width="880" height="450" font-family="Segoe UI,system-ui,sans-serif">
  ${defs(
    [
      ['gUser',    '#3B82F6','#1D4ED8'],
      ['gNginx',   '#10B981','#047857'],
      ['gNextjs',  '#F59E0B','#B45309'],
      ['gResApi',  '#8B5CF6','#5B21B6'],
      ['gSmtp',    '#6366F1','#4338CA'],
      ['gDns',     '#F97316','#C2410C'],
    ],
    [
      ['arrowBlue',   '#3B82F6'],
      ['arrowGreen',  '#10B981'],
      ['arrowPurple', '#8B5CF6'],
      ['arrowOrange', '#F97316'],
      ['arrowGray',   '#94A3B8'],
    ]
  )}
  ${bg(880, 450)}
  ${grid(880, 450, 50)}

  <!-- Title -->
  <text x="440" y="34" text-anchor="middle" font-size="20" font-weight="700" fill="#FFFFFF">Resend Email Integration — DaysToCitizen</text>

  <!-- ── EC2 boundary ─────────────────────────────────────────── -->
  <rect x="158" y="47" width="345" height="311" rx="16" fill="#ffffff05" stroke="#10B981" stroke-width="1.5" stroke-dasharray="10,6"/>
  <rect x="362" y="51" width="140" height="22" rx="6" fill="#10B981" opacity="0.2"/>
  <text x="432" y="67" text-anchor="middle" font-size="11" font-weight="600" fill="#6EE7B7">AWS EC2 · Canada Central</text>

  <!-- ── Resend boundary ──────────────────────────────────────── -->
  <rect x="508" y="60" width="262" height="288" rx="16" fill="#ffffff05" stroke="#8B5CF6" stroke-width="1.5" stroke-dasharray="10,6"/>
  <rect x="588" y="40" width="120" height="22" rx="6" fill="#8B5CF6" opacity="0.2"/>
  <text x="648" y="55" text-anchor="middle" font-size="11" font-weight="600" fill="#C4B5FD">Resend (resend.com)</text>

  <!-- ── User / Browser ───────────────────────────────────────── -->
  <rect x="18" y="155" width="115" height="80" rx="14" fill="url(#gUser)" filter="url(#sh)"/>
  <text x="75" y="190" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">Browser</text>
  <text x="75" y="208" text-anchor="middle" font-size="11" fill="#BFDBFE">User</text>

  <!-- ── Nginx ────────────────────────────────────────────────── -->
  <rect x="176" y="153" width="128" height="84" rx="14" fill="url(#gNginx)" filter="url(#sh)"/>
  <text x="240" y="187" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">Nginx</text>
  <rect x="184" y="197" width="112" height="20" rx="5" fill="#00000030"/>
  <text x="240" y="211" text-anchor="middle" font-size="10" fill="#A7F3D0">TLS + Reverse Proxy</text>

  <!-- ── Next.js API ──────────────────────────────────────────── -->
  <rect x="336" y="118" width="148" height="154" rx="14" fill="url(#gNextjs)" filter="url(#sh)"/>
  <rect x="338" y="120" width="42" height="19" rx="4" fill="#92400E"/>
  <text x="359" y="133" text-anchor="middle" font-size="10" font-weight="700" fill="#FDE68A">PM2</text>
  <text x="410" y="152" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">Next.js 15</text>
  <rect x="346" y="161" width="130" height="22" rx="5" fill="#00000025"/>
  <text x="411" y="176" text-anchor="middle" font-size="10" fill="#FEF3C7">POST /api/auth/send-otp</text>
  <rect x="346" y="188" width="130" height="22" rx="5" fill="#00000025"/>
  <text x="411" y="203" text-anchor="middle" font-size="10" fill="#FEF3C7">generateOtp()</text>
  <rect x="346" y="215" width="130" height="22" rx="5" fill="#00000025"/>
  <text x="411" y="230" text-anchor="middle" font-size="10" fill="#FEF3C7">sendOtpEmail()</text>

  <!-- ── Resend API box ───────────────────────────────────────── -->
  <rect x="522" y="153" width="235" height="84" rx="14" fill="url(#gResApi)" filter="url(#sh)"/>
  <text x="639" y="188" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">Resend API</text>
  <rect x="532" y="198" width="215" height="20" rx="5" fill="#00000025"/>
  <text x="639" y="212" text-anchor="middle" font-size="10" fill="#EDE9FE">api.resend.com/emails</text>

  <!-- ── SMTP / Delivery Engine ───────────────────────────────── -->
  <rect x="522" y="252" width="235" height="80" rx="14" fill="url(#gSmtp)" filter="url(#sh)"/>
  <text x="639" y="285" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">SMTP Relay</text>
  <rect x="532" y="295" width="215" height="20" rx="5" fill="#00000025"/>
  <text x="639" y="309" text-anchor="middle" font-size="10" fill="#C7D2FE">Deliverability + Reputation Mgmt</text>

  <!-- ── DNS Records ──────────────────────────────────────────── -->
  <rect x="540" y="360" width="315" height="68" rx="14" fill="url(#gDns)" filter="url(#sh)"/>
  <text x="697" y="386" text-anchor="middle" font-size="13" font-weight="700" fill="#FFFFFF">verification.daystocitizen.ca</text>
  <text x="697" y="406" text-anchor="middle" font-size="11" fill="#FED7AA">SPF · DKIM · DMARC  (DNS TXT records)</text>

  <!-- ══ ARROWS ══════════════════════════════════════════════════ -->

  <!-- 1. User → Nginx (HTTPS request) -->
  <line x1="133" y1="195" x2="172" y2="195" stroke="#3B82F6" stroke-width="2" marker-end="url(#arrowBlue)"/>
  <rect x="134" y="171" width="36" height="14" rx="3" fill="#1E3A5F99"/>
  <text x="152" y="182" text-anchor="middle" font-size="9" fill="#93C5FD">HTTPS</text>

  <!-- 2. Nginx → Next.js (proxy) -->
  <line x1="304" y1="195" x2="332" y2="195" stroke="#10B981" stroke-width="2" marker-end="url(#arrowGreen)"/>
  <rect x="305" y="171" width="25" height="14" rx="3" fill="#064E3B99"/>
  <text x="317" y="182" text-anchor="middle" font-size="9" fill="#6EE7B7">:3000</text>

  <!-- 3. Next.js → Resend API (SDK call) -->
  <line x1="484" y1="195" x2="518" y2="195" stroke="#8B5CF6" stroke-width="2" marker-end="url(#arrowPurple)"/>
  <rect x="485" y="170" width="30" height="14" rx="3" fill="#2D1B6999"/>
  <text x="500" y="181" text-anchor="middle" font-size="9" fill="#C4B5FD">SDK</text>

  <!-- 4. Resend API → SMTP (internal relay) -->
  <line x1="639" y1="237" x2="639" y2="248" stroke="#8B5CF6" stroke-width="2" marker-end="url(#arrowPurple)"/>

  <!-- 5. SMTP → User inbox (email delivered, curves back under everything) -->
  <path d="M 522,292 C 350,400 200,400 133,240" fill="none" stroke="#94A3B8" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arrowGray)"/>
  <rect x="268" y="393" width="100" height="14" rx="3" fill="#1E293B99"/>
  <text x="318" y="404" text-anchor="middle" font-size="10" fill="#E2E8F0">OTP email delivered</text>

  <!-- 6. DNS → Resend (domain verification, curves up right side, dashed) -->
  <path d="M 840,360 Q 800,200 760,200" fill="none" stroke="#F97316" stroke-width="1.5" stroke-dasharray="5,4" marker-end="url(#arrowOrange)"/>
  <rect x="797" y="271" width="55" height="28" rx="3" fill="#431407bb"/>
  <text x="824" y="282" text-anchor="middle" font-size="9" fill="#FED7AA">domain</text>
  <text x="824" y="294" text-anchor="middle" font-size="9" fill="#FED7AA">verified</text>

  <!-- ── Legend ────────────────────────────────────────────────── -->
  <rect x="18" y="368" width="505" height="60" rx="10" fill="#00000030"/>
  <text x="30" y="386" font-size="11" font-weight="700" fill="#94A3B8">Flow:</text>
  <circle cx="78" cy="382" r="5" fill="#3B82F6"/>
  <text x="90" y="386" font-size="10" fill="#CBD5E1">User request</text>
  <circle cx="170" cy="382" r="5" fill="#10B981"/>
  <text x="182" y="386" font-size="10" fill="#CBD5E1">Nginx proxy</text>
  <circle cx="258" cy="382" r="5" fill="#8B5CF6"/>
  <text x="270" y="386" font-size="10" fill="#CBD5E1">SDK call</text>
  <circle cx="328" cy="382" r="5" fill="#94A3B8"/>
  <text x="340" y="386" font-size="10" fill="#CBD5E1">Email delivery</text>
  <line x1="70" y1="410" x2="86" y2="410" stroke="#F97316" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="30" y="414" font-size="11" font-weight="700" fill="#94A3B8">Config:</text>
  <text x="90" y="414" font-size="10" fill="#CBD5E1">DNS verification (one-time setup, not a runtime call)</text>
</svg>`;

fs.writeFileSync(dir + 'resend-architecture.svg', svgResend, 'utf8');
console.log('resend-architecture.svg written:', fs.statSync(dir + 'resend-architecture.svg').size, 'bytes');
