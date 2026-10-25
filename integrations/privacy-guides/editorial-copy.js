// Presentation copy only. IDs, branches, source records and numeric rules stay
// in the preserved source registry. Reviewed exceptions live beside this file.
import overrides from './editorial-overrides.json' with {type:'json'};

const terms = [
  ['DPIAs', 'data protection impact assessments'], ['DPIA', 'data protection impact assessment'],
  ['DPOs', 'data protection officers'], ['DPO', 'data protection officer'],
  ['ROPAs', 'records of processing activities'], ['ROPA', 'record of processing activities'],
  ['DSARs', 'data access requests'], ['DSAR', 'data access request'],
  ['SCCs', 'standard contractual clauses'], ['SCC', 'standard contractual clauses'],
  ['BCRs', 'binding corporate rules'], ['BCR', 'binding corporate rules'],
  ['TIAs', 'transfer impact assessments'], ['TIA', 'transfer impact assessment'],
  ['LIAs', 'legitimate interests assessments'], ['LIA', 'legitimate interests assessment'],
  ['GPAI', 'general-purpose AI'], ['LLMs', 'large language models'], ['LLM', 'large language model'],
  ['RBI', 'remote biometric identification'], ['CSAM', 'child sexual abuse material'],
  ['ADMT', 'automated decision-making technology'], ['ADM', 'automated decision-making'],
  ['UOOMs', 'universal opt-out mechanisms'], ['UOOM', 'universal opt-out mechanism'],
  ['GPC', 'Global Privacy Control (a browser opt-out signal)'],
  ['RTBF', 'right to have personal data erased'], ['VPC', 'verifiable parental consent'],
  ['COPPA', "Children’s Online Privacy Protection Act"], ['BIPA', 'Biometric Information Privacy Act'],
  ['HIPAA', 'Health Insurance Portability and Accountability Act'],
  ['FERPA', 'Family Educational Rights and Privacy Act'],
  ['GLBA', 'Gramm–Leach–Bliley Act'], ['FCRA', 'Fair Credit Reporting Act'],
  ['FIPPs', 'fair information practice principles'],
  ['DUAA 2025', 'Data (Use and Access) Act 2025'], ['DUAA', 'Data (Use and Access) Act 2025'],
  ['DPA 2018', 'Data Protection Act 2018'],
  ['DPAs', 'data processing agreements'], ['DPA', 'data processing agreement'],
  ['DPF', 'Data Privacy Framework'], ['IDTA', 'International Data Transfer Agreement'],
  ['PECR', 'Privacy and Electronic Communications Regulations'],
  ['EDPB', 'European Data Protection Board'], ['EDPS', 'European Data Protection Supervisor'],
  ['CJEU', 'Court of Justice of the European Union'],
  ['ICO', 'Information Commissioner’s Office'], ['CNIL', 'French data protection regulator (CNIL)'],
  ['AEPD', 'Spanish data protection regulator (AEPD)'], ['BfDI', 'German federal data protection regulator (BfDI)'],
  ['WP29', 'Article 29 Working Party'], ['SAs', 'data protection regulators'], ['SA', 'data protection regulator'],
  ['AGs', 'state attorneys general'], ['AG', 'state attorney general'],
  ['FTC', 'Federal Trade Commission'], ['CPPA', 'California Privacy Protection Agency'],
  ['CCPA', 'California Consumer Privacy Act'], ['CPRA', 'California Privacy Rights Act'],
  ['CCTV', 'surveillance cameras'], ['HR', 'human resources'],
  ['CIO', 'chief information officer'], ['SaaS', 'software-as-a-service'],
  ['ML', 'machine learning'], ['PETs', 'privacy-enhancing technologies'],
  ['APIs', 'application programming interfaces'], ['API', 'application programming interface'],
  ['TOMs', 'technical and organizational security measures'],
  ['PII', 'personal information'], ['SARs', 'subject access requests'], ['SAR', 'subject access request']
  ,['LI', 'legitimate interests'], ['TRA', 'transfer risk assessment'],
  ['ISS', 'online information society service'], ['PI', 'personal information'],
  ['DSA', 'Digital Services Act'], ['SOP', 'written procedure'],
  ['CRIA', 'child rights impact assessment'], ['AADC', 'Age Appropriate Design Code'],
  ['TCF', 'Transparency and Consent Framework'], ['APD', 'appropriate policy document'],
  ['SDKs', 'embedded software development kits'], ['SDK', 'embedded software development kit'],
  ['B2B', 'business-to-business'], ['MS', 'EU country'],
  ['BDSG', 'German Federal Data Protection Act'], ['DSK', 'German data protection authorities’ conference'],
  ['DPPEC Regulations 2019', '2019 UK data protection regulations']
  ,['CMIA', 'California Confidentiality of Medical Information Act'],
  ['CFIPA', 'California Financial Information Privacy Act'],
  ['DPPA', 'Driver’s Privacy Protection Act'],
  ['HITECH', 'Health Information Technology for Economic and Clinical Health Act'],
  ['HHS', 'US Department of Health and Human Services'],
  ['SSNs', 'Social Security numbers'], ['SSN', 'Social Security number'],
  ['CRA', 'consumer reporting agency'], ['CRAs', 'consumer reporting agencies'],
  ['SBA', 'US Small Business Administration'], ['NAICS', 'North American Industry Classification System'],
  ['DOT', 'US Department of Transportation'], ['CPI', 'Consumer Price Index'],
  ['CCBA', 'advertising based on activity across different businesses'],
  ['SP', 'service provider'], ['M&A', 'mergers and acquisitions'],
  ['NCII', 'nonconsensual intimate imagery'], ['FRIA', 'fundamental rights impact assessment'],
  ['QMS', 'quality management system'], ['FOSS', 'free and open-source software'],
  ['PPE', 'personal protective equipment'], ['EMI', 'electromagnetic interference'],
  ['NIS2', 'Network and Information Security Directive (NIS 2)'], ['DORA', 'Digital Operational Resilience Act'],
  ['ENISA', 'EU Agency for Cybersecurity'], ['NIST', 'US National Institute of Standards and Technology'],
  ['PCLOB', 'Privacy and Civil Liberties Oversight Board'],
  ['C2C', 'controller-to-controller'], ['C2P', 'controller-to-processor'],
  ['CPA', 'Colorado Privacy Act'], ['CTDPA', 'Connecticut Data Privacy Act'],
  ['MODPA', 'Maryland Online Data Privacy Act'], ['VCDPA', 'Virginia Consumer Data Protection Act'],
  ['CDPA', 'Consumer Data Protection Act'], ['TIPA', 'Tennessee Information Protection Act'],
  ['UCPA', 'Utah Consumer Privacy Act'], ['TDPSA', 'Texas Data Privacy and Security Act'],
  ['EEA', 'European Economic Area'], ['DFS', 'New York Department of Financial Services'],
  ['IL PIPA', 'Illinois Personal Information Protection Act'], ['PIPA', 'Illinois Personal Information Protection Act'],
  ['CCR', 'California Code of Regulations'], ['IC', 'Indiana Code'],
  ['NY GBL', 'New York General Business Law'], ['CA', 'California'], ['NY', 'New York'], ['IL', 'Illinois'],
  ['UI', 'interface'], ['SMS', 'text messages'],
  ['WP243', 'guidance on data protection officers (WP243)'],
  ['WP248', 'guidance on data protection impact assessments (WP248)'],
  ['WP251', 'guidance on automated decisions and profiling (WP251)'],
  ['WP242', 'guidance on data portability (WP242)'],
  ['WP194', 'guidance on cookie-consent exceptions (WP194)']
];
const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function plainLegalCopy(value) {
  // URLs and Markdown link destinations are evidence, not editorial text.
  const urls=[];
  let text=value.replace(/https?:\/\/[^\s)<>]+/g,url=>`\uE000${urls.push(url)-1}\uE001`)
    .replace(/\bNIST SP\b/g,'NIST Special Publication')
    .replace(/\bPA26-76\b/g,'Public Act 26-76').replace(/\b(?:New York Senate Bill )?S804\b/g,'New York Senate Bill S804')
    .replace(/\bSB (?=\d)/g,'Senate Bill ')
    .replace(/\bUnion\/MS law\b/g,'EU or national law')
    .replace(/\bEU Member States\b/g,'EU countries').replace(/\bEU Member State\b/g,'EU country')
    .replace(/supervisory authorit(?:y|ies)\s*\(SAs?\)/gi,'data protection regulator')
    .replace(/\bdata subjects['’]/gi,'people’s').replace(/\bdata subject['’]s/gi,'the person’s');
  for(const [short,long] of terms) {
    const name=long.split(' (')[0];
    if(name!==long)text=text.replace(new RegExp(`${escape(name)}\\s*\\(${escape(short)}\\)`,'gi'),short);
    text=text.replace(new RegExp(`${escape(long)}\\s*\\(${escape(short)}\\)`,'gi'),long);
    text=text.replace(new RegExp(`\\b${escape(short)}\\b`,'g'),long);
  }
  text=text
    .replace(/\bArts\.?(?=\s+\d)/g,'Articles').replace(/\bArt\./g,'Article')
    .replace(/\bCh\.\s*(VIII|VII|VI|IV|V|III|II|I)\b/g,(_,n)=>'Chapter '+({I:1,II:2,III:3,IV:4,V:5,VI:6,VII:7,VIII:8}[n]))
    .replace(/\bCh\.\s*(\d+)/g,'Chapter $1')
    .replace(/\bChapters?\s+(VIII|VII|VI|IV|V|III|II|I)\b/g,(_,n)=>'Chapter '+({I:1,II:2,III:3,IV:4,V:5,VI:6,VII:7,VIII:8}[n]))
    .replace(/\bSch\.?\s+(?=\d)/g,'Schedule ').replace(/\bpara\.?\s+(?=\d)/g,'paragraph ')
    .replace(/\bss?\.\s+(?=\d)/g,'section ').replace(/§§\s*/g,'sections ').replace(/§\s*/g,'section ')
    .replace(/\bSec\.\s*(?=\d)/g,'section ').replace(/\breg\.?\s+(?=\d)/g,'regulation ')
    .replace(/\b16 CFR\b/g,'Title 16 of the Code of Federal Regulations').replace(/\b15 U\.S\.C\./g,'Title 15 of the United States Code')
    .replace(/\bCal\. Civ\. Code\b/g,'California Civil Code').replace(/\bNY GBL\b/g,'New York General Business Law')
    .replace(/\b11 California Code of Regulations\b/g,'Title 11 of the California Code of Regulations')
    .replace(/\bNYDFS\b/g,'New York Department of Financial Services').replace(/\b23 NYCRR\b/g,'Title 23 of the New York regulations')
    .replace(/\be\.g\./g,'for example,').replace(/\bi\.e\./g,'that is,')
    .replace(/\bvs\.?\b/g,'or').replace(/\binter alia\b/gi,'among other things')
    .replace(/\bcarve-outs\b/gi,'exceptions').replace(/\bcarve-out\b/gi,'exception')
    .replace(/\bprior consultation\b/g,'consultation before processing starts')
    .replace(/\bresidual risks?\b/g,m=>m.endsWith('s')?'risks that remain after safeguards':'risk that remains after safeguards')
    .replace(/\bdata subjects\b/g,'the people whose data you use').replace(/\bdata subject\b/g,'the person whose data you use')
    .replace(/\bthe subject['’]s\b/gi,'the person’s').replace(/\bsubjects['’]/gi,'people’s')
    .replace(/\bSubjects\b/g,'People').replace(/\bsubjects\b/g,'people')
    .replace(/\bsubject rights\b/g,'people’s rights').replace(/\bthe subject\b(?! to)/gi,'the person')
    .replace(/\bsupervisory authorities\b/gi,'data protection regulators').replace(/\bsupervisory authority\b/gi,'data protection regulator')
    .replace(/\blawful basis\b/gi,'legal ground').replace(/\bderogations\b/gi,'exceptions').replace(/\bderogation\b/gi,'exception')
    .replace(/\bmandatory cure period\b/gi,'mandatory period to correct a violation before enforcement')
    .replace(/\bcure period\b/gi,'period to correct a violation').replace(/\bcure window\b/gi,'period to correct a violation')
    .replace(/\bcure right\b/gi,'right to correct a violation before enforcement').replace(/\bcure opportunities\b/gi,'opportunities to correct violations')
    .replace(/\bCure and enforcement\b/g,'Correcting violations and enforcement').replace(/\bto cure\b/gi,'to correct')
    .replace(/\bthreshold gate\b/gi,'threshold test').replace(/\bscope gate\b/gi,'coverage test').replace(/\bgate\b/g,'test')
    .replace(/\blimbs\b/g,'conditions').replace(/\blimb\b/g,'condition').replace(/\bnexus\b/g,'connection to the state')
    .replace(/\bstrictly more than\b/g,'more than').replace(/\bstrictly greater than\b/g,'more than')
    .replace(/\bwillfully disregarded minors\b/g,'minors whose age is deliberately ignored')
    .replace(/\bknown or willfully disregarded consumers\b/g,'consumers whose age is known or deliberately ignored')
    .replace(/\bsame-manner health records\b/g,'health-provider records protected in the same way as regulated health information')
    .replace(/\bPart2\b/g,'Part 2 substance-use-disorder confidentiality rules')
    .replace(/\bsurviving\b/g,'remaining').replace(/\bdiary\b/gi,'record')
    .replace(/\b72h\b/g,'72 hours').replace(/\b72-h\b/g,'72-hour')
    .replace(/\bclock pauses\b/g,'response period pauses').replace(/\bnotification clocks\b/g,'notification deadlines')
    .replace(/\bnotification clock\b/g,'notification period')
    .replace(/\bFLOPs\b/g,'floating-point operations (a measure of training computation)')
    .replace(/\bONLY\b/g,'only').replace(/\bBOTH\b/g,'both').replace(/\bALWAYS\b/g,'always')
    .replace(/\bAND\b/g,'and').replace(/\bOR\b/g,'or').replace(/\bBEFORE\b/g,'before')
    .replace(/\b(ALL|ALSO|ANY|IS|NOT|OUR|OWN|PLACED|SECTION|SENSITIVE|SUPPLIES|UNLESS)\b/g,word=>word.toLowerCase())
    .replace(/\bUnion\/MS law\b/g,'EU or national law').replace(/\bUnion\/Member State law\b/g,'EU or national law')
    .replace(/\bMember States?\b/g,m=>m.endsWith('s')?'EU countries':'EU country')
    .replace(/\bminimisation\b/g,'minimization').replace(/\banonymised\b/g,'anonymized').replace(/\bregularise\b/g,'correct')
    .replace(/\brecognised\b/g,'recognized').replace(/\borganisations\b/g,'organizations').replace(/\borganisation\b/g,'organization')
    .replace(/\bwithout undue delay\b/g,'without unnecessary delay')
    .replace(/\bthe the person/g,'the person').replace(/\bthe the people/g,'the people')
    .replace(/\ban state attorney general/g,'a state attorney general')
    .replace(/\ban legitimate interests\b/g,'a legitimate interest')
    .replace(/\bGuidance guidance on/g,'Guidance on').replace(/\bguidance guidance on/g,'guidance on')
    .replace(/(guidance on [^()]+ \(WP\d+\)) guidance/g,'$1')
    .replace(/(^|[.!?]\s+)guidance on/g,'$1Guidance on')
    .replace(/\s+([,.;:])/g,'$1').replace(/,\s*,/g,',')
    .replace(/\uE000(\d+)\uE001/g,(_,i)=>urls[Number(i)]);
  return text;
}

