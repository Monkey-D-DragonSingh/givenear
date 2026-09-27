export type DonationCategory = 
  | 'Books & Stationery'
  | 'Dry Rations & Food'
  | 'Clothes & Blankets'
  | 'Medical & Hygiene'
  | 'Furniture & Utensils'
  | 'Toys & Learning Kits'
  | 'Electronics & Devices'
  | 'Other Essentials';

export type ItemCondition = 'Brand New / Sealed' | 'Gently Used / Like New' | 'Good Working Condition';

export type DonationStatus = 'available' | 'claimed' | 'completed';

export interface DonationItem {
  id: string;
  timestamp: string;
  title: string;
  category: DonationCategory;
  quantity: string;
  condition: ItemCondition;
  location: string;
  city: string;
  lat: number;
  lng: number;
  donorName: string;
  donorPhone: string;
  pickupTimes: string;
  notes: string;
  status: DonationStatus;
  claimedByNgo?: string;
  ngoRepresentative?: string;
  ngoPhone?: string;
  pickupDate?: string;
  claimedAt?: string;
}

export interface NgoNeed {
  id: string;
  ngoName: string;
  regNumber: string;
  city: string;
  location: string;
  representative: string;
  phone: string;
  title: string;
  category: DonationCategory;
  urgency: 'Critical' | 'High' | 'Medium';
  quantityNeeded: string;
  reason: string;
  targetDate: string;
  status: 'Open' | 'Partially Met' | 'Fulfilled';
  fulfilledBy?: string;
}

export interface SyncConfig {
  webAppUrl: string;
  useLiveSheet: boolean;
  lastSynced?: string;
  googleFormSurveyUrl?: string;
}

export interface CepSurveyStats {
  totalNgoRespondents: number;
  totalDonorRespondents: number;
  ngoDifficulties: {
    difficulty: string;
    percentage: number;
    description: string;
  }[];
  pickupWillingness: {
    category: string;
    value: number;
    color: string;
  }[];
  mismatchMatrix: {
    category: string;
    ngoDemand: number;
    donorSupply: number;
  }[];
  pickupRadiusPreference: {
    distance: string;
    percentage: number;
  }[];
  keyFindings: string[];
}
