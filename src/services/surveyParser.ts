export interface SurveyRespondent {
  timestamp: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  category: 'General Public' | 'Donor' | 'NGO Representative' | string;
  followUp: string;
  materialsDonated: string[];
  donorDifficulties: string[];
  unmetNeedExperience: string;
  willingness: string;
  trustFactors: string[];
  mostUsefulFeature: string;
  studentProblemQuote: string;
  // NGO fields
  ngoName?: string;
  ngoMaterialsRequired?: string[];
  ngoDifficulties?: string[];
  ngoUnfulfilledReasons?: string[];
  ngoPlatformImportance?: string;
}

export interface AggregatedSurveyStats {
  totalResponses: number;
  ngoCount: number;
  donorCount: number;
  publicCount: number;
  materialsDistribution: { name: string; count: number; percentage: number }[];
  donorDifficulties: { name: string; count: number; percentage: number }[];
  platformWillingness: { category: string; value: number; count: number; color: string }[];
  trustFactors: { name: string; count: number; percentage: number }[];
  topFeatures: { name: string; count: number; percentage: number }[];
  studentQuotes: { name: string; location: string; category: string; quote: string }[];
  lastSyncedAt: string;
  source: 'google_sheet' | 'fallback';
}

export const DEFAULT_SHEET_CSV_URL = 
  'https://docs.google.com/spreadsheets/d/1hLhexZlYut-7dMX8nYwLLoG3jOX9jxseiDN90FL57EQ/export?format=csv';

export const DEFAULT_GOOGLE_FORM_URL = 
  'https://docs.google.com/forms/d/e/1FAIpQLScFBOVov2q9G8FywoJKeeqPwWKmVDzMkjFRSTtn7yI7bAsOsQ/viewform';

export const DEFAULT_GOOGLE_SHEET_VIEW_URL = 
  'https://docs.google.com/spreadsheets/d/1hLhexZlYut-7dMX8nYwLLoG3jOX9jxseiDN90FL57EQ/edit?usp=sharing';

// Parse raw CSV text properly handling quoted commas and newlines
export function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [''];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push('');
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      lines.push(row);
      row = [''];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || (row.length === 1 && row[0].trim() !== '')) {
    lines.push(row);
  }
  return lines;
}

