import fs from 'fs';

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// 1. GENERATE SITEMAP SVG
function generateSitemapSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1100" viewBox="0 0 1600 1100" style="background:#F2F0E8; font-family:'Mona Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#111310" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- Header -->
  <text x="80" y="70" font-size="24" font-weight="800" fill="#111310" letter-spacing="-0.5">PRACTICE ATHLETIC CLUB • MASTER SITEMAP (IA)</text>
  <text x="80" y="98" font-size="13" fill="#5C6159">FitOps Phase 3 • Information Architecture &amp; Screen Navigation Hierarchy</text>

  <!-- Root Domain Node -->
  <g transform="translate(620, 140)" filter="url(#shadow)">
    <rect width="360" height="70" rx="8" fill="#111310" stroke="#C7F134" stroke-width="2"/>
    <text x="180" y="30" font-size="10" font-weight="700" fill="#C7F134" letter-spacing="1" text-anchor="middle">ROOT APPLICATION DOMAIN</text>
    <text x="180" y="52" font-size="14" font-weight="700" fill="#F2F0E8" text-anchor="middle">fitops.app / (Public &amp; Auth Space)</text>
  </g>

  <!-- Connectors from Root to 4 Branches -->
  <path d="M 800 210 L 800 270 M 240 270 L 1360 270 M 240 270 L 240 320 M 610 270 L 610 320 M 990 270 L 990 320 M 1360 270 L 1360 320" fill="none" stroke="#6B7068" stroke-width="2" stroke-linecap="round"/>

  <!-- Column 1: Public Experience -->
  <g transform="translate(80, 320)">
    <!-- Branch Header -->
    <rect width="320" height="50" rx="6" fill="#111310"/>
    <text x="16" y="24" font-size="9" font-weight="700" fill="#C7F134" letter-spacing="1">01. GUEST / VISITOR</text>
    <text x="16" y="40" font-size="13" font-weight="700" fill="#F2F0E8">Public Experience</text>

    <!-- Node 1: Home -->
    <g transform="translate(0, 70)" filter="url(#shadow)">
      <rect width="320" height="85" rx="8" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>
      <text x="16" y="24" font-size="9" font-weight="700" fill="#6B7068">PATH: /</text>
      <text x="16" y="44" font-size="13" font-weight="700" fill="#111310">🏠 Home (Landing Page)</text>
      <text x="16" y="62" font-size="11" fill="#5C6159">Hero value prop, program guide, schedule preview</text>
    </g>

    <!-- Node 2: Programs -->
    <g transform="translate(0, 175)" filter="url(#shadow)">
      <rect width="320" height="85" rx="8" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>
      <text x="16" y="24" font-size="9" font-weight="700" fill="#6B7068">PATH: /programs</text>
      <text x="16" y="44" font-size="13" font-weight="700" fill="#111310">📋 Programs Taxonomy</text>
      <text x="16" y="62" font-size="11" fill="#5C6159">Strength, Pace, Reset, Open Floor details</text>
    </g>

    <!-- Node 3: Schedule -->
    <g transform="translate(0, 280)" filter="url(#shadow)">
      <rect width="320" height="85" rx="8" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>
      <text x="16" y="24" font-size="9" font-weight="700" fill="#6B7068">PATH: /schedule</text>
      <text x="16" y="44" font-size="13" font-weight="700" fill="#111310">📅 Public Schedule Preview</text>
      <text x="16" y="62" font-size="11" fill="#5C6159">7-day rolling view, filter chips &amp; taxonomy legend</text>
    </g>

    <!-- Node 4: Trainers -->
    <g transform="translate(0, 385)" filter="url(#shadow)">
      <rect width="320" height="85" rx="8" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>
      <text x="16" y="24" font-size="9" font-weight="700" fill="#6B7068">PATH: /trainers</text>
      <text x="16" y="44" font-size="13" font-weight="700" fill="#111310">🏋️ Trainers Directory</text>
      <text x="16" y="62" font-size="11" fill="#5C6159">Coach profiles, certifications &amp; specialties</text>
    </g>
  </g>

  <!-- Column 2: Global Overlays -->
  <g transform="translate(450, 320)">
    <rect width="320" height="50" rx="6" fill="#8B5CF6"/>
    <text x="16" y="24" font-size="9" font-weight="700" fill="#FFFFFF" letter-spacing="1">02. MODALS &amp; DRAWERS</text>
    <text x="16" y="40" font-size="13" font-weight="700" fill="#FFFFFF">Global Overlays</text>

    <!-- Session Drawer -->
    <g transform="translate(0, 70)" filter="url(#shadow)">
      <rect width="320" height="95" rx="8" fill="#FFFFFF" stroke="#8B5CF6" stroke-width="1.5"/>
      <text x="16" y="24" font-size="9" font-weight="700" fill="#8B5CF6">DRAWER / OVERLAY</text>
      <text x="16" y="44" font-size="13" font-weight="700" fill="#111310">📄 Session Details Drawer</text>
      <text x="16" y="62" font-size="11" fill="#5C6159">Class focus, room, trainer bio, 2h cutoff rule</text>
      <text x="16" y="78" font-size="10" font-weight="600" fill="#111310">Dynamic CTA: [Book] vs [Join Waitlist]</text>
    </g>

    <!-- Demo Auth Modal -->
    <g transform="translate(0, 185)" filter="url(#shadow)">
      <rect width="320" height="95" rx="8" fill="#FFFFFF" stroke="#8B5CF6" stroke-width="1.5"/>
      <text x="16" y="24" font-size="9" font-weight="700" fill="#8B5CF6">MODAL / OVERLAY</text>
      <text x="16" y="44" font-size="13" font-weight="700" fill="#111310">🔑 Demo Auth &amp; Role Switcher</text>
      <text x="16" y="62" font-size="11" fill="#5C6159">1-click profile: Alex (Member) / Morgan (Admin)</text>
      <text x="16" y="78" font-size="10" font-weight="600" fill="#059669">⚡ Preserves selected session context</text>
    </g>

    <!-- Cancellation Dialog -->
    <g transform="translate(0, 300)" filter="url(#shadow)">
      <rect width="320" height="85" rx="8" fill="#FFFFFF" stroke="#8B5CF6" stroke-width="1.5"/>
      <text x="16" y="24" font-size="9" font-weight="700" fill="#8B5CF6">MODAL / OVERLAY</text>
      <text x="16" y="44" font-size="13" font-weight="700" fill="#111310">⚠️ Cancellation Confirmation</text>
      <text x="16" y="62" font-size="11" fill="#5C6159">Cutoff verification &amp; waitlist transfer notice</text>
    </g>
  </g>

  <!-- Column 3: Member Experience -->
  <g transform="translate(830, 320)">
    <rect width="320" height="50" rx="6" fill="#059669"/>
    <text x="16" y="24" font-size="9" font-weight="700" fill="#FFFFFF" letter-spacing="1">03. AUTHENTICATED MEMBER</text>
    <text x="16" y="40" font-size="13" font-weight="700" fill="#FFFFFF">Member Experience</text>

    <!-- Member Schedule -->
    <g transform="translate(0, 70)" filter="url(#shadow)">
      <rect width="320" height="85" rx="8" fill="#FFFFFF" stroke="#059669" stroke-width="1.5"/>
      <text x="16" y="24" font-size="9" font-weight="700" fill="#059669">PATH: /schedule</text>
      <text x="16" y="44" font-size="13" font-weight="700" fill="#111310">📅 Interactive Booking Schedule</text>
      <text x="16" y="62" font-size="11" fill="#5C6159">Live capacity meters &amp; instant reservation engine</text>
    </g>

    <!-- My Bookings Confirmed -->
    <g transform="translate(0, 175)" filter="url(#shadow)">
      <rect width="320" height="85" rx="8" fill="#FFFFFF" stroke="#059669" stroke-width="1.5"/>
      <text x="16" y="24" font-size="9" font-weight="700" fill="#059669">PATH: /my-bookings#confirmed</text>
      <text x="16" y="44" font-size="13" font-weight="700" fill="#111310">🎫 Active Confirmed Passes</text>
      <text x="16" y="62" font-size="11" fill="#5C6159">Pass ID, room info, trainer &amp; [Cancel] trigger</text>
    </g>

    <!-- My Bookings Waitlist -->
    <g transform="translate(0, 280)" filter="url(#shadow)">
      <rect width="320" height="85" rx="8" fill="#FFFFFF" stroke="#059669" stroke-width="1.5"/>
      <text x="16" y="24" font-size="9" font-weight="700" fill="#059669">PATH: /my-bookings#waitlist</text>
      <text x="16" y="44" font-size="13" font-weight="700" fill="#111310">⏳ FIFO Waitlist Tracker</text>
      <text x="16" y="62" font-size="11" fill="#5C6159">Queue position badge (Position #1 - Next in line)</text>
    </g>

    <!-- Membership Status -->
    <g transform="translate(0, 385)" filter="url(#shadow)">
      <rect width="320" height="85" rx="8" fill="#FFFFFF" stroke="#059669" stroke-width="1.5"/>
      <text x="16" y="24" font-size="9" font-weight="700" fill="#059669">PATH: /my-bookings#membership</text>
      <text x="16" y="44" font-size="13" font-weight="700" fill="#111310">💳 Membership &amp; Passes Tab</text>
      <text x="16" y="62" font-size="11" fill="#5C6159">All-Access Active status &amp; pass renewal policy</text>
    </g>
  </g>

  <!-- Column 4: Admin Operations -->
  <g transform="translate(1200, 320)">
    <rect width="320" height="50" rx="6" fill="#DC2626"/>
    <text x="16" y="24" font-size="9" font-weight="700" fill="#FFFFFF" letter-spacing="1">04. OPERATIONS &amp; ADMIN</text>
    <text x="16" y="40" font-size="13" font-weight="700" fill="#FFFFFF">Gym Staff Space</text>

    <!-- Operations Overview -->
    <g transform="translate(0, 70)" filter="url(#shadow)">
      <rect width="320" height="85" rx="8" fill="#FFFFFF" stroke="#DC2626" stroke-width="1.5"/>
      <text x="16" y="24" font-size="9" font-weight="700" fill="#DC2626">PATH: /admin</text>
      <text x="16" y="44" font-size="13" font-weight="700" fill="#111310">📊 Operations Dashboard</text>
      <text x="16" y="62" font-size="11" fill="#5C6159">Daily bookings (87%), waitlist load &amp; session count</text>
    </g>

    <!-- Session Management -->
    <g transform="translate(0, 175)" filter="url(#shadow)">
      <rect width="320" height="85" rx="8" fill="#FFFFFF" stroke="#DC2626" stroke-width="1.5"/>
      <text x="16" y="24" font-size="9" font-weight="700" fill="#DC2626">PATH: /admin/sessions</text>
      <text x="16" y="44" font-size="13" font-weight="700" fill="#111310">🗓️ Session Manager Table</text>
      <text x="16" y="62" font-size="11" fill="#5C6159">High-density schedule grid with quick capacity editor</text>
    </g>

    <!-- Roster Drawer -->
    <g transform="translate(0, 280)" filter="url(#shadow)">
      <rect width="320" height="85" rx="8" fill="#FFFFFF" stroke="#DC2626" stroke-width="1.5"/>
      <text x="16" y="24" font-size="9" font-weight="700" fill="#DC2626">PATH: /admin/sessions/:id/roster</text>
      <text x="16" y="44" font-size="13" font-weight="700" fill="#111310">👥 Attendee &amp; Waitlist Roster</text>
      <text x="16" y="62" font-size="11" fill="#5C6159">Check-in toggle &amp; chronological waitlist queue</text>
    </g>
  </g>
</svg>`;
}

// 2. GENERATE USER FLOW 1: DISCOVERY & BOOKING SVG
function generateFlow1Svg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="750" viewBox="0 0 1800 750" style="background:#F2F0E8; font-family:'Mona Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#111310" flood-opacity="0.08"/>
    </filter>
  </defs>

  <text x="80" y="60" font-size="22" font-weight="800" fill="#111310">FLOW 01: VISITOR DISCOVERY, AUTH, MEMBERSHIP &amp; BOOKING</text>
  <text x="80" y="86" font-size="13" fill="#5C6159">Solves: Program taxonomy education, context-preserving demo auth, membership verification, and FIFO waitlisting</text>

  <!-- Step 1: Entry -->
  <g transform="translate(80, 130)" filter="url(#shadow)">
    <rect width="200" height="90" rx="8" fill="#111310" stroke="#C7F134" stroke-width="1.5"/>
    <text x="16" y="24" font-size="9" font-weight="700" fill="#C7F134">01. ENTRY</text>
    <text x="16" y="46" font-size="13" font-weight="700" fill="#F2F0E8">Visitor on Home</text>
    <text x="16" y="68" font-size="11" fill="#D7D4CA">Explores program guide</text>
  </g>

  <!-- Arrow -->
  <path d="M 280 175 L 340 175" fill="none" stroke="#6B7068" stroke-width="2" marker-end="url(#arrow)"/>

  <!-- Step 2: Schedule -->
  <g transform="translate(340, 130)" filter="url(#shadow)">
    <rect width="200" height="90" rx="8" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>
    <text x="16" y="24" font-size="9" font-weight="700" fill="#6B7068">02. BROWSE</text>
    <text x="16" y="46" font-size="13" font-weight="700" fill="#111310">Filter Schedule</text>
    <text x="16" y="68" font-size="11" fill="#5C6159">Filters by [STRENGTH] &amp; date</text>
  </g>

  <path d="M 540 175 L 600 175" fill="none" stroke="#6B7068" stroke-width="2"/>

  <!-- Step 3: Drawer -->
  <g transform="translate(600, 130)" filter="url(#shadow)">
    <rect width="220" height="90" rx="8" fill="#FFFFFF" stroke="#8B5CF6" stroke-width="1.5"/>
    <text x="16" y="24" font-size="9" font-weight="700" fill="#8B5CF6">03. DETAILS DRAWER</text>
    <text x="16" y="46" font-size="13" font-weight="700" fill="#111310">Open Session Drawer</text>
    <text x="16" y="68" font-size="11" fill="#5C6159">Inspects intensity &amp; cutoff rule</text>
  </g>

  <path d="M 820 175 L 880 175" fill="none" stroke="#6B7068" stroke-width="2"/>

  <!-- Decision 1: Auth -->
  <g transform="translate(880, 120)">
    <polygon points="110,0 220,55 110,110 0,55" fill="#1A1E19" stroke="#EAB308" stroke-width="1.5"/>
    <text x="110" y="48" font-size="11" font-weight="700" fill="#F2F0E8" text-anchor="middle">Is Visitor</text>
    <text x="110" y="66" font-size="11" font-weight="700" fill="#F2F0E8" text-anchor="middle">Authenticated?</text>
  </g>

  <!-- Branch No Auth -> Demo Auth Modal -->
  <path d="M 990 230 L 990 310" fill="none" stroke="#6B7068" stroke-width="2"/>
  <rect x="965" y="255" width="50" height="20" rx="4" fill="#111310"/>
  <text x="990" y="268" font-size="9" font-weight="700" fill="#C7F134" text-anchor="middle">NO</text>

  <g transform="translate(880, 310)" filter="url(#shadow)">
    <rect width="220" height="90" rx="8" fill="#FFFFFF" stroke="#8B5CF6" stroke-width="1.5"/>
    <text x="16" y="24" font-size="9" font-weight="700" fill="#8B5CF6">CONTEXT-PRESERVING MODAL</text>
    <text x="16" y="46" font-size="12" font-weight="700" fill="#111310">Demo Sign-In Modal</text>
    <text x="16" y="68" font-size="11" fill="#5C6159">Select Alex Rivera • Retains Session</text>
  </g>

  <!-- Return from Auth Modal to Decision 2 -->
  <path d="M 1100 355 L 1220 355 L 1220 230" fill="none" stroke="#6B7068" stroke-width="2"/>
  <path d="M 1100 175 L 1180 175" fill="none" stroke="#6B7068" stroke-width="2"/>
  <rect x="1120" y="155" width="40" height="20" rx="4" fill="#111310"/>
  <text x="1140" y="168" font-size="9" font-weight="700" fill="#C7F134" text-anchor="middle">YES</text>

  <!-- Decision 2: Membership -->
  <g transform="translate(1180, 120)">
    <polygon points="100,0 200,55 100,110 0,55" fill="#1A1E19" stroke="#EAB308" stroke-width="1.5"/>
    <text x="100" y="48" font-size="11" font-weight="700" fill="#F2F0E8" text-anchor="middle">Active Gym</text>
    <text x="100" y="66" font-size="11" font-weight="700" fill="#F2F0E8" text-anchor="middle">Membership?</text>
  </g>

  <path d="M 1380 175 L 1440 175" fill="none" stroke="#6B7068" stroke-width="2"/>

  <!-- Decision 3: Spots Available -->
  <g transform="translate(1440, 120)">
    <polygon points="90,0 180,55 90,110 0,55" fill="#1A1E19" stroke="#EAB308" stroke-width="1.5"/>
    <text x="90" y="48" font-size="11" font-weight="700" fill="#F2F0E8" text-anchor="middle">Spots</text>
    <text x="90" y="66" font-size="11" font-weight="700" fill="#F2F0E8" text-anchor="middle">Available?</text>
  </g>

  <!-- Branch Spots > 0 (Book) -->
  <path d="M 1530 120 L 1530 50 L 1640 50" fill="none" stroke="#6B7068" stroke-width="2"/>
  <rect x="1545" y="30" width="70" height="20" rx="4" fill="#111310"/>
  <text x="1580" y="44" font-size="9" font-weight="700" fill="#C7F134" text-anchor="middle">YES (>0)</text>

  <g transform="translate(1640, 10)" filter="url(#shadow)">
    <rect width="220" height="80" rx="8" fill="#111310" stroke="#C7F134" stroke-width="1.5"/>
    <text x="16" y="24" font-size="9" font-weight="700" fill="#C7F134">CONFIRMED RESERVATION</text>
    <text x="16" y="46" font-size="13" font-weight="700" fill="#F2F0E8">✅ Booking Confirmed</text>
    <text x="16" y="66" font-size="11" fill="#D7D4CA">Spot reserved in My Bookings</text>
  </g>

  <!-- Branch Full = 0 (Waitlist) -->
  <path d="M 1530 230 L 1530 300 L 1640 300" fill="none" stroke="#6B7068" stroke-width="2"/>
  <rect x="1545" y="280" width="70" height="20" rx="4" fill="#111310"/>
  <text x="1580" y="294" font-size="9" font-weight="700" fill="#C7F134" text-anchor="middle">FULL (=0)</text>

  <g transform="translate(1640, 260)" filter="url(#shadow)">
    <rect width="220" height="80" rx="8" fill="#111310" stroke="#C7F134" stroke-width="1.5"/>
    <text x="16" y="24" font-size="9" font-weight="700" fill="#C7F134">FIFO WAITLIST QUEUE</text>
    <text x="16" y="46" font-size="13" font-weight="700" fill="#F2F0E8">⏳ Joined Waitlist #X</text>
    <text x="16" y="66" font-size="11" fill="#D7D4CA">Eligible for auto-promotion</text>
  </g>
</svg>`;
}

