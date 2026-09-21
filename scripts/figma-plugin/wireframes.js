// Native Figma renderer. Content and state definitions live in wireframe-content.js.
const WF_COLORS = {bg:'#F6F7F9',white:'#FFFFFF',ink:'#20242B',muted:'#626B77',border:'#D7DBE0',blue:'#245BCC',soft:'#EEF3FF',danger:'#A52722',warning:'#815500',success:'#196444'};
const wfPaint = value => ({type:'SOLID',color:{r:parseInt(value.slice(1,3),16)/255,g:parseInt(value.slice(3,5),16)/255,b:parseInt(value.slice(5,7),16)/255}});
let wfFonts, wfButtonSource, wfLinks, wfFrames, wfAnchors;
const wfProgress = message => figma.ui.postMessage({type:'progress',message});

async function wfPrepareResources() {
  wfButtonSource = null;
  // Inspect only likely kit pages, never every previous generated version.
  const pages = figma.root.children.filter(p => /components|webby|headers|ui kit/i.test(p.name) && !/^FitOps Wireframes/.test(p.name));
  let preferred = null;
  for (const page of pages) {
    await page.loadAsync();
    const candidates = page.findAllWithCriteria({types:['COMPONENT']});
    if (!wfButtonSource) wfButtonSource = candidates.find(n => /^button$/i.test(n.name)) || candidates.find(n => /button/i.test(n.parent?.name || '') && /primary|default/i.test(n.name));
    const sample = page.findAllWithCriteria({types:['TEXT']}).find(n => n.fontName !== figma.mixed);
    if (sample && !preferred) preferred = sample.fontName.family;
  }
  const available = (await figma.listAvailableFontsAsync()).map(x=>x.fontName);
  if (!available.length) throw new Error('No fonts are available. Enable a font and run again.');
  const family = [preferred,'Mona Sans','Roboto','Inter'].find(f=>available.some(a=>a.family===f)) || available[0].family;
  const faces = available.filter(a=>a.family===family);
  wfFonts = {regular:faces.find(f=>/regular|book/i.test(f.style))||faces[0],bold:faces.find(f=>/^bold$|semi.?bold/i.test(f.style))||faces[0]};
  for (const font of [...new Map(Object.values(wfFonts).map(f=>[JSON.stringify(f),f])).values()]) await figma.loadFontAsync(font);
  if (wfButtonSource) {
    for (const t of wfButtonSource.findAllWithCriteria({types:['TEXT']})) {
      for (const segment of t.getStyledTextSegments(['fontName'])) await figma.loadFontAsync(segment.fontName);
    }
  }
}

function wfStack(width, direction='VERTICAL', gap=16, padding=0, fill=null) {
  const n=figma.createFrame();
  n.layoutMode=direction;n.resize(width,1);
  // Never temporarily hug the horizontal primary axis: that loses the supplied width.
  n.primaryAxisSizingMode=direction==='HORIZONTAL'?'FIXED':'AUTO';
  n.counterAxisSizingMode=direction==='HORIZONTAL'?'AUTO':'FIXED';
  n.itemSpacing=gap;n.paddingTop=padding;n.paddingBottom=padding;n.paddingLeft=padding;n.paddingRight=padding;
  n.fills=fill?[wfPaint(fill)]:[];n.clipsContent=false;
  return n;
}

function wfText(value,width,size=14,bold=false,color=WF_COLORS.ink){
  const n=figma.createText();n.fontName=bold?wfFonts.bold:wfFonts.regular;n.fontSize=size;
  n.lineHeight={unit:'PERCENT',value:145};n.fills=[wfPaint(color)];
  n.characters=String(value);n.resize(width,Math.max(1,n.height));n.textAutoResize='HEIGHT';return n;
}

function wfBorder(n){n.strokes=[wfPaint(WF_COLORS.border)];n.strokeWeight=1;n.cornerRadius=8;return n;}

