import fs from 'fs';
import path from 'path';

const outDir = 'docs/brand/figma';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Read vector logos
const primaryLogoSvg = fs.readFileSync('docs/brand/logo/practice-primary-stacked.svg', 'utf8');
const inverseLogoSvg = fs.readFileSync('docs/brand/logo/practice-primary-stacked-inverse.svg', 'utf8');
const horizontalLogoSvg = fs.readFileSync('docs/brand/logo/practice-horizontal-lockup.svg', 'utf8');
const compactLogoSvg = fs.readFileSync('docs/brand/logo/practice-compact-mark.svg', 'utf8');

// Extract SVG inner content for embedding
function extractSvgContent(svgStr) {
  const match = svgStr.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  return match ? match[1] : svgStr;
}

const primaryInner = extractSvgContent(primaryLogoSvg);
const inverseInner = extractSvgContent(inverseLogoSvg);
const horizontalInner = extractSvgContent(horizontalLogoSvg);
const compactInner = extractSvgContent(compactLogoSvg);

// Common styles & fonts
const commonDefs = `
<defs>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,300..900;1,300..900&amp;family=JetBrains+Mono:wght@400;600&amp;display=swap');
    .font-sans { font-family: 'Mona Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</defs>
`;

// Slide 1: Cover
const slide1 = `
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  ${commonDefs}
  <!-- Background -->
  <rect width="1920" height="1080" fill="#111310"/>

  <!-- Subtle Grid Pattern -->
  <line x1="120" y1="0" x2="120" y2="1080" stroke="#222620" stroke-width="1"/>
  <line x1="1800" y1="0" x2="1800" y2="1080" stroke="#222620" stroke-width="1"/>
  <line x1="0" y1="120" x2="1920" y2="120" stroke="#222620" stroke-width="1"/>
  <line x1="0" y1="960" x2="1920" y2="960" stroke="#222620" stroke-width="1"/>

  <!-- Top Metadata -->
  <text x="120" y="80" fill="#C7F134" class="font-mono" font-size="14" font-weight="600" letter-spacing="2">PRACTICE ATHLETIC CLUB • BRAND IDENTITY MANUAL</text>
  <text x="1800" y="80" fill="#5C6159" class="font-mono" font-size="14" font-weight="600" text-anchor="end">VERSION 1.0 • 2026</text>

  <!-- Big Title Lockup -->
  <g transform="translate(120, 280)">
    <text x="0" y="0" fill="#F2F0E8" class="font-sans" font-size="110" font-weight="800" letter-spacing="-3">PRACTICE</text>
    <text x="0" y="110" fill="#F2F0E8" class="font-sans" font-size="110" font-weight="800" letter-spacing="-3">ATHLETIC CLUB</text>
    <rect x="0" y="150" width="180" height="12" fill="#C7F134"/>
  </g>

  <!-- Subtitle and Scope -->
  <g transform="translate(120, 560)">
    <text x="0" y="0" fill="#D7D4CA" class="font-sans" font-size="32" font-weight="500">Brand Identity Guidelines, Design System &amp; Strategic Foundations</text>
    <text x="0" y="48" fill="#5C6159" class="font-sans" font-size="22" font-weight="400">Treating fitness as a repeatable daily practice rather than an extreme performance.</text>
  </g>

  <!-- Bottom Details -->
  <g transform="translate(120, 920)">
    <text x="0" y="0" fill="#5C6159" class="font-mono" font-size="14">CORE TERRITORY: QUIET STRENGTH</text>
    <text x="400" y="0" fill="#5C6159" class="font-mono" font-size="14">TYPEFACE: MONA SANS</text>
    <text x="750" y="0" fill="#5C6159" class="font-mono" font-size="14">PALETTE: INK / BONE / SIGNAL LIME</text>
    <text x="1680" y="0" fill="#C7F134" class="font-mono" font-size="14" text-anchor="end">PAGE 01 / 08</text>
  </g>
</svg>
`;