// 3. GENERATE USER FLOW 2: CANCELLATION & FIFO PROMOTION SVG
function generateFlow2Svg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="600" viewBox="0 0 1600 600" style="background:#F2F0E8; font-family:'Mona Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#111310" flood-opacity="0.08"/>
    </filter>
  </defs>

  <text x="80" y="60" font-size="22" font-weight="800" fill="#111310">FLOW 02: CANCELLATION &amp; AUTOMATIC FIFO WAITLIST PROMOTION</text>
  <text x="80" y="86" font-size="13" fill="#5C6159">Solves: 2-hour policy cutoff enforcement, transactional spot release, and deterministic FIFO promotion</text>

  <!-- Step 1 -->
  <g transform="translate(80, 130)" filter="url(#shadow)">
    <rect width="200" height="90" rx="8" fill="#111310" stroke="#C7F134" stroke-width="1.5"/>
    <text x="16" y="24" font-size="9" font-weight="700" fill="#C7F134">01. ENTRY</text>
    <text x="16" y="46" font-size="13" font-weight="700" fill="#F2F0E8">Member in My Bookings</text>
    <text x="16" y="68" font-size="11" fill="#D7D4CA">Views confirmed passes</text>
  </g>

  <path d="M 280 175 L 340 175" fill="none" stroke="#6B7068" stroke-width="2"/>

  <!-- Step 2 -->
  <g transform="translate(340, 130)" filter="url(#shadow)">
    <rect width="200" height="90" rx="8" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>
    <text x="16" y="24" font-size="9" font-weight="700" fill="#6B7068">02. ACTION</text>
    <text x="16" y="46" font-size="13" font-weight="700" fill="#111310">Click [Cancel Booking]</text>
    <text x="16" y="68" font-size="11" fill="#5C6159">Triggers cancellation check</text>
  </g>

  <path d="M 540 175 L 600 175" fill="none" stroke="#6B7068" stroke-width="2"/>

  <!-- Decision 1: Cutoff -->
  <g transform="translate(600, 120)">
    <polygon points="100,0 200,55 100,110 0,55" fill="#1A1E19" stroke="#EAB308" stroke-width="1.5"/>
    <text x="100" y="48" font-size="11" font-weight="700" fill="#F2F0E8" text-anchor="middle">Within 2h</text>
    <text x="100" y="66" font-size="11" font-weight="700" fill="#F2F0E8" text-anchor="middle">Cutoff Window?</text>
  </g>

  <!-- Past Cutoff Locked -->
  <path d="M 700 230 L 700 310" fill="none" stroke="#6B7068" stroke-width="2"/>
  <rect x="650" y="255" width="100" height="20" rx="4" fill="#111310"/>
  <text x="700" y="268" font-size="9" font-weight="700" fill="#EF4444" text-anchor="middle">PAST CUTOFF</text>

  <g transform="translate(590, 310)" filter="url(#shadow)">
    <rect width="220" height="85" rx="8" fill="#FFFFFF" stroke="#EF4444" stroke-width="1.5"/>
    <text x="16" y="24" font-size="9" font-weight="700" fill="#EF4444">POLICY ENFORCEMENT</text>
    <text x="16" y="46" font-size="13" font-weight="700" fill="#111310">❌ Cancellation Locked</text>
    <text x="16" y="66" font-size="11" fill="#5C6159">Free cancel closes 2h before start</text>
  </g>

  <!-- Eligible Dialog -->
  <path d="M 800 175 L 870 175" fill="none" stroke="#6B7068" stroke-width="2"/>
  <rect x="815" y="155" width="45" height="20" rx="4" fill="#111310"/>
  <text x="837" y="168" font-size="9" font-weight="700" fill="#C7F134" text-anchor="middle">YES</text>

  <g transform="translate(870, 130)" filter="url(#shadow)">
    <rect width="220" height="90" rx="8" fill="#FFFFFF" stroke="#8B5CF6" stroke-width="1.5"/>
    <text x="16" y="24" font-size="9" font-weight="700" fill="#8B5CF6">CONFIRMATION MODAL</text>
    <text x="16" y="46" font-size="13" font-weight="700" fill="#111310">Policy Warning Dialog</text>
    <text x="16" y="68" font-size="11" fill="#5C6159">Explains spot auto-promotion</text>
  </g>

  <path d="M 1090 175 L 1150 175" fill="none" stroke="#6B7068" stroke-width="2"/>

  <!-- Decision 2: Waitlist Queue -->
  <g transform="translate(1150, 120)">
    <polygon points="100,0 200,55 100,110 0,55" fill="#1A1E19" stroke="#EAB308" stroke-width="1.5"/>
    <text x="100" y="48" font-size="11" font-weight="700" fill="#F2F0E8" text-anchor="middle">Waitlist Queue</text>
    <text x="100" y="66" font-size="11" font-weight="700" fill="#F2F0E8" text-anchor="middle">> 0 Members?</text>
  </g>

  <!-- Branch Auto-Promote -->
  <path d="M 1250 120 L 1250 50 L 1340 50" fill="none" stroke="#6B7068" stroke-width="2"/>
  <rect x="1265" y="30" width="60" height="20" rx="4" fill="#111310"/>
  <text x="1295" y="44" font-size="9" font-weight="700" fill="#C7F134" text-anchor="middle">YES (>0)</text>

  <g transform="translate(1340, 10)" filter="url(#shadow)">
    <rect width="220" height="80" rx="8" fill="#111310" stroke="#C7F134" stroke-width="1.5"/>
    <text x="16" y="24" font-size="9" font-weight="700" fill="#C7F134">TRANSACTIONAL PROMOTION</text>
    <text x="16" y="46" font-size="13" font-weight="700" fill="#F2F0E8">⚡ Auto-Promote #1</text>
    <text x="16" y="66" font-size="11" fill="#D7D4CA">First in line promoted instantly</text>
  </g>

  <!-- Branch Capacity Release -->
  <path d="M 1250 230 L 1250 300 L 1340 300" fill="none" stroke="#6B7068" stroke-width="2"/>
  <rect x="1265" y="280" width="60" height="20" rx="4" fill="#111310"/>
  <text x="1295" y="294" font-size="9" font-weight="700" fill="#C7F134" text-anchor="middle">NO (=0)</text>

  <g transform="translate(1340, 260)" filter="url(#shadow)">
    <rect width="220" height="80" rx="8" fill="#FFFFFF" stroke="#059669" stroke-width="1.5"/>
    <text x="16" y="24" font-size="9" font-weight="700" fill="#059669">CAPACITY REBALANCE</text>
    <text x="16" y="46" font-size="13" font-weight="700" fill="#111310">+1 Spot Available</text>
    <text x="16" y="66" font-size="11" fill="#5C6159">Returned to public schedule</text>
  </g>