export const COPY_FIELDS = new Set(['title','tag','q','help','label','desc','summary','actions','resultActions','resultNotes','notes','clock','anchorLabel','note','fact','owner','why']);

export function editorialWizard(id,source) {
  const changes=overrides[id]||{};
  const pending=new Set(Object.keys(changes));
  function visit(value,path=[],allowed=false) {
    if(typeof value==='string') {
      if(!allowed)return value;
      const key=path.join('.');
      pending.delete(key);
      return plainLegalCopy(changes[key] ?? value);
    }
    if(Array.isArray(value))return value.map((item,index)=>visit(item,[...path,index],allowed));
    if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,visit(item,[...path,key],COPY_FIELDS.has(key))]));
    return value;
  }
  const result=visit(source);
  if(pending.size)throw Error(`Unknown or non-copy override in ${id}: ${[...pending].join(', ')}`);
  return result;
}

export function editorialSources(source) {
  return Object.fromEntries(Object.entries(source).map(([id,item])=>{
    // Publication titles already explain these reference codes. Keep the code
    // beside that title instead of repeating the title inside its parentheses.
    const codes=[];
    const label=plainLegalCopy(item.label.replace(/\bWP\d+\b/g,code=>`\uE100${codes.push(code)-1}\uE101`))
      .replace(/\uE100(\d+)\uE101/g,(_,i)=>codes[Number(i)]);
    return [id,{...item,label,...(item.note?{note:plainLegalCopy(item.note)}:{})}];
  }));
}
