// Derived from draw.io Page 08. Fictional examples only; no app business logic.
const WF_ACTION = (label, target, kind = 'secondary') => ({label, target, kind});
const WF_TEXT = (title, body, actions = []) => ({type:'text', title, body, actions});
const WF_CARDS = (title, items) => ({type:'cards', title, items});
const WF_FORM = (title, fields, actions = [], body = '') => ({type:'form', title, fields, actions, body});
const WF_STATE = (id, title, body, options = {}) => ({id, title, body, ...options});
const WF_PLANS = [
  {title:'Base', body:'$39 / month · fictional price\nClub access and the demo booking workspace. No payment is collected.', actions:[WF_ACTION('Choose Base','join@base','primary')]},
  {title:'Complete', body:'$59 / month · fictional price\nGuided training and the demo booking workspace. No payment is collected.', actions:[WF_ACTION('Choose Complete','join@complete','primary')]},
  {title:'Training+', body:'$79 / month · fictional price\nAdditional training support in the fictional club story. No payment is collected.', actions:[WF_ACTION('Choose Training+','join@training','primary')]}
];
const WF_PROGRAMS = [
  {title:'Strength',body:'45 minutes · Moderate intensity\nBuild technique through controlled squat, hinge, push, and pull movements. Equipment: dumbbells and racks.',actions:[WF_ACTION('View schedule','schedule')]},
  {title:'Pace',body:'40 minutes · High intensity\nInterval-based conditioning with adjustable effort. Equipment: bikes and rowers.',actions:[WF_ACTION('View schedule','schedule')]},
  {title:'Reset',body:'30 minutes · Low intensity\nMobility, balance, and controlled movement. Equipment: mat and blocks.',actions:[WF_ACTION('View schedule','schedule')]},
  {title:'Open Floor',body:'60 minutes · Self-directed\nA scheduled training block with shared equipment and clear capacity limits.',actions:[WF_ACTION('View schedule','schedule')]}
];
const WF_TRAINERS = [
  {title:'Marcus Vance',body:'Fictional trainer · Strength\nCoaches controlled movement and gradual progression. Leads Lower Body Tempo.',actions:[WF_ACTION('Browse the public schedule','schedule')]},
  {title:'Lena Ortiz',body:'Fictional trainer · Pace\nLeads interval sessions with options for different training levels.',actions:[WF_ACTION('Browse the public schedule','schedule')]},
  {title:'Nora Silva',body:'Fictional trainer · Reset\nFocuses on mobility, balance, and movement confidence.',actions:[WF_ACTION('Browse the public schedule','schedule')]}
];
const WF_SESSION = WF_TEXT('Lower Body Tempo','Tuesday, September 22 · 7:00–7:45 AM\nStrength · Marcus Vance · Studio A\n12 confirmed / 16 capacity · 4 spots available\nBooking and cancellation close at 6:00 AM for this session.\nBring water and comfortable training clothes. All schedule times are shown in club local time.');
const WF_SCHEDULE = (member = false) => [
  WF_FORM('Find a session',[
    ['Search','Lower Body Tempo'],['Date','September 22–28'],['Program','All programs'],['Trainer','All trainers'],['Availability','Any availability']
  ],[WF_ACTION('Apply filters',(member?'memberSchedule':'schedule')+'@filtered','primary'),WF_ACTION('Clear filters',member?'memberSchedule':'schedule')]),
  WF_CARDS('Tuesday, September 22 · club local time',[
    {title:'Lower Body Tempo',body:'7:00–7:45 AM · Marcus Vance\nStrength · 4 of 16 spots available\nBooking closes at 6:00 AM.',actions:[WF_ACTION('View session',member?'memberSchedule@details':'session','primary')]},
    {title:'Pace Intervals',body:'6:30–7:10 PM · Lena Ortiz\nPace · Full, 12 of 12 confirmed\nBooking closes at 5:30 PM.',actions:[WF_ACTION('View full session',member?'memberSchedule@full':'session@full')]},
    {title:'Reset Mobility',body:'8:00–8:30 PM · Nora Silva\nReset · 8 of 14 spots available\nBooking closes at 7:30 PM.',actions:[WF_ACTION('View session',member?'memberSchedule@resetDetails':'session@reset')]}
  ]),
  WF_TEXT('Browse the week','Showing 3 sessions for the selected dates.',[WF_ACTION('Next dates',(member?'memberSchedule':'schedule')+'@empty'),WF_ACTION('Refresh schedule',member?'memberSchedule':'schedule')])
];
const WF_COLLECTION_STATES = (id, label) => [
  WF_STATE('loading',`Loading ${label}`,'Please wait while the latest information is retrieved.',{mode:'loading',autoTarget:id}),
  WF_STATE('empty',`No ${label} to show`,'Try another date or return to the full list.',{mode:'empty',actions:[WF_ACTION('Reset and return',id,'primary')]}),
  WF_STATE('error',`Could not load ${label}`,'Your selection is preserved. Try again. Reference: DEMO-104.',{mode:'error',tone:'danger',actions:[WF_ACTION('Retry',id,'primary')]})
];
const WF_LEGAL = (kind, intro, sections) => [
  WF_TEXT('Fictional portfolio notice','This is sample interface content for a fictional club. It is not a real membership contract or legal document.'),
  WF_TEXT('Document overview',intro+'\nDemo version: September 21, 2026.'),
  ...sections.map(([title,body])=>WF_TEXT(title,body)),
  WF_TEXT('Related information','Review the other documents before creating a demo profile.',[WF_ACTION('Terms','terms'),WF_ACTION('Privacy','privacy'),WF_ACTION('Waiver','waiver'),WF_ACTION('Back to Join','join')])
];
const WF_ADMIN_FIELDS = [
  ['Program','Strength'],['Session name','Lower Body Tempo'],['Trainer','Marcus Vance'],['Date','September 22, 2026'],['Start time','7:00 AM'],['End time','7:45 AM'],['Capacity','16'],['Booking/cancellation cutoff','60 minutes before start']
];
const WF_ADMIN_STATES = (id) => [
  WF_STATE('validation','Check the highlighted fields','Enter a valid session time, positive capacity, and a trainer.',{tone:'danger',actionTargets:{'Create session':id+'@validation','Save changes':id+'@validation'},fieldErrors:{'End time':'End time must be after start time.','Capacity':'Use a positive whole number.'},actions:[WF_ACTION('Review corrected example',id)]}),
  WF_STATE('overlap','Scheduling conflict','Marcus already leads a session at this time. Choose another trainer or time.',{tone:'danger',actionTargets:{'Create session':id+'@overlap','Save changes':id+'@overlap'},fieldErrors:{Trainer:'Trainer is unavailable at this time.'},actions:[WF_ACTION('Review another time',id)]}),
  WF_STATE('error','Changes were not saved','Your entries are preserved. Try again. Reference: DEMO-205.',{tone:'danger',actions:[WF_ACTION('Retry save',id+'@saved','primary'),WF_ACTION('Keep editing',id)]}),
  WF_STATE('saved','Session saved','The session list now reflects the saved fictional schedule.',{tone:'success',mode:'success',actions:[WF_ACTION('Return to sessions','adminSessions','primary')]})
];