// Slide 2: Strategy & Key Elements
const slide2 = `
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  ${commonDefs}
  <rect width="1920" height="1080" fill="#F2F0E8"/>

  <!-- Top Header -->
  <text x="120" y="90" fill="#5C6159" class="font-mono" font-size="14" font-weight="600" letter-spacing="2">01 / BRAND STRATEGY &amp; KEY ELEMENTS</text>
  <text x="1800" y="90" fill="#5C6159" class="font-mono" font-size="14" text-anchor="end">PAGE 02 / 08</text>
  <line x1="120" y1="120" x2="1800" y2="120" stroke="#D7D4CA" stroke-width="1.5"/>

  <!-- Section Title -->
  <text x="120" y="190" fill="#111310" class="font-sans" font-size="44" font-weight="800" letter-spacing="-1">Purpose, Central Tension &amp; Positioning</text>
  <text x="120" y="235" fill="#5C6159" class="font-sans" font-size="20">The foundational truth that anchors Practice Athletic Club across every physical and digital touchpoint.</text>

  <!-- Column 1: Central Tension -->
  <g transform="translate(120, 290)">
    <rect width="510" height="420" rx="16" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>
    <rect x="36" y="36" width="36" height="36" rx="8" fill="#111310"/>
    <text x="49" y="60" fill="#C7F134" class="font-mono" font-size="18" font-weight="700">01</text>
    <text x="36" y="120" fill="#111310" class="font-sans" font-size="24" font-weight="700">The Central Tension</text>
    <text x="36" y="165" fill="#5C6159" class="font-sans" font-size="16" font-weight="400">
      <tspan x="36" dy="0">Commercial fitness is either chaotic and</tspan>
      <tspan x="36" dy="26">intimidating (loud music, crowded rooms,</tspan>
      <tspan x="36" dy="26">aggressive bro-culture) or cold and</tspan>
      <tspan x="36" dy="26">transactional (opaque booking, hidden rules).</tspan>
      <tspan x="36" dy="40" font-weight="600" fill="#111310">People want a calm, disciplined space</tspan>
      <tspan x="36" dy="26" font-weight="600" fill="#111310">where showing up is straightforward</tspan>
      <tspan x="36" dy="26" font-weight="600" fill="#111310">and progress is a daily habit.</tspan>
    </text>
  </g>

  <!-- Column 2: Positioning Statement -->
  <g transform="translate(680, 290)">
    <rect width="530" height="420" rx="16" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>
    <rect x="36" y="36" width="36" height="36" rx="8" fill="#111310"/>
    <text x="47" y="60" fill="#C7F134" class="font-mono" font-size="18" font-weight="700">02</text>
    <text x="36" y="120" fill="#111310" class="font-sans" font-size="24" font-weight="700">Positioning &amp; Promise</text>
    <text x="36" y="165" fill="#5C6159" class="font-sans" font-size="16">
      <tspan x="36" dy="0">For individuals seeking purposeful training,</tspan>
      <tspan x="36" dy="26"><tspan font-weight="700" fill="#111310">Practice Athletic Club</tspan> provides structured</tspan>
      <tspan x="36" dy="26">class programming, skilled coaching, and an</tspan>
      <tspan x="36" dy="26">effortless booking experience.</tspan>
      <tspan x="36" dy="45" font-weight="700" fill="#111310" font-size="18">"A clear place, a clear plan,</tspan>
      <tspan x="36" dy="26" font-weight="700" fill="#111310" font-size="18">and your next session ready."</tspan>
    </text>
  </g>

  <!-- Column 3: The 3 Exclusions -->
  <g transform="translate(1260, 290)">
    <rect width="540" height="420" rx="16" fill="#111310"/>
    <rect x="36" y="36" width="36" height="36" rx="8" fill="#222620"/>
    <text x="46" y="60" fill="#C7F134" class="font-mono" font-size="18" font-weight="700">03</text>
    <text x="36" y="120" fill="#F2F0E8" class="font-sans" font-size="24" font-weight="700">What Practice is NOT</text>
    <g transform="translate(36, 160)">
      <text x="0" y="15" fill="#C7F134" class="font-sans" font-size="16" font-weight="700">✕ NO TRANSFORMATION HYPE</text>
      <text x="0" y="38" fill="#D7D4CA" class="font-sans" font-size="14">No 30-day shred claims, body shaming, or guilt.</text>

      <text x="0" y="85" fill="#C7F134" class="font-sans" font-size="16" font-weight="700">✕ NO AGGRESSIVE BRO-CULTURE</text>
      <text x="0" y="108" fill="#D7D4CA" class="font-sans" font-size="14">No macho screaming or gatekeeping intimidation.</text>

      <text x="0" y="155" fill="#C7F134" class="font-sans" font-size="16" font-weight="700">✕ NO ARTIFICIAL SCARCITY</text>
      <text x="0" y="178" fill="#D7D4CA" class="font-sans" font-size="14">No fake timers or opaque cancellation traps.</text>
    </g>
  </g>

  <!-- Bottom Working Tagline Banner -->
  <g transform="translate(120, 750)">
    <rect width="1680" height="200" rx="16" fill="#111310"/>
    <text x="60" y="70" fill="#5C6159" class="font-mono" font-size="14" letter-spacing="2">WORKING TAGLINE</text>
    <text x="60" y="135" fill="#F2F0E8" class="font-sans" font-size="52" font-weight="800" letter-spacing="-1">Progress is a practice.</text>
    <rect x="650" y="98" width="120" height="8" fill="#C7F134"/>
    <text x="1620" y="115" fill="#D7D4CA" class="font-sans" font-size="16" text-anchor="end">Steady habits over extreme spectacle.</text>
  </g>
</svg>
`;

// Slide 3: Master Logo System
const slide3 = `
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  ${commonDefs}
  <rect width="1920" height="1080" fill="#F2F0E8"/>

  <!-- Top Header -->
  <text x="120" y="90" fill="#5C6159" class="font-mono" font-size="14" font-weight="600" letter-spacing="2">02 / LOGO SYSTEM &amp; VARIANTS</text>
  <text x="1800" y="90" fill="#5C6159" class="font-mono" font-size="14" text-anchor="end">PAGE 03 / 08</text>
  <line x1="120" y1="120" x2="1800" y2="120" stroke="#D7D4CA" stroke-width="1.5"/>

  <!-- Section Title -->
  <text x="120" y="190" fill="#111310" class="font-sans" font-size="44" font-weight="800" letter-spacing="-1">Wordmark Lockups &amp; Construction</text>
  <text x="120" y="235" fill="#5C6159" class="font-sans" font-size="20">Typography-first wordmark set in Mona Sans with a signature lime progress indicator.</text>

  <!-- Left Card: Primary Stacked (Light) -->
  <g transform="translate(120, 280)">
    <rect width="810" height="400" rx="16" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>
    <text x="40" y="50" fill="#5C6159" class="font-mono" font-size="13" font-weight="600">PRIMARY STACKED (LIGHT FIELD)</text>
    <!-- Embedded Primary Logo -->
    <g transform="translate(100, 10) scale(0.6)">
      ${primaryInner}
    </g>
  </g>

  <!-- Right Card: Inverse Stacked (Dark) -->
  <g transform="translate(990, 280)">
    <rect width="810" height="400" rx="16" fill="#111310"/>
    <text x="40" y="50" fill="#C7F134" class="font-mono" font-size="13" font-weight="600">INVERSE STACKED (DARK FIELD)</text>
    <!-- Embedded Inverse Logo -->
    <g transform="translate(100, 10) scale(0.6)">
      ${inverseInner}
    </g>
  </g>

  <!-- Bottom Row: Horizontal & Compact Mark -->
  <g transform="translate(120, 720)">
    <!-- Horizontal Card -->
    <rect width="1120" height="230" rx="16" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>
    <text x="40" y="45" fill="#5C6159" class="font-mono" font-size="13" font-weight="600">HORIZONTAL LOCKUP (APP HEADER &amp; NAV)</text>
    <g transform="translate(140, 70) scale(0.7)">
      ${horizontalInner}
    </g>
  </g>

  <g transform="translate(1290, 720)">
    <!-- Compact Mark Card -->
    <rect width="510" height="230" rx="16" fill="#111310"/>
    <text x="40" y="45" fill="#C7F134" class="font-mono" font-size="13" font-weight="600">COMPACT MONOGRAM / FAVICON</text>
    <g transform="translate(200, 50) scale(0.45)">
      ${compactInner}
    </g>
  </g>
</svg>
`;

