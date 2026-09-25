// Managed, neutral components for the FitOps low-fidelity review kit.
// This never rewrites a Community template's own Components page.
const FOC = {ink:'#20242B',muted:'#626B77',paper:'#FFFFFF',canvas:'#F6F7F9',border:'#D7DBE0',blue:'#245BCC',danger:'#A52722',success:'#196444',warning:'#815500'};
const foPaint = hex => ({type:'SOLID',color:{r:parseInt(hex.slice(1,3),16)/255,g:parseInt(hex.slice(3,5),16)/255,b:parseInt(hex.slice(5,7),16)/255}});
const FOC_PAGE_NAME = 'FitOps Components';
const FOC_PREFIX = 'FitOps / ';

async function foText(value, size, bold, color) {
  const text = figma.createText();
  const available = await figma.listAvailableFontsAsync();
  const font = {family:available.some(item => item.fontName.family === 'Mona Sans') ? 'Mona Sans' : 'Inter',style:bold ? 'Bold' : 'Regular'};
  await figma.loadFontAsync(font);
  text.fontName = font;
  text.fontSize = size;
  text.fills = [foPaint(color)];
  text.characters = value;
  return text;
}

function foClearChildren(node) { for (const child of [...node.children]) child.remove(); }

async function foComponent(page, spec, x, y) {
  const componentName = spec.fullName ?? `${FOC_PREFIX}${spec.name}`;
  let component = page.findAllWithCriteria({types:['COMPONENT']}).find(node => node.name === componentName);
  const restored = !component;
  if (!component) {
    component = figma.createComponent();
    page.appendChild(component);
    component.name = componentName;
    component.description = 'Managed by Practice Athletic Club Master Toolkit. Re-run Manage FitOps Components to restore its defined low-fidelity structure.';
  }
  component.x = x; component.y = y; component.resize(spec.width, spec.height);
  component.layoutMode = 'VERTICAL'; component.primaryAxisSizingMode = 'AUTO'; component.counterAxisSizingMode = 'FIXED';
  component.paddingTop = spec.padding ?? 14; component.paddingRight = spec.padding ?? 14;
  component.paddingBottom = spec.padding ?? 14; component.paddingLeft = spec.padding ?? 14;
  component.itemSpacing = spec.gap ?? 8; component.cornerRadius = spec.radius ?? 8;
  component.fills = [foPaint(spec.fill ?? FOC.paper)]; component.strokes = [foPaint(spec.stroke ?? FOC.border)]; component.strokeWeight = 1;
  foClearChildren(component);
  for (const line of spec.lines) {
    const text = await foText(line.value, line.size, Boolean(line.bold), line.color ?? FOC.ink);
    text.name = line.name ?? 'Label'; text.resize(Math.max(1, spec.width - (spec.padding ?? 14) * 2), text.height); text.textAutoResize = 'HEIGHT';
    component.appendChild(text);
  }
  return {component, restored};
}

async function foButtonSet(page) {
  let set = page.findAllWithCriteria({types:['COMPONENT_SET']}).find(node => node.name === `${FOC_PREFIX}Button`);
  const variants = [];
  let restored = 0;
  const sizes = [{name:'S',height:32,fontSize:12},{name:'M',height:40,fontSize:13},{name:'L',height:48,fontSize:14}];
  const styles = [
    {name:'Filled',fill:FOC.blue,stroke:FOC.blue,color:FOC.paper},
    {name:'Outline',fill:FOC.paper,stroke:FOC.border,color:FOC.ink},
    {name:'Destructive',fill:FOC.danger,stroke:FOC.danger,color:FOC.paper}
  ];
  for (const style of styles) for (const size of sizes) {
    const fullName = `Style=${style.name}, Size=${size.name}, Brand=Neutral`;
    const result = await foComponent(page, {fullName,width:220,height:size.height,fill:style.fill,stroke:style.stroke,padding:Math.max(8,(size.height - size.fontSize) / 2),radius:6,lines:[{value:'Button',size:size.fontSize,bold:true,color:style.color}]}, 0, 0);
    variants.push(result.component);
    if (result.restored) restored++;
  }
  if (!set) {
    set = figma.combineAsVariants(variants, page);
    set.name = `${FOC_PREFIX}Button`;
    set.description = 'Managed native variant set. Properties: Style, Size, and Brand. Brand remains Neutral until FitOps brand approval.';
  } else {
    for (const variant of variants) if (variant.parent !== set) set.appendChild(variant);
  }
  set.x = 80; set.y = 210;
  return {set, restored};
}

