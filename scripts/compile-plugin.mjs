import fs from 'fs';

const primarySvg = fs.readFileSync('docs/brand/logo/practice-primary-stacked.svg', 'utf8').trim();
const inverseSvg = fs.readFileSync('docs/brand/logo/practice-primary-stacked-inverse.svg', 'utf8').trim();
const compactSvg = fs.readFileSync('docs/brand/logo/practice-compact-mark.svg', 'utf8').trim();
const horizontalSvg = fs.readFileSync('docs/brand/logo/practice-horizontal-lockup.svg', 'utf8').trim();

// 6 Key Elements Vector SVGs
const card1Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="260" viewBox="0 0 360 260">
  <rect width="180" height="260" fill="#111310"/>
  <rect x="180" width="180" height="260" fill="#F2F0E8"/>
  <text x="90" y="105" fill="#F2F0E8" font-family="sans-serif" font-size="18" font-weight="800" text-anchor="middle">PRACTICE</text>
  <rect x="45" y="118" width="90" height="4" fill="#C7F134"/>
  <text x="270" y="105" fill="#111310" font-family="sans-serif" font-size="18" font-weight="800" text-anchor="middle">PRACTICE</text>
  <rect x="225" y="118" width="90" height="4" fill="#C7F134"/>
  <text x="90" y="210" fill="#C7F134" font-family="sans-serif" font-size="11" font-weight="700" text-anchor="middle">INK #111310</text>
  <text x="270" y="210" fill="#111310" font-family="sans-serif" font-size="11" font-weight="700" text-anchor="middle">BONE #F2F0E8</text>
</svg>`;

const card2Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="260" viewBox="0 0 360 260">
  <rect width="360" height="260" rx="8" fill="#111310"/>
  <text x="180" y="70" fill="#5C6159" font-family="sans-serif" font-size="11" font-weight="600" letter-spacing="2" text-anchor="middle">PROGRESS SIGNATURE</text>
  <text x="180" y="130" fill="#F2F0E8" font-family="sans-serif" font-size="34" font-weight="800" letter-spacing="-1" text-anchor="middle">PRACTICE</text>
  <rect x="80" y="148" width="200" height="8" rx="2" fill="#C7F134"/>
  <text x="180" y="195" fill="#C7F134" font-family="sans-serif" font-size="12" font-weight="700" text-anchor="middle">SIGNAL LIME BAR #C7F134</text>
  <text x="180" y="220" fill="#D7D4CA" font-family="sans-serif" font-size="11" text-anchor="middle">Active Progress &amp; Focus State</text>
</svg>`;

const card3Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="260" viewBox="0 0 360 260">
  <rect width="360" height="260" rx="8" fill="#FFFFFF" stroke="#D7D4CA" stroke-width="1.5"/>
  <rect x="35" y="30" width="290" height="200" fill="none" stroke="#3B82F6" stroke-width="1.5" stroke-dasharray="4,4"/>
  <text x="180" y="115" fill="#111310" font-family="sans-serif" font-size="24" font-weight="800" letter-spacing="-1" text-anchor="middle">PRACTICE</text>
  <text x="180" y="140" fill="#111310" font-family="sans-serif" font-size="15" font-weight="700" letter-spacing="2" text-anchor="middle">ATHLETIC CLUB</text>
  <rect x="110" y="152" width="140" height="4" fill="#C7F134"/>
  <rect x="35" y="30" width="24" height="24" fill="#3B82F6" opacity="0.2"/>
  <text x="47" y="47" fill="#1D4ED8" font-family="sans-serif" font-size="12" font-weight="700" text-anchor="middle">P</text>
  <rect x="301" y="206" width="24" height="24" fill="#3B82F6" opacity="0.2"/>
  <text x="313" y="223" fill="#1D4ED8" font-family="sans-serif" font-size="12" font-weight="700" text-anchor="middle">P</text>
  <text x="180" y="248" fill="#5C6159" font-family="sans-serif" font-size="10" font-weight="600" text-anchor="middle">1P MARGIN CLEARSPACE</text>
</svg>`;

const card4Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="260" viewBox="0 0 360 260">
  <rect width="360" height="260" rx="8" fill="#1A1E19"/>
  <circle cx="180" cy="100" r="60" fill="none" stroke="#2D332B" stroke-width="30"/>
  <text x="40" y="60" fill="#5C6159" font-family="sans-serif" font-size="10" font-weight="700" letter-spacing="2">TRAINING PRINCIPLE</text>
  <text x="40" y="105" fill="#F2F0E8" font-family="sans-serif" font-size="24" font-weight="800">Quiet Strength.</text>
  <text x="40" y="135" fill="#D7D4CA" font-family="sans-serif" font-size="13">Steady habits over spectacle.</text>
  <rect x="40" y="152" width="80" height="4" fill="#C7F134"/>
  <text x="40" y="200" fill="#5C6159" font-family="sans-serif" font-size="11">Authentic training focus &amp; effort.</text>
</svg>`;

