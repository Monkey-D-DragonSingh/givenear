import React, { useState } from 'react';
import type { DonationItem } from '../types';
import { X, CheckCircle, Calendar, Building2, User, Phone, MessageSquare, ExternalLink } from 'lucide-react';

interface ClaimModalProps {
  item: DonationItem | null;
  onClose: () => void;
  onConfirmClaim: (claimData: {
    id: string;
    ngoName: string;
    ngoRepresentative: string;
    ngoPhone: string;
    pickupDate: string;
  }) => Promise<void>;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ item, onClose, onConfirmClaim }) => {
  const [ngoName, setNgoName] = useState('');
  const [representative, setRepresentative] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ngoName.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      await onConfirmClaim({
        id: item.id,
        ngoName: ngoName.trim(),
        ngoRepresentative: representative.trim(),
        ngoPhone: phone.trim(),
        pickupDate: pickupDate || new Date().toISOString().substring(0, 10),
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanPhone = item.donorPhone.replace(/[^0-9]/g, '');
  const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const waText = encodeURIComponent(
    `Hello ${item.donorName}! This is ${representative || 'a coordinator'} from ${ngoName || 'an NGO'}. We noticed your listing for "${item.title}" on GiveNear and would like to confirm our volunteer pickup scheduled for ${pickupDate || 'this week'}. Thank you so much for supporting our cause!`
  );
  const waUrl = `https://wa.me/${waPhone}?text=${waText}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FFFFFF] border border-[#D9DCD2] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#1F4D3D] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#E8A33D]">
              Direct Pickup Coordination
            </div>
            <h3 className="font-serif-heading text-xl font-bold">
              {success ? 'Pickup Claim Confirmed!' : 'Claim Donation for Pickup'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="space-y-5 text-center py-2">
              <div className="w-14 h-14 bg-[#EBF2EE] text-[#1F4D3D] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-serif-heading text-lg font-bold text-[#1A211E]">
                  You have claimed "{item.title}"!
                </h4>
                <p className="text-sm text-[#58655E] mt-1 max-w-sm mx-auto">
                  The listing is now marked as <strong>Claimed</strong> in the database so other organizations know volunteer collection is in progress.
                </p>
              </div>

              {/* WhatsApp direct reach button */}
              <div className="bg-[#F3F4EE] border border-[#D9DCD2] p-4 rounded-xl text-left space-y-2">
                <div className="text-xs font-semibold text-[#1A211E] flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#1F4D3D]" />
                  Direct Donor Coordination
                </div>
                <p className="text-xs text-[#58655E]">
                  Donor Contact: <strong>{item.donorName}</strong> ({item.donorPhone})
                  <br />
                  Location: <strong>{item.location}, {item.city}</strong>
                </p>
                {cleanPhone && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full mt-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-sm transition-colors"
                  >
                    <span>Send Pre-filled WhatsApp to Donor</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-full bg-[#1F4D3D] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#173B2E] transition-colors"
              >
                Close &amp; Return to Listings
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Item summary banner */}
              <div className="bg-[#F3F4EE] border border-[#D9DCD2] p-3.5 rounded-xl text-xs space-y-1">
                <div className="font-semibold text-[#1A211E] text-sm">
                  {item.title}
                </div>
                <div className="text-[#58655E] flex flex-wrap gap-x-4 gap-y-1">
                  <span>Quantity: <strong>{item.quantity}</strong></span>
                  <span>Condition: <strong>{item.condition}</strong></span>
                  <span>Location: <strong>{item.location}, {item.city}</strong></span>
                </div>
                <div className="text-[#828F87] text-[11px] pt-1">
                  Donor's preferred timings: {item.pickupTimes}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1A211E] mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#1F4D3D]" />
                    NGO / Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Robin Hood Army / Asha Remedial Trust"
                    value={ngoName}
                    onChange={(e) => setNgoName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#D9DCD2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A211E] mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#1F4D3D]" />
                      Coordinator Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={representative}
                      onChange={(e) => setRepresentative(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-[#D9DCD2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A211E] mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#1F4D3D]" />
                      Volunteer Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-[#D9DCD2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A211E] mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#1F4D3D]" />
                    Planned Pickup Date &amp; Window
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2026-09-28 (Between 4 PM - 6 PM)"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#D9DCD2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A211E] mb-1">
                    Note for Donor (Vehicle / Logistics plan)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. We will send 2 volunteers on a two-wheeler to collect the textbooks."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#D9DCD2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] bg-white resize-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-[#58655E] hover:text-[#1A211E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#1F4D3D] hover:bg-[#173B2E] text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? 'Registering Claim...' : 'Confirm Claim & Get Donor Info'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