function wfAction(action,width,device,state={}){
  const target=state.actionTargets?.[action.label]||action.target;
  const primary=action.kind==='primary', danger=action.kind==='danger';
  let n;
  if(wfButtonSource && primary && !danger){
    n=wfButtonSource.createInstance();
    const labels=n.findAllWithCriteria({types:['TEXT']}).filter(t=>t.visible);
    const label=labels.find(t=>/label|text/i.test(t.name))||labels[0];
    if(label){label.characters=action.label;label.resize(Math.max(10,width-24),label.height);label.textAutoResize='HEIGHT';}
    n.resize(width,Math.max(48,label?label.height+24:48));
    if(n.layoutMode && n.layoutMode!=='NONE'){n.primaryAxisSizingMode='FIXED';n.counterAxisSizingMode='FIXED';}
  }else{
    n=wfStack(width,'VERTICAL',0,15,primary?WF_COLORS.blue:WF_COLORS.white);wfBorder(n);
    n.appendChild(wfText(action.label,width-30,13,true,primary?WF_COLORS.white:danger?WF_COLORS.danger:WF_COLORS.blue));
  }
  n.name=`Action / ${action.label}`;
  wfLinks.push({node:n,target,device});return n;
}

function wfActions(actions,width,device,state={}){
  const wrap=wfStack(width,'VERTICAL',10);wrap.name='Actions';
  const columns=device==='mobile'||width<500?1:Math.min(3,actions.length||1);
  for(let start=0;start<actions.length;start+=columns){
    const count=Math.min(columns,actions.length-start),row=wfStack(width,'HORIZONTAL',10);
    const w=(width-(count-1)*10)/count;
    for(const action of actions.slice(start,start+count))row.appendChild(wfAction(action,w,device,state));
    wrap.appendChild(row);
  }
  return wrap;
}

function wfCard(item,width,device,state){
  const card=wfBorder(wfStack(width,'VERTICAL',12,20,WF_COLORS.white));card.name=`Card / ${item.title}`;
  const inner=width-40;
  if(item.media){const media=wfBorder(wfStack(inner,'VERTICAL',0,20,WF_COLORS.bg));media.name=item.media;media.appendChild(wfText(item.media,inner-40,12,false,WF_COLORS.muted));card.appendChild(media);}
  card.appendChild(wfText(item.title,inner,19,true));if(item.body)card.appendChild(wfText(item.body,inner));
  if(item.actions?.length)card.appendChild(wfActions(item.actions,inner,device,state));return card;
}

