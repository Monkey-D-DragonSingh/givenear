import React, { useState } from 'react';
import type { NgoNeed, DonationCategory } from '../types';
import { 
  Building2, AlertCircle, Phone, Calendar, 
  MapPin, PlusCircle, MessageSquare, ExternalLink, X, HeartHandshake 
} from 'lucide-react';

interface NgoNeedsBoardProps {
  needs: NgoNeed[];
  onPostNewNeed: (needData: Omit<NgoNeed, 'id' | 'status'>) => Promise<void>;
}

const CATEGORIES: DonationCategory[] = [
  'Books & Stationery',
  'Dry Rations & Food',
  'Clothes & Blankets',
  'Medical & Hygiene',
  'Furniture & Utensils',
  'Toys & Learning Kits',
  'Electronics & Devices',
  'Other Essentials'
];

export const NgoNeedsBoard: React.FC<NgoNeedsBoardProps> = ({ needs, onPostNewNeed }) => {
  const [showModal, setShowModal] = useState(false);
  const [fulfillModalNeed, setFulfillModalNeed] = useState<NgoNeed | null>(null);

  // Form states
  const [ngoName, setNgoName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [city, setCity] = useState('Delhi');
  const [location, setLocation] = useState('');
  const [representative, setRepresentative] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DonationCategory>('Books & Stationery');
  const [urgency, setUrgency] = useState<'Critical' | 'High' | 'Medium'>('High');
  const [quantityNeeded, setQuantityNeeded] = useState('');
  const [reason, setReason] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ngoName.trim() || !title.trim() || !quantityNeeded.trim() || !phone.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await onPostNewNeed({
        ngoName: ngoName.trim(),
        regNumber: regNumber.trim() || 'Verified-NGO-Pending',
        city: city.trim(),
        location: location.trim(),
        representative: representative.trim(),
        phone: phone.trim(),
        title: title.trim(),
        category,
        urgency,
        quantityNeeded: quantityNeeded.trim(),
        reason: reason.trim(),
        targetDate: targetDate || 'Within 2 weeks'
      });
      setShowModal(false);
      // Reset form
      setTitle('');
      setQuantityNeeded('');
      setReason('');
      setLocation('');
      setTargetDate('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#FFFFFF] border border-[#D9DCD2] p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FDF4E5] text-[#D6912A] border border-[#E8A33D]/30 mb-2">
            <AlertCircle className="w-3.5 h-3.5" />
            Empirical Need Matching • Pull Model
          </div>
          <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1A211E]">
            Verified NGO Requirements Board
          </h2>
          <p className="text-sm text-[#58655E] mt-1 max-w-2xl">
            Instead of donors guessing what NGOs need (and unintentionally sending mismatched items), registered NGOs publish their exact, verified material requirements here.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#1F4D3D] hover:bg-[#173B2E] text-white text-xs font-bold px-5 py-3 rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#E8A33D]" />
          Post NGO Requirement
        </button>
      </div>

      {/* Needs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {needs.map((need) => {
          const isCritical = need.urgency === 'Critical';
          const isHigh = need.urgency === 'High';

          return (
            <div
              key={need.id}
              className="bg-[#FFFFFF] border border-[#D9DCD2] hover:border-[#1F4D3D]/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 shadow-2xs hover:shadow-md"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#EBF2EE] text-[#1F4D3D]">
                      {need.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isCritical
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : isHigh
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {need.urgency} Urgency
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-[#828F87]">
                    {need.id}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif-heading text-xl font-bold text-[#1A211E] mb-2 leading-snug">
                  {need.title}
                </h3>

                {/* Quantity needed badge */}
                <div className="inline-block bg-[#FDF4E5] border border-[#E8A33D]/30 text-[#1A211E] font-bold text-xs px-3 py-1.5 rounded-lg mb-3">
                  Quantity Required: <span className="text-[#D6912A] font-extrabold">{need.quantityNeeded}</span>
                </div>

                {/* Context / Reason */}
                <p className="text-xs text-[#58655E] leading-relaxed mb-4">
                  {need.reason}
                </p>

                {/* Organization Details */}
                <div className="space-y-1.5 text-xs text-[#58655E] bg-[#F3F4EE] border border-[#D9DCD2] p-3.5 rounded-xl mb-4">
                  <div className="font-semibold text-[#1A211E] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#1F4D3D]" />
                    {need.ngoName}
                    {need.regNumber && (
                      <span className="text-[10px] text-[#828F87] font-normal">
                        ({need.regNumber})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#1F4D3D]" />
                    <span>{need.location}, {need.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#E8A33D]" />
                    <span>Needed by: <strong>{need.targetDate}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-[#D9DCD2] flex items-center justify-between gap-3">
                <div className="text-[11px] text-[#828F87]">
                  Contact: <strong>{need.representative}</strong>
                </div>

                <button
                  onClick={() => setFulfillModalNeed(need)}
                  className="bg-[#1F4D3D] hover:bg-[#173B2E] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <HeartHandshake className="w-4 h-4 text-[#E8A33D]" />
                  I Can Provide This
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fulfill Modal (Prospective Donor response) */}
      {fulfillModalNeed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] border border-[#D9DCD2] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#1F4D3D] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#E8A33D]">Direct Donor Match</span>
                <h3 className="font-serif-heading text-lg font-bold">Connect with {fulfillModalNeed.ngoName}</h3>
              </div>
              <button
                onClick={() => setFulfillModalNeed(null)}
                className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-[#F3F4EE] border border-[#D9DCD2] p-4 rounded-xl text-xs space-y-2">
                <div className="font-bold text-[#1A211E] text-sm">{fulfillModalNeed.title}</div>
                <div className="text-[#58655E]">Required: <strong>{fulfillModalNeed.quantityNeeded}</strong></div>
                <div className="text-[#58655E]">Locality: {fulfillModalNeed.location}, {fulfillModalNeed.city}</div>
              </div>

              <div className="space-y-2 text-xs text-[#58655E]">
                <p>
                  You can connect directly with the field coordinator to confirm if your items match their specifications:
                </p>
                <div className="bg-white border border-[#D9DCD2] p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#1F4D3D]" />
                    <span className="font-semibold text-sm text-[#1A211E]">{fulfillModalNeed.phone}</span>
                  </div>
                  <span className="text-[11px] text-[#828F87]">{fulfillModalNeed.representative}</span>
                </div>
              </div>

              <a
                href={`https://wa.me/${fulfillModalNeed.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${fulfillModalNeed.representative}! I saw your requirement for "${fulfillModalNeed.title}" on GiveNear. I would like to donate/provide these items. Can you please confirm the pickup details?`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold py-3 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message NGO Coordinator on WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setFulfillModalNeed(null)}
                className="w-full bg-[#F3F4EE] text-[#58655E] hover:text-[#1A211E] text-xs font-semibold py-2.5 rounded-xl border border-[#D9DCD2]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Need Modal for NGOs */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] border border-[#D9DCD2] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#1F4D3D] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#E8A33D]">Verified Resource Request</span>
                <h3 className="font-serif-heading text-xl font-bold">Post an Urgent NGO Requirement</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider mb-1">
                  NGO / Trust Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vidya Jyoti Remedial Centers"
                  value={ngoName}
                  onChange={(e) => setNgoName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D9DCD2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider mb-1">
                    Registration / Darpan ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. REG-DEL-2019-8812"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#D9DCD2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Delhi NCR, Lucknow"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#D9DCD2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider mb-1">
                  Area / Locality *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Seelampur &amp; Yamuna Khadar"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D9DCD2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider mb-1">
                  Requirement Headline (What specifically do you need?) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50 School Backpacks for Slum Remedial Batch"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D9DCD2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as DonationCategory)}
                    className="w-full px-3 py-2 text-sm border border-[#D9DCD2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider mb-1">
                    Urgency Level *
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-[#D9DCD2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]"
                  >
                    <option value="Critical">🚨 Critical (1-3 days)</option>
                    <option value="High">⚠️ High (Within 1-2 weeks)</option>
                    <option value="Medium">📅 Medium (This month)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider mb-1">
                    Exact Quantity *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50 Bags, 100 kg"
                    value={quantityNeeded}
                    onChange={(e) => setQuantityNeeded(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#D9DCD2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider mb-1">
                  Reason &amp; Impact (Why is this needed?) *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Explain who will benefit and how volunteers will utilize this..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D9DCD2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider mb-1">
                  Target Deadline Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2026-10-15 or Within 10 days"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D9DCD2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider mb-1">
                    Field Coordinator Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunita Sharma"
                    value={representative}
                    onChange={(e) => setRepresentative(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#D9DCD2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider mb-1">
                    Direct Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98712 34567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#D9DCD2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#58655E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#1F4D3D] hover:bg-[#173B2E] text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Publishing...' : 'Publish Verified Requirement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