// Helper to normalize multi-value answers separated by commas
function splitMultiOptions(raw: string): string[] {
  if (!raw || !raw.trim()) return [];
  return raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

// Convert CSV rows into structured respondents
export function processSurveyRows(rows: string[][]): {
  respondents: SurveyRespondent[];
  stats: AggregatedSurveyStats;
} {
  if (rows.length < 2) {
    throw new Error('CSV does not contain response rows.');
  }

  const headers = rows[0].map(h => h.trim().toLowerCase());

  // Find column indices by header keyword matching
  const findIndex = (patterns: string[]): number => {
    return headers.findIndex(h => patterns.some(p => h.includes(p)));
  };

  const idxTimestamp = findIndex(['timestamp']);
  const idxName = findIndex(['name of your ngo']) === -1 ? findIndex(['name']) : headers.findIndex((h) => h.includes('name') && !h.includes('ngo'));
  const idxEmail = findIndex(['email']);
  const idxAddress = findIndex(['address']);
  const idxPhone = findIndex(['phone number', 'phone']);
  const idxFollowUp = findIndex(['follow-up discussion', 'follow up']);
  const idxCategory = findIndex(['which category best describes you', 'category']);
  
  // Donor / Public questions
  const idxMaterialsPrefer = findIndex(['types of materials do you usually prefer to donate', 'prefer to donate']);
  const idxDonorDifficulties = findIndex(['what difficulties do you face when trying to donate', 'difficulties do you face']);
  const idxUnmet = findIndex(['could not find an ngo that currently needed it', 'could not find an ngo']);
  const idxWillingness = findIndex(['would you use a platform that shows verified ngo requirements', 'would you use a platform']);
  const idxTrust = findIndex(['what would make you trust such a platform', 'trust such a platform']);
  const idxFeature = findIndex(['which feature would be most useful to you', 'feature would be most useful']);
  const idxStudentProblem = findIndex(['biggest problem students face', 'problem students face']);

  // NGO questions
  const idxNgoName = findIndex(['name of your ngo']);
  const idxNgoMaterials = findIndex(['commonly required or offered', 'material donations are most commonly required']);
  const idxNgoDifficulties = findIndex(['communicating material requirements']);
  const idxNgoUnfulfilledReasons = findIndex(['reasons requirements remain unfulfilled']);
  const idxNgoImportance = findIndex(['how important would it be for your ngo']);

  const respondents: SurveyRespondent[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0 || !row[0]?.trim()) continue;

    const getVal = (idx: number) => (idx >= 0 && idx < row.length ? row[idx].trim() : '');

    const categoryRaw = getVal(idxCategory);
    let category = categoryRaw;
    if (categoryRaw.toLowerCase().includes('ngo')) category = 'NGO Representative';
    else if (categoryRaw.toLowerCase().includes('donor')) category = 'Donor';
    else if (categoryRaw.toLowerCase().includes('public')) category = 'General Public';
    else category = categoryRaw || 'Donor / Public';

    respondents.push({
      timestamp: getVal(idxTimestamp),
      name: getVal(idxName),
      email: getVal(idxEmail),
      address: getVal(idxAddress),
      phone: getVal(idxPhone),
      category,
      followUp: getVal(idxFollowUp),
      materialsDonated: splitMultiOptions(getVal(idxMaterialsPrefer)),
      donorDifficulties: splitMultiOptions(getVal(idxDonorDifficulties)),
      unmetNeedExperience: getVal(idxUnmet),
      willingness: getVal(idxWillingness),
      trustFactors: splitMultiOptions(getVal(idxTrust)),
      mostUsefulFeature: getVal(idxFeature),
      studentProblemQuote: getVal(idxStudentProblem),
      ngoName: getVal(idxNgoName),
      ngoMaterialsRequired: splitMultiOptions(getVal(idxNgoMaterials)),
      ngoDifficulties: splitMultiOptions(getVal(idxNgoDifficulties)),
      ngoUnfulfilledReasons: splitMultiOptions(getVal(idxNgoUnfulfilledReasons)),
      ngoPlatformImportance: getVal(idxNgoImportance),
    });
  }

  const total = respondents.length;
  let ngoCount = 0;
  let donorCount = 0;
  let publicCount = 0;

  const matCounts: Record<string, number> = {};
  const diffCounts: Record<string, number> = {};
  const willCounts: Record<string, number> = {};
  const trustCounts: Record<string, number> = {};
  const featCounts: Record<string, number> = {};
  const studentQuotes: { name: string; location: string; category: string; quote: string }[] = [];

  respondents.forEach(res => {
    if (res.category === 'NGO Representative') ngoCount++;
    else if (res.category === 'Donor') donorCount++;
    else publicCount++;

    // Materials
    res.materialsDonated.forEach(m => {
      matCounts[m] = (matCounts[m] || 0) + 1;
    });

    // Difficulties
    res.donorDifficulties.forEach(d => {
      diffCounts[d] = (diffCounts[d] || 0) + 1;
    });

    // Willingness
    if (res.willingness) {
      willCounts[res.willingness] = (willCounts[res.willingness] || 0) + 1;
    }

    // Trust factors
    res.trustFactors.forEach(t => {
      trustCounts[t] = (trustCounts[t] || 0) + 1;
    });

    // Feature
    if (res.mostUsefulFeature) {
      featCounts[res.mostUsefulFeature] = (featCounts[res.mostUsefulFeature] || 0) + 1;
    }

    // Quotes
    if (res.studentProblemQuote && res.studentProblemQuote.length > 15) {
      studentQuotes.push({
        name: res.name || 'Anonymous Student',
        location: res.address || 'Survey Respondent',
        category: res.category,
        quote: res.studentProblemQuote
      });
    }
  });

  const materialsDistribution = Object.entries(matCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  const donorDifficulties = Object.entries(diffCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  const willColorMap: Record<string, string> = {
    'Definitely': '#1F4D3D',
    'definitely': '#1F4D3D',
    'Maybe': '#E8A33D',
    'maybe': '#E8A33D',
    'Probably': '#C86446',
    'probably': '#C86446',
    'No': '#828F87',
    'no': '#828F87'
  };

  const platformWillingness = Object.entries(willCounts).map(([cat, count]) => ({
    category: cat,
    count,
    value: total > 0 ? Math.round((count / total) * 100) : 0,
    color: willColorMap[cat] || '#1F4D3D'
  }));

  const trustFactors = Object.entries(trustCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  const topFeatures = Object.entries(featCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  return {
    respondents,
    stats: {
      totalResponses: total,
      ngoCount,
      donorCount,
      publicCount,
      materialsDistribution,
      donorDifficulties,
      platformWillingness,
      trustFactors,
      topFeatures,
      studentQuotes,
      lastSyncedAt: new Date().toLocaleTimeString(),
      source: 'google_sheet'
    }
  };
}

// Fetch live CSV directly from Google Sheets
export async function fetchLiveSurveyCSV(
  sheetCsvUrl: string = DEFAULT_SHEET_CSV_URL
): Promise<{ respondents: SurveyRespondent[]; stats: AggregatedSurveyStats }> {
  const url = `${sheetCsvUrl}${sheetCsvUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'text/csv' }
  });

  if (!response.ok) {
    throw new Error(`Failed to load Google Sheet: HTTP ${response.status}`);
  }

  const csvText = await response.text();
  const rows = parseCSV(csvText);
  return processSurveyRows(rows);
}