function wfRenderSection(section,width,device,state,route){
  const wrap=wfStack(width,'VERTICAL',16);wrap.name=`Section / ${section.title}`;
  if(section.anchor && !state.id)wfAnchors.set(`${device}:${route.id}#${section.anchor}`,wrap);
  wrap.appendChild(wfText(section.title,width,device==='mobile'?22:28,true));
  if(section.body)wrap.appendChild(wfText(section.body,width,15));
  const mobile=device==='mobile';
  if(section.type==='cards'){
    const cols=mobile?1:Math.min(3,section.items.length);
    for(let i=0;i<section.items.length;i+=cols){const row=wfStack(width,'HORIZONTAL',16);const count=Math.min(cols,section.items.length-i);const w=(width-(count-1)*16)/count;for(const item of section.items.slice(i,i+count))row.appendChild(wfCard(item,w,device,state));wrap.appendChild(row);}
  }
  if(section.type==='stats'){
    const cols=mobile?2:section.items.length;
    for(let i=0;i<section.items.length;i+=cols){const row=wfStack(width,'HORIZONTAL',12);const count=Math.min(cols,section.items.length-i);const w=(width-(count-1)*12)/count;for(const [label,value] of section.items.slice(i,i+count)){const c=wfBorder(wfStack(w,'VERTICAL',6,16,WF_COLORS.white));c.appendChild(wfText(label,w-32,12,false,WF_COLORS.muted));c.appendChild(wfText(value,w-32,22,true));row.appendChild(c);}wrap.appendChild(row);}
  }
  if(section.type==='form'){
    const cols=mobile?1:2;
    for(let i=0;i<section.fields.length;i+=cols){const row=wfStack(width,'HORIZONTAL',16);const count=Math.min(cols,section.fields.length-i),w=(width-(count-1)*16)/count;
      for(const [label,value] of section.fields.slice(i,i+count)){const field=wfStack(w,'VERTICAL',6);field.name=`Field / ${label}`;field.appendChild(wfText(label,w,13,true));const input=wfBorder(wfStack(w,'VERTICAL',0,12,WF_COLORS.white));input.name=`Input / ${label}`;input.appendChild(wfText(state.fieldValues?.[label]||value,w-24,14,false,WF_COLORS.muted));field.appendChild(input);if(state.fieldErrors?.[label])field.appendChild(wfText(state.fieldErrors[label],w,12,false,WF_COLORS.danger));row.appendChild(field);}wrap.appendChild(row);
    }
  }
  if(section.type==='checks'){
    for(const [label,checked,target] of section.items){const selected=state.checks?.[label]??checked;const n=wfBorder(wfStack(width,'HORIZONTAL',12,12,WF_COLORS.white));n.name=`Checkbox / ${label}`;n.appendChild(wfText(selected?'[x]':'[ ]',28,16,true));n.appendChild(wfText(label,width-64,14));wrap.appendChild(n);if(target)wfLinks.push({node:n,target:state.checkTargets?.[label]||target,device});}
  }
  if(section.type==='table'){
    if(mobile){
      for(const row of section.rows){const card=wfBorder(wfStack(width,'VERTICAL',10,16,WF_COLORS.white));card.name=`Record / ${row[0]}`;row.forEach((value,i)=>{if(typeof value==='object'){const acts=Array.isArray(value)?value:[value];card.appendChild(wfActions(acts,width-32,device,state));}else card.appendChild(wfText(`${section.columns[i]}: ${value}`,width-32,14,i===0));});wrap.appendChild(card);}
    }else{
      const col=(width-32)/section.columns.length;
      const head=wfStack(width,'HORIZONTAL',0,16,WF_COLORS.soft);section.columns.forEach(label=>head.appendChild(wfText(label,col,12,true)));wrap.appendChild(head);
      for(const row of section.rows){const line=wfBorder(wfStack(width,'HORIZONTAL',0,16,WF_COLORS.white));row.forEach(value=>{if(typeof value==='object')line.appendChild(wfActions(Array.isArray(value)?value:[value],col-8,device,state));else line.appendChild(wfText(value,col,13));});wrap.appendChild(line);}
    }
  }
  if(section.type==='hero'){const media=wfBorder(wfStack(width,'VERTICAL',0,32,WF_COLORS.soft));media.name='Media / Club image placeholder';media.appendChild(wfText('CLUB IMAGE PLACEHOLDER',width-64,18,true,WF_COLORS.muted));wrap.appendChild(media);}
  if(section.actions?.length)wrap.appendChild(wfActions(section.actions,width,device,state));
  return wrap;
}

const WF_PUBLIC_NAV=[WF_ACTION('Home','home'),WF_ACTION('Programs','programs'),WF_ACTION('Schedule','schedule'),WF_ACTION('Services','home#services'),WF_ACTION('Facilities','home#facilities'),WF_ACTION('Pricing','pricing'),WF_ACTION('Trainers','trainers'),WF_ACTION('Contact','home#contact')];
const WF_ROLE_NAV={member:[WF_ACTION('Dashboard','dashboard'),WF_ACTION('Schedule','memberSchedule'),WF_ACTION('My bookings','bookings'),WF_ACTION('Profile & Security','profile')],trainer:[WF_ACTION('Assigned sessions','trainer')],admin:[WF_ACTION('Overview','admin'),WF_ACTION('Sessions','adminSessions'),WF_ACTION('Create session','adminCreate')]};