// Slide 4: Color Palette
const slide4 = `
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  ${commonDefs}
  <rect width="1920" height="1080" fill="#F2F0E8"/>

  <!-- Top Header -->
  <text x="120" y="90" fill="#5C6159" class="font-mono" font-size="14" font-weight="600" letter-spacing="2">03 / COLOUR PALETTE &amp; TOKENS</text>
  <text x="1800" y="90" fill="#5C6159" class="font-mono" font-size="14" text-anchor="end">PAGE 04 / 08</text>
  <line x1="120" y1="120" x2="1800" y2="120" stroke="#D7D4CA" stroke-width="1.5"/>

  <!-- Section Title -->
  <text x="120" y="190" fill="#111310" class="font-sans" font-size="44" font-weight="800" letter-spacing="-1">Core Brand Swatches</text>
  <text x="120" y="235" fill="#5C6159" class="font-sans" font-size="20">Calibrated for deep contrast, calm reading comfort, and high-visibility status cues.</text>

  <!-- Swatch 1: INK -->
  <g transform="translate(120, 290)">
    <rect width="310" height="380" rx="16" fill="#111310"/>
    <rect x="0" y="380" width="310" height="200" rx="0" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>
    <text x="24" y="420" fill="#111310" class="font-sans" font-size="22" font-weight="700">Ink</text>
    <text x="24" y="450" fill="#5C6159" class="font-mono" font-size="14">HEX: #111310</text>
    <text x="24" y="475" fill="#5C6159" class="font-mono" font-size="14">RGB: 17, 19, 16</text>
    <text x="24" y="500" fill="#5C6159" class="font-mono" font-size="14">CMYK: 75, 68, 67, 85</text>
    <text x="24" y="540" fill="#111310" class="font-sans" font-size="13" font-weight="600">Primary text &amp; dark surface</text>
  </g>

  <!-- Swatch 2: BONE -->
  <g transform="translate(460, 290)">
    <rect width="310" height="380" rx="16" fill="#F2F0E8" stroke="#D7D4CA" stroke-width="1.5"/>
    <rect x="0" y="380" width="310" height="200" rx="0" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>
    <text x="24" y="420" fill="#111310" class="font-sans" font-size="22" font-weight="700">Bone</text>
    <text x="24" y="450" fill="#5C6159" class="font-mono" font-size="14">HEX: #F2F0E8</text>
    <text x="24" y="475" fill="#5C6159" class="font-mono" font-size="14">RGB: 242, 240, 232</text>
    <text x="24" y="500" fill="#5C6159" class="font-mono" font-size="14">CMYK: 3, 2, 6, 0</text>
    <text x="24" y="540" fill="#111310" class="font-sans" font-size="13" font-weight="600">Primary light field (warm white)</text>
  </g>

  <!-- Swatch 3: SIGNAL LIME -->
  <g transform="translate(800, 290)">
    <rect width="310" height="380" rx="16" fill="#C7F134"/>
    <rect x="0" y="380" width="310" height="200" rx="0" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>
    <text x="24" y="420" fill="#111310" class="font-sans" font-size="22" font-weight="700">Signal Lime</text>
    <text x="24" y="450" fill="#5C6159" class="font-mono" font-size="14">HEX: #C7F134</text>
    <text x="24" y="475" fill="#5C6159" class="font-mono" font-size="14">RGB: 199, 241, 52</text>
    <text x="24" y="500" fill="#5C6159" class="font-mono" font-size="14">CMYK: 25, 0, 85, 0</text>
    <text x="24" y="540" fill="#111310" class="font-sans" font-size="13" font-weight="600">Progress indicator &amp; signature</text>
  </g>

  <!-- Swatch 4: SURFACE MUTED -->
  <g transform="translate(1140, 290)">
    <rect width="310" height="380" rx="16" fill="#D7D4CA"/>
    <rect x="0" y="380" width="310" height="200" rx="0" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>
    <text x="24" y="420" fill="#111310" class="font-sans" font-size="22" font-weight="700">Surface Muted</text>
    <text x="24" y="450" fill="#5C6159" class="font-mono" font-size="14">HEX: #D7D4CA</text>
    <text x="24" y="475" fill="#5C6159" class="font-mono" font-size="14">RGB: 215, 212, 202</text>
    <text x="24" y="500" fill="#5C6159" class="font-mono" font-size="14">CMYK: 15, 12, 18, 0</text>
    <text x="24" y="540" fill="#111310" class="font-sans" font-size="13" font-weight="600">Card borders &amp; quiet panels</text>
  </g>

  <!-- Swatch 5: TEXT MUTED -->
  <g transform="translate(1480, 290)">
    <rect width="320" height="380" rx="16" fill="#5C6159"/>
    <rect x="0" y="380" width="320" height="200" rx="0" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>
    <text x="24" y="420" fill="#111310" class="font-sans" font-size="22" font-weight="700">Text Muted</text>
    <text x="24" y="450" fill="#5C6159" class="font-mono" font-size="14">HEX: #5C6159</text>
    <text x="24" y="475" fill="#5C6159" class="font-mono" font-size="14">RGB: 92, 97, 89</text>
    <text x="24" y="500" fill="#5C6159" class="font-mono" font-size="14">CMYK: 55, 45, 52, 25</text>
    <text x="24" y="540" fill="#111310" class="font-sans" font-size="13" font-weight="600">Secondary helper &amp; coach labels</text>
  </g>

  <!-- Bottom WCAG Contrast Matrix Note -->
  <g transform="translate(120, 910)">
    <rect width="1680" height="90" rx="12" fill="#111310"/>
    <text x="40" y="52" fill="#C7F134" class="font-mono" font-size="14" font-weight="700">WCAG 2.1 AA/AAA CONTRAST VERIFIED:</text>
    <text x="390" y="52" fill="#F2F0E8" class="font-sans" font-size="15">Ink on Bone (16.37:1) • Muted on Bone (5.56:1) • Ink on Signal Lime (14.28:1) • Focus Forest on Bone (6.45:1)</text>
  </g>
</svg>
`;

