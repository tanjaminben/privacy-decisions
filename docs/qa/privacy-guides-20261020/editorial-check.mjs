import fs from 'node:fs';import assert from 'node:assert/strict';
import {WIZARDS as original,SOURCES as originalSources} from '../../../packages/privacy-guides/src/lib/data/registry.generated.js';
import {WIZARDS,SOURCES} from '../../../integrations/privacy-guides/presentation-registry.js';
import {COPY_FIELDS,plainLegalCopy} from '../../../integrations/privacy-guides/editorial-copy.js';
import {contextFor,tokenizeWithLinks} from '../../../integrations/privacy-guides/editorial-mentions.js';
import {questionHelpBlocks} from '../../../integrations/privacy-guides/explanation-layout.js';
import {answerQuestion,eligibleOptions,historyContext,decisionLead,outcomeForState,sourceIdsForState} from '../../../packages/privacy-guides/src/lib/engine/council.js';
import {resultText} from '../../../integrations/privacy-guides/copy-result.js';
import {sourceLinks} from '../../../integrations/privacy-guides/source-links.js';
const out='.local/privacy-guides-review/editorial';fs.mkdirSync(out,{recursive:true});
function mask(v,allowed=false){if(typeof v==='string')return allowed?'[copy]':v;if(Array.isArray(v))return v.map(x=>mask(x,allowed));if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,mask(x,COPY_FIELDS.has(k))]));return v;}
assert.deepEqual(mask(WIZARDS),mask(original),'Only authored copy fields may change');
for(const [id,source] of Object.entries(SOURCES)){const {label,note,...rest}=source;const {label:a,note:b,...before}=originalSources[id];assert.deepEqual(rest,before,id+' source evidence');}
const fields=[],help=[],urlChanges=[],grammar=[],idempotency=[];let changed=0,links=0;
function read(v,p=[],yes=false){if(typeof v==='string'){if(yes){const key=p[0],path=p.slice(1);let before=original[key];for(const part of path)before=before[part];fields.push({path:p.join('.'),text:v});if(before!==v)changed++;const urls=s=>[...s.matchAll(/https?:\/\/[^\s)<>]+/g)].map(m=>m[0]);if(JSON.stringify(urls(before))!==JSON.stringify(urls(v)))urlChanges.push({path:p.join('.'),before:urls(before),after:urls(v)});
 if(/\bthe the\b|\ban (?:state|legitimate)\b|EU EU|state connection to the state|\bto correction\b|\bcorrection the\b|response response|service provider 800|Union\/EU|Guidance guidance/i.test(v))grammar.push({path:p.join('.'),text:v});
 if(plainLegalCopy(v)!==v)idempotency.push({path:p.join('.'),text:v,again:plainLegalCopy(v)});
 const node=WIZARDS[key].nodes[path[1]]||null;const tokens=tokenizeWithLinks(v,contextFor(key,node));const display=v.replace(/\[([^\]\r\n]+)\]\((https:\/\/[^\s)]+)\)/g,'$1');assert.equal(tokens.map(t=>t.text).join(''),display,p.join('.')+' token display');for(const t of tokens)if(t.sourceId){assert.ok(SOURCES[t.sourceId]);links++;}
 }return;}if(Array.isArray(v))return v.forEach((x,i)=>read(x,[...p,i],yes));if(v&&typeof v==='object')Object.entries(v).forEach(([k,x])=>read(x,[...p,k],COPY_FIELDS.has(k)));}