function wfHeader(route,width,device){
  const mobile=device==='mobile',pad=mobile?16:40,inner=width-pad*2;
  const header=wfStack(width,'VERTICAL',12,pad,WF_COLORS.white);header.name=`Header / ${route.shell}`;
  const top=wfStack(inner,'HORIZONTAL',16);header.appendChild(top);
  top.appendChild(wfText('PRACTICE ATHLETIC CLUB',mobile?inner:inner-376,mobile?16:20,true));
  if(route.shell==='public'){
    const actions=wfStack(mobile?inner:360,'HORIZONTAL',12);actions.appendChild(wfAction(WF_ACTION('My Account','login'),mobile?(inner-12)/2:174,device));actions.appendChild(wfAction(WF_ACTION('Join Now','join','primary'),mobile?(inner-12)/2:174,device));(mobile?header:top).appendChild(actions);
    // A compact wrapped link grid exposes the same public destinations on mobile.
    const cols=mobile?4:8;
    for(let i=0;i<WF_PUBLIC_NAV.length;i+=cols){const row=wfStack(inner,'HORIZONTAL',8);const w=(inner-(cols-1)*8)/cols;for(const a of WF_PUBLIC_NAV.slice(i,i+cols)){const link=wfStack(w,'VERTICAL',0,6);link.resize(w,44);link.primaryAxisSizingMode='FIXED';link.name=`Navigation / ${a.label}`;link.appendChild(wfText(a.label,w-12,11,true,WF_COLORS.blue));wfLinks.push({node:link,target:a.target,device});row.appendChild(link);}header.appendChild(row);}
  }else{
    header.appendChild(wfText(`${route.shell==='admin'?'Administrator':route.shell==='trainer'?'Trainer':'Member'} workspace · Fictional demo`,inner,12,false,WF_COLORS.muted));
    if(mobile)header.appendChild(wfActions([...WF_ROLE_NAV[route.shell],WF_ACTION('Sign out','home@signedOut')],inner,device));
    else top.appendChild(wfAction(WF_ACTION('Sign out','home@signedOut'),360,device));
  }
  return header;
}

function wfFooter(route,width,device){
  const pad=device==='mobile'?16:40,inner=width-pad*2;
  const footer=wfStack(width,'VERTICAL',18,pad,WF_COLORS.white);footer.name='Footer';
  if(route.shell==='public')footer.appendChild(wfActions([WF_ACTION('About Us','about'),WF_ACTION('Terms','terms'),WF_ACTION('Privacy','privacy'),WF_ACTION('Waiver','waiver'),WF_ACTION('Cookie preferences','cookies'),WF_ACTION('Contact and hours','home#contact')],inner,device));
  footer.appendChild(wfText('Fictional portfolio demo. No real memberships or payments.',inner,12,false,WF_COLORS.muted));return footer;
}