// Slide 5: Semantic States
const slide5 = `
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  ${commonDefs}
  <rect width="1920" height="1080" fill="#F2F0E8"/>

  <!-- Top Header -->
  <text x="120" y="90" fill="#5C6159" class="font-mono" font-size="14" font-weight="600" letter-spacing="2">04 / SEMANTIC STATES &amp; BADGES</text>
  <text x="1800" y="90" fill="#5C6159" class="font-mono" font-size="14" text-anchor="end">PAGE 05 / 08</text>
  <line x1="120" y1="120" x2="1800" y2="120" stroke="#D7D4CA" stroke-width="1.5"/>

  <!-- Section Title -->
  <text x="120" y="190" fill="#111310" class="font-sans" font-size="44" font-weight="800" letter-spacing="-1">Operational Status Palette</text>
  <text x="120" y="235" fill="#5C6159" class="font-sans" font-size="20">Functional cues for bookings, waitlists, cutoffs, and cancellations with accessible contrast.</text>

  <!-- 4 State Cards -->
  <!-- State 1: Confirmed / Success -->
  <g transform="translate(120, 290)">
    <rect width="390" height="480" rx="16" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>
    <rect x="30" y="30" width="330" height="140" rx="12" fill="#1F4D32"/>
    <text x="60" y="110" fill="#FFFFFF" class="font-sans" font-size="28" font-weight="700">BOOKED</text>
    <text x="30" y="220" fill="#111310" class="font-sans" font-size="22" font-weight="700">Success Forest</text>
    <text x="30" y="255" fill="#5C6159" class="font-mono" font-size="14">HEX: #1F4D32</text>
    <text x="30" y="285" fill="#5C6159" class="font-mono" font-size="14">RGB: 31, 77, 50</text>
    <text x="30" y="330" fill="#111310" class="font-sans" font-size="15" font-weight="600">Usage:</text>
    <text x="30" y="360" fill="#5C6159" class="font-sans" font-size="15">Confirmed reservation badge,</text>
    <text x="30" y="385" fill="#5C6159" class="font-sans" font-size="15">spot promotion success toast.</text>
    <rect x="30" y="420" width="130" height="28" rx="6" fill="#1F4D32"/>
    <text x="45" y="439" fill="#FFFFFF" class="font-mono" font-size="12" font-weight="700">CONTRAST 9.7:1</text>
  </g>

  <!-- State 2: Waitlist / Warning -->
  <g transform="translate(550, 290)">
    <rect width="390" height="480" rx="16" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>
    <rect x="30" y="30" width="330" height="140" rx="12" fill="#7A4B00"/>
    <text x="60" y="110" fill="#FFFFFF" class="font-sans" font-size="28" font-weight="700">WAITLIST #2</text>
    <text x="30" y="220" fill="#111310" class="font-sans" font-size="22" font-weight="700">Warning Amber</text>
    <text x="30" y="255" fill="#5C6159" class="font-mono" font-size="14">HEX: #7A4B00</text>
    <text x="30" y="285" fill="#5C6159" class="font-mono" font-size="14">RGB: 122, 75, 0</text>
    <text x="30" y="330" fill="#111310" class="font-sans" font-size="15" font-weight="600">Usage:</text>
    <text x="30" y="360" fill="#5C6159" class="font-sans" font-size="15">Full capacity notice, waitlist queue,</text>
    <text x="30" y="385" fill="#5C6159" class="font-sans" font-size="15">approaching booking cutoff.</text>
    <rect x="30" y="420" width="130" height="28" rx="6" fill="#7A4B00"/>
    <text x="45" y="439" fill="#FFFFFF" class="font-mono" font-size="12" font-weight="700">CONTRAST 7.4:1</text>
  </g>

  <!-- State 3: Cancelled / Danger -->
  <g transform="translate(980, 290)">
    <rect width="390" height="480" rx="16" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>
    <rect x="30" y="30" width="330" height="140" rx="12" fill="#9E2E25"/>
    <text x="60" y="110" fill="#FFFFFF" class="font-sans" font-size="28" font-weight="700">CANCELLED</text>
    <text x="30" y="220" fill="#111310" class="font-sans" font-size="22" font-weight="700">Danger Red</text>
    <text x="30" y="255" fill="#5C6159" class="font-mono" font-size="14">HEX: #9E2E25</text>
    <text x="30" y="285" fill="#5C6159" class="font-mono" font-size="14">RGB: 158, 46, 37</text>
    <text x="30" y="330" fill="#111310" class="font-sans" font-size="15" font-weight="600">Usage:</text>
    <text x="30" y="360" fill="#5C6159" class="font-sans" font-size="15">Cancellation confirmation,</text>
    <text x="30" y="385" fill="#5C6159" class="font-sans" font-size="15">destructive action triggers.</text>
    <rect x="30" y="420" width="130" height="28" rx="6" fill="#9E2E25"/>
    <text x="45" y="439" fill="#FFFFFF" class="font-mono" font-size="12" font-weight="700">CONTRAST 7.3:1</text>
  </g>

  <!-- State 4: Focus & Active Outline -->
  <g transform="translate(1410, 290)">
    <rect width="390" height="480" rx="16" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>
    <rect x="30" y="30" width="330" height="140" rx="12" fill="#23613F"/>
    <text x="60" y="110" fill="#FFFFFF" class="font-sans" font-size="28" font-weight="700">FOCUS RING</text>
    <text x="30" y="220" fill="#111310" class="font-sans" font-size="22" font-weight="700">Focus Forest</text>
    <text x="30" y="255" fill="#5C6159" class="font-mono" font-size="14">HEX: #23613F</text>
    <text x="30" y="285" fill="#5C6159" class="font-mono" font-size="14">RGB: 35, 97, 63</text>
    <text x="30" y="330" fill="#111310" class="font-sans" font-size="15" font-weight="600">Usage:</text>
    <text x="30" y="360" fill="#5C6159" class="font-sans" font-size="15">Accessible 2px focus outlines,</text>
    <text x="30" y="385" fill="#5C6159" class="font-sans" font-size="15">keyboard navigation state.</text>
    <rect x="30" y="420" width="130" height="28" rx="6" fill="#23613F"/>
    <text x="45" y="439" fill="#FFFFFF" class="font-mono" font-size="12" font-weight="700">CONTRAST 6.5:1</text>
  </g>

  <!-- Rule Note -->
  <g transform="translate(120, 810)">
    <rect width="1680" height="180" rx="16" fill="#111310"/>
    <text x="50" y="50" fill="#C7F134" class="font-mono" font-size="14" font-weight="700">ACCESSIBILITY RULE:</text>
    <text x="50" y="90" fill="#F2F0E8" class="font-sans" font-size="20" font-weight="600">Color is never the sole indicator of status.</text>
    <text x="50" y="130" fill="#D7D4CA" class="font-sans" font-size="16">Every semantic state badge must always combine color with an explicit textual label (e.g. [BOOKED] or [WAITLIST]).</text>
  </g>
</svg>
`;

