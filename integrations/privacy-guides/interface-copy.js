// Exact presentation-only replacements. A changed upstream anchor requires review.
const replacements = {
  'App.svelte': [
    ['<label class="sr-only" for="finder">What are you trying to decide?</label>', ''],
    ['<input id="finder" type="search"', '<input id="finder" type="search" aria-labelledby="finder-heading"'],
    ['Guided privacy determinations with visible source and review status.', 'Work through a privacy question and read the explanation, next steps and sources.'],
    ['That determination link could not be opened. Choose a determination from the library.', 'That guide link could not be opened. Choose a guide below.'],
    ['Current answers cleared. The determination link still contains only the wizard ID.', 'Answers cleared.'],
    ['That answer could not be applied. The current path was left unchanged.', 'That answer could not be saved. Try choosing it again.'],
    ['The later answer was removed.', 'The last answer was removed.'],
    ['selected answer${result.removed === 1 ? \'\' : \'s\'} removed so the path can be rebuilt from that question.', 'answer${result.removed === 1 ? \'\' : \'s\'} removed. Continue from this question.'],
    ['Automatic copy was blocked. Select the text below and copy it manually.', 'Copy the result from the text box below.'],
    ['Integrity stop', 'Guides unavailable'],
    ['The decision graph did not pass its local checks.', 'The guides could not be loaded.'],
    ['No wizard can run until the broken start, branch, outcome, citation, or manifest reference is corrected.', 'A problem with a question, result or source must be fixed before these guides can run.'],
    ['Try breach, DPIA, cookies, AI risk…', 'Try breach, impact assessment, cookies, AI risk…'],
    ["'determination' : 'determinations'", "'guide' : 'guides'"],
    ['No matching determination. Try a shorter term or reset the finder.', 'No matching guide. Try a shorter term or clear the search.'],
    ['No determination matches that search.', 'No guide matches that search.'],
    ['Try a shorter term or reset the finder.', 'Try a shorter term or clear the search.'],
    ['>Reset finder<', '>Clear search<'],
    ['← Change determination', '← Choose another guide'],
    ['Unavailable · source status stop', 'Source unavailable'],
    ['This path cannot run from the current manifest.', 'This guide needs an updated source.'],
    ['At least one relied-on source is draft, missing, or superseded. Choose another determination while the source record is corrected.', 'A source is missing, still a draft or out of date. Choose another guide while it is updated.'],
    ['Choose another determination', 'Choose another guide'],
    ['heading="What you must do"', 'heading="Next steps"'],
    ['>Next determination<', '>Related guides<'],
    ['>Authority<', '>Sources<'],
    ['{item.source.citation}', '{plainLegalCopy(item.source.citation)}']
  ],
  'JurisdictionRun.svelte': [
    ['Answers cleared. Choose the states for a new determination.', 'Answers cleared. Choose the states to check.'],
    ['aria-label="State privacy determination"', 'aria-label="State privacy guides"'],
    ['>Set the scope<', '>Choose states<'],
    ['These paths cover the comprehensive state privacy laws currently in effect. A result does not rule out sector, breach, biometric or other privacy laws.', 'These guides cover the 20 state privacy laws listed below. Other rules may also apply, including laws about data breaches, biometrics and particular industries.'],
    ['{SOURCES[id].citation}', '{plainLegalCopy(SOURCES[id].citation)}'],
    ['aria-label="Next determination"', 'aria-label="Related guides"'],
    ['>Next determination<', '>Related guides<']
  ],
  'ActionChecklist.svelte': [["heading = 'What to do next'", "heading = 'Next steps'"]],
  'engine/council.js': [
    ["'Superseded — do not rely'", "'Out of date — do not use'"]
  ],
  'engine/jurisdictions.js': [
    ['The jurisdiction routes are invalid.', 'The state guide could not be loaded.'],
    ['Choose at least one listed jurisdiction, once each.', 'Choose at least one state from the list.'],
    ['That jurisdiction was not selected.', 'That state was not selected.'],
    ['Choose a selected fact.', 'Choose an answer to change.']
  ]
};

export function interfaceCopy(code, file) {
  for (const [before, after] of replacements[file] || []) {
    if (!code.includes(before)) throw Error(`Review interface copy in ${file}: ${before}`);
    code = code.replaceAll(before, after);
  }
  return code;
}