async function foUpsertPageLabel(page, name, value, x, y, size, color) {
  let text = page.findAllWithCriteria({types:['TEXT']}).find(node => node.name === name);
  if (!text) { text = await foText(value, size, false, color); page.appendChild(text); text.name = name; }
  else { await figma.loadFontAsync(text.fontName); text.characters = value; text.fontSize = size; text.fills = [foPaint(color)]; }
  text.x = x; text.y = y; return text;
}

async function buildFitOpsComponents() {
  const kitPages = figma.root.children.filter(page => !/^FitOps Components$/i.test(page.name) && !/FitOps .*—/.test(page.name) && /components|kit|library|ui/i.test(page.name));
  let kitComponentCount = 0;
  for (const page of kitPages) { await page.loadAsync(); kitComponentCount += page.findAllWithCriteria({types:['COMPONENT','COMPONENT_SET']}).length; }
  let page = figma.root.children.find(candidate => candidate.name === FOC_PAGE_NAME);
  const createdPage = !page;
  if (!page) { page = figma.createPage(); page.name = FOC_PAGE_NAME; }
  await figma.setCurrentPageAsync(page);
  await foUpsertPageLabel(page, 'FitOps / Component Page / Title', 'FitOps Components', 80, 64, 30, FOC.ink);
  await foUpsertPageLabel(page, 'FitOps / Component Page / Scope', 'Neutral, editable low-fidelity building blocks for the FitOps review wireframes. The Community template remains untouched.', 80, 106, 14, FOC.muted);
  await foUpsertPageLabel(page, 'FitOps / Component Page / Audit', `Template scan: ${kitComponentCount} reusable components or variant sets across ${kitPages.length} kit page${kitPages.length === 1 ? '' : 's'}. Managed components are refreshed safely on rerun.`, 80, 132, 12, FOC.muted);
  const button = await foButtonSet(page);
  const specs = [
    {name:'Field / Text input',width:320,height:76,fill:FOC.paper,stroke:FOC.border,lines:[{value:'Field label',size:12,bold:true,color:FOC.ink},{value:'Preset fictional value',size:14,color:FOC.muted}]},
    {name:'Badge / Status',width:220,height:48,fill:'#EAF6EF',stroke:'#8CC9A3',padding:12,radius:20,lines:[{value:'Confirmed',size:13,bold:true,color:FOC.success}]},
    {name:'Card / Session',width:360,height:132,fill:FOC.paper,stroke:FOC.border,lines:[{value:'Lower Body Tempo',size:16,bold:true},{value:'Tuesday · 7:00 AM · 45 min',size:13,color:FOC.muted},{value:'12 confirmed / 16 capacity',size:13,color:FOC.muted}]},
    {name:'Notice / Warning',width:360,height:92,fill:'#FFF7E7',stroke:'#E5C379',lines:[{value:'Cancellation cutoff',size:14,bold:true,color:FOC.warning},{value:'This fictional example uses the session-specific policy.',size:12,color:FOC.warning}]},
    {name:'Empty state / Default',width:360,height:116,fill:FOC.canvas,stroke:FOC.border,lines:[{value:'Nothing scheduled yet',size:16,bold:true},{value:'Try another week or return to the schedule.',size:13,color:FOC.muted}]}
  ];
  let restored = button.restored;
  for (const [index, spec] of specs.entries()) { const result = await foComponent(page, spec, 490 + (index % 2) * 410, 210 + Math.floor(index / 2) * 190); if (result.restored) restored++; }
  const managedNodes = page.findAllWithCriteria({types:['COMPONENT','COMPONENT_SET']});
  const managed = managedNodes.filter(node => node.name.startsWith(FOC_PREFIX)).length;
  figma.ui.postMessage({type:'components-complete',pageId:page.id,pageName:page.name,managedCount:managed,restoredCount:restored,kitComponentCount,createdPage});
  page.selection = managedNodes.filter(node => node.name.startsWith(FOC_PREFIX));
  figma.viewport.scrollAndZoomIntoView(page.selection);
  return {page,managedCount:managed,restoredCount:restored,kitComponentCount,createdPage};
}