// Slide 6: Typography Family
const slide6 = `
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  ${commonDefs}
  <rect width="1920" height="1080" fill="#F2F0E8"/>

  <!-- Top Header -->
  <text x="120" y="90" fill="#5C6159" class="font-mono" font-size="14" font-weight="600" letter-spacing="2">05 / TYPOGRAPHY • MONA SANS</text>
  <text x="1800" y="90" fill="#5C6159" class="font-mono" font-size="14" text-anchor="end">PAGE 06 / 08</text>
  <line x1="120" y1="120" x2="1800" y2="120" stroke="#D7D4CA" stroke-width="1.5"/>

  <!-- Section Title -->
  <text x="120" y="190" fill="#111310" class="font-sans" font-size="44" font-weight="800" letter-spacing="-1">Primary Typeface: Mona Sans</text>
  <text x="120" y="235" fill="#5C6159" class="font-sans" font-size="20">An industrial, highly legible grotesque sans-serif designed for flexible hierarchy across branding and digital interfaces.</text>

  <!-- Left: Weights Specimen -->
  <g transform="translate(120, 290)">
    <rect width="810" height="690" rx="16" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>
    <text x="40" y="60" fill="#5C6159" class="font-mono" font-size="13" font-weight="600">WEIGHTS IN USE</text>

    <g transform="translate(40, 110)">
      <text x="0" y="0" fill="#111310" class="font-sans" font-size="28" font-weight="800">ExtraBold (800) • Display headlines &amp; posters</text>
      <text x="0" y="70" fill="#111310" class="font-sans" font-size="28" font-weight="700">Bold (700) • Section headings &amp; CTA buttons</text>
      <text x="0" y="140" fill="#111310" class="font-sans" font-size="28" font-weight="600">SemiBold (600) • Card titles &amp; metadata labels</text>
      <text x="0" y="210" fill="#111310" class="font-sans" font-size="28" font-weight="500">Medium (500) • Subheads &amp; emphasized copy</text>
      <text x="0" y="280" fill="#111310" class="font-sans" font-size="28" font-weight="400">Regular (400) • Body text &amp; class descriptions</text>
    </g>

    <!-- Character Set -->
    <g transform="translate(40, 470)">
      <text x="0" y="0" fill="#5C6159" class="font-mono" font-size="13" font-weight="600">CHARACTER SET</text>
      <text x="0" y="40" fill="#111310" class="font-sans" font-size="20" font-weight="600" letter-spacing="1">ABCDEFGHIJKLMNOPQRSTUVWXYZ</text>
      <text x="0" y="75" fill="#111310" class="font-sans" font-size="20" font-weight="400" letter-spacing="1">abcdefghijklmnopqrstuvwxyz</text>
      <text x="0" y="110" fill="#111310" class="font-mono" font-size="20" font-weight="600" letter-spacing="2">0123456789 • !@#$%&amp;*()_+-=[]</text>
    </g>
  </g>

  <!-- Right: Tabular Numerics & Principles -->
  <g transform="translate(990, 290)">
    <rect width="810" height="690" rx="16" fill="#111310"/>
    <text x="50" y="60" fill="#C7F134" class="font-mono" font-size="13" font-weight="600">SCHEDULE &amp; TABULAR NUMERICS</text>

    <g transform="translate(50, 110)">
      <text x="0" y="0" fill="#F2F0E8" class="font-sans" font-size="22" font-weight="700">Tabular Figure Alignment</text>
      <text x="0" y="35" fill="#D7D4CA" class="font-sans" font-size="16">Ensure perfect column alignment across times and spot counts:</text>

      <!-- Table mockup -->
      <g transform="translate(0, 70)">
        <rect width="710" height="240" rx="12" fill="#1A1E19" stroke="#2D332B" stroke-width="1"/>
        <text x="30" y="45" fill="#C7F134" class="font-mono" font-size="16" font-weight="700">TIME</text>
        <text x="200" y="45" fill="#C7F134" class="font-mono" font-size="16" font-weight="700">PROGRAM</text>
        <text x="460" y="45" fill="#C7F134" class="font-mono" font-size="16" font-weight="700">COACH</text>
        <text x="640" y="45" fill="#C7F134" class="font-mono" font-size="16" font-weight="700">SPOTS</text>

        <line x1="30" y1="65" x2="680" y2="65" stroke="#2D332B" stroke-width="1"/>

        <text x="30" y="105" fill="#F2F0E8" class="font-mono" font-size="16">07:00 AM</text>
        <text x="200" y="105" fill="#F2F0E8" class="font-sans" font-size="16" font-weight="600">Practice Strength</text>
        <text x="460" y="105" fill="#D7D4CA" class="font-sans" font-size="16">Marcus Vance</text>
        <text x="640" y="105" fill="#C7F134" class="font-mono" font-size="16" font-weight="700">03</text>

        <text x="30" y="150" fill="#F2F0E8" class="font-mono" font-size="16">08:00 AM</text>
        <text x="200" y="150" fill="#F2F0E8" class="font-sans" font-size="16" font-weight="600">Practice Pace</text>
        <text x="460" y="150" fill="#D7D4CA" class="font-sans" font-size="16">Sarah Chen</text>
        <text x="640" y="150" fill="#D7D4CA" class="font-mono" font-size="16">FULL</text>

        <text x="30" y="195" fill="#F2F0E8" class="font-mono" font-size="16">09:15 AM</text>
        <text x="200" y="195" fill="#F2F0E8" class="font-sans" font-size="16" font-weight="600">Practice Reset</text>
        <text x="460" y="195" fill="#D7D4CA" class="font-sans" font-size="16">Elena Rostova</text>
        <text x="640" y="195" fill="#C7F134" class="font-mono" font-size="16" font-weight="700">08</text>
      </g>

      <g transform="translate(0, 360)">
        <text x="0" y="0" fill="#C7F134" class="font-mono" font-size="14" font-weight="700">TYPOGRAPHY PRINCIPLES</text>
        <text x="0" y="30" fill="#D7D4CA" class="font-sans" font-size="15">• Use sentence case for reading copy; avoid shouting in all-caps.</text>
        <text x="0" y="60" fill="#D7D4CA" class="font-sans" font-size="15">• Uppercase is strictly reserved for short badges ([STRENGTH], [WAITLIST]).</text>
        <text x="0" y="90" fill="#D7D4CA" class="font-sans" font-size="15">• Never reconstruct the logo with live text; always use the approved SVG vector.</text>
      </g>
    </g>
  </g>
</svg>
`;

