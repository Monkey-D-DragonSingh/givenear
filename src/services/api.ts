import type { DonationItem, NgoNeed, SyncConfig } from '../types';
import { INITIAL_DONATIONS, INITIAL_NGO_NEEDS } from '../data/mockData';

const STORAGE_KEYS = {
  DONATIONS: 'givenear_donations_v1',
  NGO_NEEDS: 'givenear_ngo_needs_v1',
  CONFIG: 'givenear_sync_config_v1'
};

export function getSavedConfig(): SyncConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse saved config', e);
  }
  return {
    webAppUrl: '',
    useLiveSheet: false,
    googleFormSurveyUrl: 'https://forms.google.com'
  };
}

export function saveConfig(config: SyncConfig): void {
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
}

export function getLocalDonations(): DonationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DONATIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse local donations', e);
  }
  localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(INITIAL_DONATIONS));
  return INITIAL_DONATIONS;
}

export function saveLocalDonations(donations: DonationItem[]): void {
  localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));
}

export function getLocalNeeds(): NgoNeed[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NGO_NEEDS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse local needs', e);
  }
  localStorage.setItem(STORAGE_KEYS.NGO_NEEDS, JSON.stringify(INITIAL_NGO_NEEDS));
  return INITIAL_NGO_NEEDS;
}

export function saveLocalNeeds(needs: NgoNeed[]): void {
  localStorage.setItem(STORAGE_KEYS.NGO_NEEDS, JSON.stringify(needs));
}

// Fetch donations from Live Google Sheet or fallback to local
export async function fetchDonationsApi(config: SyncConfig): Promise<{ success: boolean; data: DonationItem[]; message?: string }> {
  if (!config.useLiveSheet || !config.webAppUrl.trim()) {
    return { success: true, data: getLocalDonations() };
  }

  try {
    const url = `${config.webAppUrl.trim()}?action=getDonations&_t=${Date.now()}`;
    const res = await fetch(url, { method: 'GET', redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();

    if (json.status === 'success' && Array.isArray(json.donations)) {
      // Map and sanitize columns
      const mapped: DonationItem[] = json.donations.map((d: any, idx: number) => ({
        id: String(d.id || `DON-${idx + 1}`),
        timestamp: String(d.timestamp || new Date().toISOString().substring(0, 10)),
        title: String(d.title || 'Donation Item'),
        category: d.category || 'Other Essentials',
        quantity: String(d.quantity || '1 unit'),
        condition: d.condition || 'Good Working Condition',
        location: String(d.location || 'Local Area'),
        city: String(d.city || 'Delhi NCR'),
        lat: Number(d.lat) || 28.6139,
        lng: Number(d.lng) || 77.2090,
        donorName: String(d.donorName || 'Generous Donor'),
        donorPhone: String(d.donorPhone || ''),
        pickupTimes: String(d.pickupTimes || 'Contact for timings'),
        notes: String(d.notes || ''),
        status: (d.status === 'claimed' ? 'claimed' : d.status === 'completed' ? 'completed' : 'available'),
        claimedByNgo: d.claimedByNgo ? String(d.claimedByNgo) : undefined,
        ngoRepresentative: d.ngoRepresentative ? String(d.ngoRepresentative) : undefined,
        ngoPhone: d.ngoPhone ? String(d.ngoPhone) : undefined,
        pickupDate: d.pickupDate ? String(d.pickupDate) : undefined,
        claimedAt: d.claimedAt ? String(d.claimedAt) : undefined,
      }));

      // Cache locally
      saveLocalDonations(mapped);
      return { success: true, data: mapped };
    } else {
      throw new Error(json.message || 'Invalid data returned from sheet');
    }
  } catch (err: any) {
    console.error('Sheet fetch failed, using local cache:', err);
    return {
      success: false,
      data: getLocalDonations(),
      message: `Google Sheet fetch warning: ${err.message || 'Could not reach endpoint'}. Displaying cached data.`
    };
  }
}

// Create new donation post
export async function postDonationApi(config: SyncConfig, item: Omit<DonationItem, 'id' | 'timestamp' | 'status'>): Promise<{ success: boolean; item: DonationItem; message: string }> {
  const newId = `DON-${Math.floor(100 + Math.random() * 900)}`;
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const fullItem: DonationItem = {
    ...item,
    id: newId,
    timestamp,
    status: 'available'
  };

  // Always update local cache first
  const current = getLocalDonations();
  const updated = [fullItem, ...current];
  saveLocalDonations(updated);

  if (config.useLiveSheet && config.webAppUrl.trim()) {
    try {
      await fetch(config.webAppUrl.trim(), {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'createDonation',
          data: fullItem
        })
      });
      return { success: true, item: fullItem, message: 'Saved to both Google Sheet and local device!' };
    } catch (err) {
      console.warn('Apps Script post failed, saved to local cache', err);
      return { success: true, item: fullItem, message: 'Saved locally! (Google Sheet sync failed or offline)' };
    }
  }

  return { success: true, item: fullItem, message: 'Donation listing posted successfully!' };
}

// Claim a donation for NGO pickup
export async function claimDonationApi(
  config: SyncConfig, 
  claimData: { id: string; ngoName: string; ngoRepresentative: string; ngoPhone: string; pickupDate: string }
): Promise<{ success: boolean; message: string }> {
  const current = getLocalDonations();
  const now = new Date();
  const claimedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const updated = current.map(item => {
    if (item.id === claimData.id) {
      return {
        ...item,
        status: 'claimed' as const,
        claimedByNgo: claimData.ngoName,
        ngoRepresentative: claimData.ngoRepresentative,
        ngoPhone: claimData.ngoPhone,
        pickupDate: claimData.pickupDate,
        claimedAt
      };
    }
    return item;
  });

  saveLocalDonations(updated);

  if (config.useLiveSheet && config.webAppUrl.trim()) {
    try {
      await fetch(config.webAppUrl.trim(), {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'claimDonation',
          ...claimData
        })
      });
      return { success: true, message: `Successfully claimed! Google Sheet row updated with ${claimData.ngoName}.` };
    } catch (err) {
      console.warn('Apps Script claim sync failed, local updated', err);
      return { success: true, message: 'Pickup claim recorded in local database!' };
    }
  }

  return { success: true, message: 'Pickup claim registered successfully!' };
}

// Test Google Apps Script connection
export async function testSheetConnection(url: string): Promise<{ success: boolean; message: string }> {
  try {
    const testUrl = `${url.trim()}?action=test&_t=${Date.now()}`;
    const res = await fetch(testUrl, { method: 'GET', redirect: 'follow' });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    if (json.status === 'success') {
      return { success: true, message: 'Connection verified! Your Google Apps Script API is active.' };
    }
    return { success: false, message: json.message || 'Script did not return success status' };
  } catch (err: any) {
    return {
      success: false,
      message: `Connection failed: ${err.message || 'Check URL and ensure "Who has access" is set to "Anyone"'}`
    };
  }
}
