// Remove publication-workflow claims from display notes, preserving the legal
// qualifications and the unmodified underlying source records.
export const PROCESS_CLAIMS = [
  ['Verified editorial summary,', 'Editorial summary,'],
  [' Candidate checked against primary material retrieved on September 22, 2026; independent legal-panel review and practitioner review are separate.', ''],
  [' Primary text retrieved for the September 22, 2026 applicability candidate.', ''],
  [' Current Indiana Code2026 primary PDF retrieved September 22, 2026 using native PowerShell Invoke-WebRequest and PDF text extraction.', ' Indiana Code 2026.'],
  [' Independent and practitioner review remain separate.', ''],
  [' Independent content review and practitioner review are separate.', ''],
  ['Editorial summary checked against the 2026 statutory supplement and PA26-64 on October 26, 2026. Practitioner legal review is not recorded.', 'Editorial summary of the 2026 statutory supplement and Public Act 26-64.'],
  ['Editorial summary checked against primary law on October 26, 2026.', 'Editorial summary.'],
  [', checked against the enacted 2023 chapter.', ' and the enacted 2023 chapter.'],
  ['Current 2026 code fetched; no future applicability version applied.', 'No future applicability version is applied here.'],
  ['Current applicability text fetched; no future amendment applied.', 'No future amendment is applied here.'],
  ['Current code retrieved September 22, 2026; no future applicability amendment applied.', 'No future applicability amendment is applied here.'],
  ['Cure/enforcement checkpoint: September 22, 2026.', 'Deadline to correct violations and enforcement rules as of September 22, 2026.'],
  ['those are not current at this checkpoint.', 'those do not apply yet.'],
  ['this candidate flags that role for follow-up.', 'this guide flags that role for follow-up.'],
  ['this draft retains the statute\'s narrower wording', 'this guide retains the statute\'s narrower wording'],
  ['The fetched PDF explicitly identifies', 'The official PDF explicitly identifies']
];

export function sourceNote(text) {
  for (const [claim, replacement] of PROCESS_CLAIMS) text = text.replaceAll(claim, replacement);
  return text.trim();
}