// Slide 7: Type Hierarchy & Scale
const slide7 = `
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  ${commonDefs}
  <rect width="1920" height="1080" fill="#F2F0E8"/>

  <!-- Top Header -->
  <text x="120" y="90" fill="#5C6159" class="font-mono" font-size="14" font-weight="600" letter-spacing="2">06 / TYPE HIERARCHY &amp; SCALE</text>
  <text x="1800" y="90" fill="#5C6159" class="font-mono" font-size="14" text-anchor="end">PAGE 07 / 08</text>
  <line x1="120" y1="120" x2="1800" y2="120" stroke="#D7D4CA" stroke-width="1.5"/>

  <!-- Section Title -->
  <text x="120" y="190" fill="#111310" class="font-sans" font-size="44" font-weight="800" letter-spacing="-1">Digital &amp; Editorial Scale</text>
  <text x="120" y="235" fill="#5C6159" class="font-sans" font-size="20">Sizing, line-heights, tracking values, and usage guidelines for web and mobile interfaces.</text>

  <!-- Hierarchy Table Card -->
  <g transform="translate(120, 280)">
    <rect width="1680" height="710" rx="16" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>

    <!-- Table Header -->
    <text x="40" y="50" fill="#5C6159" class="font-mono" font-size="13" font-weight="700">ROLE</text>
    <text x="260" y="50" fill="#5C6159" class="font-mono" font-size="13" font-weight="700">SPECIFICATIONS</text>
    <text x="560" y="50" fill="#5C6159" class="font-mono" font-size="13" font-weight="700">SAMPLE RENDERING</text>
    <text x="1300" y="50" fill="#5C6159" class="font-mono" font-size="13" font-weight="700">PRIMARY USAGE</text>
    <line x1="40" y1="70" x2="1640" y2="70" stroke="#D7D4CA" stroke-width="1.5"/>

    <!-- Row 1: Display -->
    <g transform="translate(40, 120)">
      <text x="0" y="0" fill="#111310" class="font-sans" font-size="18" font-weight="700">Display</text>
      <text x="220" y="0" fill="#5C6159" class="font-mono" font-size="14">64px / 72px • 800 • -3%</text>
      <text x="520" y="0" fill="#111310" class="font-sans" font-size="40" font-weight="800" letter-spacing="-1.5">Progress is a practice.</text>
      <text x="1260" y="0" fill="#5C6159" class="font-sans" font-size="15">Hero headline, campaign panel</text>
    </g>
    <line x1="40" y1="160" x2="1640" y2="160" stroke="#F2F0E8" stroke-width="1.5"/>

    <!-- Row 2: Headline 1 -->
    <g transform="translate(40, 205)">
      <text x="0" y="0" fill="#111310" class="font-sans" font-size="18" font-weight="700">Headline 1</text>
      <text x="220" y="0" fill="#5C6159" class="font-mono" font-size="14">40px / 48px • 700 • -2%</text>
      <text x="520" y="0" fill="#111310" class="font-sans" font-size="30" font-weight="700" letter-spacing="-1">Weekly Class Schedule</text>
      <text x="1260" y="0" fill="#5C6159" class="font-sans" font-size="15">Primary page header</text>
    </g>
    <line x1="40" y1="245" x2="1640" y2="245" stroke="#F2F0E8" stroke-width="1.5"/>

    <!-- Row 3: Headline 2 -->
    <g transform="translate(40, 290)">
      <text x="0" y="0" fill="#111310" class="font-sans" font-size="18" font-weight="700">Headline 2</text>
      <text x="220" y="0" fill="#5C6159" class="font-mono" font-size="14">28px / 36px • 650 • -2%</text>
      <text x="520" y="0" fill="#111310" class="font-sans" font-size="24" font-weight="650" letter-spacing="-0.5">Strength &amp; Conditioning Track</text>
      <text x="1260" y="0" fill="#5C6159" class="font-sans" font-size="15">Major section title &amp; modal header</text>
    </g>
    <line x1="40" y1="330" x2="1640" y2="330" stroke="#F2F0E8" stroke-width="1.5"/>

    <!-- Row 4: Headline 3 -->
    <g transform="translate(40, 375)">
      <text x="0" y="0" fill="#111310" class="font-sans" font-size="18" font-weight="700">Headline 3</text>
      <text x="220" y="0" fill="#5C6159" class="font-mono" font-size="14">20px / 28px • 600 • -1%</text>
      <text x="520" y="0" fill="#111310" class="font-sans" font-size="20" font-weight="600">Practice Strength • 07:00 AM</text>
      <text x="1260" y="0" fill="#5C6159" class="font-sans" font-size="15">Class card title, module title</text>
    </g>
    <line x1="40" y1="415" x2="1640" y2="415" stroke="#F2F0E8" stroke-width="1.5"/>

    <!-- Row 5: Body -->
    <g transform="translate(40, 460)">
      <text x="0" y="0" fill="#111310" class="font-sans" font-size="18" font-weight="700">Body</text>
      <text x="220" y="0" fill="#5C6159" class="font-mono" font-size="14">16px / 24px • 400 • 0%</text>
      <text x="520" y="0" fill="#111310" class="font-sans" font-size="16">Focus on controlled compound barbell movements with tempo progression.</text>
      <text x="1260" y="0" fill="#5C6159" class="font-sans" font-size="15">Main reading text &amp; class description</text>
    </g>
    <line x1="40" y1="500" x2="1640" y2="500" stroke="#F2F0E8" stroke-width="1.5"/>

    <!-- Row 6: Body Small -->
    <g transform="translate(40, 545)">
      <text x="0" y="0" fill="#111310" class="font-sans" font-size="18" font-weight="700">Body Small</text>
      <text x="220" y="0" fill="#5C6159" class="font-mono" font-size="14">14px / 20px • 450 • 0%</text>
      <text x="520" y="0" fill="#5C6159" class="font-sans" font-size="14">Cancellation cutoff is 2 hours prior to session start without penalty.</text>
      <text x="1260" y="0" fill="#5C6159" class="font-sans" font-size="15">Helper copy, fine print, metadata</text>
    </g>
    <line x1="40" y1="585" x2="1640" y2="585" stroke="#F2F0E8" stroke-width="1.5"/>

    <!-- Row 7: Label / Badge -->
    <g transform="translate(40, 630)">
      <text x="0" y="0" fill="#111310" class="font-sans" font-size="18" font-weight="700">Label / Badge</text>
      <text x="220" y="0" fill="#5C6159" class="font-mono" font-size="14">12px / 16px • 700 • +5%</text>
      <text x="520" y="0" fill="#111310" class="font-mono" font-size="13" font-weight="700" letter-spacing="1">[STRENGTH]  [WAITLIST #2]  [BOOKED]</text>
      <text x="1260" y="0" fill="#5C6159" class="font-sans" font-size="15">Category pills, status chips, filters</text>
    </g>
  </g>
</svg>
`;

