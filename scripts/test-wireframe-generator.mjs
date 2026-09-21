// Structural smoke test of the real generator using a bounded Plugin API double.
// This does not replace running the plugin or visually inspecting it in Figma.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import vm from 'node:vm';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const registry=new Map();let serial=0,currentPage;const messages=[];
const loadedFonts=new Set();
class Node {
  constructor(type){this.type=type;this.id=String(++serial);this.name=type;this.children=[];this._width=100;this._height=100;this.x=0;this.y=0;this.fills=[];this.visible=true;registry.set(this.id,this);}
  get width(){return this._width;}
  get height(){
    if(this.type==='TEXT'){
      const max=Math.max(1,Math.floor(this.width/(this.fontSize*.56)));
      return this.characters.split('\n').reduce((n,l)=>n+Math.max(1,Math.ceil(l.length/max)),0)*this.fontSize*1.45;
    }
    const pad=(this.paddingTop||0)+(this.paddingBottom||0);
    if(this.layoutMode==='VERTICAL'&&this.primaryAxisSizingMode==='AUTO')return pad+this.children.reduce((n,c)=>n+c.height,0)+Math.max(0,this.children.length-1)*(this.itemSpacing||0);
    if(this.layoutMode==='HORIZONTAL'&&this.counterAxisSizingMode==='AUTO')return pad+Math.max(0,...this.children.map(c=>c.height));
    return this._height;
  }
  set characters(value){assert(loadedFonts.has(JSON.stringify(this.fontName)),`Font not loaded for ${value}`);this._characters=value;}
  get characters(){return this._characters||'';}
  resize(w,h){assert(w>0&&h>0&&Number.isFinite(w)&&Number.isFinite(h),'Invalid dimensions');this._width=w;this._height=h;}
  resizeWithoutConstraints(w,h){this.resize(w,h);}
  appendChild(n){if(n.parent){const i=n.parent.children.indexOf(n);if(i>=0)n.parent.children.splice(i,1);}this.children.push(n);n.parent=this;}
  async loadAsync(){}
  setRelaunchData(data){this.relaunchData=data;}
  getStyledTextSegments(){return [{fontName:this.fontName}];}
  findAllWithCriteria({types}){return this.children.flatMap(c=>[...(types.includes(c.type)?[c]:[]),...c.findAllWithCriteria({types})]);}
  async setReactionsAsync(reactions){
    for(const reaction of reactions)for(const action of reaction.actions){
      assert(registry.has(action.destinationId),'Unknown reaction destination');
      const pageOf=n=>{while(n&&n.type!=='PAGE')n=n.parent;return n;};
      assert.equal(pageOf(this),pageOf(registry.get(action.destinationId)),'Cross-page prototype action');
      if(action.navigation==='NAVIGATE'){
        const destination=registry.get(action.destinationId);
        assert.equal(destination.type,'FRAME','NAVIGATE destination must be a frame');
        assert.equal(destination.parent?.type,'PAGE','NAVIGATE destination must be top-level');
        let source=this;while(source.parent&&source.parent.type!=='PAGE')source=source.parent;
        assert.notEqual(source,destination,'NAVIGATE cannot target its own top-level frame');
      }
    }
    this.reactions=reactions;
  }
  set selection(nodes){for(const n of nodes){let p=n;while(p&&p!==this)p=p.parent;assert(p===this,'Cross-page selection');}this._selection=nodes;}
}
const root=new Node('DOCUMENT'),existing=new Node('PAGE');existing.name='Existing user work';root.appendChild(existing);currentPage=existing;
const original=new Node('FRAME');original.name='Do not modify';existing.appendChild(original);
function create(type){const n=new Node(type);if(type==='PAGE')root.appendChild(n);else currentPage.appendChild(n);return n;}
const figma={root,mixed:Symbol('mixed'),ui:{postMessage:m=>messages.push(m)},viewport:{scrollAndZoomIntoView(){}},
  get currentPage(){return currentPage;},async setCurrentPageAsync(p){currentPage=p;},
  createFrame:()=>create('FRAME'),createText:()=>create('TEXT'),createRectangle:()=>create('RECTANGLE'),createSection:()=>create('SECTION'),createPage:()=>create('PAGE'),
  async listAvailableFontsAsync(){return ['Regular','Bold'].map(style=>({fontName:{family:'Mona Sans',style}}));},
  async loadFontAsync(font){loadedFonts.add(JSON.stringify(font));}
  ,async getNodeByIdAsync(id){return registry.get(id)||null;}
};
const content=readFileSync('scripts/figma-plugin/wireframe-content.js','utf8'),renderer=readFileSync('scripts/figma-plugin/wireframes.js','utf8');
const context=vm.createContext({figma,console,setTimeout,Map,Promise});
vm.runInContext(content+'\n'+renderer+'\nglobalThis.routes=WIREFRAME_ROUTES; globalThis.run=buildFitOpsWireframes; globalThis.frames=()=>wfFrames;',context);
const result=await context.run();
assert.equal(existing.children.length,1);assert.equal(existing.children[0],original);
const frames=context.frames();
const expected=[...readFileSync('docs/design/sitemap.mmd','utf8').matchAll(/^\s+\w+\["(\/[^"\n]*)"\]/gm)].map(m=>m[1]).concat('/404');
assert.deepEqual([...context.routes.map(r=>r.route)].sort(),expected.sort());
const scenarioCount=context.routes.reduce((n,r)=>n+1+r.states.length,0);
assert.equal(result.screenCount,scenarioCount*2);
assert.equal(result.pageCount,27);
assert.equal(new Set([...frames.values()].map(f=>f.parent.id)).size,27,'Routes were not split across pages');
for(const route of context.routes){
  for(const state of [{id:'ready'},...route.states]){
    for(const device of ['desktop','mobile']){
      const frame=frames.get(`${device}:${route.id}${state.id==='ready'?'':'@'+state.id}`);
      assert(frame,`Missing ${route.id}/${state.id}/${device}`);
      assert.equal(frame.parent.type,'PAGE','Screen nested under section/frame');
      assert.equal(frame.width,device==='desktop'?1440:390);
      assert.equal(frame.clipsContent,state.mode==='dialog','Only overlay viewport mockups may clip their background');
      if(state.mode==='denied')assert(!frame.findAllWithCriteria({types:['TEXT']}).some(n=>/12 confirmed|Demo Member|Marcus Vance/.test(n.characters)),'Protected content in denied state');
    }
  }
}
let overflow=[];
for(const n of registry.values()){
  if(!n.layoutMode)continue;
  const inner=n.width-(n.paddingLeft||0)-(n.paddingRight||0);
  const used=n.layoutMode==='HORIZONTAL'?n.children.reduce((sum,c)=>sum+c.width,0)+Math.max(0,n.children.length-1)*(n.itemSpacing||0):Math.max(0,...n.children.map(c=>c.width));
  if(used>inner+1)overflow.push(`${n.name}: ${used.toFixed(1)} > ${inner.toFixed(1)}`);
}
assert.deepEqual(overflow,[],'Horizontal overflow in generated mock layout');
assert(messages.some(m=>m.type==='wireframes-complete'));
function actionDestination(key,label){
  const frame=frames.get(key);
  const action=frame.findAllWithCriteria({types:['FRAME','INSTANCE','TEXT']}).find(n=>n.name===`Action / ${label}`);
  assert(action,`Missing action ${key}/${label}`);
  return action.reactions?.[0]?.actions[0]?.destinationId;
}
for(const device of ['desktop','mobile']){
  assert(!frames.get(`${device}:participants@pace`).findAllWithCriteria({types:['TEXT']}).some(n=>n.characters==='Lower Body Tempo participants'),'Wrong session title in participant variant');
  assert.equal(actionDestination(`${device}:adminEdit@capacity`,'Save changes'),undefined,'Blocked action must not self-navigate');
  assert.equal(actionDestination(`${device}:register@consentMissing`,'Create demo account'),undefined,'Blocked consent must not self-navigate');
  for(const [key,target] of [['intentbase','memberSchedule@details'],['fullIntenttraining','memberSchedule@full']]){
    const action=frames.get(`${device}:register@${key}`).findAllWithCriteria({types:['FRAME','INSTANCE']}).find(n=>n.name.startsWith('Action / Create demo account'));
    assert(action.name.endsWith('/ '+target),'Cross-page intent label lost');
    assert(!action.reactions?.length,'Cross-page native NAVIGATE must not be created');
  }
  assert.equal(actionDestination(`${device}:cookies@changed`,'Save preferences'),frames.get(`${device}:cookies@savedOff`).id,'Preference toggle reset');
  assert(frames.get(`${device}:register@base`).findAllWithCriteria({types:['TEXT']}).some(n=>n.characters.startsWith('Selected plan: Base')),'Lost selected plan');
}
// Export selected real generator outputs for a clearly labeled local HTML preview.
function snapshot(n){return {type:n.type,name:n.name,x:n.x,y:n.y,width:n.width,height:n.height,clipsContent:n.clipsContent,layout:n.layoutMode,gap:n.itemSpacing||0,padding:[n.paddingTop||0,n.paddingRight||0,n.paddingBottom||0,n.paddingLeft||0],text:n.characters||undefined,fontSize:n.fontSize,bold:/bold/i.test(n.fontName?.style||''),fill:n.fills?.[0]?.color,stroke:n.strokes?.[0]?.color,children:n.children.map(snapshot)};}
const directory=join(tmpdir(),'fitops-wireframe-review');mkdirSync(directory,{recursive:true});
const keys=['desktop:home','mobile:home','desktop:register','mobile:register','desktop:adminEdit@capacity','mobile:adminEdit@capacity','mobile:participants@pace','desktop:memberSchedule@full','mobile:bookings@cancel','mobile:terms','mobile:trainerSession'];
writeFileSync(join(directory,'screens.json'),JSON.stringify(Object.fromEntries(keys.map(k=>[k,snapshot(frames.get(k))]))));
console.log(`PASS: ${expected.length} distinct route/fallback screens, ${scenarioCount} scenarios per device, ${result.actionCount} valid same-page actions, no horizontal overflow, denied-state privacy, and existing-page preservation. Native Figma visual QA still required.`);
console.log(`Local preview data: ${join(directory,'screens.json')}`);

// A second run must reuse a discovered kit button while preserving both prior output and user work.
const firstPage=currentPage,firstChildCount=firstPage.children.length;
const kitPage=new Node('PAGE');kitPage.name='Components / Existing UI kit';root.appendChild(kitPage);
const button=new Node('COMPONENT');button.name='Button';kitPage.appendChild(button);
const sourceLabel=new Node('TEXT');sourceLabel.fontName={family:'Mona Sans',style:'Regular'};sourceLabel.fontSize=14;sourceLabel.characters='Button';button.appendChild(sourceLabel);
button.createInstance=()=>{const n=create('INSTANCE');n.layoutMode='NONE';const label=new Node('TEXT');label.name='Label';label.fontName=sourceLabel.fontName;label.fontSize=14;label.characters='Button';n.appendChild(label);return n;};
const second=await context.run();
assert.notEqual(currentPage,firstPage);assert.equal(firstPage.children.length,firstChildCount);assert.equal(existing.children[0],original);
assert.equal(second.screenCount,result.screenCount);assert(currentPage.findAllWithCriteria({types:['INSTANCE']}).length>0,'Kit components were not reused');
assert(currentPage.name.includes('v2 / 01 Home'),'Output version not unique');
console.log('PASS: rerun keeps prior pages, discovers the existing kit, loads its fonts, reuses button instances, and creates a unique output version.');

// Reproduce the user's old combined-page structure and repair it without rebuilding screens.
const latest=context.frames(),legacy=figma.createPage();legacy.name='FitOps Wireframes / Complete / legacy [Incomplete]';await figma.setCurrentPageAsync(legacy);
const retainedNote=create('TEXT');retainedNote.fontName=sourceLabel.fontName;retainedNote.fontSize=14;retainedNote.characters='Keep this user annotation';
const moved=[];
for(const route of ['home','register']){
  const section=figma.createSection();
  for(const device of ['desktop','mobile']){const frame=latest.get(`${device}:${route}`);section.appendChild(frame);moved.push(frame);}
}
const split=await vm.runInContext('splitCurrentFitOpsWireframes()',context);
assert.equal(split.pageCount,2);assert.equal(split.screenCount,4);
assert.equal(retainedNote.parent,legacy,'Original annotation was lost');
for(const frame of moved)assert.equal(frame.parent.type,'PAGE','Split left nested destination');
assert.equal(new Set(moved.map(f=>f.parent.id)).size,2);
const before=root.children.length;
await assert.rejects(()=>vm.runInContext('splitCurrentFitOpsWireframes()',context),/Select the old/);
assert.equal(root.children.length,before,'Unsafe split mutated an unrelated page');
console.log('PASS: legacy split moves existing screen objects into route pages, preserves annotations, and rejects unrelated pages before mutation.');
