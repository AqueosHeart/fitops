import fs from 'node:fs';

throw new Error(
  'Deprecated: FitOps User Flows.drawio is the editable UX source of truth. Do not regenerate it from this stale script; update the .drawio file first, then refresh Mermaid and Figma derived views.',
);

const outputPath = 'second-brain/wiki/design/FitOps User Flows.drawio';

const esc = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const palette = {
  default: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#F2F0E8;strokeColor=#111310;fontColor=#111310;fontSize=13;spacing=8;',
  decision: 'rhombus;whiteSpace=wrap;html=1;fillColor=#FFF4D6;strokeColor=#7A4B00;fontColor=#111310;fontSize=12;spacing=8;',
  success: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#DDEBD8;strokeColor=#1F4D32;fontColor=#111310;fontSize=13;spacing=8;',
  error: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#F7DFDC;strokeColor=#9E2E25;fontColor=#111310;fontSize=13;spacing=8;',
  protected: 'rounded=1;whiteSpace=wrap;html=1;fillColor=#111310;strokeColor=#C7F134;fontColor=#F2F0E8;fontSize=13;spacing=8;',
  note: 'shape=note;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#8B5CF6;fontColor=#111310;fontSize=12;spacing=8;',
};

const node = (id, label, x, y, type = 'default', width = 250, height = 74) => ({id, label, x, y, type, width, height});
const edge = (from, to, label = '') => ({from, to, label});