// Slide 8: Offer & UI Context
const slide8 = `
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  ${commonDefs}
  <rect width="1920" height="1080" fill="#F2F0E8"/>

  <!-- Top Header -->
  <text x="120" y="90" fill="#5C6159" class="font-mono" font-size="14" font-weight="600" letter-spacing="2">07 / OFFER ARCHITECTURE &amp; UI CONTEXT</text>
  <text x="1800" y="90" fill="#5C6159" class="font-mono" font-size="14" text-anchor="end">PAGE 08 / 08</text>
  <line x1="120" y1="120" x2="1800" y2="120" stroke="#D7D4CA" stroke-width="1.5"/>

  <!-- Section Title -->
  <text x="120" y="190" fill="#111310" class="font-sans" font-size="44" font-weight="800" letter-spacing="-1">Programs &amp; Live UI Components</text>
  <text x="120" y="235" fill="#5C6159" class="font-sans" font-size="20">How the brand personality translates into clear, scannable class cards and interface components.</text>

  <!-- Left: Program Taxonomy -->
  <g transform="translate(120, 280)">
    <rect width="780" height="710" rx="16" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>
    <text x="40" y="55" fill="#5C6159" class="font-mono" font-size="13" font-weight="700">CORE PROGRAM TAXONOMY</text>

    <!-- Program 1 -->
    <g transform="translate(40, 95)">
      <rect width="700" height="125" rx="12" fill="#F2F0E8"/>
      <rect x="20" y="20" width="100" height="24" rx="4" fill="#111310"/>
      <text x="32" y="36" fill="#C7F134" class="font-mono" font-size="11" font-weight="700">STRENGTH</text>
      <text x="135" y="37" fill="#111310" class="font-sans" font-size="20" font-weight="700">Practice Strength</text>
      <text x="590" y="37" fill="#5C6159" class="font-mono" font-size="13">45–50 MIN</text>
      <text x="20" y="75" fill="#5C6159" class="font-sans" font-size="14">Compound barbell and dumbbell mechanics with structured progressive overload.</text>
      <text x="20" y="100" fill="#111310" class="font-sans" font-size="13" font-weight="600">Intensity: Moderate to High • All levels</text>
    </g>

    <!-- Program 2 -->
    <g transform="translate(40, 240)">
      <rect width="700" height="125" rx="12" fill="#F2F0E8"/>
      <rect x="20" y="20" width="70" height="24" rx="4" fill="#111310"/>
      <text x="33" y="36" fill="#C7F134" class="font-mono" font-size="11" font-weight="700">PACE</text>
      <text x="105" y="37" fill="#111310" class="font-sans" font-size="20" font-weight="700">Practice Pace</text>
      <text x="590" y="37" fill="#5C6159" class="font-mono" font-size="13">45 MIN</text>
      <text x="20" y="75" fill="#5C6159" class="font-sans" font-size="14">Aerobic capacity intervals, rowers, ski ergs, and dynamic bodyweight circuits.</text>
      <text x="20" y="100" fill="#111310" class="font-sans" font-size="13" font-weight="600">Intensity: High • Cardiovascular stamina</text>
    </g>

    <!-- Program 3 -->
    <g transform="translate(40, 385)">
      <rect width="700" height="125" rx="12" fill="#F2F0E8"/>
      <rect x="20" y="20" width="75" height="24" rx="4" fill="#111310"/>
      <text x="32" y="36" fill="#C7F134" class="font-mono" font-size="11" font-weight="700">RESET</text>
      <text x="110" y="37" fill="#111310" class="font-sans" font-size="20" font-weight="700">Practice Reset</text>
      <text x="590" y="37" fill="#5C6159" class="font-mono" font-size="13">40 MIN</text>
      <text x="20" y="75" fill="#5C6159" class="font-sans" font-size="14">Joint mobility, posterior chain decompression, and nervous system down-regulation.</text>
      <text x="20" y="100" fill="#111310" class="font-sans" font-size="13" font-weight="600">Intensity: Low • Active recovery</text>
    </g>

    <!-- Program 4 -->
    <g transform="translate(40, 530)">
      <rect width="700" height="125" rx="12" fill="#F2F0E8"/>
      <rect x="20" y="20" width="120" height="24" rx="4" fill="#111310"/>
      <text x="32" y="36" fill="#C7F134" class="font-mono" font-size="11" font-weight="700">OPEN FLOOR</text>
      <text x="155" y="37" fill="#111310" class="font-sans" font-size="20" font-weight="700">Practice Open Floor</text>
      <text x="590" y="37" fill="#5C6159" class="font-mono" font-size="13">60 MIN</text>
      <text x="20" y="75" fill="#5C6159" class="font-sans" font-size="14">Supervised open practice session under coach guidance for individual programs.</text>
      <text x="20" y="100" fill="#111310" class="font-sans" font-size="13" font-weight="600">Intensity: Self-paced • Independent work</text>
    </g>
  </g>

  <!-- Right: Live Class Card Mockup -->
  <g transform="translate(940, 280)">
    <rect width="860" height="710" rx="16" fill="#111310"/>
    <text x="50" y="55" fill="#C7F134" class="font-mono" font-size="13" font-weight="700">INTERACTIVE CLASS CARD COMPONENT</text>

    <!-- Sample Card 1: Available -->
    <g transform="translate(50, 95)">
      <rect width="760" height="250" rx="16" fill="#1A1E19" stroke="#2D332B" stroke-width="1.5"/>
      <rect x="30" y="28" width="95" height="24" rx="4" fill="#111310"/>
      <text x="42" y="44" fill="#C7F134" class="font-mono" font-size="11" font-weight="700">STRENGTH</text>
      <text x="640" y="45" fill="#C7F134" class="font-mono" font-size="15" font-weight="700">07:00 AM (45M)</text>

      <text x="30" y="95" fill="#F2F0E8" class="font-sans" font-size="26" font-weight="700">Practice Strength</text>
      <text x="30" y="130" fill="#D7D4CA" class="font-sans" font-size="16">Coach Marcus Vance • Floor A</text>

      <line x1="30" y1="165" x2="730" y2="165" stroke="#2D332B" stroke-width="1"/>

      <circle cx="40" cy="205" r="5" fill="#C7F134"/>
      <text x="55" y="210" fill="#C7F134" class="font-mono" font-size="14" font-weight="600">3 SPOTS REMAINING</text>

      <!-- Button -->
      <rect x="580" y="180" width="150" height="48" rx="8" fill="#C7F134"/>
      <text x="615" y="210" fill="#111310" class="font-sans" font-size="15" font-weight="800">Book Session</text>
    </g>

    <!-- Sample Card 2: Full / Waitlist -->
    <g transform="translate(50, 380)">
      <rect width="760" height="250" rx="16" fill="#1A1E19" stroke="#2D332B" stroke-width="1.5"/>
      <rect x="30" y="28" width="65" height="24" rx="4" fill="#111310"/>
      <text x="42" y="44" fill="#C7F134" class="font-mono" font-size="11" font-weight="700">PACE</text>
      <text x="640" y="45" fill="#D7D4CA" class="font-mono" font-size="15" font-weight="700">08:00 AM (45M)</text>

      <text x="30" y="95" fill="#F2F0E8" class="font-sans" font-size="26" font-weight="700">Practice Pace</text>
      <text x="30" y="130" fill="#D7D4CA" class="font-sans" font-size="16">Coach Sarah Chen • Turf 1</text>

      <line x1="30" y1="165" x2="730" y2="165" stroke="#2D332B" stroke-width="1"/>

      <circle cx="40" cy="205" r="5" fill="#7A4B00"/>
      <text x="55" y="210" fill="#D7D4CA" class="font-mono" font-size="14" font-weight="600">FULL • 2 ON WAITLIST</text>

      <!-- Button -->
      <rect x="570" y="180" width="160" height="48" rx="8" fill="#222620" stroke="#7A4B00" stroke-width="1.5"/>
      <text x="600" y="210" fill="#F2F0E8" class="font-sans" font-size="15" font-weight="700">Join Waitlist</text>
    </g>
  </g>
</svg>
`;

