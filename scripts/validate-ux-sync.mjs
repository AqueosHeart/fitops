import {readFileSync} from 'node:fs';

const drawio = readFileSync('second-brain/wiki/design/FitOps User Flows.drawio', 'utf8');
const sitemap = readFileSync('docs/design/sitemap.mmd', 'utf8');
const wireframes = readFileSync('scripts/figma-plugin/wireframes.js', 'utf8');

const routeMappings = [
  ['Home /', 'Home /'], ['Programs /programs', 'Programs /programs'],
  ['Services /#services', 'Services /#services'], ['Facilities /#facilities', 'Facilities /#facilities'],
  ['Contact /#contact', 'Contact /#contact'], ['Schedule /schedule', 'Schedule /schedule'],
  ['Trainers /trainers', 'Trainers /trainers'], ['Pricing /pricing', 'Pricing /pricing'],
  ['About Us /about', 'About Us /about'], ['Terms of Service /terms', 'Terms of Service /terms'],
  ['Privacy Policy /privacy', 'Privacy Policy /privacy'], ['Liability Waiver /waiver', 'Liability Waiver /waiver'],
  ['Cookie preferences /cookie-settings', 'Cookie preferences /cookie-settings'], ['Not Found /404', 'Not Found /404'],
  ['Join now /join', 'Join now /join'], ['Member Portal Login /portal/login', 'Member Portal Login /portal/login'],
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
    ['Mermaid sitemap', sitemap, drawioLabel],
    ['Figma route coverage', wireframes, figmaLabel],
  ];
  return locations.filter(([, content, label]) => !content.includes(label)).map(([location]) => `${drawioLabel} missing from ${location}`);
});

const spanishTokens = /\b(inicio|actividades|horario|servicios|instalaciones|tarifas|equipo|contacto|fuerza|movilidad|recuperaci[oó]n|sesiones|fictici\w*|datos|ubicaci[oó]n|horarios|privacidad|t[eé]rminos|entrena|consulta|reserva|conoce|elige|entrenamiento|centro|ciudad)\b/i;
if (spanishTokens.test(wireframes)) missing.push('Spanish UI copy found in the Figma wireframe generator');
if (wireframes.includes("const access = textNode('Sign in'")) missing.push('Landing header exposes Sign In instead of Join now');

if (missing.length > 0) {
  console.error(`UX synchronization failed:\n- ${missing.join('\n- ')}`);
  process.exit(1);
}

console.log(`UX synchronization passed: ${routeMappings.length} draw.io routes or anchors are mapped in the Mermaid sitemap and English-only Figma generator.`);