const pages = [
  {
    name: '01 Sitemap',
    title: 'PRACTICE ATHLETIC CLUB - INFORMATION ARCHITECTURE',
    subtitle: 'Public, member, trainer, and administrator experience',
    nodes: [
      node('root', 'Practice Athletic Club', 720, 90, 'protected', 300),
      node('publicNav', 'Public navigation\nAvailable from every public page', 720, 220, 'note', 300),
      node('home', 'Home /\nValue proposition and schedule preview', 40, 410),
      node('programs', 'Programs /programs\nIntensity, duration, equipment', 340, 410),
      node('schedule', 'Schedule /schedule\nDate, program, trainer, availability filters', 640, 410),
      node('trainers', 'Trainers /trainers\nFictional bios and specialties', 940, 410),
      node('pricing', 'Pricing /pricing\nClearly fictional plans', 1240, 410),
      node('details', 'Session details\nTime, trainer, availability, configured cutoff', 640, 570, 'note'),
      node('auth', 'Demo sign-in\nPreserve selected session', 940, 570, 'note'),
      node('myBookings', 'My bookings /my-bookings\nConfirmed and waiting entries', 240, 780),
      node('confirmed', 'Confirmed reservations\nCancellation action', 240, 920),
      node('waiting', 'Waitlist entries\nPosition and leave action', 540, 920),
      node('trainer', 'Assigned sessions /trainer/sessions\nRead-only attendee counts', 780, 780, 'protected'),
      node('admin', 'Operations overview /admin\nOccupancy and waitlist counts', 1240, 780, 'protected'),
      node('sessions', 'Session manager\nList and filter sessions', 1240, 920, 'protected'),
      node('create', 'Create session', 960, 1060, 'protected'),
      node('edit', 'Edit session', 1240, 1060, 'protected'),
      node('participants', 'Participants\nFictional bookings and FIFO waitlist', 1520, 1060, 'protected'),
    ],
    edges: [
      edge('root', 'publicNav'), edge('root', 'myBookings'), edge('root', 'trainer'), edge('root', 'admin'),
      edge('publicNav', 'home'), edge('publicNav', 'programs'), edge('publicNav', 'schedule'), edge('publicNav', 'trainers'), edge('publicNav', 'pricing'),
      edge('schedule', 'details'), edge('details', 'auth', 'Unauthenticated booking'), edge('auth', 'details', 'Return to selected session'),
      edge('myBookings', 'confirmed'), edge('myBookings', 'waiting'), edge('admin', 'sessions'), edge('sessions', 'create'), edge('sessions', 'edit'), edge('sessions', 'participants'),
    ],
  },
  {
    name: '02 Booking and Waitlist',
    title: 'BOOKING AND WAITLIST ENTRY',
    subtitle: 'Server-authoritative eligibility, capacity, and conflict checks',
    nodes: [
      node('start', 'Open schedule', 650, 80), node('filters', 'Filter by date, program, trainer, and availability', 650, 200),
      node('results', 'Any matching sessions?', 650, 330, 'decision'), node('empty', 'Empty state\nClear filters or choose another date', 980, 330, 'error'),
      node('details', 'Select session and view details\nAvailability, status, configured cutoff', 650, 490), node('auth', 'Authenticated?', 650, 630, 'decision'),
      node('signIn', 'Demo sign-in\nPreserve selected session', 280, 630, 'note'), node('profile', 'Has member profile?', 650, 780, 'decision'),
      node('roleBlocked', 'Member-only action unavailable', 1020, 780, 'error'), node('membership', 'Membership active?', 650, 930, 'decision'),
      node('inactive', 'Booking blocked\nExplain inactive membership', 1020, 930, 'error'), node('eligible', 'Scheduled and before configured cutoff?', 650, 1080, 'decision'),
      node('unavailable', 'Booking unavailable\nShow status or cutoff', 1020, 1080, 'error'), node('transaction', 'Submit booking\nServer rechecks identity, membership, status, cutoff, duplicates, overlap, capacity', 650, 1240),
      node('duplicate', 'Already confirmed?', 650, 1410, 'decision'), node('alreadyBooked', 'Show existing reservation', 1020, 1410, 'error'),
      node('overlap', 'Overlaps another confirmed booking?', 650, 1570, 'decision'), node('conflict', 'Show booking conflict', 1020, 1570, 'error'),
      node('capacity', 'Capacity available at commit time?', 650, 1730, 'decision'), node('confirmed', 'Create confirmed booking atomically\nBooking confirmed', 280, 1880, 'success'),
      node('full', 'Session full\nJoin waitlist?', 1020, 1730, 'decision'), node('waitlist', 'Create one FIFO waitlist entry\nShow current position', 1020, 1880, 'success'),
      node('failure', 'Unexpected failure\nPreserve context, show request ID, offer retry', 1360, 1240, 'error'),
    ],
    edges: [
      edge('start', 'filters'), edge('filters', 'results'), edge('results', 'empty', 'No'), edge('empty', 'filters', 'Clear filters'), edge('results', 'details', 'Yes'),
      edge('details', 'auth'), edge('auth', 'signIn', 'No'), edge('signIn', 'profile'), edge('auth', 'profile', 'Yes'), edge('profile', 'roleBlocked', 'No'), edge('profile', 'membership', 'Yes'),
      edge('membership', 'inactive', 'No'), edge('membership', 'eligible', 'Yes'), edge('eligible', 'unavailable', 'No'), edge('eligible', 'transaction', 'Yes'),
      edge('transaction', 'duplicate'), edge('duplicate', 'alreadyBooked', 'Yes'), edge('duplicate', 'overlap', 'No'), edge('overlap', 'conflict', 'Yes'), edge('overlap', 'capacity', 'No'),
      edge('capacity', 'confirmed', 'Yes'), edge('capacity', 'full', 'No'), edge('full', 'waitlist', 'Yes'), edge('transaction', 'failure', 'Failure'),
    ],
  },
  {
    name: '03 Waitlist Management',
    title: 'WAITLIST MANAGEMENT',
    subtitle: 'View position, leave the queue, and handle concurrent promotion',
    nodes: [
      node('start', 'Open My bookings', 600, 80), node('load', 'Load confirmed reservations and waiting entries', 600, 210), node('state', 'Request result?', 600, 350, 'decision'),
      node('loading', 'Loading skeleton', 200, 350, 'note'), node('failure', 'Recoverable error and retry', 1000, 350, 'error'), node('empty', 'No upcoming bookings or waiting entries', 1000, 510, 'note'),
      node('details', 'Select waiting entry\nShow FIFO position and Leave waitlist action', 600, 520), node('choice', 'Member choice?', 600, 670, 'decision'),
      node('keep', 'Remain on waitlist', 200, 810, 'note'), node('submit', 'Submit removal request', 950, 810), node('check', 'Server verifies identity, ownership, current entry status', 950, 950),
      node('status', 'Current status?', 950, 1100, 'decision'), node('removed', 'Waiting\nMark entry cancelled atomically', 570, 1250, 'success'),
      node('promoted', 'Promoted\nShow confirmed reservation and cancellation policy', 950, 1250, 'success'), node('resolved', 'Cancelled or expired\nRefresh My bookings', 1330, 1250, 'note'),
    ],
    edges: [edge('start', 'load'), edge('load', 'state'), edge('state', 'loading', 'Loading'), edge('loading', 'state'), edge('state', 'failure', 'Failure'), edge('failure', 'load', 'Retry'), edge('state', 'empty', 'Empty'), edge('state', 'details', 'Ready'), edge('details', 'choice'), edge('choice', 'keep', 'Keep waiting'), edge('choice', 'submit', 'Leave'), edge('submit', 'check'), edge('check', 'status'), edge('status', 'removed', 'Waiting'), edge('status', 'promoted', 'Promoted'), edge('status', 'resolved', 'Resolved')],
  },
  {
    name: '04 Cancellation and Promotion',
    title: 'CANCELLATION AND FIFO PROMOTION',
    subtitle: 'One transaction; maximum capacity never changes',
    nodes: [
      node('start', 'Open My bookings and select confirmed reservation', 620, 80), node('cutoff', 'Before configured cancellation cutoff?', 620, 220, 'decision'), node('locked', 'Cancellation unavailable\nReservation remains confirmed', 990, 220, 'error'),
      node('dialog', 'Confirmation dialog\nExplain possible waitlist promotion', 620, 380), node('choice', 'Confirm cancellation?', 620, 530, 'decision'), node('retain', 'Close dialog\nReservation retained', 250, 530, 'note'),
      node('validate', 'Server verifies identity, ownership, confirmed status, and cutoff', 620, 690), node('valid', 'Still eligible to cancel?', 620, 840, 'decision'), node('rejected', 'Show stable domain error and refresh state', 990, 840, 'error'),
      node('transaction', 'Begin database transaction\nMark booking cancelled', 620, 1010), node('next', 'Select earliest FIFO waiting entry', 620, 1160), node('queue', 'Waiting entry found?', 620, 1310, 'decision'),
      node('open', 'Commit cancellation\nMaximum capacity unchanged; availability increases', 240, 1460, 'success'), node('eligible', 'Entry eligible under booking rules?', 990, 1460, 'decision'),
      node('skip', 'Mark ineligible entry expired\nContinue FIFO search', 1320, 1600, 'error'), node('promote', 'Create confirmed booking and mark entry promoted atomically', 990, 1740, 'success'),
      node('rollback', 'Transaction failure\nRoll back all changes', 1320, 1010, 'error'),
    ],
    edges: [edge('start', 'cutoff'), edge('cutoff', 'locked', 'No'), edge('cutoff', 'dialog', 'Yes'), edge('dialog', 'choice'), edge('choice', 'retain', 'No'), edge('choice', 'validate', 'Yes'), edge('validate', 'valid'), edge('valid', 'rejected', 'No'), edge('valid', 'transaction', 'Yes'), edge('transaction', 'next'), edge('transaction', 'rollback', 'Failure'), edge('next', 'queue'), edge('queue', 'open', 'No'), edge('queue', 'eligible', 'Yes'), edge('eligible', 'skip', 'No'), edge('skip', 'next', 'Continue'), edge('eligible', 'promote', 'Yes')],
  },
  {
    name: '05 Trainer Access',
    title: 'TRAINER READ-ONLY ACCESS',
    subtitle: 'Assigned sessions and attendee counts only in version one',
    nodes: [
      node('start', 'User signs in', 600, 100), node('role', 'Trainer role?', 600, 240, 'decision'), node('forbidden', 'Access denied\nNo trainer data exposed', 970, 240, 'error'),
      node('load', 'Load assigned upcoming sessions', 600, 400), node('state', 'Request result?', 600, 550, 'decision'), node('loading', 'Loading skeleton', 220, 550, 'note'), node('failure', 'Show request ID and retry', 970, 550, 'error'),
      node('empty', 'No assigned upcoming sessions', 970, 720, 'note'), node('list', 'Show assigned sessions and attendee counts', 600, 720), node('assigned', 'Assigned to this trainer?', 600, 870, 'decision'),
      node('details', 'Read-only details and attendee count\nNo trainer editing in version one', 600, 1030, 'success'),
    ],
    edges: [edge('start', 'role'), edge('role', 'forbidden', 'No'), edge('role', 'load', 'Yes'), edge('load', 'state'), edge('state', 'loading', 'Loading'), edge('loading', 'state'), edge('state', 'failure', 'Failure'), edge('failure', 'load', 'Retry'), edge('state', 'empty', 'Empty'), edge('state', 'list', 'Ready'), edge('list', 'assigned'), edge('assigned', 'forbidden', 'No'), edge('assigned', 'details', 'Yes')],
  },
  {
    name: '06 Administrator Operations',
    title: 'ADMINISTRATOR OPERATIONS',
    subtitle: 'Server-authorized session creation, editing, and participant review',
    nodes: [
      node('start', 'User signs in', 650, 80), node('role', 'Administrator role?', 650, 220, 'decision'), node('forbidden', 'Access denied', 1020, 220, 'error'),
      node('overview', 'Operations overview\nOccupancy and waitlist counts', 650, 370, 'protected'), node('sessions', 'Open session manager', 650, 510, 'protected'), node('state', 'Session list result?', 650, 650, 'decision'),
      node('failure', 'Show request ID and retry', 1020, 650, 'error'), node('empty', 'No sessions\nOffer Create session', 270, 790, 'note'), node('action', 'Administrator action?', 650, 790, 'decision'),
      node('create', 'Create: program, trainer, dates, capacity, cutoff', 270, 970), node('createValid', 'Fields, capacity, dates, trainer, overlap valid?', 270, 1130, 'decision'), node('created', 'Session created\nRefresh list', 270, 1290, 'success'),
      node('edit', 'Edit allowed scheduling fields', 650, 970), node('editValid', 'Capacity not below confirmed bookings and no trainer overlap?', 650, 1130, 'decision'), node('updated', 'Session updated\nRefetch affected views', 650, 1290, 'success'),
      node('participants', 'View fictional confirmed members and FIFO waitlist', 1030, 970, 'protected'), node('errors', 'Show field-level and conflict errors\nPreserve entered values', 1030, 1130, 'error'),
    ],
    edges: [edge('start', 'role'), edge('role', 'forbidden', 'No'), edge('role', 'overview', 'Yes'), edge('overview', 'sessions'), edge('sessions', 'state'), edge('state', 'failure', 'Failure'), edge('failure', 'sessions', 'Retry'), edge('state', 'empty', 'Empty'), edge('state', 'action', 'Ready'), edge('empty', 'create'), edge('action', 'create', 'Create'), edge('create', 'createValid'), edge('createValid', 'errors', 'No'), edge('errors', 'create', 'Fix'), edge('createValid', 'created', 'Yes'), edge('action', 'edit', 'Edit'), edge('edit', 'editValid'), edge('editValid', 'errors', 'No'), edge('editValid', 'updated', 'Yes'), edge('action', 'participants', 'Participants')],
  },
];