const WIREFRAME_ROUTES = [
  {id:'home',route:'/',label:'Home',shell:'public',title:'Train with purpose. Make room for progress.',description:'Discover a fictional club built around strength, pace, and recovery.',sections:[
    {type:'hero',title:'Your next session starts here.',body:'Find a program that fits your week. Explore the club, compare fictional plans, and book through the member workspace.',actions:[WF_ACTION('View schedule','schedule'),WF_ACTION('Join Now','join','primary')]},
    WF_CARDS('Programs for your week',WF_PROGRAMS),
    WF_TEXT('Upcoming sessions','Lower Body Tempo · Tue 7:00 AM\nPace Intervals · Tue 6:30 PM\nReset Mobility · Tue 8:00 PM',[WF_ACTION('Browse the full schedule','schedule','primary')]),
    {...WF_CARDS('Services',[
      {title:'Initial assessment',body:'An introduction to the fictional club and training goals.'},
      {title:'Training guidance',body:'Support with technique and building a consistent routine.'},
      {title:'Recovery',body:'Time and space for mobility and a measured return to movement.'}
    ]),anchor:'services'},
    {...WF_CARDS('Facilities',[
      {title:'Strength room',body:'Racks, free weights, and space for coached sessions.',media:'Strength room image placeholder'},
      {title:'Pace studio',body:'Bikes and rowers for interval classes.',media:'Pace studio image placeholder'},
      {title:'Mobility space',body:'Mats, blocks, and room to reset.',media:'Mobility space image placeholder'}
    ]),anchor:'facilities'},
    WF_CARDS('Fictional membership plans',WF_PLANS),
    WF_CARDS('Meet the team',WF_TRAINERS),
    {...WF_TEXT('Contact and visit','Fictional location: 100 Training Avenue, Demo City\nOpening hours: daily, 6:00 AM–10:00 PM\nStep-free entrance and accessible changing space in this fictional club.\nDemo inquiries: hello@practice.example.invalid\nNo real messages are sent from this portfolio.',[WF_ACTION('View About Us','about')]),anchor:'contact'},
    WF_TEXT('Make time for your first session.','Select a fictional plan to begin. No card or payment is required.',[WF_ACTION('Join Now','join','primary'),WF_ACTION('My Account','login')]),
    {type:'notice',title:'Your demo privacy',body:'Only essential session cookies and local display preferences are represented.',actions:[WF_ACTION('Cookie preferences','cookies'),WF_ACTION('Dismiss notice','home@noticeDismissed')]}
  ],states:[WF_STATE('noticeDismissed','Cookie notice dismissed','Display preference remembered for this preview.',{omitSection:'Your demo privacy'}),WF_STATE('signedOut','You are signed out','Your member session has ended.',{tone:'success'})]},
  {id:'programs',route:'/programs',label:'Programs',shell:'public',title:'Find your way to train',description:'Compare formats, intensity, duration, and equipment before choosing a session.',sections:[
    WF_CARDS('Explore all programs',WF_PROGRAMS),WF_TEXT('New to a program?','Read the session description and arrival guidance. Choose an intensity that fits your experience.',[WF_ACTION('Meet the trainers','trainers'),WF_ACTION('View schedule','schedule','primary')])
  ],states:WF_COLLECTION_STATES('programs','programs')},
  {id:'schedule',route:'/schedule',label:'Schedule',shell:'public',title:'Find your next session',description:'Browse upcoming classes without an account. Times are shown in club local time.',sections:WF_SCHEDULE(),states:[
    ...WF_COLLECTION_STATES('schedule','sessions'),WF_STATE('filtered','Filters applied','Strength · Marcus Vance · September 22. One matching session.',{sections:[WF_FORM('Current filters',[['Program','Strength'],['Trainer','Marcus Vance'],['Date','September 22']],[WF_ACTION('Clear filters','schedule')]),{...WF_SESSION,actions:[WF_ACTION('View session','session','primary')]}]})
  ]},
  {id:'session',route:'/sessions/:id',label:'Session detail',shell:'public',title:'Lower Body Tempo',description:'Review this session before continuing to member booking.',sections:[
    WF_SESSION,WF_TEXT('What to expect','A coached 45-minute strength session. Warm up, practice lower-body movements, and finish with a measured cooldown.'),
    WF_TEXT('Trainer and equipment','Marcus Vance · Fictional strength trainer\nEquipment: dumbbells, rack, and mat.',[WF_ACTION('Meet the team','trainers')]),
    WF_TEXT('Ready to attend?','New members choose a fictional plan first. Existing members can sign in and continue with this session.',[WF_ACTION('Join to book','join@intent','primary'),WF_ACTION('My Account','login@intent'),WF_ACTION('Back to schedule','schedule')])
  ],states:[WF_STATE('full','This session is full','Pace Intervals · 12 of 12 spots taken. Members can join the waitlist.',{sections:[WF_TEXT('Pace Intervals','Tuesday, September 22 · 6:30–7:10 PM\nLena Ortiz · Pace studio\nBooking cutoff: 5:30 PM. No confirmed spots remain.',[WF_ACTION('Join to continue','join@fullIntent','primary'),WF_ACTION('My Account','login@fullIntent'),WF_ACTION('Back to schedule','schedule')])]}),WF_STATE('unavailable','Session unavailable','This session was cancelled or is no longer listed.',{mode:'empty',actions:[WF_ACTION('Browse other sessions','schedule','primary')]}),...WF_COLLECTION_STATES('session','session details').filter(s=>s.id!=='empty')]},
  {id:'trainers',route:'/trainers',label:'Trainers',shell:'public',title:'Meet your training team',description:'Fictional profiles, coaching approaches, and program specialties.',sections:[WF_CARDS('Our trainers',WF_TRAINERS),WF_TEXT('Train with the team','Find a scheduled class led by the trainer whose approach suits you.',[WF_ACTION('View schedule','schedule','primary')])],states:WF_COLLECTION_STATES('trainers','trainers')},
  {id:'pricing',route:'/pricing',label:'Pricing',shell:'public',title:'Choose a fictional plan',description:'These prices explain the demo experience. There is no purchase or real subscription.',sections:[
    WF_CARDS('Membership comparison',WF_PLANS),
    {type:'table',title:'What the demo includes',columns:['Feature','Base','Complete','Training+'],rows:[['Schedule and availability','Included','Included','Included'],['Booking and waitlist demo','Included','Included','Included'],['Guided-session club concept','Standard','Expanded','Expanded'],['Training-support club concept','Basic','Group','Additional']]},
    WF_TEXT('Common questions','Will I be charged? No. Prices and plans are fictional.\nDo I need a credit card? No card details are collected.\nCan I try the member experience? Use My Account and choose a demo persona.',[WF_ACTION('Join Now','join','primary'),WF_ACTION('My Account','login')])
  ],states:[]},
  {id:'about',route:'/about',label:'About Us',shell:'public',title:'A club built around practice',description:'A fictional place to build a sustainable training routine.',sections:[
    WF_TEXT('Our story','Practice Athletic Club is a fictional portfolio project exploring a complete gym scheduling and booking experience.'),
    WF_CARDS('How we approach training',[{title:'Consistency',body:'Make a realistic plan and return to it.'},{title:'Clear guidance',body:'Know what a session involves before reserving.'},{title:'Respect for shared space',body:'Fair capacity, considerate cancellation, and an ordered waitlist.'}]),
    WF_CARDS('The fictional team',WF_TRAINERS),WF_TEXT('The club experience','Strength room, Pace studio, and a dedicated mobility space.',[WF_ACTION('Explore facilities','home#facilities'),WF_ACTION('Contact and hours','home#contact'),WF_ACTION('View programs','programs')])
  ],states:[]},
  {id:'terms',route:'/terms',label:'Terms of Service',shell:'public',title:'Terms of Service',description:'Sample membership and reservation terms for this fictional experience.',sections:WF_LEGAL('terms','Membership, booking, cancellation, and shared-space rules.',[
    ['Demo membership','A selected plan records a fictional enrollment. It does not create a paid subscription.'],['Reservations','An active demo member may reserve an eligible class when capacity is available. Duplicate and overlapping bookings are not permitted.'],['Waitlist','Full sessions use an ordered waitlist. A released spot goes to the first eligible waiting member.'],['Cancellation and cutoffs','Each session displays its configured booking and cancellation cutoff. Review it before reserving.'],['Club etiquette','Arrive prepared, respect other participants, and release a reservation when you cannot attend.'],['Questions','Use the fictional contact information on the public site. No real support service is provided.']
  ]),states:[]},
  {id:'privacy',route:'/privacy',label:'Privacy Policy',shell:'public',title:'Privacy Policy',description:'How data is represented in this fictional portfolio experience.',sections:WF_LEGAL('privacy','Data boundaries, session cookies, and demo privacy.',[
    ['Fictional data only','Names, sessions, biographies, and reservations are invented. Use the supplied demo personas; do not enter personal records.'],['Account and reservation data','The demo models account identity, selected plan, consent status, bookings, and waitlist entries.'],['Cookies','Essential cookies represent sign-in sessions. Display preferences represent local interface choices. No advertising-cookie flow is included.'],['Visibility','Members see their own reservations. Trainers see assigned-session details and counts. Administrators see fictional participant lists.'],['Consent and readiness','The prototype shows consent acknowledgement, not a medical-history questionnaire. Do not provide health details.'],['Questions and preferences','Review Cookie preferences or return to the public site.']
  ]),states:[]},
  {id:'waiver',route:'/waiver',label:'Liability Waiver',shell:'public',title:'Readiness and waiver information',description:'Sample acknowledgement content for the fictional booking flow.',sections:WF_LEGAL('waiver','Read the demo information before acknowledging it during registration or booking.',[
    ['Participation information','The fictional class descriptions identify duration, intensity, and equipment so participants can understand the activity.'],['Readiness acknowledgement','The demo asks for acknowledgement of the readiness information. It does not collect symptoms, diagnoses, or health records.'],['Sample release','This screen reserves space for reviewed participation and release language. It is not an enforceable real-world waiver.'],['Where acknowledgement happens','Consent is captured in registration or the member booking acknowledgement dialog. This public document does not change account consent.']
  ]),states:[]},
  {id:'cookies',route:'/cookie-settings',label:'Cookie preferences',shell:'public',title:'Cookie preferences',description:'Choose how the fictional demo remembers display preferences.',sections:[
    WF_TEXT('Essential session cookies','Always enabled for the represented sign-in experience. These cannot be disabled here.'),
    {type:'checks',title:'Display preferences',items:[['Remember display preferences',true,'cookies@changed']]},
    WF_TEXT('No advertising preferences','Advertising and production analytics are outside this demo.',[WF_ACTION('Save preferences','cookies@saved','primary'),WF_ACTION('Read Privacy Policy','privacy')])
  ],states:[WF_STATE('changed','Display preference changed','Remember display preferences is off.',{checks:{'Remember display preferences':false},checkTargets:{'Remember display preferences':'cookies'},actionTargets:{'Save preferences':'cookies@savedOff'}}),WF_STATE('savedOff','Preferences saved','Remember display preferences is off.',{tone:'success',checks:{'Remember display preferences':false},checkTargets:{'Remember display preferences':'cookies'},actionTargets:{'Save preferences':'cookies@savedOff'},actions:[WF_ACTION('Return Home','home')]}),WF_STATE('saved','Preferences saved','Your display preference is saved for this preview.',{tone:'success',actions:[WF_ACTION('Return Home','home')]})]},
  {id:'join',route:'/join',label:'Join Now',shell:'public',title:'Join Practice Athletic Club',description:'Choose a fictional plan. No payment, card, or real subscription is involved.',sections:[
    WF_CARDS('Choose your demo plan',WF_PLANS),WF_TEXT('Already a member?','Use your existing demo account or a supplied persona.',[WF_ACTION('My Account','login')]),WF_TEXT('Before you continue','Registration asks for demo account details, terms acceptance, and waiver acknowledgement.',[WF_ACTION('Review Terms','terms'),WF_ACTION('Review Privacy','privacy'),WF_ACTION('Review Waiver','waiver')])
  ],states:[
    ...[['base','Base'],['complete','Complete'],['training','Training+']].map(([id,title])=>WF_STATE(id,`${title} selected`,'No payment will be collected.',{actions:[WF_ACTION('Continue to registration','register@'+id,'primary'),WF_ACTION('Change plan','join')]})),
    WF_STATE('intent','Continue to Lower Body Tempo','Your selected session is saved while you choose a plan.',{sections:[WF_CARDS('Choose a plan to continue',WF_PLANS.map(p=>({...p,actions:[WF_ACTION('Choose '+p.title,'register@intent','primary')]}))),WF_TEXT('Existing member?','Sign in to continue with your selected session.',[WF_ACTION('My Account','login@intent')])]}),
    WF_STATE('fullIntent','Continue to Pace Intervals','Your full-session selection is saved. Membership does not guarantee a place.',{sections:[WF_CARDS('Choose a plan to continue',WF_PLANS.map(p=>({...p,actions:[WF_ACTION('Choose '+p.title,'register@fullIntent','primary')]}))),WF_TEXT('Existing member?','Sign in to review the waitlist.',[WF_ACTION('My Account','login@fullIntent')])]})
  ]},
  {id:'register',route:'/register',label:'Member registration',shell:'public',title:'Create your demo member account',description:'Selected plan: Complete · fictional enrollment. Use fictional details only.',sections:[
    WF_FORM('Account details',[['Name','Alex Morgan'],['Email','alex@practice.example.invalid'],['Password','••••••••••••'],['Confirm password','••••••••••••']]),
    {type:'checks',title:'Review and consent',items:[['I accept the sample Terms and Privacy information.',true,'register@consentMissing'],['I acknowledge the sample readiness and waiver information.',true,'register@consentMissing']]},
    WF_TEXT('Complete your enrollment','No payment information is collected.',[WF_ACTION('Create demo account','dashboard','primary'),WF_ACTION('Change plan','join'),WF_ACTION('Terms','terms'),WF_ACTION('Privacy','privacy'),WF_ACTION('Waiver','waiver')])
  ],states:[
    ...[['base','Base'],['complete','Complete'],['training','Training+']].map(([id,title])=>WF_STATE(id,`Selected plan: ${title}`,'Fictional enrollment only. No payment is collected.',{description:`Selected plan: ${title} · fictional enrollment. Use fictional details only.`})),
    WF_STATE('intent','Session saved: Lower Body Tempo','After creating your account, continue to the selected member session.',{actionTargets:{'Create demo account':'memberSchedule@details'}}),
    WF_STATE('fullIntent','Session saved: Pace Intervals','After creating your account, review the full session and waitlist.',{actionTargets:{'Create demo account':'memberSchedule@full'}}),
    WF_STATE('validation','Check your account details','Correct the fields below. Your other entries are preserved.',{tone:'danger',fieldErrors:{Email:'Enter a valid fictional email address.','Confirm password':'Passwords must match.'},actionTargets:{'Create demo account':'register'}}),
    WF_STATE('consentMissing','Acknowledgement required','Review and accept both statements to continue.',{tone:'warning',checks:{'I accept the sample Terms and Privacy information.':false,'I acknowledge the sample readiness and waiver information.':false},actionTargets:{'Create demo account':'register@consentMissing'},actions:[WF_ACTION('Accept both in this preview','register','primary')]}),
    WF_STATE('existingEmail','This demo account already exists','Sign in instead of creating another account.',{tone:'warning',actionTargets:{'Create demo account':'register@existingEmail'},actions:[WF_ACTION('Open My Account','login','primary')]}),
    WF_STATE('planMissing','Choose a plan first','Registration requires a selected fictional plan.',{mode:'empty',actions:[WF_ACTION('Return to Join','join','primary')]}),
    WF_STATE('error','Account could not be created','Your entries are preserved. Try again. Reference: DEMO-301.',{tone:'danger',actions:[WF_ACTION('Retry','register','primary')]})
  ]},
  {id:'login',route:'/portal/login',label:'My Account',shell:'public',title:'Welcome back',description:'Sign in with demo credentials or choose a fictional persona.',sections:[
    WF_FORM('Demo account',[['Email','alex@practice.example.invalid'],['Password','••••••••••••']],[WF_ACTION('Sign in','dashboard','primary'),WF_ACTION('Forgot password?','recovery')]),
    WF_CARDS('Try a demo persona',[{title:'Alex Morgan · Member',body:'Book sessions, manage reservations, and view waitlist position.',actions:[WF_ACTION('Continue as Member','dashboard','primary')]},{title:'Marcus Vance · Trainer',body:'Read assigned sessions and attendee counts.',actions:[WF_ACTION('Continue as Trainer','trainer')]},{title:'Sarah Lin · Administrator',body:'Manage fictional sessions and participant lists.',actions:[WF_ACTION('Continue as Administrator','admin')]}]),
    WF_TEXT('New to Practice?','Select a fictional plan before creating an account.',[WF_ACTION('Join Now','join')])
  ],states:[WF_STATE('intent','Continue to Lower Body Tempo','Sign in to continue with your selected session.',{actionTargets:{'Sign in':'memberSchedule@details','Continue as Member':'memberSchedule@details'}}),WF_STATE('fullIntent','Continue to Pace Intervals','Sign in to review the full session.',{actionTargets:{'Sign in':'memberSchedule@full','Continue as Member':'memberSchedule@full'}}),WF_STATE('invalid','Email or password not recognized','Check your demo credentials or use a persona.',{tone:'danger',fieldErrors:{Password:'Check your demo credentials.'}}),WF_STATE('locked','Please wait before trying again','Too many attempts. The next sign-in attempt is available after the displayed cooldown.',{tone:'warning',actionTargets:{'Sign in':'login@locked'},actions:[WF_ACTION('Try after cooldown','login')]}),WF_STATE('error','Sign-in unavailable','Try again shortly. Reference: DEMO-302.',{tone:'danger',actions:[WF_ACTION('Retry','login','primary')]})]},
  {id:'recovery',route:'/auth/forgot-password',label:'Account recovery',shell:'public',title:'Account recovery',description:'This portfolio simulates recovery and does not send real email.',sections:[
    WF_FORM('Recovery request',[['Email','alex@practice.example.invalid']],[WF_ACTION('Show recovery instructions','recovery@sent','primary'),WF_ACTION('Back to My Account','login')]),WF_TEXT('Need immediate demo access?','Return to My Account and select a demo persona.',[WF_ACTION('Choose a persona','login')])
  ],states:[WF_STATE('sent','Recovery request received','If this were a live account, instructions would be provided through its recovery channel. This demo sends no email and does not reset a password.',{mode:'success',actions:[WF_ACTION('Return to My Account','login','primary')]}),WF_STATE('validation','Check the email format','Enter a fictional email address in the expected format.',{tone:'danger',fieldErrors:{Email:'Use a valid email format.'}}),WF_STATE('limited','Please wait before trying again','The demo request limit has been reached.',{mode:'error',tone:'warning',actions:[WF_ACTION('Back to My Account','login')]})]},
  {id:'dashboard',route:'/app',label:'Member dashboard',shell:'member',title:'Good morning, Alex',description:'Your membership, next session, and booking shortcuts in one place.',sections:[
    {type:'stats',title:'Your membership',items:[['Status','Active'],['Fictional plan','Complete'],['Upcoming bookings','1'],['Waiting entries','1']]},
    {...WF_SESSION,title:'Your next class',actions:[WF_ACTION('View my bookings','bookings','primary')]},
    WF_TEXT('Your waitlist','Pace Intervals · Tuesday 6:30 PM\nWaiting position: 2. Check My bookings for the latest result.',[WF_ACTION('View waitlist','bookings@waiting')]),
    WF_TEXT('Plan your week','Find another class or review your account.',[WF_ACTION('Browse schedule','memberSchedule','primary'),WF_ACTION('Profile & Security','profile')])
  ],states:[...WF_COLLECTION_STATES('dashboard','dashboard details'),WF_STATE('inactive','Membership inactive','You can review your existing reservations and profile. New bookings and waitlist joins are unavailable.',{tone:'warning',sections:[WF_TEXT('Membership','Inactive · Complete demo plan',[WF_ACTION('Review profile','profile@inactive','primary'),WF_ACTION('View existing bookings','bookings')])]})]},
  {id:'memberSchedule',route:'/app/schedule',label:'Member schedule',shell:'member',title:'Book your next session',description:'Browse classes and review the latest availability before booking.',sections:WF_SCHEDULE(true),states:[
    ...WF_COLLECTION_STATES('memberSchedule','sessions'),WF_STATE('filtered','Filters applied','One matching Strength session.',{sections:[{...WF_SESSION,actions:[WF_ACTION('View and book','memberSchedule@details','primary'),WF_ACTION('Clear filters','memberSchedule')]}]}),
    WF_STATE('details','Session details','Review the session and cutoff before confirming.',{sections:[WF_SESSION,WF_TEXT('Reserve your place','Your reservation is confirmed only after the booking succeeds.',[WF_ACTION('Book session','memberSchedule@confirmed','primary'),WF_ACTION('Back to schedule','memberSchedule')])]}),
    WF_STATE('full','Session full','Pace Intervals has 12 confirmed members and no available spots.',{sections:[WF_TEXT('Pace Intervals','Tuesday, September 22 · 6:30–7:10 PM\nLena Ortiz · Pace studio\nBooking closes at 5:30 PM.',[WF_ACTION('Join waitlist','memberSchedule@waitlisted','primary'),WF_ACTION('Back to schedule','memberSchedule')])]}),
    WF_STATE('confirmed','Booking confirmed','Lower Body Tempo is now in My bookings.',{mode:'success',tone:'success',actions:[WF_ACTION('View My bookings','bookings','primary'),WF_ACTION('Browse sessions','memberSchedule')]}),
    WF_STATE('waitlisted','You joined the waitlist','Pace Intervals · Position 2. A place is not yet confirmed.',{mode:'success',tone:'success',actions:[WF_ACTION('View waitlist','bookings@waiting','primary')]}),
    WF_STATE('waiver','Review the readiness acknowledgement','No health details are collected. Read the sample information before continuing.',{mode:'dialog',actions:[WF_ACTION('Read sample waiver','waiver'),WF_ACTION('Acknowledge and continue','memberSchedule@details','primary'),WF_ACTION('Close','memberSchedule@details')]}),
    WF_STATE('duplicate','You already have this reservation','No second booking was created.',{mode:'error',tone:'warning',actions:[WF_ACTION('View existing reservation','bookings','primary')]}),
    WF_STATE('alreadyWaiting','You are already on this waitlist','Your current position is 2. No duplicate entry was added.',{mode:'error',tone:'warning',actions:[WF_ACTION('View waitlist','bookings@waiting','primary')]}),
    WF_STATE('overlap','This class overlaps your reservation','Lower Body Tempo conflicts with an existing confirmed session.',{mode:'error',tone:'warning',actions:[WF_ACTION('View conflicting reservation','bookings'),WF_ACTION('Choose another session','memberSchedule','primary')]}),
    WF_STATE('cutoff','Booking has closed','This session is past its configured cutoff.',{mode:'error',tone:'warning',actions:[WF_ACTION('Browse other sessions','memberSchedule','primary')]}),
    WF_STATE('spotOpened','A spot became available','The class is no longer full. Review current availability before booking.',{mode:'success',actions:[WF_ACTION('Review available session','memberSchedule@details','primary')]}),
    WF_STATE('inactive','Membership inactive','New bookings and waitlist joins are unavailable for this demo membership.',{mode:'error',tone:'warning',actions:[WF_ACTION('Review profile','profile@inactive'),WF_ACTION('Back to schedule','memberSchedule')]}),
    WF_STATE('forbidden','Member access required','This account cannot use member booking actions.',{mode:'denied',tone:'danger',actions:[WF_ACTION('Choose Member persona','login','primary')]}),
    WF_STATE('expired','Sign in to continue','Your selected session is preserved. No booking has been submitted again.',{mode:'dialog',actions:[WF_ACTION('Restore demo member session','memberSchedule@details','primary'),WF_ACTION('Dismiss','schedule')]}),
    WF_STATE('failed','Booking was not completed','The selected session is preserved. Reference: DEMO-401.',{mode:'error',tone:'danger',actions:[WF_ACTION('Review and retry','memberSchedule@details','primary'),WF_ACTION('Back to schedule','memberSchedule')]})
  ]},
  {id:'bookings',route:'/app/bookings',label:'My bookings',shell:'member',title:'My bookings',description:'Review confirmed reservations and waiting entries.',sections:[
    WF_TEXT('Upcoming confirmed reservations','Lower Body Tempo · Tue September 22 · 7:00–7:45 AM\nMarcus Vance · Studio A\nConfirmed · Cancellation closes at 6:00 AM.',[WF_ACTION('View session details','memberSchedule@details'),WF_ACTION('Cancel reservation','bookings@cancel')]),
    WF_TEXT('Waitlist entries','Pace Intervals · Tue September 22 · 6:30–7:10 PM\nPosition 2 · Not confirmed.',[WF_ACTION('Refresh position','bookings@waiting'),WF_ACTION('Leave waitlist','bookings@leave')])
  ],states:[
    ...WF_COLLECTION_STATES('bookings','bookings'),WF_STATE('waiting','Waitlist position refreshed','Pace Intervals · Position 2. No confirmed place yet.'),
    WF_STATE('cancel','Cancel this reservation?','Lower Body Tempo · Tuesday 7:00 AM. This action releases your confirmed place if cancellation is still allowed.',{mode:'dialog',actions:[WF_ACTION('Keep reservation','bookings'),WF_ACTION('Confirm cancellation','bookings@cancelled','danger')]}),
    WF_STATE('cancelled','Reservation cancelled','Lower Body Tempo is no longer in your confirmed reservations.',{mode:'success',tone:'success',actions:[WF_ACTION('View remaining waitlist','bookings@remaining'),WF_ACTION('Find another session','memberSchedule','primary')]}),
    WF_STATE('remaining','Your remaining entry','No upcoming confirmed reservations. You are still waiting for Pace Intervals.',{sections:[WF_TEXT('Waitlist entries','Pace Intervals · Position 2 · Tuesday 6:30 PM',[WF_ACTION('Leave waitlist','bookings@leave'),WF_ACTION('Browse schedule','memberSchedule')])]}),
    WF_STATE('cancelCutoff','Cancellation is closed','This reservation is past its configured cancellation cutoff.',{mode:'error',tone:'warning',actions:[WF_ACTION('Keep and return','bookings','primary')]}),
    WF_STATE('cancelError','Cancellation was not completed','Your reservation remains confirmed. Reference: DEMO-402.',{mode:'error',tone:'danger',actions:[WF_ACTION('Retry cancellation','bookings@cancel','primary'),WF_ACTION('Keep reservation','bookings')]}),
    WF_STATE('leave','Leave the waitlist?','You will lose your waiting position for Pace Intervals.',{mode:'dialog',actions:[WF_ACTION('Keep waiting','bookings@waiting'),WF_ACTION('Leave waitlist','bookings@left','danger')]}),
    WF_STATE('left','You left the waitlist','Your waiting entry was removed.',{tone:'success',sections:[WF_TEXT('Confirmed reservation','Lower Body Tempo · Tuesday 7:00 AM',[WF_ACTION('Cancel reservation','bookings@cancel'),WF_ACTION('Browse schedule','memberSchedule')])]}),
    WF_STATE('promoted','Your waitlist place is now confirmed','Pace Intervals was promoted while you were viewing the list. Use cancellation to release a confirmed reservation.',{tone:'success',sections:[WF_TEXT('Confirmed reservations','Pace Intervals · Tuesday 6:30 PM\nLower Body Tempo · Tuesday 7:00 AM',[WF_ACTION('Review promoted reservation','bookings@promotedCancel'),WF_ACTION('Back to schedule','memberSchedule')])]}),
    WF_STATE('promotedCancel','Cancel Pace Intervals?','This entry is now confirmed. Cancellation uses the session cutoff.',{mode:'dialog',actions:[WF_ACTION('Keep reservation','bookings@promoted'),WF_ACTION('Cancel promoted reservation','bookings@left','danger')]}),
    WF_STATE('leaveError','Waitlist could not be updated','Your current entry is preserved. Refresh before trying again. Reference: DEMO-403.',{mode:'error',tone:'danger',actions:[WF_ACTION('Refresh entry','bookings@waiting','primary')]})
  ]},
  {id:'profile',route:'/app/profile/security',label:'Profile and Security',shell:'member',title:'Profile & Security',description:'Review your demo membership, consent, and sign-in session.',sections:[
    WF_TEXT('Demo profile','Alex Morgan\nalex@practice.example.invalid\nMember profile · Fictional data'),
    WF_TEXT('Membership','Active · Complete plan\nSelected September 21, 2026. No real payment or subscription.'),
    WF_TEXT('Consent record','Sample terms and waiver acknowledged September 21, 2026.',[WF_ACTION('Read Terms','terms'),WF_ACTION('Read Waiver','waiver')]),
    WF_TEXT('Current session','Demo member session active on this browser. Signing out ends this session.',[WF_ACTION('Sign out','home@signedOut','primary')])
  ],states:[WF_STATE('inactive','Membership inactive','Booking is blocked. Existing reservations remain available for review.',{tone:'warning',sections:[WF_TEXT('Membership','Inactive · Complete demo plan\nActivation changes are not available in this prototype.',[WF_ACTION('Review bookings','bookings'),WF_ACTION('Choose an active demo persona','login')]),WF_TEXT('Current session','You remain signed in to this demo profile.',[WF_ACTION('Sign out','home@signedOut')])]}),...WF_COLLECTION_STATES('profile','profile details').filter(s=>s.id!=='empty')]},
  {id:'trainer',route:'/trainer/sessions',label:'Assigned sessions',shell:'trainer',title:'Your assigned sessions',description:'Read-only access to the sessions assigned to your trainer profile.',sections:[
    WF_FORM('Filter assignments',[['Date','September 22–28']],[WF_ACTION('Apply date','trainer@filtered'),WF_ACTION('Reset','trainer')]),
    {type:'table',title:'Upcoming assignments',columns:['Session','Time','Attendees','Action'],rows:[['Lower Body Tempo','Tue 7:00 AM','12 / 16',WF_ACTION('View session','trainerSession','primary')],['Strength Foundations','Thu 8:00 AM','8 / 14',WF_ACTION('View session','trainerSession')]]},
    WF_TEXT('Trainer access','Session editing and member booking actions are not part of the trainer workspace.')
  ],states:[...WF_COLLECTION_STATES('trainer','assigned sessions'),WF_STATE('filtered','Date filter applied','Assignments for September 22.'),WF_STATE('denied','Trainer access unavailable','This account cannot view trainer assignments.',{mode:'denied',tone:'danger',actions:[WF_ACTION('Choose Trainer persona','login','primary')]})]},
  {id:'trainerSession',route:'/trainer/sessions/:id',label:'Assigned session',shell:'trainer',title:'Lower Body Tempo',description:'Assigned-session details and attendee counts.',sections:[
    WF_SESSION,WF_TEXT('Class preparation','Strength · 45 minutes\nEquipment: dumbbells, racks, and mats.\nReview the session time and room before class.'),WF_TEXT('Attendance overview','12 confirmed attendees · Capacity 16\nParticipant identities are not shown in the trainer experience.',[WF_ACTION('Back to assigned sessions','trainer','primary')])
  ],states:[...WF_COLLECTION_STATES('trainerSession','session details').filter(s=>s.id!=='empty'),WF_STATE('denied','Session not assigned to you','You cannot view this session through the trainer workspace.',{mode:'denied',tone:'danger',actions:[WF_ACTION('Return to assignments','trainer','primary')]})]},
  {id:'admin',route:'/admin',label:'Operations overview',shell:'admin',title:'Operations overview',description:'A snapshot of the fictional club schedule and occupancy.',sections:[
    {type:'stats',title:'Today at the club',items:[['Scheduled sessions','3'],['Confirmed places','30 / 42'],['Waiting entries','2'],['Full sessions','1']]},
    {type:'table',title:'Session occupancy',columns:['Session','Confirmed / capacity','Waiting','Action'],rows:[['Lower Body Tempo','12 / 16','0',WF_ACTION('Participants','participants')],['Pace Intervals','12 / 12','2',WF_ACTION('View sessions','adminSessions')],['Reset Mobility','6 / 14','0',WF_ACTION('View sessions','adminSessions')]]},
    WF_TEXT('Manage the schedule','Create a session or review existing sessions.',[WF_ACTION('Create session','adminCreate','primary'),WF_ACTION('Session manager','adminSessions')])
  ],states:[...WF_COLLECTION_STATES('admin','operations'),WF_STATE('denied','Administrator access required','No operations data is available for this account.',{mode:'denied',tone:'danger',actions:[WF_ACTION('Choose Administrator persona','login','primary')]})]},
  {id:'adminSessions',route:'/admin/sessions',label:'Session manager',shell:'admin',title:'Manage sessions',description:'Review scheduled classes, occupancy, and waitlist counts.',sections:[
    WF_FORM('Filter sessions',[['Date','September 22–28'],['Program','All programs'],['Trainer','All trainers'],['Status','Scheduled']],[WF_ACTION('Apply filters','adminSessions@filtered'),WF_ACTION('Reset','adminSessions'),WF_ACTION('Create session','adminCreate','primary')]),
    {type:'table',title:'Scheduled sessions',columns:['Session','Trainer / time','Confirmed / capacity','Waiting','Actions'],rows:[['Lower Body Tempo','Marcus · Tue 7:00 AM','12 / 16','0',[WF_ACTION('Edit','adminEdit'),WF_ACTION('Participants','participants')]],['Pace Intervals','Lena · Tue 6:30 PM','12 / 12','2',[WF_ACTION('Review full session','participants@pace')]],['Reset Mobility','Nora · Tue 8:00 PM','6 / 14','0',[WF_ACTION('View filtered example','adminSessions@filtered')]]]},
    WF_TEXT('Result navigation','Showing 3 scheduled sessions.',[WF_ACTION('Next dates','adminSessions@empty'),WF_ACTION('Refresh','adminSessions')])
  ],states:[...WF_COLLECTION_STATES('adminSessions','sessions'),WF_STATE('filtered','Filters applied','Showing one matching Strength session.',{sections:[{...WF_SESSION,actions:[WF_ACTION('Edit session','adminEdit','primary'),WF_ACTION('Participants','participants'),WF_ACTION('Reset filters','adminSessions')]}]})]},
  {id:'adminCreate',route:'/admin/sessions/new',label:'Create session',shell:'admin',title:'Create a session',description:'Define the program, trainer, time, capacity, and cutoff.',sections:[
    WF_FORM('Session details',WF_ADMIN_FIELDS,[WF_ACTION('Create session','adminCreate@saved','primary'),WF_ACTION('Cancel','adminSessions')]),WF_TEXT('Before saving','The trainer must be available. End time must follow start time. Capacity must be positive. Cutoff is configured per session.')
  ],states:WF_ADMIN_STATES('adminCreate')},
  {id:'adminEdit',route:'/admin/sessions/:id/edit',label:'Edit session',shell:'admin',title:'Edit Lower Body Tempo',description:'Review existing reservations before changing the session.',sections:[
    WF_TEXT('Current occupancy','12 confirmed members · Capacity 16 · No waiting entries. Capacity cannot be reduced below 12.'),
    WF_FORM('Session details',WF_ADMIN_FIELDS,[WF_ACTION('Save changes','adminEdit@saved','primary'),WF_ACTION('Discard changes','adminSessions')]),
    WF_TEXT('Scheduling safeguards','Trainer and participant conflicts must be resolved before a schedule change is saved.',[WF_ACTION('View participants','participants')])
  ],states:[...WF_ADMIN_STATES('adminEdit'),WF_STATE('capacity','Capacity conflicts with reservations','There are 12 confirmed members. A capacity of 10 cannot be saved.',{tone:'danger',actionTargets:{'Save changes':'adminEdit@capacity'},fieldErrors:{Capacity:'Minimum capacity is 12 for this session.'},fieldValues:{Capacity:'10'},actions:[WF_ACTION('Restore valid capacity','adminEdit','primary')]}),WF_STATE('memberConflict','A member has an overlapping reservation','Changing the time would conflict with an existing participant booking.',{tone:'danger',actionTargets:{'Save changes':'adminEdit@memberConflict'},fieldErrors:{'Start time':'Choose a time without participant conflicts.'},actions:[WF_ACTION('Review original time','adminEdit')]})]},
  {id:'participants',route:'/admin/sessions/:id/participants',label:'Participants',shell:'admin',title:'Lower Body Tempo participants',description:'Fictional confirmed members and ordered waiting entries.',sections:[
    WF_TEXT('Session summary','Tuesday 7:00–7:45 AM · Marcus Vance\n12 confirmed / 16 capacity · 0 waiting'),
    {type:'table',title:'Confirmed members',columns:['Member','Status','Booked'],rows:Array.from({length:12},(_,i)=>[`Demo Member ${String(i+1).padStart(2,'0')}`,'Confirmed','September 21'])},
    WF_TEXT('Ordered waitlist','No waiting members for this session.'),WF_TEXT('Session actions','Roster is read-only in this view.',[WF_ACTION('Edit session','adminEdit'),WF_ACTION('Back to sessions','adminSessions','primary')])
  ],states:[...WF_COLLECTION_STATES('participants','participants'),WF_STATE('pace','Pace Intervals participants','Tuesday 6:30 PM · Lena Ortiz · 12 confirmed / 12 capacity.',{sections:[{type:'table',title:'Confirmed members',columns:['Member','Status'],rows:Array.from({length:12},(_,i)=>[`Demo Member ${String(i+1).padStart(2,'0')}`,'Confirmed'])},{type:'table',title:'Ordered waitlist',columns:['Position','Member','Joined'],rows:[['1','Demo Member 13','September 21 · 10:00'],['2','Alex Morgan','September 21 · 10:05']]},WF_TEXT('Session actions','Waitlist order follows joining order.',[WF_ACTION('Back to sessions','adminSessions','primary')])]})]},
  {id:'notFound',route:'/404',label:'Not Found',shell:'public',title:'We could not find that page',description:'The address may be incorrect or the page may no longer be available.',sections:[WF_TEXT('Find your way back','Browse the public site or open your account.',[WF_ACTION('Go Home','home','primary'),WF_ACTION('View schedule','schedule'),WF_ACTION('My Account','login')])],states:[]}
];

