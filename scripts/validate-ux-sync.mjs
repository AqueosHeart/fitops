import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const drawio = readFileSync('second-brain/wiki/design/FitOps User Flows.drawio', 'utf8');
const sitemap = readFileSync('docs/design/sitemap.mmd', 'utf8');
const architecture = readFileSync('docs/design/route-access-architecture.mmd', 'utf8');
const wireframes = readFileSync('scripts/figma-plugin/wireframes.js', 'utf8');
const content = readFileSync('scripts/figma-plugin/wireframe-content.js', 'utf8');
const routes = runInNewContext(`${content}; WIREFRAME_ROUTES`);

const routeMappings = [
  ['Home /', 'Home /'], ['Programs /programs', 'Programs /programs'],
  ['Services /#services', 'Services /#services'], ['Facilities /#facilities', 'Facilities /#facilities'],
  ['Contact /#contact', 'Contact /#contact'], ['Schedule /schedule', 'Schedule /schedule'],
  ['Trainers /trainers', 'Trainers /trainers'], ['Pricing /pricing', 'Pricing /pricing'],
  ['About Us /about', 'About Us /about'], ['Terms of Service /terms', 'Terms of Service /terms'],
  ['Privacy Policy /privacy', 'Privacy Policy /privacy'], ['Liability Waiver /waiver', 'Liability Waiver /waiver'],
  ['Cookie preferences /cookie-settings', 'Cookie preferences /cookie-settings'], ['Not Found /404', 'Not Found /404'],
  ['Join Now /join', 'Join Now /join'], ['My Account /portal/login', 'My Account /portal/login'],
  ['Member registration /register', 'Member registration /register'], ['Account recovery /auth/forgot-password', 'Account recovery /auth/forgot-password'],
  ['Member dashboard /app', 'Member dashboard /app'], ['Member schedule /app/schedule', 'Member schedule /app/schedule'],
  ['My bookings /app/bookings', 'My bookings /app/bookings'], ['Profile &amp; Security /app/profile/security', 'Profile and Security /app/profile/security'], ['Assigned sessions /trainer/sessions', 'Assigned sessions /trainer/sessions'],
  ['Assigned session /trainer/sessions/:id', 'Assigned session /trainer/sessions/:id'], ['Operations overview /admin', 'Operations overview /admin'],
  ['Session manager /admin/sessions', 'Session manager /admin/sessions'], ['Create session /admin/sessions/new', 'Create session /admin/sessions/new'],
  ['Edit session /admin/sessions/:id/edit', 'Edit session /admin/sessions/:id/edit'], ['Participants /admin/sessions/:id/participants', 'Participants /admin/sessions/:id/participants'],
];

const missing = routeMappings.flatMap(([drawioLabel, figmaLabel]) => {
  const locations = [
    ['draw.io', drawio, drawioLabel],
    ['Mermaid route/access architecture', architecture, drawioLabel],
  ];
  return locations.filter(([, content, label]) => !content.includes(label)).map(([location]) => `${drawioLabel} missing from ${location}`);
});

// Page inventory is distinct from anchors, system fallbacks, and interaction states.
const sitemapPage = drawio.match(/<diagram id="00Sitemap"[\s\S]*?<\/diagram>/)?.[0] ?? '';
const architecturePage = drawio.match(/<diagram id="01Sitemap"[\s\S]*?<\/diagram>/)?.[0] ?? '';
const routeNodes = [...sitemapPage.matchAll(/<mxCell\b[^>]*\broute="([^"]+)"[^>]*>/g)];
const actualRoutes = routeNodes.map((match) => match[1]);
const expectedRoutes = routeMappings.map(([label]) => label.slice(label.indexOf(' /') + 1))
  .filter((route) => !route.startsWith('/#') && route !== '/404');
expectedRoutes.push('/sessions/:id');
const exportedRoutes = [...sitemap.matchAll(/^\s+\w+\["(\/[^"\n]*)"\]/gm)].map((match) => match[1]);
for (const route of expectedRoutes) {
  if (!actualRoutes.includes(route)) missing.push(`Page ${route} missing from draw.io 00 Sitemap`);
  if (!exportedRoutes.includes(route)) missing.push(`Page ${route} missing from Mermaid sitemap`);
  if (!architecturePage.includes(route)) missing.push(`Page ${route} missing from draw.io route/access architecture`);
  if (!routes.some(entry => entry.route === route)) missing.push(`Page ${route} missing from Figma screen definitions`);
}
if (!routes.some(entry => entry.route === '/404')) missing.push('Missing separate 404 fallback screen');
const coveragePage = drawio.match(/<diagram id="08WireframeCoverage"[\s\S]*?<\/diagram>/)?.[0] ?? '';
for (const route of routes) {
  const cell = coveragePage.match(new RegExp(`<mxCell id="coverage_${route.id}"[^>]+>`))?.[0] ?? '';
  if (!cell.includes(`route="${route.route}"`) || !cell.includes(`scenarios="${route.states.length + 1}"`)) missing.push(`Draw.io wireframe coverage differs for ${route.route}`);
}
for (const anchor of ['services', 'facilities', 'contact']) {
  if (!routes.find(entry => entry.route === '/')?.sections.some(section => section.anchor === anchor)) missing.push(`Landing section ${anchor} missing from Figma definition`);
}
for (const [label, routes] of [['draw.io', actualRoutes], ['Mermaid', exportedRoutes]]) {
  if (new Set(routes).size !== routes.length) missing.push(`Duplicate page in ${label} sitemap`);
  for (const route of routes) if (!expectedRoutes.includes(route)) missing.push(`Unexpected page ${route} in ${label} sitemap`);
}
for (const [match, route] of routeNodes) {
  if (!match.includes(`value="${route}"`)) missing.push(`Non-URL label in sitemap route ${route}`);
}

const spanishTokens = /\b(inicio|actividades|horario|servicios|instalaciones|tarifas|equipo|contacto|fuerza|movilidad|recuperaci[oó]n|sesiones|fictici\w*|datos|ubicaci[oó]n|horarios|privacidad|t[eé]rminos|entrena|consulta|reserva|conoce|elige|entrenamiento|centro|ciudad)\b/i;
if (spanishTokens.test(content)) missing.push('Spanish UI copy found in the Figma wireframe content');
if (wireframes.includes("const access = textNode('Sign in'")) missing.push('Landing header exposes Sign In instead of My Account and Join Now');

if (missing.length > 0) {
  console.error(`UX synchronization failed:\n- ${missing.join('\n- ')}`);
  process.exit(1);
}

console.log(`UX synchronization passed: ${expectedRoutes.length} page routes, a separate 404 screen, and ${routes.reduce((n, r) => n + 1 + r.states.length, 0)} scenarios per device match the Figma definitions and draw.io coverage. This is static coverage, not live Figma visual validation.`);