function graphXml(page) {
  const cells = [
    '<mxCell id="0"/>',
    '<mxCell id="1" parent="0"/>',
    `<mxCell id="title" value="${esc(page.title)}" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=22;fontStyle=1;fontColor=#111310;" vertex="1" parent="1"><mxGeometry x="40" y="25" width="1300" height="32" as="geometry"/></mxCell>`,
    `<mxCell id="subtitle" value="${esc(page.subtitle)}" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=12;fontColor=#5C6159;" vertex="1" parent="1"><mxGeometry x="40" y="60" width="1300" height="24" as="geometry"/></mxCell>`,
  ];
  for (const item of page.nodes) {
    const value = esc(item.label).replace(/\n/g, '&lt;br&gt;');
    cells.push(`<mxCell id="${item.id}" value="${value}" style="${palette[item.type]}" vertex="1" parent="1"><mxGeometry x="${item.x}" y="${item.y}" width="${item.width}" height="${item.height}" as="geometry"/></mxCell>`);
  }
  for (const [index, item] of page.edges.entries()) {
    const label = item.label ? ` value="${esc(item.label)}"` : '';
    cells.push(`<mxCell id="edge-${index}"${label} style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;strokeColor=#40443F;fontSize=11;fontColor=#40443F;labelBackgroundColor=#FFFFFF;" edge="1" parent="1" source="${item.from}" target="${item.to}"><mxGeometry relative="1" as="geometry"/></mxCell>`);
  }
  return `<mxGraphModel dx="1900" dy="1300" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="2200" pageHeight="1800" math="0" shadow="0"><root>${cells.join('')}</root></mxGraphModel>`;
}

const document = `<mxfile host="app.diagrams.net" modified="2026-09-17T00:00:00.000Z" agent="Codex" version="28.0.6">${pages.map((page) => `<diagram id="${page.name.replace(/[^a-z0-9]/gi, '')}" name="${esc(page.name)}">${graphXml(page)}</diagram>`).join('')}</mxfile>`;

fs.writeFileSync(outputPath, document, 'utf8');
console.log(`Wrote ${outputPath} with ${pages.length} editable pages.`);