// Session variants share the same route; the selected session survives Join/Login.
const wfResetSession = WF_TEXT('Reset Mobility','Tuesday, September 22 · 8:00–8:30 PM\nReset · Nora Silva · Mobility space\n6 confirmed / 14 capacity · 8 spots available\nBooking and cancellation close at 7:30 PM.');
const wfRoute = id => WIREFRAME_ROUTES.find(r=>r.id===id);
wfRoute('session').states.push(WF_STATE('reset','Reset Mobility','Review this mobility session.',{description:'Reset · Nora Silva · 30 minutes.',sections:[wfResetSession,WF_TEXT('Ready to attend?','Continue with your selected session.',[WF_ACTION('Join to book','join@resetIntent','primary'),WF_ACTION('My Account','login@resetIntent'),WF_ACTION('Back to schedule','schedule')])]}));
wfRoute('join').states.push(WF_STATE('resetIntent','Continue to Reset Mobility','Your selected session is preserved.',{sections:[WF_CARDS('Select your fictional plan',WF_PLANS.map((p,i)=>({...p,actions:[WF_ACTION('Choose '+p.title,'register@reset'+['base','complete','training'][i],'primary')]}))),WF_TEXT('Existing member?','Sign in to continue with Reset Mobility.',[WF_ACTION('My Account','login@resetIntent')])]}));
wfRoute('login').states.push(WF_STATE('resetIntent','Continue to Reset Mobility','Sign in to continue with your selected mobility session.',{actionTargets:{'Sign in':'memberSchedule@resetDetails','Continue as Member':'memberSchedule@resetDetails'}}));
for (const [code,title] of [['base','Base'],['complete','Complete'],['training','Training+']]) wfRoute('register').states.push(WF_STATE('reset'+code,'Selected session: Reset Mobility','Your session is preserved while you register.',{description:`Selected plan: ${title} · fictional enrollment.`,actionTargets:{'Create demo account':'memberSchedule@resetDetails'}}));
wfRoute('memberSchedule').states.push(WF_STATE('resetDetails','Reset Mobility','Review the latest availability.',{sections:[wfResetSession,WF_TEXT('Reserve your place','Review the session cutoff before booking.',[WF_ACTION('Book session','bookings@resetConfirmed','primary'),WF_ACTION('Back to schedule','memberSchedule')])]}));
wfRoute('bookings').states.push(WF_STATE('resetConfirmed','Reset Mobility confirmed','Your reservation was added.',{tone:'success',sections:[wfResetSession,WF_TEXT('Manage reservation','Cancellation closes at 7:30 PM.',[WF_ACTION('Cancel Reset Mobility','bookings@resetCancel'),WF_ACTION('Browse sessions','memberSchedule')])]}),WF_STATE('resetCancel','Cancel Reset Mobility?','This releases your confirmed place if cancellation is still allowed.',{mode:'dialog',actions:[WF_ACTION('Keep reservation','bookings@resetConfirmed'),WF_ACTION('Confirm cancellation','bookings@resetCancelled','danger')]}),WF_STATE('resetCancelled','Reset Mobility cancelled','This reservation is no longer confirmed.',{mode:'success',tone:'success',actions:[WF_ACTION('Browse sessions','memberSchedule','primary')]}));
// Preserve the plan choice in the two original booking-intent examples.
for (const [intent,destination] of [['intent','memberSchedule@details'],['fullIntent','memberSchedule@full']]) {
  const state=wfRoute('join').states.find(s=>s.id===intent);
  state.sections[0].items.forEach((item,i)=>{const code=['base','complete','training'][i];item.actions[0].target='register@'+intent+code;wfRoute('register').states.push(WF_STATE(intent+code,'Selected session preserved','Continue after fictional enrollment.',{description:`Selected plan: ${item.title} · fictional enrollment.`,actionTargets:{'Create demo account':destination}}));});
}