// Save all individual slides
fs.writeFileSync(path.join(outDir, '01_cover.svg'), slide1.trim());
fs.writeFileSync(path.join(outDir, '02_key_elements_strategy.svg'), slide2.trim());
fs.writeFileSync(path.join(outDir, '03_logo_system.svg'), slide3.trim());
fs.writeFileSync(path.join(outDir, '04_color_palette.svg'), slide4.trim());
fs.writeFileSync(path.join(outDir, '05_shades_and_semantic_states.svg'), slide5.trim());
fs.writeFileSync(path.join(outDir, '06_typography_family.svg'), slide6.trim());
fs.writeFileSync(path.join(outDir, '07_type_hierarchy.svg'), slide7.trim());
fs.writeFileSync(path.join(outDir, '08_offer_and_ui_context.svg'), slide8.trim());

// Master all-in-one horizontal board (15360 x 1080 or 4x2 grid of 7680 x 2160)
const masterBoard = `
<svg xmlns="http://www.w3.org/2000/svg" width="7680" height="2280" viewBox="0 0 7680 2280">
  <rect width="7680" height="2280" fill="#0D0E0C"/>
  <!-- Row 1 -->
  <g transform="translate(60, 60)">${slide1}</g>
  <g transform="translate(2020, 60)">${slide2}</g>
  <g transform="translate(3980, 60)">${slide3}</g>
  <g transform="translate(5940, 60)">${slide4}</g>
  <!-- Row 2 -->
  <g transform="translate(60, 1180)">${slide5}</g>
  <g transform="translate(2020, 1180)">${slide6}</g>
  <g transform="translate(3980, 1180)">${slide7}</g>
  <g transform="translate(5940, 1180)">${slide8}</g>
</svg>
`;
fs.writeFileSync(path.join(outDir, 'practice-brand-presentation-master-board.svg'), masterBoard.trim());

console.log('Successfully generated all 8 Figma presentation slide SVGs in docs/brand/figma/!');