function wfScreen(route,state,device){
  const width=device==='mobile'?390:1440,hasSidebar=device==='desktop'&&route.shell!=='public';
  const contentWidth=hasSidebar?1216:width,pad=device==='mobile'?16:hasSidebar?40:64,inner=contentWidth-pad*2;
  if(state.mode==='dialog'){
    const frame=figma.createFrame();frame.resize(width,device==='mobile'?844:1024);frame.name=`${device==='mobile'?'M':'D'} / ${route.route} / ${state.id}`;frame.clipsContent=true;
    const background=wfScreen(route,{},device);frame.appendChild(background);background.x=0;background.y=0;
    const shade=figma.createRectangle();shade.resize(width,frame.height);shade.fills=[{...wfPaint('#20242B'),opacity:0.35}];frame.appendChild(shade);shade.x=0;shade.y=0;
    const w=device==='mobile'?358:640,dialog=wfBorder(wfStack(w,'VERTICAL',18,24,WF_COLORS.white));dialog.name='Dialog / '+state.title;
    dialog.appendChild(wfText(state.title,w-48,24,true));dialog.appendChild(wfText(state.body,w-48,15));dialog.appendChild(wfActions(state.actions||[],w-48,device,state));frame.appendChild(dialog);dialog.x=(width-w)/2;dialog.y=Math.max(40,(frame.height-dialog.height)/2);
    return frame;
  }
  const screen=wfStack(width,'VERTICAL',0,0,WF_COLORS.bg);
  screen.name=`${device==='mobile'?'M':'D'} / ${route.route} / ${state.id||'ready'}`;
  screen.appendChild(wfHeader(route,width,device));
  const content=wfStack(contentWidth,'VERTICAL',32,pad);content.name='Page Content';
  if(hasSidebar){const body=wfStack(width,'HORIZONTAL',0);screen.appendChild(body);const side=wfStack(224,'VERTICAL',20,20,WF_COLORS.white);side.name='Workspace navigation';side.appendChild(wfActions(WF_ROLE_NAV[route.shell],184,device));body.appendChild(side);body.appendChild(content);}else screen.appendChild(content);
  const safeTitle=state.mode==='denied'?state.title:state.pageTitle||route.title;
  content.appendChild(wfText(safeTitle,inner,device==='mobile'?30:42,true));
  if(state.mode!=='denied')content.appendChild(wfText(state.description||route.description,inner,16,false,WF_COLORS.muted));
  if(state.id){
    const tone=WF_COLORS[state.tone]||WF_COLORS.blue;
    const status=wfBorder(wfStack(inner,'VERTICAL',12,20,WF_COLORS.white));status.name=state.mode==='dialog'?'Dialog / '+state.title:'Status / '+state.title;
    status.appendChild(wfText(state.title,inner-40,22,true,tone));status.appendChild(wfText(state.body,inner-40,15));
    if(state.actions?.length)status.appendChild(wfActions(state.actions,inner-40,device,state));content.appendChild(status);
  }
  if(state.mode==='loading'){
    for(let i=0;i<3;i++){const skeleton=wfStack(inner,'VERTICAL',10,20,WF_COLORS.white);skeleton.name='Loading placeholder';for(const w of [inner-40,inner*.65,inner*.4]){const line=figma.createRectangle();line.resize(w,14);line.fills=[wfPaint(WF_COLORS.border)];skeleton.appendChild(line);}content.appendChild(skeleton);}
  }else if(!['empty','error','denied','success','dialog'].includes(state.mode)){
    for(const section of state.sections||route.sections){if(section.title!==state.omitSection)content.appendChild(wfRenderSection(section,inner,device,state,route));}
  }
  screen.appendChild(wfFooter(route,width,device));
  // Full content stays visible on the canvas, including long mobile tables and legal pages.
  screen.clipsContent=false;
  if(state.autoTarget)wfLinks.push({node:screen,target:state.autoTarget,device,trigger:{type:'AFTER_TIMEOUT',timeout:800}});
  return screen;
}

function wfUniqueName(base){let n=1,name=base;while(figma.root.children.some(p=>p.name===name))name=`${base} (${++n})`;return name;}

let wfGeneratedPages = [];

function wfTopFrame(node) {
  let current=node;
  while(current?.parent && current.parent.type!=='PAGE')current=current.parent;
  return current?.type==='FRAME'?current:null;
}

async function openFitOpsWireframePage(pageId) {
  const entry=wfGeneratedPages.find(p=>p.page.id===pageId);
  if(!entry)return;
  await figma.setCurrentPageAsync(entry.page);
  const desktop=wfFrames.get(`desktop:${entry.route.id}`),mobile=wfFrames.get(`mobile:${entry.route.id}`);
  const available=[desktop,mobile].filter(Boolean);
  if(available.length){entry.page.selection=[available[0]];figma.viewport.scrollAndZoomIntoView(available);}
}

