const C = {
  canvas: '#EEF0F3', bg: '#F6F7F9', white: '#FFFFFF', ink: '#20242B', muted: '#68707C',
  border: '#D7DBE0', line: '#C4C9D0', blue: '#1F66FF', blueSoft: '#EAF0FF',
  green: '#19724F', greenSoft: '#E6F4ED', amber: '#945700', amberSoft: '#FFF3D9',
  red: '#B42318', redSoft: '#FDECEC', dark: '#31363E'
};

const hex = (value) => {
  const h = value.replace('#', '');
  const n = parseInt(h, 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
};
const paint = (value, opacity = 1) => ({ type: 'SOLID', color: hex(value), opacity });

let family = 'Inter';
let fonts = {};
let kit = {};
let createdScreens = [];
let prototypeLinks = [];

const progress = (message) => figma.ui.postMessage({ type: 'progress', message });

async function prepareFonts() {
  const available = await figma.listAvailableFontsAsync();
  const familyNames = [...new Set(available.map((f) => f.fontName.family))];
  const sampleText = kit.sourcePages
    ?.flatMap((page) => page.findAllWithCriteria({ types: ['TEXT'] }))
    .find((node) => node.fontName !== figma.mixed);
  const kitFamily = sampleText && sampleText.fontName !== figma.mixed ? sampleText.fontName.family : null;
  const sampleFamily = (kitFamily && familyNames.includes(kitFamily) ? kitFamily : null)
    || familyNames.find((f) => /roboto/i.test(f))
    || familyNames.find((f) => /inter/i.test(f));
  family = sampleFamily || familyNames[0];
  const inFamily = available.filter((f) => f.fontName.family === family).map((f) => f.fontName.style);
  const pick = (patterns) => inFamily.find((style) => patterns.some((pattern) => pattern.test(style))) || inFamily[0];
  fonts.regular = { family, style: pick([/^regular$/i, /book/i]) };
  fonts.medium = { family, style: pick([/medium/i, /semi.?bold/i, /regular/i]) };
  fonts.bold = { family, style: pick([/^bold$/i, /semi.?bold/i, /medium/i]) };
  await Promise.all([...new Map(Object.values(fonts).map((f) => [JSON.stringify(f), f])).values()].map((f) => figma.loadFontAsync(f)));
}

function findComponent(regex) {
  return kit.components.find((node) => regex.test(node.name));
}

async function prepareKit() {
  try { await figma.loadAllPagesAsync(); } catch (_) {}
  const sourcePages = figma.root.children.filter((p) => /components|headers|footers|content sections|dashboards/i.test(p.name));
  kit.sourcePages = sourcePages;
  const components = [];
  for (const page of sourcePages) {
    components.push(...page.findAllWithCriteria({ types: ['COMPONENT', 'COMPONENT_SET'] }));
  }
  kit.components = components;
  kit.button = findComponent(/^button$/i);
  kit.badge = findComponent(/^badge$/i);
}

function textNode(value, size = 14, weight = 'regular', color = C.ink, width = null, align = 'LEFT') {
  const node = figma.createText();
  node.fontName = fonts[weight] || fonts.regular;
  node.fontSize = size;
  node.lineHeight = { unit: 'PERCENT', value: 135 };
  node.fills = [paint(color)];
  node.textAlignHorizontal = align;
  if (width !== null) {
    node.textAutoResize = 'HEIGHT';
    node.resize(width, Math.max(size * 1.4, node.height));
  }
  node.characters = value;
  return node;
}

function auto(direction = 'VERTICAL', gap = 12, padding = 0) {
  const frame = figma.createFrame();
  frame.layoutMode = direction;
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.itemSpacing = gap;
  frame.paddingTop = padding;
  frame.paddingRight = padding;
  frame.paddingBottom = padding;
  frame.paddingLeft = padding;
  frame.fills = [];
  return frame;
}

function box(width, height, fill = C.white, stroke = C.border, radius = 8) {
  const frame = figma.createFrame();
  frame.resize(width, height);
  frame.fills = [paint(fill)];
  frame.strokes = stroke ? [paint(stroke)] : [];
  frame.strokeWeight = stroke ? 1 : 0;
  frame.cornerRadius = radius;
  return frame;
}

async function loadNodeFonts(node) {
  const textNodes = node.type === 'TEXT' ? [node] : ('findAllWithCriteria' in node ? node.findAllWithCriteria({ types: ['TEXT'] }) : []);
  const found = [];
  for (const text of textNodes) {
    for (const segment of text.getStyledTextSegments(['fontName'])) found.push(segment.fontName);
  }
  const unique = [...new Map(found.map((f) => [JSON.stringify(f), f])).values()];
  await Promise.all(unique.map((f) => figma.loadFontAsync(f)));
}

async function setInstanceLabel(instance, label) {
  const textNodes = instance.findAllWithCriteria({ types: ['TEXT'] }).filter((node) => node.visible);
  if (!textNodes.length) return;
  await loadNodeFonts(instance);
  const target = textNodes.find((node) => /label|button|text/i.test(node.name)) || textNodes[0];
  target.characters = label;
}

async function kitButton(label, kind = 'primary', width = 150) {
  let source = kit.button;
  if (source && source.type === 'COMPONENT_SET') {
    const terms = kind === 'secondary' ? /secondary|outline|stroke|ghost/i : /primary|filled|solid/i;
    source = source.children.find((node) => node.type === 'COMPONENT' && terms.test(node.name)) || source.defaultVariant;
  }
  if (source && source.type === 'COMPONENT') {
    const instance = source.createInstance();
    await setInstanceLabel(instance, label);
    instance.resize(width, 44);
    instance.name = `Kit Button / ${label}`;
    return instance;
  }
  const frame = auto('HORIZONTAL', 8, 12);
  frame.name = `Button / ${label}`;
  frame.fills = [paint(kind === 'secondary' ? C.white : C.blue)];
  frame.strokes = [paint(C.blue)];
  frame.cornerRadius = 4;
  frame.resize(width, 44);
  frame.primaryAxisAlignItems = 'CENTER';
  frame.counterAxisAlignItems = 'CENTER';
  frame.appendChild(textNode(label, 13, 'medium', kind === 'secondary' ? C.blue : C.white));
  return frame;
}

async function kitBadge(label, tone = 'neutral') {
  let source = kit.badge;
  if (source && source.type === 'COMPONENT_SET') source = source.defaultVariant;
  if (source && source.type === 'COMPONENT') {
    const instance = source.createInstance();
    await setInstanceLabel(instance, label);
    instance.name = `Kit Badge / ${label}`;
    return instance;
  }
  const bg = tone === 'success' ? C.greenSoft : tone === 'warning' ? C.amberSoft : tone === 'danger' ? C.redSoft : C.blueSoft;
  const fg = tone === 'success' ? C.green : tone === 'warning' ? C.amber : tone === 'danger' ? C.red : C.blue;
  const frame = auto('HORIZONTAL', 0, 6);
  frame.name = `Badge / ${label}`;
  frame.fills = [paint(bg)];
  frame.cornerRadius = 999;
  frame.appendChild(textNode(label, 10, 'medium', fg));
  return frame;
}

function field(label, value, width) {
  const wrapper = auto('VERTICAL', 6, 0);
  wrapper.name = `Field / ${label}`;
  wrapper.appendChild(textNode(label, 11, 'medium', C.ink));
  const input = box(width, 44, C.white, C.border, 4);
  const valueText = textNode(value, 12, 'regular', C.muted, width - 24);
  input.appendChild(valueText);
  valueText.x = 12;
  valueText.y = 13;
  wrapper.appendChild(input);
  return wrapper;
}

function checkbox(label, checked = false, width = 420) {
  const row = auto('HORIZONTAL', 10, 0);
  const square = box(18, 18, checked ? C.blue : C.white, checked ? C.blue : C.line, 3);
  if (checked) {
    const mark = textNode('✓', 12, 'bold', C.white);
    square.appendChild(mark); mark.x = 4; mark.y = 0;
  }
  row.appendChild(square);
  row.appendChild(textNode(label, 11, 'regular', C.ink, width - 28));
  return row;
}

function alertBox(title, body, tone = 'info', width = 560) {
  const colors = tone === 'success' ? [C.greenSoft, C.green] : tone === 'warning' ? [C.amberSoft, C.amber] : tone === 'danger' ? [C.redSoft, C.red] : [C.blueSoft, C.blue];
  const frame = auto('VERTICAL', 4, 14);
  frame.resize(width, 72);
  frame.counterAxisSizingMode = 'FIXED';
  frame.fills = [paint(colors[0])];
  frame.strokes = [paint(colors[1])];
  frame.strokeWeight = 1;
  frame.cornerRadius = 6;
  frame.appendChild(textNode(title, 12, 'bold', colors[1], width - 28));
  frame.appendChild(textNode(body, 11, 'regular', C.ink, width - 28));
  return frame;
}

function divider(width) {
  const line = figma.createRectangle();
  line.resize(width, 1);
  line.fills = [paint(C.border)];
  return line;
}

function desktopHeader(width = 1440) {
  const header = box(width, 80, C.white, C.border, 0);
  header.name = 'Header / Public';
  const logo = textNode('PRACTICE ATHLETIC CLUB', 15, 'bold', C.ink);
  logo.x = 32; logo.y = 29; header.appendChild(logo);
  const nav = textNode('Home     Programs     Schedule     Services     Facilities     Pricing     Team     Contact', 10, 'medium', C.ink);
  nav.x = 320; nav.y = 31; header.appendChild(nav);
  const access = textNode('Join now', 11, 'bold', C.blue); access.x = 1320; access.y = 31; header.appendChild(access);
  return header;
}

function protectedSidebar(role = 'Member') {
  const side = box(240, 1024, C.white, C.border, 0);
  side.name = `Sidebar / ${role}`;
  const brand = textNode('PRACTICE', 17, 'bold', C.ink); brand.x = 24; brand.y = 28; side.appendChild(brand);
  const roleText = textNode(`${role} workspace`, 11, 'regular', C.muted); roleText.x = 24; roleText.y = 54; side.appendChild(roleText);
  const items = role === 'Administrator'
    ? ['Overview', 'Sessions', 'Participants', 'Audit status']
    : role === 'Trainer' ? ['Assigned sessions', 'Profile & security'] : ['Schedule', 'My bookings', 'Profile & security'];
  items.forEach((item, index) => {
    const active = index === 0;
    const nav = box(192, 44, active ? C.blueSoft : C.white, null, 4);
    nav.x = 24; nav.y = 110 + index * 54; side.appendChild(nav);
    const label = textNode(item, 12, active ? 'bold' : 'medium', active ? C.blue : C.ink);
    label.x = 12; label.y = 13; nav.appendChild(label);
  });
  const demo = textNode('FICTIONAL DEMO DATA', 9, 'bold', C.muted); demo.x = 24; demo.y = 970; side.appendChild(demo);
  return side;
}

function mobileHeader() {
  const header = box(390, 64, C.white, C.border, 0);
  header.name = 'Header / Mobile';
  const logo = textNode('PRACTICE', 14, 'bold', C.ink); logo.x = 16; logo.y = 22; header.appendChild(logo);
  const action = textNode('Join now  Menu', 10, 'medium', C.blue); action.x = 272; action.y = 24; header.appendChild(action);
  return header;
}

function mobileBottom() {
  const nav = box(390, 64, C.white, C.border, 0);
  nav.name = 'Navigation / Mobile';
  const label = textNode('Schedule        Bookings        Profile', 10, 'medium', C.ink, 358, 'CENTER');
  label.x = 16; label.y = 23; nav.appendChild(label);
  return nav;
}

function titleBlock(title, subtitle, width) {
  const block = auto('VERTICAL', 6, 0);
  block.appendChild(textNode(title, width < 500 ? 22 : 30, 'bold', C.ink, width));
  block.appendChild(textNode(subtitle, 12, 'regular', C.muted, width));
  return block;
}

function createDesktopBase(name, title, subtitle, protectedRole = null) {
  const screen = box(1440, 1024, C.bg, null, 0);
  screen.name = name;
  screen.clipsContent = true;
  let content;
  if (protectedRole) {
    screen.appendChild(protectedSidebar(protectedRole));
    const topbar = box(1200, 80, C.white, C.border, 0); topbar.x = 240; screen.appendChild(topbar);
    const role = textNode(protectedRole, 12, 'medium', C.muted); role.x = 1090; role.y = 31; topbar.appendChild(role);
    content = auto('VERTICAL', 18, 0); content.name = 'Page Content'; content.resize(1104, 100); content.counterAxisSizingMode = 'FIXED'; content.primaryAxisSizingMode = 'AUTO'; content.x = 288; content.y = 112; screen.appendChild(content);
    content.appendChild(titleBlock(title, subtitle, 1104));
  } else {
    screen.appendChild(desktopHeader());
    content = auto('VERTICAL', 18, 0); content.name = 'Page Content'; content.resize(1312, 100); content.counterAxisSizingMode = 'FIXED'; content.primaryAxisSizingMode = 'AUTO'; content.x = 64; content.y = 112; screen.appendChild(content);
    content.appendChild(titleBlock(title, subtitle, 1312));
  }
  createdScreens.push(screen);
  return { screen, content };
}

function createMobileBase(name, title, subtitle) {
  const screen = box(390, 844, C.bg, null, 0);
  screen.name = name;
  screen.clipsContent = true;
  screen.appendChild(mobileHeader());
  const bottom = mobileBottom(); bottom.y = 780; screen.appendChild(bottom);
  const content = auto('VERTICAL', 14, 0); content.name = 'Page Content'; content.resize(358, 100); content.counterAxisSizingMode = 'FIXED'; content.primaryAxisSizingMode = 'AUTO'; content.x = 16; content.y = 86; screen.appendChild(content);
  content.appendChild(titleBlock(title, subtitle, 358));
  createdScreens.push(screen);
  return { screen, content, bottom };
}

async function sessionCard(data, width, compact = false) {
  const frame = auto('VERTICAL', compact ? 8 : 10, compact ? 12 : 16);
  frame.name = `Session Card / ${data.title}`;
  frame.resize(width, 100);
  frame.counterAxisSizingMode = 'FIXED';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.fills = [paint(C.white)]; frame.strokes = [paint(C.border)]; frame.strokeWeight = 1; frame.cornerRadius = 6;
  const top = auto('HORIZONTAL', 10, 0); top.resize(width - (compact ? 24 : 32), 24); top.counterAxisSizingMode = 'FIXED';
  top.appendChild(await kitBadge(data.program, data.full ? 'warning' : 'neutral'));
  const capacity = textNode(data.full ? 'FULL' : data.spots, 11, 'bold', data.full ? C.amber : C.green);
  top.appendChild(capacity); frame.appendChild(top);
  frame.appendChild(textNode(data.title, compact ? 15 : 18, 'bold', C.ink, width - (compact ? 24 : 32)));
  frame.appendChild(textNode(`${data.time} · ${data.duration} · ${data.trainer}`, 11, 'regular', C.muted, width - (compact ? 24 : 32)));
  if (!compact) frame.appendChild(textNode(`Booking cutoff: ${data.cutoff}`, 10, 'regular', C.muted, width - 32));
  return frame;
}

function detailsPanel(width, data) {
  const panel = auto('VERTICAL', 12, 20); panel.name = 'Session Details'; panel.resize(width, 100); panel.counterAxisSizingMode = 'FIXED'; panel.primaryAxisSizingMode = 'AUTO'; panel.fills = [paint(C.white)]; panel.strokes = [paint(C.border)]; panel.cornerRadius = 8;
  panel.appendChild(textNode(data.title, 22, 'bold', C.ink, width - 40));
  panel.appendChild(textNode(`${data.time} · ${data.duration} · Trainer ${data.trainer}`, 12, 'medium', C.muted, width - 40));
  panel.appendChild(divider(width - 40));
  panel.appendChild(textNode('Session information', 12, 'bold', C.ink));
  panel.appendChild(textNode(`Availability: ${data.spots}\nStatus: Scheduled\nConfigured booking cutoff: ${data.cutoff}\nLocation: Studio A`, 12, 'regular', C.ink, width - 40));
  panel.appendChild(alertBox('Server-authoritative availability', 'Availability is rechecked when the request is submitted.', 'info', width - 40));
  return panel;
}

// Keep this list aligned with the editable draw.io sitemap. Each entry names the
// generated frame that provides visual coverage for the route or in-page anchor.
const UX_ROUTE_COVERAGE = [
  ['Home /', 'D00/M00 Landing'], ['Programs /programs', 'D13/M13 Public directory'],
  ['Services /#services', 'D00/M00 Landing'], ['Facilities /#facilities', 'D00/M00 Landing'],
  ['Contact /#contact', 'D00/M00 Landing'], ['Schedule /schedule', 'D01/M01 Schedule'],
  ['Trainers /trainers', 'D13/M13 Public directory'], ['Pricing /pricing', 'D14/M14 Pricing and About Us'],
  ['About Us /about', 'D14/M14 Pricing and About Us'], ['Terms of Service /terms', 'D15/M15 Legal, Cookies, and Not Found'],
  ['Privacy Policy /privacy', 'D15/M15 Legal, Cookies, and Not Found'], ['Liability Waiver /waiver', 'D15/M15 Legal, Cookies, and Not Found'],
  ['Cookie preferences /cookie-settings', 'D15/M15 Legal, Cookies, and Not Found'], ['Not Found /404', 'D15/M15 Legal, Cookies, and Not Found'],
  ['Join now /join', 'D03/M03 Join decision'], ['Member Portal Login /portal/login', 'D11/M10 Member Portal Login'],
  ['Member registration /register', 'D03/M03 Join decision'], ['Account recovery /auth/forgot-password', 'D11/M10 Sign In'],
  ['Member dashboard /app', 'D16/M16 Member dashboard'], ['Member schedule /app/schedule', 'D16/M16 Member dashboard'],
  ['My bookings /app/bookings', 'D07/M06 My Bookings'], ['Profile and Security /app/profile/security', 'D07/M06 Member workspace'], ['Assigned sessions /trainer/sessions', 'D12/M11 Trainer'],
  ['Assigned session /trainer/sessions/:id', 'D12/M11 Trainer'], ['Operations overview /admin', 'D13/M12 Administrator'],
  ['Session manager /admin/sessions', 'D13/M12 Administrator'], ['Create session /admin/sessions/new', 'D13/M12 Administrator'],
  ['Edit session /admin/sessions/:id/edit', 'D13/M12 Administrator'], ['Participants /admin/sessions/:id/participants', 'D13/M12 Administrator'],
];

function routeCoverageCard(title, routes, width) {
  const card = auto('VERTICAL', 8, 16); card.resize(width, 120); card.counterAxisSizingMode = 'FIXED'; card.fills = [paint(C.white)]; card.strokes = [paint(C.border)]; card.cornerRadius = 6;
  card.appendChild(textNode(title, 14, 'bold', C.ink, width - 32));
  card.appendChild(textNode(routes.join('\n'), 11, 'regular', C.muted, width - 32));
  return card;
}

async function buildPublicCoverageDesktop() {
  const screens = {};
  let base = createDesktopBase('D13 · Public Directory / Route Coverage', 'Public destinations', 'Every public destination in the draw.io sitemap is represented by a generated frame or a named landing anchor.');
  base.content.appendChild(routeCoverageCard('DRAW.IO TO FIGMA COVERAGE', UX_ROUTE_COVERAGE.slice(0, 14).map(([route, frame]) => `${route}  →  ${frame}`), 980));
  const directory = auto('HORIZONTAL', 16, 0);
  directory.appendChild(routeCoverageCard('PROGRAMS', ['Strength', 'Pace', 'Reset', 'Open Floor'], 300));
  directory.appendChild(routeCoverageCard('TRAINERS', ['Fictional bios', 'Specialties', 'Assigned sessions'], 300));
  directory.appendChild(routeCoverageCard('CONTACT', ['Landing anchor', 'Fictional location', 'Opening hours'], 300));
  base.content.appendChild(directory); screens.publicDirectory = base.screen;

  base = createDesktopBase('D14 · Pricing and About Us', 'Membership options and club story', 'Fictional plans, a transparent product boundary, and the public club narrative.');
  const pricing = auto('HORIZONTAL', 16, 0);
  [['Base', '$39 / month'], ['Complete', '$59 / month'], ['Training+', '$79 / month']].forEach(([name, price]) => pricing.appendChild(routeCoverageCard(name, [price, 'Fictional plan', 'No payment collection'], 300)));
  base.content.appendChild(pricing); base.content.appendChild(routeCoverageCard('ABOUT US /about', ['Practice Athletic Club is a fictional portfolio product.', 'Mission, operating principles, and team overview are public.', 'No real gym, member, or health data is represented.'], 980)); screens.pricingAbout = base.screen;

  base = createDesktopBase('D15 · Legal, Cookies, and Not Found', 'Legal and recovery destinations', 'Static public destinations are explicit so the sitemap, wireframes, and generated Figma pages stay aligned.');
  const legal = auto('HORIZONTAL', 16, 0);
  legal.appendChild(routeCoverageCard('TERMS OF SERVICE /terms', ['Membership rules', 'Configured cutoff policy', 'Club etiquette'], 300));
  legal.appendChild(routeCoverageCard('PRIVACY POLICY /privacy', ['Fictional demo disclosure', 'Minimal session cookies', 'No production data'], 300));
  legal.appendChild(routeCoverageCard('LIABILITY WAIVER /waiver', ['Physical readiness declaration', 'Required before first booking', 'Server-side recheck'], 300));
  base.content.appendChild(legal); base.content.appendChild(routeCoverageCard('COOKIE PREFERENCES /cookie-settings', ['Essential cookie disclosure', 'Display preference controls', 'Visible from the public cookie notice'], 980)); base.content.appendChild(alertBox('NOT FOUND /404', 'Unknown routes explain what happened and return the visitor to public navigation without exposing protected data.', 'danger', 980)); screens.legalMisc = base.screen;
  return screens;
}

async function buildPublicCoverageMobile() {
  const screens = {};
  let base = createMobileBase('M13 · Public Directory / Route Coverage', 'Public destinations', 'Every public route is mapped from draw.io to Figma.');
  base.content.appendChild(routeCoverageCard('PUBLIC ROUTE COVERAGE', UX_ROUTE_COVERAGE.slice(0, 14).map(([route, frame]) => `${route}\n${frame}`), 358)); screens.publicDirectory = base.screen;
  base = createMobileBase('M14 · Pricing and About Us', 'Membership options and club story', 'Fictional pricing and a clear public narrative.');
  for (const [name, price] of [['Base', '$39 / month'], ['Complete', '$59 / month'], ['Training+', '$79 / month']]) base.content.appendChild(routeCoverageCard(name, [price, 'Fictional plan'], 358));
  base.content.appendChild(routeCoverageCard('ABOUT US /about', ['Fictional portfolio product', 'Mission and team overview'], 358)); screens.pricingAbout = base.screen;
  base = createMobileBase('M15 · Legal, Cookies, and Not Found', 'Legal and recovery destinations', 'Public legal pages and safe unknown-route recovery.');
  for (const [title, lines] of [['TERMS /terms', ['Membership rules', 'Configured cutoff']], ['PRIVACY /privacy', ['Fictional demo disclosure', 'Session cookies']], ['WAIVER /waiver', ['Physical readiness', 'Booking requirement']], ['COOKIE PREFERENCES /cookie-settings', ['Essential cookies', 'Display preferences']], ['NOT FOUND /404', ['Unknown-route recovery', 'Return to public navigation']]]) base.content.appendChild(routeCoverageCard(title, lines, 358));
  screens.legalMisc = base.screen;
  return screens;
}

async function buildDesktopScreens(page) {
  const session = { title: 'Lower Body Tempo', program: 'STRENGTH', time: 'Tue · 7:00 AM', duration: '45 min', trainer: 'Marcus Vance', spots: '4 of 16 spots left', cutoff: '60 minutes before start' };
  const full = { ...session, title: 'Pace Intervals', program: 'PACE', time: 'Wed · 6:30 PM', trainer: 'Lena Ortiz', spots: '0 of 12 spots left', full: true };
  const screens = {};

  let base = createDesktopBase('D00 · Landing / Complete', 'Train with purpose. Live with more energy.', 'A fictional public Practice Athletic Club experience, from discovering the club to booking your next session.');
  screens.landing = base.screen;
  base.screen.resize(1440, 6100);
  const hero = auto('HORIZONTAL', 24, 32); hero.resize(1312, 340); hero.counterAxisSizingMode = 'FIXED'; hero.fills = [paint(C.white)]; hero.strokes = [paint(C.border)]; hero.cornerRadius = 8;
  const heroCopy = auto('VERTICAL', 16, 0); heroCopy.resize(720, 100); heroCopy.counterAxisSizingMode = 'FIXED'; heroCopy.primaryAxisSizingMode = 'AUTO'; heroCopy.appendChild(await kitBadge('PRACTICE ATHLETIC CLUB')); heroCopy.appendChild(textNode('Strength, pace, and recovery for real life.', 38, 'bold', C.ink, 720)); heroCopy.appendChild(textNode('Discover programs, meet the team, and join a fictional club experience. Booking lives in the separate member workspace.', 15, 'regular', C.muted, 660)); const heroActions = auto('HORIZONTAL', 12, 0); heroActions.appendChild(await kitButton('View schedule', 'secondary', 160)); heroActions.appendChild(await kitButton('Join now', 'primary', 160)); heroCopy.appendChild(heroActions);
  const heroPanel = auto('VERTICAL', 12, 24); heroPanel.resize(500, 250); heroPanel.counterAxisSizingMode = 'FIXED'; heroPanel.fills = [paint(C.blueSoft)]; heroPanel.cornerRadius = 6; heroPanel.appendChild(textNode('YOUR WEEK AT PRACTICE', 11, 'bold', C.blue, 452)); heroPanel.appendChild(textNode('18 guided sessions', 26, 'bold', C.ink, 452)); heroPanel.appendChild(textNode('Strength, mobility, intervals, and open training spaces.', 13, 'regular', C.muted, 452)); heroPanel.appendChild(await kitButton('Browse schedule', 'secondary', 180)); hero.appendChild(heroCopy); hero.appendChild(heroPanel); base.content.appendChild(hero);
  const stats = box(1312, 78, C.dark, null, 0); const statsText = textNode('OPEN EVERY DAY        ·        GUIDED PROGRAMS        ·        BOOK IN THE APP        ·        DEMO DATA', 12, 'bold', C.white, 1260, 'CENTER'); statsText.x = 26; statsText.y = 29; stats.appendChild(statsText); base.content.appendChild(stats);

  const sectionHeading = (eyebrow, title, body) => { const block = auto('VERTICAL', 6, 0); block.appendChild(textNode(eyebrow.toUpperCase(), 11, 'bold', C.blue, 1312)); block.appendChild(textNode(title, 28, 'bold', C.ink, 1040)); block.appendChild(textNode(body, 13, 'regular', C.muted, 920)); return block; };
  base.content.appendChild(sectionHeading('Programs', 'A routine that moves with you.', 'Explore strength, pace, mobility, and functional-training formats.'));
  const activityRow = auto('HORIZONTAL', 16, 0); [['Strength', 'Technique, progression, and load.'], ['Pace', 'Intervals for capacity and energy.'], ['Reset', 'Mobility, control, and recovery.'], ['Open Floor', 'Train at your own pace.']].forEach(([title, body]) => { const card = auto('VERTICAL', 10, 18); card.resize(316, 180); card.counterAxisSizingMode = 'FIXED'; card.fills = [paint(C.white)]; card.strokes = [paint(C.border)]; card.cornerRadius = 6; const placeholder = box(280, 62, C.canvas, C.line, 4); const label = textNode('PROGRAM', 10, 'bold', C.muted); label.x = 12; label.y = 24; placeholder.appendChild(label); card.appendChild(placeholder); card.appendChild(textNode(title, 18, 'bold', C.ink, 280)); card.appendChild(textNode(body, 12, 'regular', C.muted, 280)); activityRow.appendChild(card); }); base.content.appendChild(activityRow);

  base.content.appendChild(sectionHeading('Services', 'Support before, during, and after training.', 'The experience combines an initial assessment, training guidance, follow-up, and recovery.'));
  const serviceRow = auto('HORIZONTAL', 16, 0); [['Initial assessment', 'Goals and starting point.'], ['Training plan', 'A visible route for your progress.'], ['Recovery', 'Spaces and habits to reset.']].forEach(([title, body]) => { const card = auto('VERTICAL', 8, 20); card.resize(426, 142); card.counterAxisSizingMode = 'FIXED'; card.fills = [paint(C.blueSoft)]; card.cornerRadius = 6; card.appendChild(textNode(title, 16, 'bold', C.ink, 386)); card.appendChild(textNode(body, 12, 'regular', C.muted, 386)); card.appendChild(textNode('Explore service →', 11, 'bold', C.blue, 386)); serviceRow.appendChild(card); }); base.content.appendChild(serviceRow);

  base.content.appendChild(sectionHeading('Facilities', 'Spaces designed for training and recovery.', 'A quick view of the spaces in this fictional club.'));
  const facilityGrid = auto('HORIZONTAL', 16, 0); [['Strength room', 420], ['Pace studio', 280], ['Mobility', 280], ['Recovery', 280]].forEach(([name, width]) => { const card = box(width, 214, C.canvas, C.line, 6); const placeholder = textNode(`IMAGE\n${name.toUpperCase()}`, 12, 'bold', C.muted, width - 32, 'CENTER'); placeholder.x = 16; placeholder.y = 88; card.appendChild(placeholder); facilityGrid.appendChild(card); }); base.content.appendChild(facilityGrid);

  base.content.appendChild(sectionHeading('Pricing', 'Choose the way of training that fits you.', 'Fictional plans used to define product hierarchy and comparison.'));
  const priceRow = auto('HORIZONTAL', 16, 0); const plans = [['Base', 'Essential access', '$39 / month'], ['Complete', 'Guided sessions', '$59 / month'], ['Training+', 'Complete support', '$79 / month']];
  for (const [index, [name, detail, price]] of plans.entries()) { const card = auto('VERTICAL', 10, 20); card.resize(426, 245); card.counterAxisSizingMode = 'FIXED'; card.fills = [paint(index === 1 ? C.dark : C.white)]; card.strokes = [paint(index === 1 ? C.dark : C.border)]; card.cornerRadius = 6; const ink = index === 1 ? C.white : C.ink; card.appendChild(textNode(name, 18, 'bold', ink, 386)); card.appendChild(textNode(detail, 12, 'regular', index === 1 ? C.canvas : C.muted, 386)); card.appendChild(textNode(price, 28, 'bold', ink, 386)); card.appendChild(textNode('✓ Schedule and availability\n✓ Profile and bookings\n✓ Fictional data', 11, 'regular', index === 1 ? C.canvas : C.muted, 386)); card.appendChild(await kitButton('View plan', index === 1 ? 'primary' : 'secondary', 150)); priceRow.appendChild(card); }
  base.content.appendChild(priceRow);

  base.content.appendChild(sectionHeading('Team', 'Support is part of training.', 'Fictional profiles define how the team and specialties are presented.'));
  const teamRow = auto('HORIZONTAL', 16, 0); [['Maya Torres', 'Strength'], ['Daniel Ross', 'Pace'], ['Sofia Mendes', 'Mobility'], ['Lucas Vega', 'Member support']].forEach(([name, role]) => { const card = auto('VERTICAL', 8, 16); card.resize(316, 174); card.counterAxisSizingMode = 'FIXED'; card.fills = [paint(C.white)]; card.strokes = [paint(C.border)]; card.cornerRadius = 6; const avatar = box(72, 72, C.canvas, C.line, 999); const avatarText = textNode('PHOTO', 10, 'bold', C.muted); avatarText.x = 18; avatarText.y = 28; avatar.appendChild(avatarText); card.appendChild(avatar); card.appendChild(textNode(name, 15, 'bold', C.ink, 280)); card.appendChild(textNode(role, 11, 'regular', C.muted, 280)); teamRow.appendChild(card); }); base.content.appendChild(teamRow);

  base.content.appendChild(sectionHeading('Contact', 'Get to know the club before you start.', 'Fictional information for hours, location, accessibility, and first contact.'));
  const contactRow = auto('HORIZONTAL', 16, 0); const map = box(650, 196, C.canvas, C.line, 6); const mapText = textNode('MAP / LOCATION\nFICTIONAL DATA', 12, 'bold', C.muted, 610, 'CENTER'); mapText.x = 20; mapText.y = 82; map.appendChild(mapText); const contact = auto('VERTICAL', 8, 20); contact.resize(646, 196); contact.counterAxisSizingMode = 'FIXED'; contact.fills = [paint(C.white)]; contact.strokes = [paint(C.border)]; contact.cornerRadius = 6; contact.appendChild(textNode('Practice Athletic Club', 17, 'bold', C.ink, 606)); contact.appendChild(textNode('100 Training Avenue · Fictional City\nMon–Sun · 06:00–22:00\ncontact@practice.example.invalid', 12, 'regular', C.muted, 606)); contact.appendChild(await kitButton('Contact the club', 'secondary', 190)); contactRow.appendChild(map); contactRow.appendChild(contact); base.content.appendChild(contactRow);

  const finalCta = auto('VERTICAL', 12, 28); finalCta.resize(1312, 204); finalCta.counterAxisSizingMode = 'FIXED'; finalCta.fills = [paint(C.blueSoft)]; finalCta.cornerRadius = 8; finalCta.appendChild(textNode('You have the plan. Your first session is next.', 27, 'bold', C.ink, 1256)); finalCta.appendChild(textNode('Join now to select a fictional plan. Already a member? The Join page gives you a clear path to sign in.', 13, 'regular', C.muted, 1256)); finalCta.appendChild(await kitButton('Join now', 'primary', 170)); base.content.appendChild(finalCta);
  const footer = box(1312, 260, C.dark, null, 0); const footerTitle = textNode('PRACTICE ATHLETIC CLUB', 17, 'bold', C.white); footerTitle.x = 28; footerTitle.y = 28; footer.appendChild(footerTitle); const footerNav = textNode('Explore\nHome\nPrograms\nServices\nFacilities\nPricing\n\nClub\nTeam\nContact\nSchedule\nAbout Us\n\nLegal\nPrivacy\nTerms\nLiability waiver\nCookie preferences', 12, 'regular', C.canvas, 720); footerNav.x = 28; footerNav.y = 68; footer.appendChild(footerNav); const footerNote = textNode('Fictional portfolio project. No real or production data.\n© Practice Athletic Club', 11, 'regular', C.muted, 430); footerNote.x = 840; footerNote.y = 184; footer.appendChild(footerNote); base.content.appendChild(footer);

  base = createDesktopBase('D01 · Schedule / Ready', 'Find your next session', 'Filter the fictional schedule by date, program, trainer, and availability.');
  screens.schedule = base.screen;
  const filters = auto('HORIZONTAL', 12, 0); filters.appendChild(field('Date', 'This week', 210)); filters.appendChild(field('Program', 'All programs', 210)); filters.appendChild(field('Trainer', 'All trainers', 210)); filters.appendChild(field('Availability', 'Any availability', 210)); base.content.appendChild(filters);
  base.content.appendChild(textNode('Tuesday, September 22', 16, 'bold', C.ink));
  const row = auto('HORIZONTAL', 16, 0);
  const card1 = await sessionCard(session, 420); const card2 = await sessionCard(full, 420); const card3 = await sessionCard({ ...session, title: 'Reset Mobility', program: 'RESET', time: 'Tue · 6:00 PM', trainer: 'Nora Silva', spots: '8 of 14 spots left' }, 420);
  row.appendChild(card1); row.appendChild(card2); row.appendChild(card3); base.content.appendChild(row);
  const viewButton = await kitButton('View session', 'primary', 160); card1.appendChild(viewButton);

  base = createDesktopBase('D02 · Session Details / Public', 'Session details', 'Review time, trainer, capacity, status, and the configured cutoff. Booking is completed in the separate member workspace.');
  screens.details = base.screen; const details = detailsPanel(720, session); base.content.appendChild(details); const book = await kitButton('Join to book', 'primary', 180); details.appendChild(book);

  base = createDesktopBase('D03 · Join / Membership Decision', 'Join Practice Athletic Club', 'Choose a fictional plan to create a demo member profile, or sign in if you are already a member.');
  screens.auth = base.screen; const auth = auto('VERTICAL', 12, 24); auth.resize(720, 100); auth.counterAxisSizingMode = 'FIXED'; auth.primaryAxisSizingMode = 'AUTO'; auth.fills = [paint(C.white)]; auth.strokes = [paint(C.border)]; auth.cornerRadius = 8;
  auth.appendChild(await kitBadge('RETURN TO LOWER BODY TEMPO'));
  auth.appendChild(textNode('New to Practice?', 20, 'bold', C.ink, 672));
  auth.appendChild(alertBox('Fictional portfolio enrollment', 'Plan selection creates a demo membership only. No payment, credit card, or real subscription is collected.', 'info', 672));
  for (const persona of ['Base · Essential access · $39/month', 'Complete · Guided sessions · $59/month', 'Training+ · Complete support · $79/month']) {
    const personaRow = box(672, 56, C.white, C.border, 5); const t = textNode(persona, 12, 'medium', C.ink); t.x = 16; t.y = 19; personaRow.appendChild(t); auth.appendChild(personaRow);
  }
  const continueButton = await kitButton('Select a plan and register', 'primary', 240); auth.appendChild(continueButton); auth.appendChild(await kitButton('Already a member? Sign in', 'secondary', 240)); base.content.appendChild(auth);

  base = createDesktopBase('D04 · Booking / Confirmed', 'Booking confirmed', 'The authoritative state has refreshed and the reservation is now visible in My bookings.');
  screens.confirmed = base.screen; base.content.appendChild(alertBox('Confirmed reservation', 'Lower Body Tempo · Tuesday at 7:00 AM · Request completed successfully.', 'success', 760)); base.content.appendChild(detailsPanel(760, { ...session, spots: '3 of 16 spots left' })); base.content.appendChild(await kitButton('View My bookings', 'primary', 190));

  base = createDesktopBase('D05 · Session Details / Full', 'Session is full', 'A booking is not promised from stale availability. The member may join the FIFO waitlist.');
  screens.full = base.screen; const fullPanel = detailsPanel(720, full); fullPanel.appendChild(alertBox('No confirmed spots remain', 'Join the waitlist once. Your position is assigned after the server rechecks capacity.', 'warning', 680)); const joinButton = await kitButton('Join waitlist', 'primary', 180); fullPanel.appendChild(joinButton); base.content.appendChild(fullPanel);

  base = createDesktopBase('D06 · Waitlist / Joined', 'You joined the waitlist', 'Position is deterministic and may change only after server-authoritative resolution.');
  screens.waitlist = base.screen; const wait = auto('VERTICAL', 12, 24); wait.resize(760, 100); wait.counterAxisSizingMode = 'FIXED'; wait.primaryAxisSizingMode = 'AUTO'; wait.fills = [paint(C.white)]; wait.strokes = [paint(C.border)]; wait.cornerRadius = 8; wait.appendChild(await kitBadge('WAITLIST POSITION #2', 'warning')); wait.appendChild(textNode(full.title, 22, 'bold', C.ink, 712)); wait.appendChild(textNode(`${full.time} · ${full.trainer}`, 12, 'regular', C.muted, 712)); wait.appendChild(alertBox('Automatic promotion policy', 'When a spot is released, the first eligible waiting member is promoted transactionally.', 'info', 712)); const leave = await kitButton('Leave waitlist', 'secondary', 170); wait.appendChild(leave); base.content.appendChild(wait);

  base = createDesktopBase('D07 · My Bookings / Ready', 'My bookings', 'Upcoming confirmed reservations and waiting entries for the signed-in fictional member.', 'Member');
  screens.myBookings = base.screen; const tabs = auto('HORIZONTAL', 8, 0); tabs.appendChild(await kitBadge('CONFIRMED 1', 'success')); tabs.appendChild(await kitBadge('WAITLIST 1', 'warning')); base.content.appendChild(tabs);
  const booking = await sessionCard(session, 720); booking.appendChild(await kitBadge('CONFIRMED', 'success')); const cancel = await kitButton('Cancel reservation', 'secondary', 190); booking.appendChild(cancel); base.content.appendChild(booking);
  const waiting = await sessionCard(full, 720); waiting.appendChild(await kitBadge('POSITION #2', 'warning')); waiting.appendChild(await kitButton('Leave waitlist', 'secondary', 170)); base.content.appendChild(waiting);

  base = createDesktopBase('D16 · Member Dashboard / Home', 'Welcome back, Alex', 'Your protected member home brings together your next class, booking status, and quick actions.', 'Member');
  screens.dashboard = base.screen; base.content.appendChild(alertBox('Next class', 'Lower Body Tempo · Tuesday at 7:00 AM · Confirmed. Arrive 10 minutes early.', 'success', 760)); base.content.appendChild(alertBox('Waitlist promotion', 'You were promoted to Pace Intervals. Review the confirmed reservation in My bookings.', 'success', 760)); const dashboardActions = auto('HORIZONTAL', 12, 0); dashboardActions.appendChild(await kitButton('Explore schedule', 'primary', 180)); dashboardActions.appendChild(await kitButton('View My bookings', 'secondary', 190)); base.content.appendChild(dashboardActions); base.content.appendChild(alertBox('Membership', 'Complete plan · Fictional demo enrollment · No payment information is stored.', 'info', 760));

  base = createDesktopBase('D08 · Cancellation / Confirmation', 'My bookings', 'Cancellation remains pending until the member confirms and the server rechecks the cutoff.', 'Member');
  screens.cancelDialog = base.screen; base.content.appendChild(await sessionCard(session, 720)); const dialog = auto('VERTICAL', 12, 24); dialog.resize(620, 100); dialog.counterAxisSizingMode = 'FIXED'; dialog.primaryAxisSizingMode = 'AUTO'; dialog.fills = [paint(C.white)]; dialog.strokes = [paint(C.line)]; dialog.cornerRadius = 8; dialog.appendChild(textNode('Cancel this reservation?', 20, 'bold', C.ink, 572)); dialog.appendChild(textNode('The reservation will remain active until cancellation commits. If a waiting member is eligible, the released spot will be transferred in the same transaction.', 12, 'regular', C.ink, 572)); dialog.appendChild(alertBox('Configured cutoff', 'Cancellation is currently permitted. The server validates this again on submit.', 'warning', 572)); const actions = auto('HORIZONTAL', 12, 0); actions.appendChild(await kitButton('Keep reservation', 'secondary', 170)); const confirmCancel = await kitButton('Confirm cancellation', 'primary', 190); actions.appendChild(confirmCancel); dialog.appendChild(actions); base.content.appendChild(dialog);

  base = createDesktopBase('D09 · Cancellation / Success', 'Reservation cancelled', 'The refreshed state shows the committed result without changing maximum capacity.', 'Member');
  screens.cancelSuccess = base.screen; base.content.appendChild(alertBox('Cancellation completed', 'Your reservation was cancelled. The first eligible waiting member was promoted.', 'success', 760)); base.content.appendChild(await sessionCard(full, 720)); base.content.appendChild(await kitButton('Browse schedule', 'primary', 170));

  base = createDesktopBase('D10 · Domain and Failure States', 'Recoverable states', 'Every state preserves context, identifies the cause, and offers a safe next action.');
  screens.failures = base.screen; base.content.appendChild(alertBox('Session expired · 401', 'Re-authenticate in place, then replay the preserved request.', 'danger', 820)); base.content.appendChild(alertBox('Membership inactive · 403', 'Booking is unavailable for this fictional profile. Return to the permitted member experience.', 'warning', 820)); base.content.appendChild(alertBox('Booking conflict · 409', 'This session overlaps another confirmed reservation. Open the conflicting booking.', 'warning', 820)); base.content.appendChild(alertBox('Configured cutoff passed · 422', 'This action is no longer available. Browse other sessions or return to My bookings.', 'danger', 820)); base.content.appendChild(alertBox('Unexpected server failure', 'Nothing was changed. Request ID: demo-7F3A. Retry the preserved request safely.', 'danger', 820));

  base = createDesktopBase('D11 · Sign In / Existing Member', 'Sign in', 'This path is for an existing member or a direct protected-route visit; return to Join to create a fictional member profile.');
  screens.registration = base.screen; const authCols = auto('HORIZONTAL', 32, 0); const credentials = auto('VERTICAL', 12, 20); credentials.resize(560, 100); credentials.counterAxisSizingMode = 'FIXED'; credentials.primaryAxisSizingMode = 'AUTO'; credentials.fills = [paint(C.white)]; credentials.strokes = [paint(C.border)]; credentials.cornerRadius = 8; credentials.appendChild(textNode('Credentials', 18, 'bold', C.ink)); credentials.appendChild(field('Email', 'alex.member@example.invalid', 520)); credentials.appendChild(field('Password', '••••••••••••', 520)); credentials.appendChild(await kitButton('Sign in', 'primary', 180)); const register = auto('VERTICAL', 12, 20); register.resize(650, 100); register.counterAxisSizingMode = 'FIXED'; register.primaryAxisSizingMode = 'AUTO'; register.fills = [paint(C.white)]; register.strokes = [paint(C.border)]; register.cornerRadius = 8; register.appendChild(textNode('Member registration', 18, 'bold', C.ink)); register.appendChild(field('Name', 'Fictional member name', 610)); register.appendChild(checkbox('I agree to the Terms of Service and Privacy Policy.', true, 610)); register.appendChild(checkbox('I confirm physical readiness and sign the Liability Waiver.', true, 610)); register.appendChild(await kitButton('Create demo account', 'primary', 210)); authCols.appendChild(credentials); authCols.appendChild(register); base.content.appendChild(authCols);

  base = createDesktopBase('D12 · Trainer / Assigned Sessions', 'Assigned sessions', 'Read-only access: trainers see only their assigned upcoming sessions and attendee counts.', 'Trainer');
  screens.trainer = base.screen; base.content.appendChild(alertBox('Read-only role', 'Editing schedules, capacity, bookings, and attendees is unavailable to trainers.', 'info', 760)); base.content.appendChild(await sessionCard({ ...session, spots: '12 confirmed attendees' }, 760)); base.content.appendChild(await sessionCard({ ...full, title: 'Strength Foundations', full: false, spots: '9 confirmed attendees' }, 760));

  base = createDesktopBase('D13 · Admin / Session Manager', 'Session manager', 'Operational list with confirmed and waiting counts. Every action is server-authorized.', 'Administrator');
  screens.admin = base.screen; const adminActions = auto('HORIZONTAL', 12, 0); adminActions.appendChild(field('Date', 'This week', 220)); adminActions.appendChild(field('Program', 'All programs', 220)); adminActions.appendChild(await kitButton('Create session', 'primary', 170)); base.content.appendChild(adminActions); const table = auto('VERTICAL', 0, 0); table.resize(1040, 100); table.counterAxisSizingMode = 'FIXED'; table.primaryAxisSizingMode = 'AUTO'; const rows = [['SESSION','TRAINER','TIME','CONFIRMED','WAITING','ACTION'],['Lower Body Tempo','Marcus Vance','Tue 7:00 AM','12 / 16','0','Edit · Participants'],['Pace Intervals','Lena Ortiz','Wed 6:30 PM','12 / 12','4','Edit · Participants'],['Reset Mobility','Nora Silva','Thu 5:30 PM','6 / 14','0','Edit · Participants']]; rows.forEach((cells,index)=>{ const rowFrame=box(1040,index===0?44:54,index===0?C.dark:C.white,C.border,0); const t=textNode(cells.join('        '),11,index===0?'bold':'regular',index===0?C.white:C.ink,1008); t.x=16;t.y=index===0?14:18;rowFrame.appendChild(t);table.appendChild(rowFrame);}); base.content.appendChild(table);

  base = createDesktopBase('D14 · Admin / Edit and Participants', 'Edit session', 'Validation preserves entered values and prevents trainer overlap or capacity below confirmed bookings.', 'Administrator');
  screens.adminForm = base.screen; const formRow = auto('HORIZONTAL', 24, 0); const form = auto('VERTICAL', 10, 18); form.resize(520, 100); form.counterAxisSizingMode = 'FIXED'; form.primaryAxisSizingMode = 'AUTO'; form.fills=[paint(C.white)];form.strokes=[paint(C.border)];form.cornerRadius=8; form.appendChild(field('Program','Pace Intervals',484));form.appendChild(field('Trainer','Lena Ortiz',484));form.appendChild(field('Start','Wed · 6:30 PM',484));form.appendChild(field('Capacity','10',484));form.appendChild(alertBox('Capacity conflict','Capacity cannot be reduced below 12 confirmed bookings.','danger',484));form.appendChild(await kitButton('Save changes','primary',170)); const roster=auto('VERTICAL',10,18);roster.resize(520,100);roster.counterAxisSizingMode='FIXED';roster.primaryAxisSizingMode='AUTO';roster.fills=[paint(C.white)];roster.strokes=[paint(C.border)];roster.cornerRadius=8;roster.appendChild(textNode('Participants',18,'bold',C.ink));roster.appendChild(textNode('Confirmed members · 12\nAlex Morgan\nJamie Cruz\nTaylor Reed\n\nOrdered waitlist · 4\n#1 Jordan Kim\n#2 Casey Brooks\n#3 Morgan Bell\n#4 Drew Park',12,'regular',C.ink,484));formRow.appendChild(form);formRow.appendChild(roster);base.content.appendChild(formRow);

  Object.assign(screens, await buildPublicCoverageDesktop());
  return screens;
}

async function buildMobileScreens(page) {
  const session = { title: 'Lower Body Tempo', program: 'STRENGTH', time: 'Tue · 7:00 AM', duration: '45 min', trainer: 'Marcus Vance', spots: '4 spots left', cutoff: '60 minutes before start' };
  const full = { ...session, title: 'Pace Intervals', program: 'PACE', time: 'Wed · 6:30 PM', trainer: 'Lena Ortiz', spots: 'Full', full: true };
  const screens = {};

  let base = createMobileBase('M00 · Landing / Android Complete', 'Practice Athletic Club', 'A fictional public discovery experience. Joining and booking happen in a separate member workspace.'); screens.landing = base.screen; base.screen.resize(390, 5000); base.bottom.y = 4936; const mobileHero = auto('VERTICAL', 12, 20); mobileHero.resize(358, 280); mobileHero.counterAxisSizingMode = 'FIXED'; mobileHero.fills = [paint(C.white)]; mobileHero.strokes = [paint(C.border)]; mobileHero.cornerRadius = 8; mobileHero.appendChild(await kitBadge('PRACTICE ATHLETIC CLUB')); mobileHero.appendChild(textNode('Train with purpose.', 30, 'bold', C.ink, 318)); mobileHero.appendChild(textNode('Strength, pace, and recovery for real life.', 13, 'regular', C.muted, 318)); const mobileHeroActions = auto('HORIZONTAL', 10, 0); mobileHeroActions.appendChild(await kitButton('Schedule', 'secondary', 150)); mobileHeroActions.appendChild(await kitButton('Join now', 'primary', 150)); mobileHero.appendChild(mobileHeroActions); base.content.appendChild(mobileHero); const mobileSection = (eyebrow, title, body) => { const section = auto('VERTICAL', 5, 0); section.appendChild(textNode(eyebrow.toUpperCase(), 10, 'bold', C.blue, 358)); section.appendChild(textNode(title, 22, 'bold', C.ink, 358)); section.appendChild(textNode(body, 12, 'regular', C.muted, 358)); return section; }; base.content.appendChild(mobileSection('Programs', 'A routine that moves with you.', 'Strength, pace, reset, and open floor.')); for (const program of ['Strength · Technique and progression', 'Pace · Capacity and energy', 'Reset · Mobility and control', 'Open Floor · At your own pace']) { const card = box(358, 56, C.white, C.border, 5); const label = textNode(program, 12, 'medium', C.ink); label.x = 14; label.y = 20; card.appendChild(label); base.content.appendChild(card); } base.content.appendChild(mobileSection('Services', 'Guidance and care throughout.', 'Assessment, training plan, and recovery.')); for (const service of ['Initial assessment', 'Training plan', 'Recovery']) { const card = box(358, 54, C.blueSoft, null, 5); const label = textNode(`${service}  →`, 12, 'bold', C.ink); label.x = 14; label.y = 19; card.appendChild(label); base.content.appendChild(card); } base.content.appendChild(mobileSection('Facilities', 'Spaces that support your training.', 'Fictional spaces for strength, pace, mobility, and recovery.')); const mobileFacilities = box(358, 180, C.canvas, C.line, 6); const facilityLabel = textNode('FACILITIES GALLERY\nREFERENCE IMAGES', 11, 'bold', C.muted, 318, 'CENTER'); facilityLabel.x = 20; facilityLabel.y = 76; mobileFacilities.appendChild(facilityLabel); base.content.appendChild(mobileFacilities); base.content.appendChild(mobileSection('Pricing', 'Choose your training approach.', 'Fictional plans for comparison.')); for (const plan of ['Base · $39 / month', 'Complete · $59 / month', 'Training+ · $79 / month']) { const card = box(358, 66, C.white, C.border, 5); const label = textNode(plan, 14, 'bold', C.ink); label.x = 14; label.y = 15; card.appendChild(label); const sub = textNode('View benefits →', 11, 'medium', C.blue); sub.x = 14; sub.y = 39; card.appendChild(sub); base.content.appendChild(card); } base.content.appendChild(mobileSection('Team', 'You do not train alone.', 'Meet profiles and specialties.')); for (const person of ['Maya · Strength', 'Daniel · Pace', 'Sofia · Mobility']) { const card = box(358, 52, C.white, C.border, 5); const label = textNode(person, 12, 'medium', C.ink); label.x = 14; label.y = 18; card.appendChild(label); base.content.appendChild(card); } base.content.appendChild(mobileSection('Contact', 'Visit the club.', 'Location, hours, and first contact.')); const mobileContact = auto('VERTICAL', 8, 16); mobileContact.resize(358, 170); mobileContact.counterAxisSizingMode = 'FIXED'; mobileContact.fills = [paint(C.white)]; mobileContact.strokes = [paint(C.border)]; mobileContact.cornerRadius = 6; mobileContact.appendChild(textNode('Practice Athletic Club', 16, 'bold', C.ink, 326)); mobileContact.appendChild(textNode('Fictional City · Mon–Sun 06:00–22:00\ncontact@practice.example.invalid', 11, 'regular', C.muted, 326)); mobileContact.appendChild(await kitButton('Contact', 'secondary', 150)); base.content.appendChild(mobileContact); const mobileCta = auto('VERTICAL', 10, 18); mobileCta.resize(358, 154); mobileCta.counterAxisSizingMode = 'FIXED'; mobileCta.fills = [paint(C.blueSoft)]; mobileCta.cornerRadius = 6; mobileCta.appendChild(textNode('Your first session starts here.', 19, 'bold', C.ink, 322)); mobileCta.appendChild(await kitButton('Join now', 'primary', 180)); base.content.appendChild(mobileCta); const mobileFooter = box(358, 190, C.dark, null, 0); const mobileFooterText = textNode('PRACTICE ATHLETIC CLUB\n\nHome · Programs · Schedule\nServices · Facilities · Pricing\nTeam · Contact · About Us · Privacy\nTerms · Liability waiver · Cookie preferences\n\nFictional portfolio project', 11, 'regular', C.canvas, 318); mobileFooterText.x = 20; mobileFooterText.y = 20; mobileFooter.appendChild(mobileFooterText); base.content.appendChild(mobileFooter);
  base = createMobileBase('M01 · Schedule / Ready', 'Schedule', 'Filter and choose a fictional session.'); screens.schedule = base.screen; base.content.appendChild(field('Date','This week',358)); base.content.appendChild(await sessionCard(session,358,true)); base.content.appendChild(await sessionCard(full,358,true)); const view = await kitButton('View Lower Body Tempo','primary',220); base.content.appendChild(view);
  base = createMobileBase('M02 · Session Details / Public','Lower Body Tempo','Review capacity and configured cutoff. Booking continues in the member workspace.'); screens.details=base.screen; const mobileDetails=detailsPanel(358,session); const book=await kitButton('Join to book','primary',326);mobileDetails.appendChild(book);base.content.appendChild(mobileDetails);
  base=createMobileBase('M03 · Join / Membership Decision','Join Practice','Select a fictional plan, or sign in if you are already a member. No payment is collected.');screens.auth=base.screen;base.content.appendChild(await kitBadge('RETURN TO SESSION'));for(const person of ['Base · $39/month','Complete · $59/month','Training+ · $79/month']){const p=box(358,54,C.white,C.border,5);const t=textNode(person,12,'medium',C.ink);t.x=14;t.y=18;p.appendChild(t);base.content.appendChild(p);}const continueButton=await kitButton('Select plan and register','primary',240);base.content.appendChild(continueButton);base.content.appendChild(await kitButton('Already a member? Sign in','secondary',250));
  base=createMobileBase('M04 · Booking / Confirmed','Booking confirmed','Authoritative state refreshed successfully.');screens.confirmed=base.screen;base.content.appendChild(alertBox('Confirmed','Lower Body Tempo · Tue at 7:00 AM','success',358));base.content.appendChild(await sessionCard({...session,spots:'3 spots left'},358,true));base.content.appendChild(await kitButton('View My bookings','primary',220));
  base=createMobileBase('M05 · Waitlist / Join and Status','Session is full','Join once and receive a deterministic FIFO position.');screens.waitlist=base.screen;base.content.appendChild(await sessionCard(full,358,true));base.content.appendChild(alertBox('Position assigned after submit','The server rechecks capacity and duplicates.','warning',358));const join=await kitButton('Join waitlist','primary',220);base.content.appendChild(join);base.content.appendChild(await kitBadge('RESULT · POSITION #2','warning'));
  base=createMobileBase('M06 · My Bookings / Ready','My bookings','Confirmed reservations and waiting entries.');screens.myBookings=base.screen;base.content.appendChild(await sessionCard(session,358,true));const cancel=await kitButton('Cancel reservation','secondary',220);base.content.appendChild(cancel);base.content.appendChild(await sessionCard(full,358,true));base.content.appendChild(await kitButton('Leave waitlist','secondary',200));
  base=createMobileBase('M16 · Member Dashboard / Home','Welcome back, Alex','Your protected member home shows your next class and quick actions.');screens.dashboard=base.screen;base.content.appendChild(alertBox('Next class','Lower Body Tempo · Tuesday at 7:00 AM · Confirmed.','success',358));base.content.appendChild(alertBox('Waitlist promotion','You were promoted to Pace Intervals. Review My bookings.','success',358));base.content.appendChild(await kitButton('Explore schedule','primary',240));base.content.appendChild(await kitButton('View My bookings','secondary',240));base.content.appendChild(alertBox('Membership','Complete plan · Fictional demo enrollment · No payment stored.','info',358));
  base=createMobileBase('M07 · Cancellation / Confirm','Cancel reservation?','The booking remains active until commit.');screens.cancel=base.screen;base.content.appendChild(await sessionCard(session,358,true));base.content.appendChild(alertBox('Promotion may occur','The first eligible waiting member may receive the released spot.','warning',358));const confirm=await kitButton('Confirm cancellation','primary',230);base.content.appendChild(confirm);base.content.appendChild(await kitButton('Keep reservation','secondary',210));
  base=createMobileBase('M08 · Cancellation / Success','Reservation cancelled','The updated state is visible after commit.');screens.success=base.screen;base.content.appendChild(alertBox('Completed','An eligible waiting member was promoted.','success',358));base.content.appendChild(await kitButton('Browse schedule','primary',190));
  base=createMobileBase('M09 · Failure States','Needs attention','Context is preserved and recovery is explicit.');screens.failures=base.screen;base.content.appendChild(alertBox('Session expired · 401','Re-authenticate in place and replay the request.','danger',358));base.content.appendChild(alertBox('Booking conflict · 409','Open the conflicting reservation.','warning',358));base.content.appendChild(alertBox('Cutoff passed · 422','Browse other sessions or return to My bookings.','danger',358));base.content.appendChild(alertBox('Server failure','Request ID demo-7F3A · Retry the preserved request safely.','danger',358));
  base=createMobileBase('M10 · Sign In / Existing Member','Sign in','Use this path only if you are already a member or reached a protected route directly.');screens.register=base.screen;base.content.appendChild(field('Email','member@example.invalid',358));base.content.appendChild(field('Password','••••••••',358));base.content.appendChild(await kitButton('Sign in','primary',220));base.content.appendChild(await kitButton('Back to Join','secondary',220));
  base=createMobileBase('M11 · Trainer / Assigned Sessions','Assigned sessions','Read-only trainer access.');screens.trainer=base.screen;base.content.appendChild(alertBox('Read only','No editing in version one.','info',358));base.content.appendChild(await sessionCard({...session,spots:'12 attendees'},358,true));base.content.appendChild(await sessionCard({...full,full:false,spots:'9 attendees'},358,true));
  base=createMobileBase('M12 · Admin / Sessions','Session manager','Authorized operational actions.');screens.admin=base.screen;base.content.appendChild(await kitButton('Create session','primary',190));base.content.appendChild(await sessionCard({...session,spots:'12 confirmed · 0 waiting'},358,true));base.content.appendChild(await sessionCard({...full,spots:'12 confirmed · 4 waiting'},358,true));base.content.appendChild(alertBox('Validation','Capacity cannot fall below confirmed bookings.','warning',358));

  Object.assign(screens, await buildPublicCoverageMobile());
  return screens;
}

function place(node, x, y) { node.x = x; node.y = y; return node; }

async function createCover(page, pageName) {
  const cover = box(1440, 900, C.white, C.border, 0); cover.name = '00 · Wireframe Index'; page.appendChild(cover);
  const kicker = textNode('FITOPS · PRACTICE ATHLETIC CLUB', 12, 'bold', C.blue); kicker.x = 72; kicker.y = 72; cover.appendChild(kicker);
  const title = textNode('Low-fidelity product wireframes', 44, 'bold', C.ink, 920); title.x = 72; title.y = 112; cover.appendChild(title);
  const subtitle = textNode('Translated from the seven-page FitOps User Flows.drawio architecture into reusable desktop and mobile interface states.', 17, 'regular', C.muted, 920); subtitle.x = 72; subtitle.y = 180; cover.appendChild(subtitle);
  const note = alertBox('Status: exploratory design evidence', 'Neutral WebbyFrames kit styling is used for structure only. This page does not approve the Practice Athletic Club brand system.', 'info', 920); note.x = 72; note.y = 250; cover.appendChild(note);
  const columns = [
    ['MEMBER JOURNEY','Schedule and filters\nSession details\nDemo sign-in\nBooking confirmation\nFull-session waitlist\nMy bookings\nCancellation and recovery'],
    ['AUTH & SECURITY','Credentials and demo personas\nRegistration consent\nSession-expiry recovery\nStable 401/403/409/422 states'],
    ['ROLE COVERAGE','Trainer read-only assignments\nAdministrator session manager\nCreate/edit validation\nParticipants and ordered waitlist']
  ];
  columns.forEach((item,index)=>{const card=auto('VERTICAL',10,20);card.resize(400,300);card.counterAxisSizingMode='FIXED';card.fills=[paint(C.bg)];card.strokes=[paint(C.border)];card.cornerRadius=8;card.appendChild(textNode(item[0],12,'bold',C.blue,360));card.appendChild(textNode(item[1],15,'regular',C.ink,360));card.x=72+index*432;card.y=370;cover.appendChild(card);});
  const footer = textNode('Fictional demo data only · Desktop 1440px · Mobile 390px · Server-authoritative rules', 12, 'medium', C.muted, 1296); footer.x = 72; footer.y = 820; cover.appendChild(footer);
  return cover;
}

function createModuleGuide(page, title, description) {
  const guide = box(1920, 170, C.white, C.border, 0); guide.name = `${title} / Guide`; page.appendChild(guide);
  const kicker = textNode('FITOPS · PRACTICE ATHLETIC CLUB · LOW-FIDELITY', 11, 'bold', C.blue, 1800); kicker.x = 32; kicker.y = 30; guide.appendChild(kicker);
  const heading = textNode(title, 28, 'bold', C.ink, 1800); heading.x = 32; heading.y = 58; guide.appendChild(heading);
  const copy = textNode(description, 12, 'regular', C.muted, 1320); copy.x = 32; copy.y = 108; guide.appendChild(copy);
  const desktop = textNode('DESKTOP · 1440 PX', 11, 'bold', C.muted); desktop.x = 32; desktop.y = 142; guide.appendChild(desktop);
  const android = textNode('ANDROID · 390 PX', 11, 'bold', C.muted); android.x = 1500; android.y = 142; guide.appendChild(android);
  return guide;
}

function cascadeModule(page, title, description, desktopStates, mobileStates) {
  page.backgrounds = [paint(C.canvas)];
  const guide = createModuleGuide(page, title, description); place(guide, 0, 0);
  const rows = Math.max(desktopStates.length, mobileStates.length);
  for (let index = 0; index < rows; index++) {
    const y = 220 + index * 1120;
    const desktop = desktopStates[index];
    const mobile = mobileStates[index];
    if (desktop) { page.appendChild(desktop); place(desktop, 0, y); }
    if (mobile) { page.appendChild(mobile); place(mobile, 1500, y); }
  }
}

function uniqueModulePageName(baseName) {
  let candidate = baseName;
  let version = 2;
  while (figma.root.children.some((page) => page.name === candidate)) candidate = `${baseName} v${version++}`;
  return candidate;
}

async function linkLandingToSchedule(source, destination) {
  await source.setReactionsAsync([{
    trigger: { type: 'ON_CLICK' },
    actions: [{ type: 'NODE', destinationId: destination.id, navigation: 'NAVIGATE', transition: { type: 'DISSOLVE', easing: { type: 'EASE_OUT' }, duration: 0.2 }, resetScrollPosition: true }]
  }]);
}

async function buildFitOpsWireframes() {
  progress('Loading fonts and indexing local WebbyFrames components…');
  await prepareKit();
  await prepareFonts();
  const prefix = 'FitOps /';
  // Frames are created on the current page, then re-parented into module pages.
  // Do not create/remove a scratch page: Figma may forbid page removal in a file.
  const staging = figma.currentPage;
  createdScreens = []; prototypeLinks = [];
  progress('Creating desktop and Android states from the verified user flows…');
  const desktop = await buildDesktopScreens(staging);
  const mobile = await buildMobileScreens(staging);
  const modules = [
    ['00 Public, Legal, and Miscellaneous', 'Route coverage for public destinations, legal pages, cookie preferences, and safe 404 recovery.', [desktop.publicDirectory, desktop.pricingAbout, desktop.legalMisc], [mobile.publicDirectory, mobile.pricingAbout, mobile.legalMisc]],
    ['01 Landing', 'Public marketing entry only. Join now is the primary membership action.', [desktop.landing], [mobile.landing]],
    ['02 Public Schedule', 'Browse public sessions and view class details. Booking continues through Join or the member workspace.', [desktop.schedule, desktop.details, desktop.failures], [mobile.schedule, mobile.details, mobile.failures]],
    ['03 Join', 'New members select a fictional plan; existing members continue to the Member Portal.', [desktop.auth], [mobile.auth]],
    ['04 Member Portal', 'Direct existing-member login and demo persona access from /portal/login.', [desktop.registration], [mobile.register]],
    ['05 Member Workspace', 'Dashboard home, class discovery, and member-owned bookings behind the protected app shell.', [desktop.dashboard, desktop.myBookings], [mobile.dashboard, mobile.myBookings]],
    ['06 Booking', 'Confirmed reservation after the server rechecks eligibility, capacity, and conflicts.', [desktop.confirmed], [mobile.confirmed]],
    ['07 Waitlist', 'Full-session state and deterministic FIFO waitlist result.', [desktop.full, desktop.waitlist], [mobile.waitlist]],
    ['08 Cancellation', 'Confirmation and committed result without inventing capacity.', [desktop.cancelDialog, desktop.cancelSuccess], [mobile.cancel, mobile.success]],
    ['09 Trainer', 'Read-only assigned-session experience.', [desktop.trainer], [mobile.trainer]],
    ['10 Administrator', 'Session operations, validation, participants, and ordered waitlist.', [desktop.admin, desktop.adminForm], [mobile.admin]]
  ];
  progress('Organizing one Figma page per module with side-by-side Android states…');
  const pages = modules.map(([name, description, desktopStates, mobileStates]) => {
    const page = figma.createPage(); page.name = uniqueModulePageName(`${prefix} ${name}`);
    cascadeModule(page, name, description, desktopStates, mobileStates);
    return page;
  });
  progress('Keeping public Landing and Public Schedule as distinct Figma modules…');
  const landingModuleIndex = modules.findIndex(([name]) => name === '01 Landing');
  const landingPage = pages[landingModuleIndex];
  await figma.setCurrentPageAsync(landingPage);
  figma.currentPage.selection = [desktop.landing];
  figma.viewport.scrollAndZoomIntoView([desktop.landing, mobile.landing]);
  figma.ui.postMessage({ type: 'wireframes-complete', pageName: 'FitOps module wireframes', pageCount: pages.length, screenCount: createdScreens.length });
}