read(WIZARDS);
for(const [id,w] of Object.entries(WIZARDS))for(const [nodeId,n] of Object.entries(w.nodes))if(n.type==='question'&&n.help){const full=n.help.trim(),lead=decisionLead(full);const text=w.jurisdictionRoutes?full:!lead||lead===full?'':lead.endsWith('…')?full:full.slice(lead.length).trim();if(!text)continue;const ctx=contextFor(id,n);const scope=new Set();if(!w.jurisdictionRoutes)tokenizeWithLinks(lead,ctx,scope);const tokens=tokenizeWithLinks(text,ctx,scope);const blocks=questionHelpBlocks(tokens,id,nodeId);const body=blocks.flatMap(b=>b.items||[b]).flatMap(b=>[...b.lead,...b.tokens]).map(t=>t.text).join(' ').replace(/\s+/g,' ').trim();const display=tokens.map(t=>t.text).join('').replace(/\s+/g,' ').trim();assert.equal(body.replace(/\s+/g,''),display.replace(/\s+/g,''),id+nodeId+' formatting');help.push({id,nodeId,blocks:blocks.map(b=>b.kind)});}
const citations=[
 ['ai-risk','Article 3(63)','eu-ai-act-art-3-roles'],
 ['ai-risk','Article 3(66)','eu-ai-act-art-3-roles'],
 ['ai-risk','Article 2','eu-ai-act-art-2'],
 ['children','Digital Services Act Article 28(2)','dsa-art-28'],
 ['children','Data Protection Act 2018 section 9','uk-dpa-2018-s9'],
 ['cookies','Privacy and Electronic Communications Regulations regulation 6','uk-pecr-reg-6'],
 ['sale-share','California Civil Code section 1798.140(ag)','ccpa-1798-140'],
 ['sale-share','Title 11 of the California Code of Regulations section 7025','ccr-7025'],
 ['breach','Illinois Personal Information Protection Act section 10','il-pipa-10'],
 ['children','Title 16 of the Code of Federal Regulations Part 312','coppa-rule-312'],
 ['adm','Articles 22A–22D','uk-gdpr-art-22a-d']
];for(const [id,text,source] of citations){const c=contextFor(id,{cites:[source]});const actual=tokenizeWithLinks(text,c);assert.ok(actual.some(t=>t.sourceId===source),JSON.stringify({text,source,actual}));}
let steps=0,paths=0;const covered=new Set();const examples=[];
for(const [id,w] of Object.entries(WIZARDS)){
 function visit(nid,h=[],rawh=[]){if(++steps>150000)throw Error('Unexpected path expansion');const n=w.nodes[nid];if(n.type==='outcome'){paths++;covered.add(id+':'+nid);const text=resultText({wizardId:id,history:h,outcomeId:nid});const result=outcomeForState(w,h,nid);assert.ok(text.includes(result.title));assert.ok(text.includes(result.summary));for(const action of result.actions||[])assert.ok(text.includes(action));for(const fact of h)assert.ok(text.includes(fact.question)&&text.includes(fact.answer));for(const sourceId of sourceIdsForState(w,h,null,nid)){const source=SOURCES[sourceId];for(const link of sourceLinks(sourceId,source))assert.ok(text.includes(link.url),sourceId+' copied source URL');if((source.provenance.match(/https:\/\//g)||[]).length>1)assert.ok(!text.includes(source.provenance),sourceId+' combined URL must not be copied');}if(!examples.some(x=>x.id===id)){examples.push({id,outcomeId:nid,history:h,text});}return;}
 const options=eligibleOptions(n,historyContext(h));for(let i=0;i<options.length;i++){const a=answerQuestion(w,nid,i,h),b=answerQuestion(original[id],nid,i,rawh);assert.equal(a.ok,b.ok);assert.equal(a.currentNodeId,b.currentNodeId);assert.equal(a.outcomeId,b.outcomeId);visit(a.currentNodeId||a.outcomeId,a.history,b.history);}}
 visit(w.start);
}
const summary={guides:Object.keys(WIZARDS).length,fields:fields.length,changedFields:changed,sourceRecords:Object.keys(SOURCES).length,inlineSourceTokens:links,helpExcerpts:help.length,formattedComparisons:help.filter(x=>x.blocks.includes('cards')).length,paths,reachableOutcomes:covered.size,steps,citationCases:citations.length,urlChanges,grammar,idempotency};
fs.writeFileSync(out+'/processed-flat.json',JSON.stringify(fields,null,2));fs.writeFileSync(out+'/source-output-check.json',JSON.stringify(summary,null,2));fs.writeFileSync(out+'/copy-examples.json',JSON.stringify(examples,null,2));console.log(JSON.stringify(summary,null,2));assert.deepEqual(urlChanges,[]);assert.deepEqual(grammar,[]);