// Submission states demonstrate pending actions without submitting real requests.
for (const [id,stateId,title,body,destination] of [
  ['register','submitting','Creating demo account','Please wait while your fictional account is prepared.','dashboard'],
  ['login','submitting','Signing in','Checking the selected demo credentials.','dashboard'],
  ['recovery','submitting','Preparing recovery instructions','This simulation sends no email.','recovery@sent'],
  ['adminCreate','submitting','Saving session','Your entered session details are retained.','adminCreate@saved'],
  ['adminEdit','submitting','Saving changes','Your entered changes are retained.','adminEdit@saved'],
  ['memberSchedule','submitting','Reserving your place','Checking the current session availability.','memberSchedule@confirmed'],
  ['memberSchedule','joining','Joining the waitlist','Checking current availability and your waiting entry.','memberSchedule@waitlisted'],
  ['bookings','cancelling','Cancelling reservation','Your reservation stays confirmed until cancellation succeeds.','bookings@cancelled']
]) wfRoute(id).states.push(WF_STATE(stateId,title,body,{mode:'loading',autoTarget:destination}));
function wfRetargetActions(sections,label,target) { for (const section of sections) { for (const a of section.actions||[]) if(a.label===label)a.target=target; } }
wfRetargetActions(wfRoute('register').sections,'Create demo account','register@submitting');
wfRetargetActions(wfRoute('login').sections,'Sign in','login@submitting');
wfRetargetActions(wfRoute('recovery').sections,'Show recovery instructions','recovery@submitting');
wfRetargetActions(wfRoute('adminCreate').sections,'Create session','adminCreate@submitting');
wfRetargetActions(wfRoute('adminEdit').sections,'Save changes','adminEdit@submitting');
wfRetargetActions(wfRoute('memberSchedule').states.find(s=>s.id==='details').sections,'Book session','memberSchedule@submitting');
wfRetargetActions(wfRoute('memberSchedule').states.find(s=>s.id==='full').sections,'Join waitlist','memberSchedule@joining');
wfRoute('bookings').states.find(s=>s.id==='cancel').actions.find(a=>a.label==='Confirm cancellation').target='bookings@cancelling';
wfRoute('trainerSession').states.push(WF_STATE('foundations','Strength Foundations','Thursday, September 24 · 8:00–8:45 AM.',{description:'Assigned session · Marcus Vance.',sections:[WF_TEXT('Strength Foundations','Strength · Studio A\n8 confirmed / 14 capacity\nEquipment: dumbbells, racks, and mats.\nBooking and cancellation close at 7:00 AM.'),WF_TEXT('Read-only trainer view','Participant identities are not shown here.',[WF_ACTION('Back to assigned sessions','trainer','primary')])]}));
wfRoute('trainer').sections.find(s=>s.type==='table').rows[1][3].target='trainerSession@foundations';

wfRoute('participants').states.find(s=>s.id==='pace').pageTitle='Pace Intervals participants';
wfRoute('session').states.find(s=>s.id==='full').pageTitle='Pace Intervals';
wfRoute('session').states.find(s=>s.id==='reset').pageTitle='Reset Mobility';
wfRoute('trainerSession').states.find(s=>s.id==='foundations').pageTitle='Strength Foundations';