async function splitCurrentFitOpsWireframes(){
  const source=figma.currentPage;
  if(!source.name.startsWith('FitOps Wireframes / Complete /'))throw new Error('Select the old FitOps Wireframes / Complete page first, then click Split current combined page.');
  const candidates=source.findAllWithCriteria({types:['FRAME']}).filter(n=>n.parent?.type==='SECTION'&&n.parent.parent===source&&/^[DM] \/ .+ \/ [^/]+$/.test(n.name));
  if(!candidates.length)throw new Error('No original combined-page wireframe screens were found on this page.');
  const records=candidates.map(frame=>{const [,device,url,state]=frame.name.match(/^([DM]) \/ (.+) \/ ([^/]+)$/);return {frame,device:device==='D'?'desktop':'mobile',route:WIREFRAME_ROUTES.find(r=>r.route===url),state};});
  if(records.some(r=>!r.route))throw new Error('An unrecognized route was found. No screens were moved.');
  const saved=[];
  const oldIndex=source.children.find(n=>n.name==='START HERE / Route and scenario index');
  for(const root of [...candidates,...(oldIndex?[oldIndex]:[])]){
    const nodes=[root,...root.findAllWithCriteria({types:['FRAME','INSTANCE','TEXT','RECTANGLE']})];
    for(const node of nodes){if(node.reactions?.length){if(root!==oldIndex)saved.push({node,reactions:node.reactions});await node.setReactionsAsync([]);}}
  }
  wfFrames=new Map();wfGeneratedPages=[];
  for(const route of WIREFRAME_ROUTES){
    const owned=records.filter(r=>r.route===route);if(!owned.length)continue;
    const page=figma.createPage();page.name=wfUniqueName(`FitOps Split / ${String(wfGeneratedPages.length+1).padStart(2,'0')} ${route.label}`);wfGeneratedPages.push({page,route});
    let y=80;
    for(const state of [...new Set(owned.map(r=>r.state))]){
      let height=0;
      for(const item of owned.filter(r=>r.state===state)){page.appendChild(item.frame);item.frame.x=item.device==='desktop'?0:1510;item.frame.y=y;height=Math.max(height,item.frame.height);wfFrames.set(`${item.device}:${route.id}${state==='ready'?'':'@'+state}`,item.frame);}
      y+=height+140;
    }
    wfProgress(`Split ${route.label}: ${owned.length} existing screens moved`);
  }
  let linked=0;
  for(const {node,reactions} of saved){
    const allowed=[];
    for(const reaction of reactions){const actions=[];
      for(const action of reaction.actions||[]){
        if(action.type!=='NODE'){actions.push(action);continue;}
        const target=await figma.getNodeByIdAsync(action.destinationId),owner=wfTopFrame(node);
        if(action.navigation==='NAVIGATE'&&target?.type==='FRAME'&&target.parent?.type==='PAGE'&&owner?.parent===target.parent&&owner!==target)actions.push(action);
        else if(action.navigation==='SCROLL_TO'&&target&&wfTopFrame(target)===owner)actions.push(action);
        else if(target)node.name+=` → ${wfTopFrame(target)?.parent?.name||'another route page'}`;
      }
      if(actions.length)allowed.push({...reaction,actions});
    }
    if(allowed.length){await node.setReactionsAsync(allowed);linked++;}
  }
  if(oldIndex)oldIndex.name='Legacy index / screens moved to separate route pages';
  source.name+=' [Split - original annotations retained]';
  await openFitOpsWireframePage(wfGeneratedPages[0].page.id);
  const result={type:'wireframes-complete',pageName:'Split existing wireframes',pageCount:wfGeneratedPages.length,moduleCount:wfGeneratedPages.length,desktopCount:records.filter(r=>r.device==='desktop').length,mobileCount:records.filter(r=>r.device==='mobile').length,screenCount:records.length,actionCount:linked,pages:wfGeneratedPages.map(({page,route})=>({id:page.id,label:route.label,route:route.route}))};
  figma.ui.postMessage(result);return result;
}