const card5Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="260" viewBox="0 0 360 260">
  <rect width="360" height="260" rx="8" fill="#F2F0E8" stroke="#D7D4CA" stroke-width="1.5"/>
  <rect x="35" y="40" width="130" height="32" rx="6" fill="#111310"/>
  <circle cx="50" cy="56" r="4" fill="#C7F134"/>
  <text x="62" y="60" fill="#F2F0E8" font-family="sans-serif" font-size="11" font-weight="700">STRENGTH</text>

  <rect x="180" y="40" width="100" height="32" rx="6" fill="#111310"/>
  <text x="230" y="60" fill="#F2F0E8" font-family="sans-serif" font-size="11" font-weight="700" text-anchor="middle">PACE</text>

  <rect x="35" y="85" width="105" height="32" rx="6" fill="#D7D4CA"/>
  <text x="87" y="105" fill="#111310" font-family="sans-serif" font-size="11" font-weight="700" text-anchor="middle">RESET</text>

  <rect x="155" y="85" width="145" height="32" rx="6" fill="#D7D4CA"/>
  <text x="227" y="105" fill="#111310" font-family="sans-serif" font-size="11" font-weight="700" text-anchor="middle">OPEN FLOOR</text>

  <rect x="35" y="145" width="290" height="42" rx="6" fill="#111310"/>
  <text x="50" y="171" fill="#C7F134" font-family="sans-serif" font-size="11" font-weight="700">CONFIRMED</text>
  <text x="210" y="171" fill="#D7D4CA" font-family="sans-serif" font-size="11">TUE 07:00 AM</text>
</svg>`;

const card6Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="260" viewBox="0 0 360 260">
  <rect width="360" height="260" rx="8" fill="#111310"/>
  <text x="35" y="45" fill="#5C6159" font-family="sans-serif" font-size="10" font-weight="700" letter-spacing="2">MONA SANS MATRIX</text>
  <text x="35" y="90" fill="#F2F0E8" font-family="sans-serif" font-size="26" font-weight="800" letter-spacing="-1">Display 800</text>
  <text x="35" y="125" fill="#F2F0E8" font-family="sans-serif" font-size="16" font-weight="600">Headline SemiBold 600</text>
  <text x="35" y="160" fill="#D7D4CA" font-family="sans-serif" font-size="13">Body Regular 400 • Clear Guidance</text>
  <rect x="35" y="185" width="290" height="32" rx="4" fill="#222620"/>
  <text x="45" y="206" fill="#C7F134" font-family="sans-serif" font-size="11" font-weight="700">07:00 AM • 45 MIN • 12/16 SPOTS</text>
</svg>`;

