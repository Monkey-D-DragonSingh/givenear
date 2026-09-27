import React, { useState, useMemo } from 'react';
import type { DonationItem, DonationCategory } from '../types';
import { DonationMap } from './DonationMap';
import { 
  Search, MapPin, Clock, CheckCircle2, Navigation, Layers, 
  Map as MapIcon, Share2, Sparkles, Filter, Check
} from 'lucide-react';

interface DonationBoardProps {
  items: DonationItem[];
  onClaimClick: (item: DonationItem) => void;
  onPostNewClick: () => void;
}

const CATEGORIES: { label: string; value: DonationCategory | 'All'; emoji: string }[] = [
  { label: 'All Items', value: 'All', emoji: '🌟' },
  { label: 'Books & Stationery', value: 'Books & Stationery', emoji: '📚' },
  { label: 'Dry Rations & Food', value: 'Dry Rations & Food', emoji: '🍲' },
  { label: 'Clothes & Blankets', value: 'Clothes & Blankets', emoji: '👕' },
  { label: 'Medical & Hygiene', value: 'Medical & Hygiene', emoji: '💊' },
  { label: 'Furniture & Utensils', value: 'Furniture & Utensils', emoji: '🪑' },
  { label: 'Toys & Learning', value: 'Toys & Learning Kits', emoji: '🧸' },
  { label: 'Electronics', value: 'Electronics & Devices', emoji: '💻' },
  { label: 'Other Essentials', value: 'Other Essentials', emoji: '📦' },
];