</svg>`;
}

// 4. GENERATE USER FLOW 3: ADMIN OPERATIONS SVG
function generateFlow3Svg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="340" viewBox="0 0 1600 340" style="background:#F2F0E8; font-family:'Mona Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#111310" flood-opacity="0.08"/>
    </filter>
  </defs>

  <text x="80" y="60" font-size="22" font-weight="800" fill="#111310">FLOW 03: ADMINISTRATOR OPERATIONS &amp; ROSTER SYNC</text>
  <text x="80" y="86" font-size="13" fill="#5C6159">Solves: Real-time schedule management, trainer assignment, capacity adjustment, and roster oversight</text>

  <!-- Step 1 -->
  <g transform="translate(80, 130)" filter="url(#shadow)">
    <rect width="220" height="85" rx="8" fill="#111310" stroke="#DC2626" stroke-width="1.5"/>
    <text x="16" y="24" font-size="9" font-weight="700" fill="#DC2626">01. AUTH</text>
    <text x="16" y="46" font-size="13" font-weight="700" fill="#F2F0E8">Sign in as Admin</text>
    <text x="16" y="66" font-size="11" fill="#D7D4CA">Morgan Vance profile</text>
  </g>

  <path d="M 300 172 L 360 172" fill="none" stroke="#6B7068" stroke-width="2"/>

  <!-- Step 2 -->
  <g transform="translate(360, 130)" filter="url(#shadow)">
    <rect width="220" height="85" rx="8" fill="#FFFFFF" stroke="#DC2626" stroke-width="1.5"/>
    <text x="16" y="24" font-size="9" font-weight="700" fill="#DC2626">02. DASHBOARD</text>
    <text x="16" y="46" font-size="13" font-weight="700" fill="#111310">Operations Overview</text>
    <text x="16" y="66" font-size="11" fill="#5C6159">Inspects capacity % &amp; waitlists</text>
  </g>

  <path d="M 580 172 L 640 172" fill="none" stroke="#6B7068" stroke-width="2"/>

  <!-- Step 3 -->
  <g transform="translate(640, 130)" filter="url(#shadow)">
    <rect width="220" height="85" rx="8" fill="#FFFFFF" stroke="#DC2626" stroke-width="1.5"/>
    <text x="16" y="24" font-size="9" font-weight="700" fill="#DC2626">03. SESSIONS TABLE</text>
    <text x="16" y="46" font-size="13" font-weight="700" fill="#111310">Open Session Table</text>
    <text x="16" y="66" font-size="11" fill="#5C6159">Selects session for management</text>
  </g>

  <path d="M 860 172 L 920 172" fill="none" stroke="#6B7068" stroke-width="2"/>

  <!-- Step 4 -->
  <g transform="translate(920, 130)" filter="url(#shadow)">
    <rect width="220" height="85" rx="8" fill="#FFFFFF" stroke="#8B5CF6" stroke-width="1.5"/>
    <text x="16" y="24" font-size="9" font-weight="700" fill="#8B5CF6">04. ROSTER DRAWER</text>
    <text x="16" y="46" font-size="13" font-weight="700" fill="#111310">Edit Capacity / Trainer</text>
    <text x="16" y="66" font-size="11" fill="#5C6159">Adjusts max spots or coach</text>
  </g>

  <path d="M 1140 172 L 1200 172" fill="none" stroke="#6B7068" stroke-width="2"/>

  <!-- Step 5 -->
  <g transform="translate(1200, 130)" filter="url(#shadow)">
    <rect width="220" height="85" rx="8" fill="#111310" stroke="#C7F134" stroke-width="1.5"/>
    <text x="16" y="24" font-size="9" font-weight="700" fill="#C7F134">05. LIVE SYNC</text>
    <text x="16" y="46" font-size="13" font-weight="700" fill="#F2F0E8">⚡ Real-Time Sync</text>
    <text x="16" y="66" font-size="11" fill="#D7D4CA">Public schedule updated live</text>
  </g>
</svg>`;
}

fs.writeFileSync('docs/design/sitemap.svg', generateSitemapSvg());
fs.writeFileSync('docs/design/user-flow-booking.svg', generateFlow1Svg());
fs.writeFileSync('docs/design/user-flow-cancellation.svg', generateFlow2Svg());
fs.writeFileSync('docs/design/user-flow-admin.svg', generateFlow3Svg());

console.log('Successfully generated all 4 high-precision vector SVGs in docs/design/!');