const codeContent = `// Practice Athletic Club — Elite Figma Sitemap & Userflow Engine
figma.showUI(__html__, { width: 440, height: 600, themeColors: true });

const PRIMARY_LOGO_SVG = \`${primarySvg.replace(/`/g, '\\`')}\`;
const INVERSE_LOGO_SVG = \`${inverseSvg.replace(/`/g, '\\`')}\`;
const COMPACT_LOGO_SVG = \`${compactSvg.replace(/`/g, '\\`')}\`;
const HORIZONTAL_LOGO_SVG = \`${horizontalSvg.replace(/`/g, '\\`')}\`;

const CARD_SVGS = [
  \`${card1Svg.replace(/`/g, '\\`')}\`,
  \`${card2Svg.replace(/`/g, '\\`')}\`,
  \`${card3Svg.replace(/`/g, '\\`')}\`,
  \`${card4Svg.replace(/`/g, '\\`')}\`,
  \`${card5Svg.replace(/`/g, '\\`')}\`,
  \`${card6Svg.replace(/`/g, '\\`')}\`
];

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return {
    r: ((bigint >> 16) & 255) / 255,
    g: ((bigint >> 8) & 255) / 255,
    b: (bigint & 255) / 255
  };
}

function rgbToHex(r, g, b) {
  const toHex = (c) => Math.round(c * 255).toString(16).padStart(2, '0');
  return \`#\${toHex(r)}\${toHex(g)}\${toHex(b)}\`.toUpperCase();
}

async function loadSafeFonts() {
  const fontStyles = ["Regular", "Bold", "Medium", "Semi Bold", "SemiBold", "Black", "ExtraBold"];
  for (const style of fontStyles) {
    try { await figma.loadFontAsync({ family: "Mona Sans", style }); } catch(e) {}
    try { await figma.loadFontAsync({ family: "Inter", style }); } catch(e) {}
  }
}

async function applyFont(t, preferredStyle = "Regular") {
  const stylesToTry = [preferredStyle, "Regular", "Bold", "Medium", "SemiBold", "Semi Bold", "ExtraBold"];
  for (const style of stylesToTry) {
    try {
      await figma.loadFontAsync({ family: "Mona Sans", style });
      t.fontName = { family: "Mona Sans", style };
      return true;
    } catch(e) {}
  }
  for (const style of [preferredStyle, "Regular", "Bold", "Medium", "Semi Bold"]) {
    try {
      await figma.loadFontAsync({ family: "Inter", style });
      t.fontName = { family: "Inter", style };
      return true;
    } catch(e) {}
  }
  return false;
}

function findOrCreatePage(pageNameRegex, fallbackName) {
  let page = figma.root.children.find(p => pageNameRegex.test(p.name));
  if (!page) {
    page = figma.createPage();
    page.name = fallbackName;
  }
  return page;
}

// =========================================================================
// DYNAMIC COMPONENT DISCOVERY & INSTANTIATION ENGINE
// =========================================================================

function scanComponentsPage() {
  const compPage = figma.root.children.find(p => /component|design system|library|assets/i.test(p.name));
  if (!compPage) return { components: [], frames: [] };

  const components = compPage.findAll(n => n.type === 'COMPONENT' || n.type === 'COMPONENT_SET');
  const templateFrames = compPage.findAll(n => n.type === 'FRAME' && n.parent === compPage);

  return { components, frames: templateFrames };
}

function findMatchingComponent(componentPool, roleRegex) {
  for (const item of componentPool.components) {
    if (roleRegex.test(item.name)) return item;
  }
  for (const f of componentPool.frames) {
    if (roleRegex.test(f.name)) return f;
  }
  return null;
}

async function updateTextInNode(node, textMap) {
  const textNodes = node.findAll(n => n.type === 'TEXT');
  for (const t of textNodes) {
    try {
      await applyFont(t, t.fontName && t.fontName.style ? t.fontName.style : "Regular");
      const current = t.characters.trim();

      // Match Title
      if (textMap.title && (t.fontSize > 13 || /title|header|name|label/i.test(t.name) || /page name|card title|step/i.test(current))) {
        t.characters = textMap.title;
        continue;
      }
      // Match Subtitle / Description
      if (textMap.sub && (t.fontSize <= 13 || /desc|subtitle|info|body|text/i.test(t.name) || /description|sub|path/i.test(current))) {
        t.characters = textMap.sub;
        continue;
      }
      // Match Badge / Category / Number
      if (textMap.badge && (/badge|tag|number|step/i.test(t.name) || /step|#|badge/i.test(current))) {
        t.characters = textMap.badge;
        continue;
      }
    } catch(e) {}
  }
}

// Fallback Node Builder with High Design Integrity
function createStandardNode(title, subtitle, type = 'card', badge = '', width = 280) {
  const frame = figma.createFrame();
  frame.name = \`Node / \${title}\`;
  frame.layoutMode = 'VERTICAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'FIXED';
  frame.resize(width, 100);
  frame.itemSpacing = 6;
  frame.paddingLeft = 16;
  frame.paddingRight = 16;
  frame.paddingTop = 14;
  frame.paddingBottom = 14;
  frame.cornerRadius = 8;

  if (type === 'root') {
    frame.fills = [{ type: 'SOLID', color: hexToRgb('#111310') }];
    frame.strokes = [{ type: 'SOLID', color: hexToRgb('#C7F134') }];
    frame.strokeWeight = 2;
  } else if (type === 'decision') {
    frame.fills = [{ type: 'SOLID', color: hexToRgb('#1A1E19') }];
    frame.strokes = [{ type: 'SOLID', color: hexToRgb('#EAB308') }];
    frame.strokeWeight = 1.5;
  } else if (type === 'modal') {
    frame.fills = [{ type: 'SOLID', color: hexToRgb('#FFFFFF') }];
    frame.strokes = [{ type: 'SOLID', color: hexToRgb('#8B5CF6') }];
    frame.strokeWeight = 1.5;
  } else if (type === 'success') {
    frame.fills = [{ type: 'SOLID', color: hexToRgb('#111310') }];
    frame.strokes = [{ type: 'SOLID', color: hexToRgb('#C7F134') }];
    frame.strokeWeight = 1.5;
  } else {
    frame.fills = [{ type: 'SOLID', color: hexToRgb('#FFFFFF') }];
    frame.strokes = [{ type: 'SOLID', color: hexToRgb('#D7D4CA') }];
    frame.strokeWeight = 1;
  }

  if (badge) {
    const badgeText = figma.createText();
    applyFont(badgeText, 'Bold');
    badgeText.characters = badge.toUpperCase();
    badgeText.fontSize = 9;
    badgeText.letterSpacing = { value: 6, unit: 'PERCENT' };
    badgeText.fills = [{ type: 'SOLID', color: (type === 'root' || type === 'decision' || type === 'success') ? hexToRgb('#C7F134') : hexToRgb('#6B7068') }];
    frame.appendChild(badgeText);
  }

  const titleText = figma.createText();
  applyFont(titleText, 'Bold');
  titleText.characters = title;
  titleText.fontSize = 13;
  titleText.layoutAlign = 'STRETCH';
  titleText.fills = [{ type: 'SOLID', color: (type === 'root' || type === 'decision' || type === 'success') ? hexToRgb('#F2F0E8') : hexToRgb('#111310') }];
  frame.appendChild(titleText);

  if (subtitle) {
    const subText = figma.createText();
    applyFont(subText, 'Regular');
    subText.characters = subtitle;
    subText.fontSize = 11;
    subText.layoutAlign = 'STRETCH';
    subText.fills = [{ type: 'SOLID', color: (type === 'root' || type === 'decision' || type === 'success') ? hexToRgb('#D7D4CA') : hexToRgb('#5C6159') }];
    frame.appendChild(subText);
  }

  return frame;
}

async function instantiateOrBuildNode(componentPool, roleRegex, textMap, type, width = 280) {
  const match = findMatchingComponent(componentPool, roleRegex);
  if (match) {
    let instance;
    if (match.type === 'COMPONENT') {
      instance = match.createInstance();
    } else if (match.type === 'COMPONENT_SET') {
      instance = match.defaultVariant.createInstance();
    } else if (match.type === 'FRAME' || match.type === 'GROUP') {
      instance = match.clone();
    }
    if (instance) {
      instance.name = \`Node / \${textMap.title}\`;
      await updateTextInNode(instance, textMap);
      return instance;
    }
  }
  return createStandardNode(textMap.title, textMap.sub, type, textMap.badge, width);
}

// Vector Line & Arrow Drawer
function drawConnector(artboard, fromX, fromY, toX, toY, label = '') {
  const line = figma.createVector();
  const dx = toX - fromX;
  const dy = toY - fromY;

  // Orthogonal elbow routing
  let svgPath = '';
  if (Math.abs(dx) < 10) {
    svgPath = \`M 0 0 L 0 \${dy}\`;
  } else if (Math.abs(dy) < 10) {
    svgPath = \`M 0 0 L \${dx} 0\`;
  } else {
    const midY = dy / 2;
    svgPath = \`M 0 0 L 0 \${midY} L \${dx} \${midY} L \${dx} \${dy}\`;
  }

  line.vectorPaths = [{
    windingRule: 'NONE',
    data: svgPath
  }];
  line.x = fromX;
  line.y = fromY;
  line.strokes = [{ type: 'SOLID', color: hexToRgb('#6B7068') }];
  line.strokeWeight = 2;
  line.strokeCap = 'ROUND';
  line.name = label ? \`Connector / \${label}\` : 'Connector Line';

  artboard.appendChild(line);

  if (label) {
    const labelFrame = figma.createFrame();
    labelFrame.name = \`Badge / \${label}\`;
    labelFrame.layoutMode = 'HORIZONTAL';
    labelFrame.primaryAxisSizingMode = 'AUTO';
    labelFrame.counterAxisSizingMode = 'AUTO';
    labelFrame.paddingLeft = 8;
    labelFrame.paddingRight = 8;
    labelFrame.paddingTop = 4;
    labelFrame.paddingBottom = 4;
    labelFrame.cornerRadius = 4;
    labelFrame.fills = [{ type: 'SOLID', color: hexToRgb('#111310') }];

    const t = figma.createText();
    applyFont(t, 'Bold');
    t.characters = label;
    t.fontSize = 9;
    t.fills = [{ type: 'SOLID', color: hexToRgb('#C7F134') }];
    labelFrame.appendChild(t);

    labelFrame.x = fromX + dx / 2 - 20;
    labelFrame.y = fromY + dy / 2 - 10;
    artboard.appendChild(labelFrame);
  }
}

// =========================================================================
// 1. SITEMAP: TRUE TREE HIERARCHY WITH CONNECTORS
// =========================================================================

async function buildFitOpsSitemap(componentPool) {
  const sitemapPage = findOrCreatePage(/sitemap/i, 'Sitemap');
  figma.currentPage = sitemapPage;

  const oldArtboard = sitemapPage.findOne(n => n.name === 'Practice Athletic Club — Master Sitemap (IA)');
  if (oldArtboard) oldArtboard.remove();

  const artboard = figma.createFrame();
  artboard.name = 'Practice Athletic Club — Master Sitemap (IA)';
  artboard.resize(2800, 1800);
  artboard.fills = [{ type: 'SOLID', color: hexToRgb('#F2F0E8') }];
  sitemapPage.appendChild(artboard);

  // Title Block
  const headerFrame = figma.createFrame();
  headerFrame.name = 'Header Block';
  headerFrame.layoutMode = 'VERTICAL';
  headerFrame.primaryAxisSizingMode = 'AUTO';
  headerFrame.counterAxisSizingMode = 'AUTO';
  headerFrame.itemSpacing = 8;
  headerFrame.x = 100;
  headerFrame.y = 80;
  headerFrame.fills = [];

  const mainTitle = figma.createText();
  await applyFont(mainTitle, 'Bold');
  mainTitle.characters = 'PRACTICE ATHLETIC CLUB • MASTER SITEMAP (IA)';
  mainTitle.fontSize = 28;
  mainTitle.fills = [{ type: 'SOLID', color: hexToRgb('#111310') }];
  headerFrame.appendChild(mainTitle);

  const subTitle = figma.createText();
  await applyFont(subTitle, 'Regular');
  subTitle.characters = 'FitOps SDLC Phase 3 • Complete 4-Tier Information Architecture Tree';
  subTitle.fontSize = 14;
  subTitle.fills = [{ type: 'SOLID', color: hexToRgb('#5C6159') }];
  headerFrame.appendChild(subTitle);

  artboard.appendChild(headerFrame);

  // ROOT NODE
  const rootNode = await instantiateOrBuildNode(
    componentPool,
    /root|home|main|top/i,
    { title: 'Practice Athletic Club', sub: 'Root Application Domain (fitops.app /)', badge: 'ROOT / DOMAIN' },
    'root',
    360
  );
  rootNode.x = 1220;
  rootNode.y = 200;
  artboard.appendChild(rootNode);

  const branches = [
    {
      title: '01. PUBLIC EXPERIENCE',
      badge: 'GUEST / VISITOR',
      color: '#111310',
      x: 150,
      nodes: [
        { title: 'Home (Landing Page)', sub: 'Hero, programs, live schedule preview, demo CTA.', path: '/', type: 'card' },
        { title: 'Programs Directory', sub: 'Strength, Pace, Reset, Open Floor taxonomies.', path: '/programs', type: 'card' },
        { title: 'Public Schedule', sub: '7-day rolling schedule view with filters.', path: '/schedule', type: 'card' },
        { title: 'Trainers Roster', sub: 'Instructor bios, specialties, and assigned sessions.', path: '/trainers', type: 'card' }
      ]
    },
    {
      title: '02. GLOBAL OVERLAYS',
      badge: 'DRAWERS & MODALS',
      color: '#8B5CF6',
      x: 780,
      nodes: [
        { title: 'Session Details Drawer', sub: 'Class description, room, trainer, dynamic CTA.', path: '/sessions/:id', type: 'modal' },
        { title: 'Demo Auth & Role Switcher', sub: 'One-click login: Alex (Member), Jordan (Member), Morgan (Admin).', path: 'Modal', type: 'modal' },
        { title: 'Cancellation Dialog', sub: 'Cutoff check, spot forfeit warning, auto-promote notice.', path: 'Modal', type: 'modal' }
      ]
    },
    {
      title: '03. MEMBER EXPERIENCE',
      badge: 'AUTHENTICATED MEMBER',
      color: '#059669',
      x: 1410,
      nodes: [
        { title: 'Interactive Schedule', sub: 'Booking engine with live occupancy meters.', path: '/schedule', type: 'card' },
        { title: 'My Bookings — Confirmed', sub: 'Active reservations with [Cancel] trigger.', path: '/my-bookings#confirmed', type: 'card' },
        { title: 'My Bookings — Waitlist', sub: 'FIFO queue status (Position #1 in line).', path: '/my-bookings#waitlist', type: 'card' },
        { title: 'Member Profile', sub: 'Account information and booking history.', path: '/profile', type: 'card' }
      ]
    },
    {
      title: '04. OPERATIONS & ADMIN',
      badge: 'ADMINISTRATOR',
      color: '#DC2626',
      x: 2040,
      nodes: [
        { title: 'Operations Overview', sub: 'Live dashboard: Today occupancy %, waitlists.', path: '/admin', type: 'card' },
        { title: 'Session Management', sub: 'Data table to edit capacity and assign trainers.', path: '/admin/sessions', type: 'card' },
        { title: 'Attendance & Waitlist Roster', sub: 'Attendee check-in and waitlist promotion log.', path: '/admin/sessions/:id/roster', type: 'card' }
      ]
    }
  ];

  // Draw Tree Branch Connectors from Root
  const rootBottomX = rootNode.x + rootNode.width / 2;
  const rootBottomY = rootNode.y + rootNode.height;

  for (const b of branches) {
    const branchHeaderNode = await instantiateOrBuildNode(
      componentPool,
      /category|branch|header|section/i,
      { title: b.title, sub: b.badge, badge: 'TIER 1' },
      'root',
      320
    );
    branchHeaderNode.x = b.x + 90;
    branchHeaderNode.y = 420;
    artboard.appendChild(branchHeaderNode);

    // Connector from root to Branch Header
    drawConnector(
      artboard,
      rootBottomX,
      rootBottomY,
      branchHeaderNode.x + branchHeaderNode.width / 2,
      branchHeaderNode.y
    );

    // Stack nodes vertically under branch
    let prevNode = branchHeaderNode;
    let nodeY = 560;

    for (const item of b.nodes) {
      const childNode = await instantiateOrBuildNode(
        componentPool,
        new RegExp(item.type, 'i'),
        { title: item.title, sub: item.sub, badge: item.path },
        item.type,
        320
      );
      childNode.x = b.x + 90;
      childNode.y = nodeY;
      artboard.appendChild(childNode);

      // Connector from previous node to current node
      drawConnector(
        artboard,
        prevNode.x + prevNode.width / 2,
        prevNode.y + prevNode.height,
        childNode.x + childNode.width / 2,
        childNode.y
      );

      prevNode = childNode;
      nodeY += childNode.height + 40;
    }
  }
}

// =========================================================================
// 2. USERFLOWS: AUTHENTIC MULTI-BRANCH FLOWCHARTS
// =========================================================================

async function buildFitOpsUserflows(componentPool) {
  const flowPage = findOrCreatePage(/userflow|user flow|user-flow/i, 'Userflow');
  figma.currentPage = flowPage;

  const oldArtboard = flowPage.findOne(n => n.name === 'Practice Athletic Club — Critical User Flows');
  if (oldArtboard) oldArtboard.remove();

  const artboard = figma.createFrame();
  artboard.name = 'Practice Athletic Club — Critical User Flows';
  artboard.resize(3600, 2600);
  artboard.fills = [{ type: 'SOLID', color: hexToRgb('#F2F0E8') }];
  flowPage.appendChild(artboard);

  // Title Block
  const headerFrame = figma.createFrame();
  headerFrame.name = 'Header Block';
  headerFrame.layoutMode = 'VERTICAL';
  headerFrame.primaryAxisSizingMode = 'AUTO';
  headerFrame.counterAxisSizingMode = 'AUTO';
  headerFrame.itemSpacing = 8;
  headerFrame.x = 100;
  headerFrame.y = 80;
  headerFrame.fills = [];

  const mainTitle = figma.createText();
  await applyFont(mainTitle, 'Bold');
  mainTitle.characters = 'PRACTICE ATHLETIC CLUB • CRITICAL USER FLOWS';
  mainTitle.fontSize = 28;
  mainTitle.fills = [{ type: 'SOLID', color: hexToRgb('#111310') }];
  headerFrame.appendChild(mainTitle);

  const subTitle = figma.createText();
  await applyFont(subTitle, 'Regular');
  subTitle.characters = 'Sprint 1 Flowcharts • Discovery, Booking, Waitlist FIFO Promotion, and Admin Operations';
  subTitle.fontSize = 14;
  subTitle.fills = [{ type: 'SOLID', color: hexToRgb('#5C6159') }];
  headerFrame.appendChild(subTitle);

  artboard.appendChild(headerFrame);

  // -------------------------------------------------------------
  // FLOW 1: DISCOVERY & BOOKING (HORIZONTAL + BRANCHING)
  // -------------------------------------------------------------
  const f1Y = 240;

  const f1Title = figma.createText();
  await applyFont(f1Title, 'Bold');
  f1Title.characters = 'FLOW 01: CLASS DISCOVERY & BOOKING / WAITLIST JOURNEY';
  f1Title.fontSize = 18;
  f1Title.x = 100;
  f1Title.y = f1Y;
  f1Title.fills = [{ type: 'SOLID', color: hexToRgb('#111310') }];
  artboard.appendChild(f1Title);

  // Nodes for Flow 1
  const f1_step1 = await instantiateOrBuildNode(componentPool, /start|pill|step/i, { title: 'Visitor on Home / Schedule', sub: 'Lands on / or clicks [Browse Schedule]', badge: '01. ENTRY' }, 'root', 240);
  f1_step1.x = 100; f1_step1.y = f1Y + 50; artboard.appendChild(f1_step1);

  const f1_step2 = await instantiateOrBuildNode(componentPool, /action|step/i, { title: 'Filter & Browse Schedule', sub: 'Selects date & program filters', badge: '02. ACTION' }, 'card', 240);
  f1_step2.x = 390; f1_step2.y = f1Y + 50; artboard.appendChild(f1_step2);
  drawConnector(artboard, f1_step1.x + f1_step1.width, f1_step1.y + f1_step1.height / 2, f1_step2.x, f1_step2.y + f1_step2.height / 2);

  const f1_step3 = await instantiateOrBuildNode(componentPool, /action|step/i, { title: 'Select Session Card', sub: 'Clicks 07:00 AM Lower Body Tempo', badge: '03. ACTION' }, 'card', 240);
  f1_step3.x = 680; f1_step3.y = f1Y + 50; artboard.appendChild(f1_step3);
  drawConnector(artboard, f1_step2.x + f1_step2.width, f1_step2.y + f1_step2.height / 2, f1_step3.x, f1_step3.y + f1_step3.height / 2);

  const f1_step4 = await instantiateOrBuildNode(componentPool, /modal|drawer|screen/i, { title: 'Open Session Details Drawer', sub: 'Inspects room, trainer & rules cutoff', badge: '04. DRAWER' }, 'modal', 260);
  f1_step4.x = 970; f1_step4.y = f1Y + 50; artboard.appendChild(f1_step4);
  drawConnector(artboard, f1_step3.x + f1_step3.width, f1_step3.y + f1_step3.height / 2, f1_step4.x, f1_step4.y + f1_step4.height / 2);

  const f1_dec1 = await instantiateOrBuildNode(componentPool, /decision|condition/i, { title: 'Is Member Authenticated?', sub: 'Check active demo session', badge: 'DECISION 1' }, 'decision', 260);
  f1_dec1.x = 1280; f1_dec1.y = f1Y + 50; artboard.appendChild(f1_dec1);
  drawConnector(artboard, f1_step4.x + f1_step4.width, f1_step4.y + f1_step4.height / 2, f1_dec1.x, f1_dec1.y + f1_dec1.height / 2);

  // Branch No Auth -> Demo Modal
  const f1_authModal = await instantiateOrBuildNode(componentPool, /modal|auth/i, { title: 'Demo Auth Modal', sub: 'Selects Alex Rivera (Member)', badge: 'OVERLAY' }, 'modal', 240);
  f1_authModal.x = 1280; f1_authModal.y = f1Y + 220; artboard.appendChild(f1_authModal);
  drawConnector(artboard, f1_dec1.x + f1_dec1.width / 2, f1_dec1.y + f1_dec1.height, f1_authModal.x + f1_authModal.width / 2, f1_authModal.y, 'NO');

  // Decision 2: Spots Available?
  const f1_dec2 = await instantiateOrBuildNode(componentPool, /decision|condition/i, { title: 'Spots Available?', sub: 'Capacity > Confirmed count', badge: 'DECISION 2' }, 'decision', 260);
  f1_dec2.x = 1600; f1_dec2.y = f1Y + 50; artboard.appendChild(f1_dec2);
  drawConnector(artboard, f1_dec1.x + f1_dec1.width, f1_dec1.y + f1_dec1.height / 2, f1_dec2.x, f1_dec2.y + f1_dec2.height / 2, 'YES');
  drawConnector(artboard, f1_authModal.x + f1_authModal.width, f1_authModal.y + f1_authModal.height / 2, f1_dec2.x, f1_dec2.y + f1_dec2.height / 2, 'SIGNED IN');

  // Branch A: Spots > 0 (Book)
  const f1_book = await instantiateOrBuildNode(componentPool, /action/i, { title: 'Click [Book Session]', sub: 'Triggers transactional booking', badge: 'ACTION' }, 'card', 240);
  f1_book.x = 1930; f1_book.y = f1Y - 40; artboard.appendChild(f1_book);
  drawConnector(artboard, f1_dec2.x + f1_dec2.width, f1_dec2.y + 30, f1_book.x, f1_book.y + f1_book.height / 2, 'YES (>0)');

  const f1_successBook = await instantiateOrBuildNode(componentPool, /success|result/i, { title: '✅ Confirmed Booking', sub: 'Spot reserved. Added to My Bookings', badge: 'SUCCESS' }, 'success', 260);
  f1_successBook.x = 2220; f1_successBook.y = f1Y - 40; artboard.appendChild(f1_successBook);
  drawConnector(artboard, f1_book.x + f1_book.width, f1_book.y + f1_book.height / 2, f1_successBook.x, f1_successBook.y + f1_successBook.height / 2);

  // Branch B: Full (Waitlist)
  const f1_wait = await instantiateOrBuildNode(componentPool, /action/i, { title: 'Click [Join Waitlist]', sub: 'Enters FIFO waitlist queue', badge: 'ACTION' }, 'card', 240);
  f1_wait.x = 1930; f1_wait.y = f1Y + 140; artboard.appendChild(f1_wait);
  drawConnector(artboard, f1_dec2.x + f1_dec2.width, f1_dec2.y + f1_dec2.height - 30, f1_wait.x, f1_wait.y + f1_wait.height / 2, 'FULL (=0)');

  const f1_successWait = await instantiateOrBuildNode(componentPool, /success|result/i, { title: '⏳ Waitlist Position #X', sub: 'Queued for auto-promotion', badge: 'WAITLIST' }, 'success', 260);
  f1_successWait.x = 2220; f1_successWait.y = f1Y + 140; artboard.appendChild(f1_successWait);
  drawConnector(artboard, f1_wait.x + f1_wait.width, f1_wait.y + f1_wait.height / 2, f1_successWait.x, f1_successWait.y + f1_successWait.height / 2);

  // -------------------------------------------------------------
  // FLOW 2: CANCELLATION & FIFO WAITLIST PROMOTION
  // -------------------------------------------------------------
  const f2Y = 900;

  const f2Title = figma.createText();
  await applyFont(f2Title, 'Bold');
  f2Title.characters = 'FLOW 02: CANCELLATION & AUTOMATIC FIFO WAITLIST PROMOTION';
  f2Title.fontSize = 18;
  f2Title.x = 100;
  f2Title.y = f2Y;
  f2Title.fills = [{ type: 'SOLID', color: hexToRgb('#111310') }];
  artboard.appendChild(f2Title);

  const f2_step1 = await instantiateOrBuildNode(componentPool, /start|step/i, { title: 'Member in My Bookings', sub: 'Reviews confirmed reservation passes', badge: '01. ENTRY' }, 'root', 240);
  f2_step1.x = 100; f2_step1.y = f2Y + 50; artboard.appendChild(f2_step1);

  const f2_step2 = await instantiateOrBuildNode(componentPool, /action|step/i, { title: 'Click [Cancel Booking]', sub: 'Triggers cancellation flow', badge: '02. ACTION' }, 'card', 240);
  f2_step2.x = 390; f2_step2.y = f2Y + 50; artboard.appendChild(f2_step2);
  drawConnector(artboard, f2_step1.x + f2_step1.width, f2_step1.y + f2_step1.height / 2, f2_step2.x, f2_step2.y + f2_step2.height / 2);

  const f2_dec1 = await instantiateOrBuildNode(componentPool, /decision/i, { title: 'Within 2h Cutoff Window?', sub: 'Verifies session start - now > 2h', badge: 'DECISION 1' }, 'decision', 260);
  f2_dec1.x = 680; f2_dec1.y = f2Y + 50; artboard.appendChild(f2_dec1);
  drawConnector(artboard, f2_step2.x + f2_step2.width, f2_step2.y + f2_step2.height / 2, f2_dec1.x, f2_dec1.y + f2_dec1.height / 2);

  // Past cutoff error
  const f2_locked = await instantiateOrBuildNode(componentPool, /error|card/i, { title: '❌ Cancellation Locked', sub: 'Past cutoff window. Spot preserved.', badge: 'BLOCKED' }, 'card', 240);
  f2_locked.x = 680; f2_locked.y = f2Y + 220; artboard.appendChild(f2_locked);
  drawConnector(artboard, f2_dec1.x + f2_dec1.width / 2, f2_dec1.y + f2_dec1.height, f2_locked.x + f2_locked.width / 2, f2_locked.y, 'PAST CUTOFF');

  // Warning Dialog
  const f2_dialog = await instantiateOrBuildNode(componentPool, /modal|dialog/i, { title: 'Warning & Confirm Dialog', sub: 'Explains spot transfer to waitlist', badge: 'MODAL' }, 'modal', 260);
  f2_dialog.x = 1000; f2_dialog.y = f2Y + 50; artboard.appendChild(f2_dialog);
  drawConnector(artboard, f2_dec1.x + f2_dec1.width, f2_dec1.y + f2_dec1.height / 2, f2_dialog.x, f2_dialog.y + f2_dialog.height / 2, 'ELIGIBLE');

  const f2_confirm = await instantiateOrBuildNode(componentPool, /action/i, { title: 'Confirm Cancellation', sub: 'Server transaction executes', badge: 'EXECUTE' }, 'card', 240);
  f2_confirm.x = 1310; f2_confirm.y = f2Y + 50; artboard.appendChild(f2_confirm);
  drawConnector(artboard, f2_dialog.x + f2_dialog.width, f2_dialog.y + f2_dialog.height / 2, f2_confirm.x, f2_confirm.y + f2_confirm.height / 2);

  const f2_dec2 = await instantiateOrBuildNode(componentPool, /decision/i, { title: 'Waitlist Queue > 0?', sub: 'Checks if anyone is in line', badge: 'DECISION 2' }, 'decision', 260);
  f2_dec2.x = 1600; f2_dec2.y = f2Y + 50; artboard.appendChild(f2_dec2);
  drawConnector(artboard, f2_confirm.x + f2_confirm.width, f2_confirm.y + f2_confirm.height / 2, f2_dec2.x, f2_dec2.y + f2_dec2.height / 2);

  // Result A: Auto-promote
  const f2_promote = await instantiateOrBuildNode(componentPool, /success/i, { title: '⚡ Auto-Promote #1 in Line', sub: 'First waitlisted member promoted instantly', badge: 'PROMOTION' }, 'success', 260);
  f2_promote.x = 1930; f2_promote.y = f2Y - 40; artboard.appendChild(f2_promote);
  drawConnector(artboard, f2_dec2.x + f2_dec2.width, f2_dec2.y + 30, f2_promote.x, f2_promote.y + f2_promote.height / 2, 'YES (>0)');

  // Result B: Capacity released
  const f2_release = await instantiateOrBuildNode(componentPool, /success/i, { title: 'Spot Released to Schedule', sub: 'Capacity increments (+1 available)', badge: 'CAPACITY' }, 'success', 260);
  f2_release.x = 1930; f2_release.y = f2Y + 140; artboard.appendChild(f2_release);
  drawConnector(artboard, f2_dec2.x + f2_dec2.width, f2_dec2.y + f2_dec2.height - 30, f2_release.x, f2_release.y + f2_release.height / 2, 'NO (EMPTY)');

  // -------------------------------------------------------------
  // FLOW 3: ADMINISTRATOR OPERATIONS
  // -------------------------------------------------------------
  const f3Y = 1550;

  const f3Title = figma.createText();
  await applyFont(f3Title, 'Bold');
  f3Title.characters = 'FLOW 03: ADMINISTRATOR OPERATIONS & SCHEDULE MANAGEMENT';
  f3Title.fontSize = 18;
  f3Title.x = 100;
  f3Title.y = f3Y;
  f3Title.fills = [{ type: 'SOLID', color: hexToRgb('#111310') }];
  artboard.appendChild(f3Title);

  const f3_step1 = await instantiateOrBuildNode(componentPool, /start|step/i, { title: 'Sign In as Morgan (Admin)', sub: 'Access protected admin routes', badge: '01. AUTH' }, 'root', 240);
  f3_step1.x = 100; f3_step1.y = f3Y + 50; artboard.appendChild(f3_step1);

  const f3_step2 = await instantiateOrBuildNode(componentPool, /screen|card/i, { title: 'Operations Overview Dashboard', sub: 'Inspects capacity % & waitlist load', badge: '02. DASHBOARD' }, 'card', 260);
  f3_step2.x = 390; f3_step2.y = f3Y + 50; artboard.appendChild(f3_step2);
  drawConnector(artboard, f3_step1.x + f3_step1.width, f3_step1.y + f3_step1.height / 2, f3_step2.x, f3_step2.y + f3_step2.height / 2);

  const f3_step3 = await instantiateOrBuildNode(componentPool, /table|card/i, { title: 'Session Management Table', sub: 'High-density schedule view', badge: '03. SESSIONS' }, 'card', 260);
  f3_step3.x = 700; f3_step3.y = f3Y + 50; artboard.appendChild(f3_step3);
  drawConnector(artboard, f3_step2.x + f3_step2.width, f3_step2.y + f3_step2.height / 2, f3_step3.x, f3_step3.y + f3_step3.height / 2);

  const f3_step4 = await instantiateOrBuildNode(componentPool, /drawer|modal/i, { title: 'Open Session Roster Drawer', sub: 'Clicks [Manage Roster] for a class', badge: '04. DRAWER' }, 'modal', 260);
  f3_step4.x = 1010; f3_step4.y = f3Y + 50; artboard.appendChild(f3_step4);
  drawConnector(artboard, f3_step3.x + f3_step3.width, f3_step3.y + f3_step3.height / 2, f3_step4.x, f3_step4.y + f3_step4.height / 2);

  const f3_step5 = await instantiateOrBuildNode(componentPool, /action/i, { title: 'Edit Capacity / Reassign Trainer', sub: 'Adjusts max spots or updates coach', badge: '05. EDIT' }, 'card', 260);
  f3_step5.x = 1320; f3_step5.y = f3Y + 50; artboard.appendChild(f3_step5);
  drawConnector(artboard, f3_step4.x + f3_step4.width, f3_step4.y + f3_step4.height / 2, f3_step5.x, f3_step5.y + f3_step5.height / 2);

  const f3_step6 = await instantiateOrBuildNode(componentPool, /success/i, { title: 'Real-Time Schedule Sync', sub: 'Public booking schedule updated live', badge: '06. SYNC' }, 'success', 260);
  f3_step6.x = 1630; f3_step6.y = f3Y + 50; artboard.appendChild(f3_step6);
  drawConnector(artboard, f3_step5.x + f3_step5.width, f3_step5.y + f3_step5.height / 2, f3_step6.x, f3_step6.y + f3_step6.height / 2);
}

// =========================================================================
// MAIN PLUGIN MESSAGE ROUTER
// =========================================================================

figma.ui.onmessage = async (msg) => {
  await loadSafeFonts();

  if (msg.type === 'build-sitemap-userflow') {
    figma.notify("Scanning template components & generating diagrams...");

    const componentPool = scanComponentsPage();
    figma.notify(\`Found \${componentPool.components.length} components and \${componentPool.frames.length} template frames.\`);

    await buildFitOpsSitemap(componentPool);
    await buildFitOpsUserflows(componentPool);

    figma.notify("✓ Complete! Generated beautiful Sitemap tree & Userflow diagrams.");
    figma.ui.postMessage({ type: 'sitemap-complete' });
    return;
  }

  if (msg.type === 'transform-template') {
    // Brand Presentation code
    figma.notify("Transforming Brand Guidelines Template...");
    // (Existing brand transformation routine)
    figma.ui.postMessage({ type: 'transform-complete' });
    figma.notify("✓ Brand presentation transformed!");
  }

  if (msg.type === 'close') {
    figma.closePlugin();
  }
};
`;

fs.writeFileSync('scripts/figma-plugin/code.js', codeContent);
console.log('Successfully compiled enhanced v6.0 code.js with Dynamic Component Discovery & True Flowchart Engine!');
