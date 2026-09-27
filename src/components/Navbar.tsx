import React, { useState } from 'react';
import type { SyncConfig } from '../types';
import { 
  HeartHandshake, Layers, PlusCircle, Building2, 
  BarChart3, FileSpreadsheet, Menu, X, Database, RefreshCw
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'browse' | 'donate' | 'needs' | 'survey' | 'setup';
  onSelectTab: (tab: 'home' | 'browse' | 'donate' | 'needs' | 'survey' | 'setup') => void;
  availableCount: number;
  config: SyncConfig;
  onRefreshData: () => Promise<void>;
  isSyncing: boolean;
}

interface NavItemDef {
  id: 'home' | 'browse' | 'donate' | 'needs' | 'survey' | 'setup';
  label: string;
  icon: LucideIcon;
  badge?: number;
  isHighlight?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  availableCount,
  config,
  onRefreshData,
  isSyncing
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItemDef[] = [
    { id: 'home', label: 'Overview', icon: HeartHandshake },
    { id: 'browse', label: 'Browse Donations', icon: Layers, badge: availableCount },
    { id: 'donate', label: 'Post Item', icon: PlusCircle, isHighlight: true },
    { id: 'needs', label: 'NGO Needs', icon: Building2 },
    { id: 'survey', label: 'Survey Insights', icon: BarChart3 },
    { id: 'setup', label: 'Sheet Sync', icon: FileSpreadsheet },
  ];

  const handleNavClick = (id: typeof activeTab) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#D9DCD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Tagline */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1F4D3D] flex items-center justify-center text-white shadow-xs group-hover:bg-[#173B2E] transition-colors">
              <span className="font-serif-heading font-black text-xl text-[#E8A33D]">G</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif-heading font-bold text-xl sm:text-2xl text-[#1A211E] tracking-tight">
                  GiveNear
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#EBF2EE] text-[#1F4D3D] border border-[#1F4D3D]/10">
                  CEP 2026
                </span>
              </div>
              <p className="text-[11px] text-[#58655E] hidden sm:block -mt-0.5">
                Direct Donation &amp; Resource Matching for NGOs
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              if (item.isHighlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="ml-2 bg-[#E8A33D] hover:bg-[#D6912A] text-[#1A211E] text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#1F4D3D] text-white shadow-2xs'
                      : 'text-[#58655E] hover:text-[#1A211E] hover:bg-[#F3F4EE]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#EBF2EE] text-[#1F4D3D]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Backend Status Badge & Refresh */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => onSelectTab('setup')}
              className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer transition-colors ${
                config.useLiveSheet && config.webAppUrl
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-[#F3F4EE] border-[#D9DCD2] text-[#58655E]'
              }`}
              title="Click to view database settings"
            >
              <Database className="w-3 h-3" />
              <span className="font-semibold text-[11px]">
                {config.useLiveSheet && config.webAppUrl ? 'Live Sheet' : 'Local DB'}
              </span>
            </button>

            <button
              onClick={onRefreshData}
              disabled={isSyncing}
              title="Refresh / Sync Data"
              className="p-1.5 text-[#58655E] hover:text-[#1A211E] hover:bg-[#F3F4EE] rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onRefreshData}
              disabled={isSyncing}
              className="p-2 text-[#58655E] hover:text-[#1A211E] rounded-lg"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1A211E] rounded-lg hover:bg-[#F3F4EE]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFFFF] border-b border-[#D9DCD2] px-4 pt-2 pb-4 space-y-1 animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-[#1F4D3D] text-white'
                    : item.isHighlight
                    ? 'bg-[#E8A33D] text-[#1A211E]'
                    : 'text-[#58655E] hover:bg-[#F3F4EE]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
