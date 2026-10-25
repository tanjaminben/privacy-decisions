import {
  outcomeForState, sourceIdsForState, verifiedDate, wizardReviewState
} from '../../packages/privacy-guides/src/lib/engine/council.js';
import { WIZARDS, SOURCES } from './presentation-registry.js';
import { MOTION } from './editorial-motion.js';
import { sourceLinks } from './source-links.js';

// A short, plain-text note from the same result shown on the page.
// Keep source checks and unknown facts with the answer; omit file metadata and source dumps.
function resultLines({ wizardId, history, outcomeId }) {
  const wizard = WIZARDS[wizardId];
  const outcome = wizard && outcomeForState(wizard, history, outcomeId);
  const review = wizardReviewState(wizardId);
  if (!outcome || outcome.type !== 'outcome' || !review.available) throw new Error('This result is not ready to copy.');
  const lines = [outcome.title, '', outcome.summary];
  if (outcome.notes?.length) lines.push('', 'Why', ...outcome.notes.map(note => `• ${note}`));
  if (outcome.missingFacts?.length) {
    lines.push('', 'Facts still needed');
    for (const fact of outcome.missingFacts) lines.push(`• ${fact.fact}`, `  Ask: ${fact.owner}`, `  Why: ${fact.why}`);
  }
  if (outcome.actions?.length) lines.push('', 'Next steps', ...outcome.actions.map(action => `• ${action}`));
  if (outcome.clock) lines.push('', 'Timing', outcome.clock);
  const jurisdictions = new Set((outcome.cites || []).map(id => SOURCES[id]?.juris));
  const changes = MOTION.filter(note => note.wizardIds.includes(wizardId)
    && (!note.outcomeIds || note.outcomeIds.includes(outcomeId))
    && (!note.scope || jurisdictions.has(note.scope)));
  if (changes.length) {
    lines.push('', 'What may change');
    for (const note of changes) lines.push(`• ${note.text}`, `  Checked ${note.checked}: ${note.source.url}`);
  }
  lines.push('', 'Your answers');
  for (const fact of history) {
    lines.push(`• ${fact.question}`, `  ${fact.answer}`);
    if (fact.answerNote) lines.push(`  ${fact.answerNote}`);
  }
  lines.push('', 'Sources');
  for (const id of sourceIdsForState(wizard, history, null, outcomeId)) {
    const source = SOURCES[id];
    if (source) lines.push(`• ${source.label}`, ...sourceLinks(id, source).map(link => `  ${link.url}`));
  }
  const checked = verifiedDate(wizard);
  if (checked) lines.push('', `Sources checked: ${checked}`);
  lines.push(review.practitionerReviewed
    ? `Legal review${review.reviewedThrough ? ` through ${review.reviewedThrough}` : ' recorded'}.`
    : 'Sources checked by software. No legal review recorded.');
  return lines;
}

export function resultText(state) {
  return [WIZARDS[state.wizardId]?.title, '', ...resultLines(state)].join('\n');
}

export function stateResultsText({ wizardId, runs }) {
  if (!runs?.length || runs.some(run => !run.outcomeId)) throw new Error('Finish the selected states before copying.');
  return [WIZARDS[wizardId]?.title, ...runs.flatMap(run => [
    '', run.label, '', ...resultLines({ wizardId, history: run.history, outcomeId: run.outcomeId })
  ])].join('\n');
}
