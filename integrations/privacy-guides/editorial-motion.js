import { MOTION as original } from '../../packages/privacy-guides/src/lib/data/motion.js';
import { plainLegalCopy } from './editorial-copy.js';
export const MOTION = original.map(note => ({
  ...note,
  text: plainLegalCopy(note.text).replace(/supervisory-authority notification/g, 'notification to the data protection regulator'),
  source: { ...note.source, label: 'Joint Opinion 2/2026 by the European Data Protection Board and European Data Protection Supervisor on the Digital Omnibus proposal' }
}));
