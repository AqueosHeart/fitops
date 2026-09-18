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
  const nav = textNode('Programs     Schedule     Trainers     Pricing', 12, 'medium', C.ink);
  nav.x = 500; nav.y = 30; header.appendChild(nav);
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
  const action = textNode('Help   Menu', 11, 'medium', C.blue); action.x = 300; action.y = 24; header.appendChild(action);
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
  return { screen, content };
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

async function buildDesktopScreens(page) {
  const session = { title: 'Lower Body Tempo', program: 'STRENGTH', time: 'Tue · 7:00 AM', duration: '45 min', trainer: 'Marcus Vance', spots: '4 of 16 spots left', cutoff: '60 minutes before start' };
  const full = { ...session, title: 'Pace Intervals', program: 'PACE', time: 'Wed · 6:30 PM', trainer: 'Lena Ortiz', spots: '0 of 12 spots left', full: true };
  const screens = {};

  let base = createDesktopBase('D00 · Landing / Primary', 'Build strength that fits real life.', 'A fictional Practice Athletic Club landing experience that leads into the schedule.');
  screens.landing = base.screen;
  const hero = auto('HORIZONTAL', 24, 28); hero.resize(1312, 260); hero.counterAxisSizingMode = 'FIXED'; hero.fills = [paint(C.white)]; hero.strokes = [paint(C.border)]; hero.cornerRadius = 8;
  const heroCopy = auto('VERTICAL', 12, 0); heroCopy.resize(720, 100); heroCopy.counterAxisSizingMode = 'FIXED'; heroCopy.primaryAxisSizingMode = 'AUTO'; heroCopy.appendChild(textNode('Strength. Pace. Reset.', 36, 'bold', C.ink, 720)); heroCopy.appendChild(textNode('A fictional training club for people who want a clear plan, a supportive room, and a schedule that respects their time.', 15, 'regular', C.muted, 640)); heroCopy.appendChild(await kitButton('Browse schedule', 'primary', 180));
  const heroPanel = auto('VERTICAL', 10, 20); heroPanel.resize(500, 200); heroPanel.counterAxisSizingMode = 'FIXED'; heroPanel.fills = [paint(C.blueSoft)]; heroPanel.cornerRadius = 6; heroPanel.appendChild(await kitBadge('THIS WEEK')); heroPanel.appendChild(textNode('18 guided sessions', 24, 'bold', C.ink, 460)); heroPanel.appendChild(textNode('Programs for strength, pace, recovery, and open-floor work.', 12, 'regular', C.muted, 460)); hero.appendChild(heroCopy); hero.appendChild(heroPanel); base.content.appendChild(hero);
  const landingPrograms = auto('HORIZONTAL', 16, 0); ['Strength\nBuild durable force.', 'Pace\nTrain capacity and rhythm.', 'Reset\nRecover with intent.'].forEach((copy) => { const card = auto('VERTICAL', 8, 18); card.resize(416, 132); card.counterAxisSizingMode = 'FIXED'; card.fills = [paint(C.white)]; card.strokes = [paint(C.border)]; card.cornerRadius = 6; card.appendChild(textNode(copy, 16, 'bold', C.ink, 380)); landingPrograms.appendChild(card); }); base.content.appendChild(landingPrograms);
  const landingPreview = auto('VERTICAL', 8, 18); landingPreview.resize(1312, 154); landingPreview.counterAxisSizingMode = 'FIXED'; landingPreview.fills = [paint(C.white)]; landingPreview.strokes = [paint(C.border)]; landingPreview.cornerRadius = 6; landingPreview.appendChild(textNode('Your next session starts here', 20, 'bold', C.ink, 1276)); landingPreview.appendChild(textNode('Explore availability, review a session, then book or join a waitlist after server-side checks.', 13, 'regular', C.muted, 1276)); base.content.appendChild(landingPreview);

  base = createDesktopBase('D01 · Schedule / Ready', 'Find your next session', 'Filter the fictional schedule by date, program, trainer, and availability.');
  screens.schedule = base.screen;
  const filters = auto('HORIZONTAL', 12, 0); filters.appendChild(field('Date', 'This week', 210)); filters.appendChild(field('Program', 'All programs', 210)); filters.appendChild(field('Trainer', 'All trainers', 210)); filters.appendChild(field('Availability', 'Any availability', 210)); base.content.appendChild(filters);
  base.content.appendChild(textNode('Tuesday, September 22', 16, 'bold', C.ink));
  const row = auto('HORIZONTAL', 16, 0);
  const card1 = await sessionCard(session, 420); const card2 = await sessionCard(full, 420); const card3 = await sessionCard({ ...session, title: 'Reset Mobility', program: 'RESET', time: 'Tue · 6:00 PM', trainer: 'Nora Silva', spots: '8 of 14 spots left' }, 420);
  row.appendChild(card1); row.appendChild(card2); row.appendChild(card3); base.content.appendChild(row);
  const viewButton = await kitButton('View session', 'primary', 160); card1.appendChild(viewButton);

  base = createDesktopBase('D02 · Session Details / Available', 'Session details', 'Review time, trainer, capacity, status, and the configured cutoff before booking.');
  screens.details = base.screen; const details = detailsPanel(720, session); base.content.appendChild(details); const book = await kitButton('Book session', 'primary', 180); details.appendChild(book);

  base = createDesktopBase('D03 · Demo Sign In / Preserved Intent', 'Continue to booking', 'Authentication preserves the selected session and returns here after sign-in.');
  screens.auth = base.screen; const auth = auto('VERTICAL', 12, 24); auth.resize(720, 100); auth.counterAxisSizingMode = 'FIXED'; auth.primaryAxisSizingMode = 'AUTO'; auth.fills = [paint(C.white)]; auth.strokes = [paint(C.border)]; auth.cornerRadius = 8;
  auth.appendChild(await kitBadge('RETURN TO LOWER BODY TEMPO'));
  auth.appendChild(textNode('Choose a fictional demo persona', 20, 'bold', C.ink, 672));
  auth.appendChild(alertBox('Demo environment', 'No production accounts or personal information are used.', 'info', 672));
  for (const persona of ['Alex Morgan · Member', 'Marcus Vance · Trainer', 'Sarah Lin · Administrator']) {
    const personaRow = box(672, 56, C.white, C.border, 5); const t = textNode(persona, 12, 'medium', C.ink); t.x = 16; t.y = 19; personaRow.appendChild(t); auth.appendChild(personaRow);
  }
  const continueButton = await kitButton('Continue as Alex Morgan', 'primary', 240); auth.appendChild(continueButton); base.content.appendChild(auth);

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

  base = createDesktopBase('D08 · Cancellation / Confirmation', 'My bookings', 'Cancellation remains pending until the member confirms and the server rechecks the cutoff.', 'Member');
  screens.cancelDialog = base.screen; base.content.appendChild(await sessionCard(session, 720)); const dialog = auto('VERTICAL', 12, 24); dialog.resize(620, 100); dialog.counterAxisSizingMode = 'FIXED'; dialog.primaryAxisSizingMode = 'AUTO'; dialog.fills = [paint(C.white)]; dialog.strokes = [paint(C.line)]; dialog.cornerRadius = 8; dialog.appendChild(textNode('Cancel this reservation?', 20, 'bold', C.ink, 572)); dialog.appendChild(textNode('The reservation will remain active until cancellation commits. If a waiting member is eligible, the released spot will be transferred in the same transaction.', 12, 'regular', C.ink, 572)); dialog.appendChild(alertBox('Configured cutoff', 'Cancellation is currently permitted. The server validates this again on submit.', 'warning', 572)); const actions = auto('HORIZONTAL', 12, 0); actions.appendChild(await kitButton('Keep reservation', 'secondary', 170)); const confirmCancel = await kitButton('Confirm cancellation', 'primary', 190); actions.appendChild(confirmCancel); dialog.appendChild(actions); base.content.appendChild(dialog);

  base = createDesktopBase('D09 · Cancellation / Success', 'Reservation cancelled', 'The refreshed state shows the committed result without changing maximum capacity.', 'Member');
  screens.cancelSuccess = base.screen; base.content.appendChild(alertBox('Cancellation completed', 'Your reservation was cancelled. The first eligible waiting member was promoted.', 'success', 760)); base.content.appendChild(await sessionCard(full, 720)); base.content.appendChild(await kitButton('Browse schedule', 'primary', 170));

  base = createDesktopBase('D10 · Domain and Failure States', 'Recoverable states', 'Every state preserves context, identifies the cause, and offers a safe next action.');
  screens.failures = base.screen; base.content.appendChild(alertBox('Session expired · 401', 'Re-authenticate without losing the selected session or pending action.', 'danger', 820)); base.content.appendChild(alertBox('Membership inactive · 403', 'Booking is unavailable for this fictional profile.', 'warning', 820)); base.content.appendChild(alertBox('Booking conflict · 409', 'This session overlaps another confirmed reservation. Open the conflicting booking.', 'warning', 820)); base.content.appendChild(alertBox('Configured cutoff passed · 422', 'The booking or cancellation action is no longer available.', 'danger', 820)); base.content.appendChild(alertBox('Unexpected server failure', 'Nothing was changed. Request ID: demo-7F3A. Retry safely.', 'danger', 820));

  base = createDesktopBase('D11 · Authentication / Registration', 'Sign in or create a demo member', 'Credentials and one-click personas share the same server-managed session model.');
  screens.registration = base.screen; const authCols = auto('HORIZONTAL', 32, 0); const credentials = auto('VERTICAL', 12, 20); credentials.resize(560, 100); credentials.counterAxisSizingMode = 'FIXED'; credentials.primaryAxisSizingMode = 'AUTO'; credentials.fills = [paint(C.white)]; credentials.strokes = [paint(C.border)]; credentials.cornerRadius = 8; credentials.appendChild(textNode('Credentials', 18, 'bold', C.ink)); credentials.appendChild(field('Email', 'alex.member@example.invalid', 520)); credentials.appendChild(field('Password', '••••••••••••', 520)); credentials.appendChild(await kitButton('Sign in', 'primary', 180)); const register = auto('VERTICAL', 12, 20); register.resize(650, 100); register.counterAxisSizingMode = 'FIXED'; register.primaryAxisSizingMode = 'AUTO'; register.fills = [paint(C.white)]; register.strokes = [paint(C.border)]; register.cornerRadius = 8; register.appendChild(textNode('Member registration', 18, 'bold', C.ink)); register.appendChild(field('Name', 'Fictional member name', 610)); register.appendChild(checkbox('I agree to the Terms of Service and Privacy Policy.', true, 610)); register.appendChild(checkbox('I confirm physical readiness and sign the Liability Waiver.', true, 610)); register.appendChild(await kitButton('Create demo account', 'primary', 210)); authCols.appendChild(credentials); authCols.appendChild(register); base.content.appendChild(authCols);

  base = createDesktopBase('D12 · Trainer / Assigned Sessions', 'Assigned sessions', 'Read-only access: trainers see only their assigned upcoming sessions and attendee counts.', 'Trainer');
  screens.trainer = base.screen; base.content.appendChild(alertBox('Read-only role', 'Editing schedules, capacity, bookings, and attendees is unavailable to trainers.', 'info', 760)); base.content.appendChild(await sessionCard({ ...session, spots: '12 confirmed attendees' }, 760)); base.content.appendChild(await sessionCard({ ...full, title: 'Strength Foundations', full: false, spots: '9 confirmed attendees' }, 760));

  base = createDesktopBase('D13 · Admin / Session Manager', 'Session manager', 'Operational list with confirmed and waiting counts. Every action is server-authorized.', 'Administrator');
  screens.admin = base.screen; const adminActions = auto('HORIZONTAL', 12, 0); adminActions.appendChild(field('Date', 'This week', 220)); adminActions.appendChild(field('Program', 'All programs', 220)); adminActions.appendChild(await kitButton('Create session', 'primary', 170)); base.content.appendChild(adminActions); const table = auto('VERTICAL', 0, 0); table.resize(1040, 100); table.counterAxisSizingMode = 'FIXED'; table.primaryAxisSizingMode = 'AUTO'; const rows = [['SESSION','TRAINER','TIME','CONFIRMED','WAITING','ACTION'],['Lower Body Tempo','Marcus Vance','Tue 7:00 AM','12 / 16','0','Edit · Participants'],['Pace Intervals','Lena Ortiz','Wed 6:30 PM','12 / 12','4','Edit · Participants'],['Reset Mobility','Nora Silva','Thu 5:30 PM','6 / 14','0','Edit · Participants']]; rows.forEach((cells,index)=>{ const rowFrame=box(1040,index===0?44:54,index===0?C.dark:C.white,C.border,0); const t=textNode(cells.join('        '),11,index===0?'bold':'regular',index===0?C.white:C.ink,1008); t.x=16;t.y=index===0?14:18;rowFrame.appendChild(t);table.appendChild(rowFrame);}); base.content.appendChild(table);

  base = createDesktopBase('D14 · Admin / Edit and Participants', 'Edit session', 'Validation preserves entered values and prevents trainer overlap or capacity below confirmed bookings.', 'Administrator');
  screens.adminForm = base.screen; const formRow = auto('HORIZONTAL', 24, 0); const form = auto('VERTICAL', 10, 18); form.resize(520, 100); form.counterAxisSizingMode = 'FIXED'; form.primaryAxisSizingMode = 'AUTO'; form.fills=[paint(C.white)];form.strokes=[paint(C.border)];form.cornerRadius=8; form.appendChild(field('Program','Pace Intervals',484));form.appendChild(field('Trainer','Lena Ortiz',484));form.appendChild(field('Start','Wed · 6:30 PM',484));form.appendChild(field('Capacity','10',484));form.appendChild(alertBox('Capacity conflict','Capacity cannot be reduced below 12 confirmed bookings.','danger',484));form.appendChild(await kitButton('Save changes','primary',170)); const roster=auto('VERTICAL',10,18);roster.resize(520,100);roster.counterAxisSizingMode='FIXED';roster.primaryAxisSizingMode='AUTO';roster.fills=[paint(C.white)];roster.strokes=[paint(C.border)];roster.cornerRadius=8;roster.appendChild(textNode('Participants',18,'bold',C.ink));roster.appendChild(textNode('Confirmed members · 12\nAlex Morgan\nJamie Cruz\nTaylor Reed\n\nOrdered waitlist · 4\n#1 Jordan Kim\n#2 Casey Brooks\n#3 Morgan Bell\n#4 Drew Park',12,'regular',C.ink,484));formRow.appendChild(form);formRow.appendChild(roster);base.content.appendChild(formRow);

  return screens;
}

