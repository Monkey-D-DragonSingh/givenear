import { useState, useEffect, useCallback } from 'react';
import type { DonationItem, NgoNeed, SyncConfig, DonationCategory, ItemCondition } from './types';
import { 
  getSavedConfig, saveConfig, fetchDonationsApi, 
  postDonationApi, claimDonationApi, getLocalNeeds, saveLocalNeeds 
} from './services/api';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { DonationBoard } from './components/DonationBoard';
import { DonateForm } from './components/DonateForm';
import { NgoNeedsBoard } from './components/NgoNeedsBoard';
import { SurveyInsights } from './components/SurveyInsights';
import { GoogleSheetSetup } from './components/GoogleSheetSetup';
import { ClaimModal } from './components/ClaimModal';
import { CheckCircle2 } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'browse' | 'donate' | 'needs' | 'survey' | 'setup'>('home');
  const [config, setConfig] = useState<SyncConfig>(getSavedConfig());
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [needs, setNeeds] = useState<NgoNeed[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [claimModalItem, setClaimModalItem] = useState<DonationItem | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Initial load
  const loadData = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await fetchDonationsApi(config);
      setDonations(res.data);
      const localNeeds = getLocalNeeds();
      setNeeds(localNeeds);
      if (res.message) {
        console.info(res.message);
      }
    } catch (err) {
      console.error('Failed to load donations', err);
    } finally {
      setIsSyncing(false);
    }
  }, [config]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle donation submission
  const handlePostDonation = async (itemData: {
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
  }) => {
    const res = await postDonationApi(config, itemData);
    setDonations(prev => [res.item, ...prev]);
    showNotification(`Listing "${res.item.title}" successfully published for pickup!`);
  };

  // Handle claiming
  const handleConfirmClaim = async (claimData: {
    id: string;
    ngoName: string;
    ngoRepresentative: string;
    ngoPhone: string;
    pickupDate: string;
  }) => {
    await claimDonationApi(config, claimData);
    setDonations(prev => prev.map(item => {
      if (item.id === claimData.id) {
        return {
          ...item,
          status: 'claimed',
          claimedByNgo: claimData.ngoName,
          ngoRepresentative: claimData.ngoRepresentative,
          ngoPhone: claimData.ngoPhone,
          pickupDate: claimData.pickupDate,
          claimedAt: new Date().toISOString()
        };
      }
      return item;
    }));
    showNotification(`Item successfully claimed by ${claimData.ngoName}!`);
  };

  // Handle new NGO need
  const handlePostNeed = async (needData: Omit<NgoNeed, 'id' | 'status'>) => {
    const newNeed: NgoNeed = {
      ...needData,
      id: `NEED-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Open'
    };
    const updated = [newNeed, ...needs];
    setNeeds(updated);
    saveLocalNeeds(updated);
    showNotification(`NGO requirement "${newNeed.title}" published!`);
  };

  // Handle config save
  const handleSaveConfig = (newConfig: SyncConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
    showNotification(newConfig.useLiveSheet ? 'Connected to Live Google Sheet API!' : 'Switched to Local Database.');
  };

  const availableCount = donations.filter(d => d.status === 'available').length;
  const claimedCount = donations.filter(d => d.status === 'claimed').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4EE] text-[#1A211E]">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-[#1F4D3D] text-white px-4 py-3 rounded-xl shadow-lg border border-[#E8A33D]/40 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-4 fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#E8A33D]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        availableCount={availableCount}
        config={config}
        onRefreshData={loadData}
        isSyncing={isSyncing}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'home' && (
          <HomeHero
            onNavigate={setActiveTab}
            availableCount={availableCount}
            claimedCount={claimedCount}
            ngoCount={needs.length + 6}
          />
        )}

        {activeTab === 'browse' && (
          <DonationBoard
            items={donations}
            onClaimClick={(item) => setClaimModalItem(item)}
            onPostNewClick={() => setActiveTab('donate')}
          />
        )}

        {activeTab === 'donate' && (
          <DonateForm
            onSubmit={handlePostDonation}
            onCancel={() => setActiveTab('browse')}
          />
        )}

        {activeTab === 'needs' && (
          <NgoNeedsBoard
            needs={needs}
            onPostNewNeed={handlePostNeed}
          />
        )}

        {activeTab === 'survey' && (
          <SurveyInsights
            googleFormUrl={config.googleFormSurveyUrl}
            onUpdateFormUrl={(url) => {
              const updated = { ...config, googleFormSurveyUrl: url };
              setConfig(updated);
              saveConfig(updated);
              showNotification('Google Form survey link updated!');
            }}
          />
        )}

        {activeTab === 'setup' && (
          <GoogleSheetSetup
            config={config}
            onSaveConfig={handleSaveConfig}
            onRefreshData={loadData}
          />
        )}
      </main>

      {/* Claim Pickup Modal */}
      {claimModalItem && (
        <ClaimModal
          item={claimModalItem}
          onClose={() => setClaimModalItem(null)}
          onConfirmClaim={handleConfirmClaim}
        />
      )}

      {/* Footer */}
      <footer className="bg-[#FFFFFF] border-t border-[#D9DCD2] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="font-serif-heading font-bold text-xl text-[#1A211E]">GiveNear</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EBF2EE] text-[#1F4D3D]">
                  CEP Capstone Platform
                </span>
              </div>
              <p className="text-xs text-[#58655E] max-w-md">
                Donation and Resource Matching for NGOs: Identifying communication bottlenecks and developing a verified direct pickup mechanism.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#58655E]">
              <button 
                onClick={() => setActiveTab('home')} 
                className="hover:text-[#1F4D3D] transition-colors cursor-pointer"
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('browse')} 
                className="hover:text-[#1F4D3D] transition-colors cursor-pointer"
              >
                Available Listings
              </button>
              <button 
                onClick={() => setActiveTab('needs')} 
                className="hover:text-[#1F4D3D] transition-colors cursor-pointer"
              >
                NGO Verified Needs
              </button>
              <button 
                onClick={() => setActiveTab('survey')} 
                className="hover:text-[#1F4D3D] transition-colors cursor-pointer"
              >
                Survey Charts
              </button>
              <button 
                onClick={() => setActiveTab('setup')} 
                className="hover:text-[#1F4D3D] transition-colors cursor-pointer"
              >
                Google Sheets Setup
              </button>
            </div>

            <div className="text-xs text-[#828F87] text-center md:text-right">
              <div>Designed with Community Pickup Architecture</div>
              <div className="text-[11px] mt-0.5">Zero-fee • Open Source Leaflet • Google Apps Script API</div>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
