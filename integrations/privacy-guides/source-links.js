// BT-77: display individual source URLs without rewriting imported evidence.
// Labels describe provisions already named in the original provenance records.
const reviewed = {
  'uk-dpa-2018-s10-sch1': [
    ['Section 10', 'https://www.legislation.gov.uk/ukpga/2018/12/section/10'],
    ['Section 11', 'https://www.legislation.gov.uk/ukpga/2018/12/section/11'],
    ['Schedule 1', 'https://www.legislation.gov.uk/ukpga/2018/12/schedule/1'],
  ],
  'uk-dpa-2018-s9': [
    ['Section 9', 'https://www.legislation.gov.uk/ukpga/2018/12/section/9/enacted'],
    ['UK GDPR Article 8', 'https://www.legislation.gov.uk/eur/2016/679/article/8'],
  ],
  'uk-duaa-2025-sar': [
    ['Section 78', 'https://www.legislation.gov.uk/ukpga/2025/18/section/78'],
    ['Section 76', 'https://www.legislation.gov.uk/ukpga/2025/18/section/76'],
  ],
  'uk-duaa-2025': [
    ['Data (Use and Access) Act 2025', 'https://www.legislation.gov.uk/ukpga/2025/18'],
    ['Consolidated UK GDPR', 'https://www.legislation.gov.uk/eur/2016/679'],
  ],
  'uk-pecr-reg-6': [
    ['Regulation 6', 'https://www.legislation.gov.uk/uksi/2003/2426/regulation/6'],
    ['Schedule A1', 'https://www.legislation.gov.uk/uksi/2003/2426/schedule/A1'],
  ],
};

function safeUrl(value) {
  if (typeof value !== 'string' || /[\r\n]/.test(value) || (value.match(/https?:\/\//g) || []).length !== 1) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

export function sourceLinks(id, source) {
  return (reviewed[id] || [['Open the official text', source?.provenance || source?.url]])
    .flatMap(([label, value]) => {
      const url = safeUrl(value);
      return url ? [{ label, url }] : [];
    });
}

export function primarySourceUrl(id, source) {
  return sourceLinks(id, source)[0]?.url || null;
}