async function buildFitOpsWireframes(){
  wfLinks=[];wfFrames=new Map();wfAnchors=new Map();wfGeneratedPages=[];
  wfProgress('Reading the existing UI kit and loading available fonts…');
  await wfPrepareResources();
  const base='FitOps Wireframes / '+new Date().toISOString().slice(0,10);
  let version=1,runPrefix=base+' v1';
  while(figma.root.children.some(p=>p.name.startsWith(runPrefix+' /')))runPrefix=base+' v'+(++version);
  let localActionCount=0,crossPageCount=0,selfActionCount=0;
  try {
    for(const [index,route] of WIREFRAME_ROUTES.entries()){
      const page=figma.createPage();page.name=`${runPrefix} / ${String(index+1).padStart(2,'0')} ${route.label}`;
      wfGeneratedPages.push({page,route});await figma.setCurrentPageAsync(page);
      wfProgress(`${index+1}/${WIREFRAME_ROUTES.length} · ${route.label}: separate page, desktop + mobile`);
      const overview=wfStack(1960,'VERTICAL',14,24,WF_COLORS.white);overview.name='START HERE / '+route.label;page.appendChild(overview);overview.x=0;overview.y=0;
      overview.setRelaunchData({open:'Open the FitOps wireframe page chooser'});
      overview.appendChild(wfText(`${route.label} · ${route.route}`,1912,30,true));
      overview.appendChild(wfText('Desktop 1440 px / Mobile 390 px. Local scenarios are clickable. Use the plugin page chooser for another route; cross-page controls carry destination names in their layer labels. Inputs use preset fictional examples.',1912,15));
      const scenarios=[{id:'ready'},...route.states],pairs=[];
      for(const state of scenarios){
        const desktop=wfScreen(route,state.id==='ready'?{}:state,'desktop'),mobile=wfScreen(route,state.id==='ready'?{}:state,'mobile');
        page.appendChild(desktop);page.appendChild(mobile);
        for(const [device,frame] of [['desktop',desktop],['mobile',mobile]])wfFrames.set(`${device}:${route.id}${state.id==='ready'?'':'@'+state.id}`,frame);
        pairs.push({desktop,mobile,state});
        const row=wfStack(1912,'HORIZONTAL',16);row.appendChild(wfText(state.id==='ready'?'Ready':state.title,720,14,true));
        row.appendChild(wfAction(WF_ACTION('Desktop preview',route.id+(state.id==='ready'?'':'@'+state.id)),280,'desktop'));
        row.appendChild(wfAction(WF_ACTION('Mobile preview',route.id+(state.id==='ready'?'':'@'+state.id)),280,'mobile'));overview.appendChild(row);
      }
      let y=overview.height+100;
      for(const {desktop,mobile} of pairs){desktop.x=0;desktop.y=y;mobile.x=1510;mobile.y=y;y+=Math.max(desktop.height,mobile.height)+140;}
      await new Promise(resolve=>setTimeout(resolve,0));
    }
    for(const [index,link] of wfLinks.entries()){
      if(index%200===0)wfProgress(`Checking local prototype actions ${index+1} of ${wfLinks.length}…`);
      const routeTarget=link.target.split('#')[0];
      const target=wfFrames.get(`${link.device}:${routeTarget}`);
      const source=wfTopFrame(link.node);
      if(!target||!source||target.parent?.type!=='PAGE')throw new Error(`Invalid prototype endpoint: ${link.target}`);
      if(source.parent!==target.parent){
        await link.node.setReactionsAsync([]);
        link.node.name+=` → ${target.parent.name} / ${link.target}`;
        crossPageCount++;
        continue;
      }
      if(source===target){
        if(link.target.includes('#')){
          const anchor=wfAnchors.get(`${link.device}:${link.target}`);
          if(anchor&&wfTopFrame(anchor)===source){
            await link.node.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:anchor.id,navigation:'SCROLL_TO',transition:null,preserveScrollPosition:false}]}]);localActionCount++;continue;
          }
        }
        // Current navigation items and blocked submissions stay on the existing screen.
        await link.node.setReactionsAsync([]);
        selfActionCount++;
        continue;
      }
      await link.node.setReactionsAsync([{trigger:link.trigger||{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:target.id,navigation:'NAVIGATE',transition:null,preserveScrollPosition:false}]}]);localActionCount++;
    }
    await openFitOpsWireframePage(wfGeneratedPages[0].page.id);
    const result={type:'wireframes-complete',pageName:'FitOps route pages',pageCount:wfGeneratedPages.length,moduleCount:wfGeneratedPages.length,screenCount:wfFrames.size,desktopCount:wfFrames.size/2,mobileCount:wfFrames.size/2,actionCount:localActionCount,crossPageCount,selfActionCount,pages:wfGeneratedPages.map(({page,route})=>({id:page.id,label:route.label,route:route.route}))};
    figma.ui.postMessage(result);return result;
  }catch(error){for(const {page} of wfGeneratedPages)page.name+=' [Incomplete]';throw error;}
}
