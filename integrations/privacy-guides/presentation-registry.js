import {WIZARDS as originals,SOURCES as sources,REGISTRY_SHA256} from '../../packages/privacy-guides/src/lib/data/registry.generated.js';
import {editorialWizard,editorialSources} from './editorial-copy.js';
export {REGISTRY_SHA256};
export const WIZARDS=Object.fromEntries(Object.entries(originals).map(([id,wizard])=>[id,editorialWizard(id,wizard)]));
export const SOURCES=editorialSources(sources);