async function buildMobileScreens(page) {
  const session = { title: 'Lower Body Tempo', program: 'STRENGTH', time: 'Tue · 7:00 AM', duration: '45 min', trainer: 'Marcus Vance', spots: '4 spots left', cutoff: '60 minutes before start' };
  const full = { ...session, title: 'Pace Intervals', program: 'PACE', time: 'Wed · 6:30 PM', trainer: 'Lena Ortiz', spots: 'Full', full: true };
  const screens = {};

  let base = createMobileBase('M00 · Landing / Android', 'Practice Athletic Club', 'Fictional training, clear next steps.'); screens.landing = base.screen; const mobileHero = auto('VERTICAL', 12, 20); mobileHero.resize(358, 242); mobileHero.counterAxisSizingMode = 'FIXED'; mobileHero.fills = [paint(C.white)]; mobileHero.strokes = [paint(C.border)]; mobileHero.cornerRadius = 8; mobileHero.appendChild(await kitBadge('FICTIONAL DEMO')); mobileHero.appendChild(textNode('Strength. Pace. Reset.', 28, 'bold', C.ink, 318)); mobileHero.appendChild(textNode('Find guided sessions that fit your real schedule.', 13, 'regular', C.muted, 318)); mobileHero.appendChild(await kitButton('Browse schedule', 'primary', 230)); base.content.appendChild(mobileHero); for (const program of ['Strength', 'Pace', 'Reset']) { const card = box(358, 48, C.white, C.border, 5); const label = textNode(`${program}  ·  Explore sessions`, 12, 'medium', C.ink); label.x = 14; label.y = 17; card.appendChild(label); base.content.appendChild(card); }
  base = createMobileBase('M01 · Schedule / Ready', 'Schedule', 'Filter and choose a fictional session.'); screens.schedule = base.screen; base.content.appendChild(field('Date','This week',358)); base.content.appendChild(await sessionCard(session,358,true)); base.content.appendChild(await sessionCard(full,358,true)); const view = await kitButton('View Lower Body Tempo','primary',220); base.content.appendChild(view);
  base = createMobileBase('M02 · Session Details / Available','Lower Body Tempo','Review capacity and configured cutoff.'); screens.details=base.screen; const mobileDetails=detailsPanel(358,session); const book=await kitButton('Book session','primary',326);mobileDetails.appendChild(book);base.content.appendChild(mobileDetails);
  base=createMobileBase('M03 · Demo Sign In','Continue to booking','Selected session and booking intent are preserved.');screens.auth=base.screen;base.content.appendChild(await kitBadge('RETURN TO SESSION'));for(const person of ['Alex Morgan · Member','Marcus Vance · Trainer','Sarah Lin · Administrator']){const p=box(358,54,C.white,C.border,5);const t=textNode(person,12,'medium',C.ink);t.x=14;t.y=18;p.appendChild(t);base.content.appendChild(p);}const continueButton=await kitButton('Continue as Alex','primary',220);base.content.appendChild(continueButton);
  base=createMobileBase('M04 · Booking / Confirmed','Booking confirmed','Authoritative state refreshed successfully.');screens.confirmed=base.screen;base.content.appendChild(alertBox('Confirmed','Lower Body Tempo · Tue at 7:00 AM','success',358));base.content.appendChild(await sessionCard({...session,spots:'3 spots left'},358,true));base.content.appendChild(await kitButton('View My bookings','primary',220));
  base=createMobileBase('M05 · Waitlist / Join and Status','Session is full','Join once and receive a deterministic FIFO position.');screens.waitlist=base.screen;base.content.appendChild(await sessionCard(full,358,true));base.content.appendChild(alertBox('Position assigned after submit','The server rechecks capacity and duplicates.','warning',358));const join=await kitButton('Join waitlist','primary',220);base.content.appendChild(join);base.content.appendChild(await kitBadge('RESULT · POSITION #2','warning'));
  base=createMobileBase('M06 · My Bookings / Ready','My bookings','Confirmed reservations and waiting entries.');screens.myBookings=base.screen;base.content.appendChild(await sessionCard(session,358,true));const cancel=await kitButton('Cancel reservation','secondary',220);base.content.appendChild(cancel);base.content.appendChild(await sessionCard(full,358,true));base.content.appendChild(await kitButton('Leave waitlist','secondary',200));
  base=createMobileBase('M07 · Cancellation / Confirm','Cancel reservation?','The booking remains active until commit.');screens.cancel=base.screen;base.content.appendChild(await sessionCard(session,358,true));base.content.appendChild(alertBox('Promotion may occur','The first eligible waiting member may receive the released spot.','warning',358));const confirm=await kitButton('Confirm cancellation','primary',230);base.content.appendChild(confirm);base.content.appendChild(await kitButton('Keep reservation','secondary',210));
  base=createMobileBase('M08 · Cancellation / Success','Reservation cancelled','The updated state is visible after commit.');screens.success=base.screen;base.content.appendChild(alertBox('Completed','An eligible waiting member was promoted.','success',358));base.content.appendChild(await kitButton('Browse schedule','primary',190));
  base=createMobileBase('M09 · Failure States','Needs attention','Context is preserved and recovery is explicit.');screens.failures=base.screen;base.content.appendChild(alertBox('Session expired · 401','Re-authenticate and resume.','danger',358));base.content.appendChild(alertBox('Booking conflict · 409','Open the conflicting reservation.','warning',358));base.content.appendChild(alertBox('Cutoff passed · 422','This action is no longer available.','danger',358));base.content.appendChild(alertBox('Server failure','Request ID demo-7F3A · Retry safely.','danger',358));
  base=createMobileBase('M10 · Registration / Legal Consent','Create demo member','Terms, privacy, and waiver are mandatory.');screens.register=base.screen;base.content.appendChild(field('Name','Fictional member',358));base.content.appendChild(field('Email','member@example.invalid',358));base.content.appendChild(checkbox('Terms and Privacy Policy',true,358));base.content.appendChild(checkbox('Physical readiness and Liability Waiver',true,358));base.content.appendChild(await kitButton('Create demo account','primary',240));
  base=createMobileBase('M11 · Trainer / Assigned Sessions','Assigned sessions','Read-only trainer access.');screens.trainer=base.screen;base.content.appendChild(alertBox('Read only','No editing in version one.','info',358));base.content.appendChild(await sessionCard({...session,spots:'12 attendees'},358,true));base.content.appendChild(await sessionCard({...full,full:false,spots:'9 attendees'},358,true));
  base=createMobileBase('M12 · Admin / Sessions','Session manager','Authorized operational actions.');screens.admin=base.screen;base.content.appendChild(await kitButton('Create session','primary',190));base.content.appendChild(await sessionCard({...session,spots:'12 confirmed · 0 waiting'},358,true));base.content.appendChild(await sessionCard({...full,spots:'12 confirmed · 4 waiting'},358,true));base.content.appendChild(alertBox('Validation','Capacity cannot fall below confirmed bookings.','warning',358));

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

async function buildFitOpsWireframes() {
  progress('Loading fonts and indexing local WebbyFrames components…');
  await prepareKit();
  await prepareFonts();
  const prefix = 'FitOps /';
  const staging = figma.createPage(); staging.name = `${prefix} Wireframe Staging`; await figma.setCurrentPageAsync(staging); staging.backgrounds = [paint(C.canvas)];
  createdScreens = []; prototypeLinks = [];
  progress('Creating desktop and Android states from the verified user flows…');
  const desktop = await buildDesktopScreens(staging);
  const mobile = await buildMobileScreens(staging);
  const modules = [
    ['01 Landing', 'Public entry point with program discovery and a direct route into the schedule.', [desktop.landing], [mobile.landing]],
    ['02 Schedule', 'Browse, inspect session details, and recover safely from availability or domain failures.', [desktop.schedule, desktop.details, desktop.failures], [mobile.schedule, mobile.details, mobile.failures]],
    ['03 Authentication', 'Context-preserving sign-in, demo personas, registration, legal consent, and recovery.', [desktop.auth, desktop.registration], [mobile.auth, mobile.register]],
    ['04 Booking', 'Confirmed reservation after the server rechecks eligibility, capacity, and conflicts.', [desktop.confirmed], [mobile.confirmed]],
    ['05 Waitlist', 'Full-session state and deterministic FIFO waitlist result.', [desktop.full, desktop.waitlist], [mobile.waitlist]],
    ['06 My Bookings', 'Member-owned confirmed and waiting entries.', [desktop.myBookings], [mobile.myBookings]],
    ['07 Cancellation', 'Confirmation and committed result without inventing capacity.', [desktop.cancelDialog, desktop.cancelSuccess], [mobile.cancel, mobile.success]],
    ['08 Trainer', 'Read-only assigned-session experience.', [desktop.trainer], [mobile.trainer]],
    ['09 Administrator', 'Session operations, validation, participants, and ordered waitlist.', [desktop.admin, desktop.adminForm], [mobile.admin]]
  ];
  progress('Organizing one Figma page per module with side-by-side Android states…');
  const pages = modules.map(([name, description, desktopStates, mobileStates]) => {
    const page = figma.createPage(); page.name = `${prefix} ${name}`;
    cascadeModule(page, name, description, desktopStates, mobileStates);
    return page;
  });
  staging.remove();
  await figma.setCurrentPageAsync(pages[0]);
  figma.currentPage.selection = [desktop.landing];
  figma.viewport.scrollAndZoomIntoView([desktop.landing, mobile.landing]);
  figma.ui.postMessage({ type: 'wireframes-complete', pageName: 'FitOps module wireframes', pageCount: pages.length, screenCount: createdScreens.length });
}