export const DonationBoard: React.FC<DonationBoardProps> = ({ items, onClaimClick, onPostNewClick }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DonationCategory | 'All'>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'claimed'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract unique cities
  const uniqueCities = useMemo(() => {
    const set = new Set(items.map(i => i.city).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedCity !== 'All' && item.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          item.title.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q) ||
          item.notes.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [items, selectedCategory, selectedCity, statusFilter, searchQuery]);

  const availableCount = items.filter(i => i.status === 'available').length;
  const claimedCount = items.filter(i => i.status === 'claimed').length;

  const handleShare = (item: DonationItem) => {
    const text = `Check out this donation listing on GiveNear: "${item.title}" (${item.quantity}) at ${item.location}, ${item.city}. Pickup by nearby NGO!`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="bg-[#FFFFFF] border border-[#D9DCD2] p-5 sm:p-6 rounded-2xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EBF2EE] text-[#1F4D3D] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#E8A33D]" />
              Direct Pickup &amp; Resource Matching Bulletin
            </div>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1A211E]">
              Available Material Donations
            </h2>
            <p className="text-sm text-[#58655E] mt-1 max-w-xl">
              Nearby donors have listed these items for doorstep pickup. Verified NGOs and volunteers can claim listings directly without delivery or courier friction.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View switcher */}
            <div className="inline-flex rounded-xl bg-[#F3F4EE] p-1 border border-[#D9DCD2]">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#1F4D3D] text-white shadow-xs'
                    : 'text-[#58655E] hover:text-[#1A211E]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Cards ({filteredItems.length})
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-[#1F4D3D] text-white shadow-xs'
                    : 'text-[#58655E] hover:text-[#1A211E]'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                Live Map
              </button>
            </div>

            <button
              onClick={onPostNewClick}
              className="bg-[#E8A33D] hover:bg-[#D6912A] text-[#1A211E] font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              + Post a Donation
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-6 pt-5 border-t border-[#D9DCD2] space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#828F87]" />
              <input
                type="text"
                placeholder="Search items by name, category, or locality (e.g. books, blankets, Indiranagar)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F3F4EE] border border-[#D9DCD2] rounded-xl text-sm text-[#1A211E] placeholder:text-[#828F87] focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] focus:bg-white transition-all"
              />
            </div>

            {/* City Selector */}
            <div className="sm:w-48">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F3F4EE] border border-[#D9DCD2] rounded-xl text-sm font-medium text-[#1A211E] focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] focus:bg-white"
              >
                {uniqueCities.map(city => (
                  <option key={city} value={city}>
                    {city === 'All' ? '📍 All Locations' : `📍 ${city}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Selector */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-[#F3F4EE] border border-[#D9DCD2] rounded-xl text-sm font-medium text-[#1A211E] focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] focus:bg-white"
              >
                <option value="all">⚡ All Statuses</option>
                <option value="available">🟢 Available ({availableCount})</option>
                <option value="claimed">🟡 Claimed ({claimedCount})</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[#828F87] font-semibold text-[11px] uppercase tracking-wider pr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat.value;
              const count = cat.value === 'All' 
                ? items.length 
                : items.filter(i => i.category === cat.value).length;

              return (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer font-medium ${
                    isSelected
                      ? 'bg-[#1F4D3D] text-white shadow-xs'
                      : 'bg-[#F3F4EE] hover:bg-[#EBF2EE] text-[#58655E] border border-[#D9DCD2]'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-[#828F87]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area: Map or Grid */}
      {viewMode === 'map' ? (
        <div className="space-y-3">
          <div className="text-xs text-[#58655E] flex items-center justify-between px-1">
            <span>Showing <strong>{filteredItems.length}</strong> geocoded donation locations on OpenStreetMap</span>
            <span>Zero delivery charges • Direct volunteer pickup</span>
          </div>
          <DonationMap items={filteredItems} onClaimClick={onClaimClick} selectedCity={selectedCity} />
        </div>
      ) : (
        <div>
          {filteredItems.length === 0 ? (
            <div className="bg-[#FFFFFF] border border-dashed border-[#D9DCD2] rounded-2xl p-12 text-center space-y-3">
              <div className="text-4xl">📦</div>
              <h3 className="font-serif-heading text-xl font-bold text-[#1A211E]">
                No matching donations found
              </h3>
              <p className="text-sm text-[#58655E] max-w-md mx-auto">
                No active listings match your current filters. Try changing your search query, selecting "All Items", or be the first to list an item in this category.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedCity('All');
                    setStatusFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-[#F3F4EE] border border-[#D9DCD2] rounded-lg text-xs font-semibold text-[#1F4D3D] hover:bg-[#EBF2EE] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map(item => {
                const isClaimed = item.status === 'claimed';

                return (
                  <div
                    key={item.id}
                    className={`bg-[#FFFFFF] border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
                      isClaimed 
                        ? 'border-zinc-200 bg-zinc-50/50 opacity-90' 
                        : 'border-[#D9DCD2] hover:border-[#1F4D3D]/40'
                    }`}
                  >
                    <div>
                      {/* Top bar tags */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#EBF2EE] text-[#1F4D3D] border border-[#1F4D3D]/10">
                          {item.category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                            isClaimed 
                              ? 'bg-zinc-200 text-zinc-700' 
                              : 'bg-[#FDF4E5] text-[#D6912A] border border-[#E8A33D]/30'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isClaimed ? 'bg-zinc-500' : 'bg-[#E8A33D]'}`} />
                            {isClaimed ? 'Claimed' : 'Available for Pickup'}
                          </span>

                          <button
                            onClick={() => handleShare(item)}
                            title="Copy Listing Link"
                            className="p-1 rounded-lg text-[#828F87] hover:text-[#1A211E] hover:bg-[#F3F4EE] transition-colors"
                          >
                            {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif-heading text-lg font-bold text-[#1A211E] leading-snug line-clamp-2 mb-2">
                        {item.title}
                      </h3>

                      {/* Specs */}
                      <div className="text-xs text-[#58655E] flex flex-wrap gap-2 mb-3">
                        <span className="bg-[#F3F4EE] px-2 py-0.5 rounded font-medium text-[#1A211E]">
                          Qty: {item.quantity}
                        </span>
                        <span className="bg-[#F3F4EE] px-2 py-0.5 rounded text-[#58655E]">
                          {item.condition}
                        </span>
                      </div>

                      {/* Details & Notes */}
                      {item.notes && (
                        <p className="text-xs text-[#58655E] line-clamp-2 mb-4 italic">
                          "{item.notes}"
                        </p>
                      )}

                      {/* Location & Timings */}
                      <div className="space-y-1.5 text-xs text-[#58655E] border-t border-[#D9DCD2] pt-3 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#1F4D3D] shrink-0" />
                          <span className="font-medium text-[#1A211E] truncate">
                            {item.location}, {item.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#E8A33D] shrink-0" />
                          <span className="truncate">{item.pickupTimes}</span>
                        </div>
                        <div className="text-[11px] text-[#828F87]">
                          Listed by <strong>{item.donorName}</strong> on {item.timestamp}
                        </div>
                      </div>
                    </div>

                    {/* Action footer */}
                    <div className="pt-2 border-t border-[#D9DCD2]">
                      {isClaimed ? (
                        <div className="bg-[#EBF2EE] border border-[#1F4D3D]/15 rounded-xl p-3 text-xs text-[#1F4D3D] flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#1F4D3D] shrink-0" />
                          <div>
                            <div className="font-bold">Claimed for Pickup</div>
                            <div className="text-[11px] text-[#58655E]">
                              By: {item.claimedByNgo || 'Verified NGO'}
                              {item.pickupDate && ` • Scheduled: ${item.pickupDate}`}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => onClaimClick(item)}
                          className="w-full bg-[#1F4D3D] hover:bg-[#173B2E] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer group"
                        >
                          <Navigation className="w-4 h-4 text-[#E8A33D] group-hover:translate-x-0.5 transition-transform" />
                          <span>I'll Pick This Up (NGO Claim)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
