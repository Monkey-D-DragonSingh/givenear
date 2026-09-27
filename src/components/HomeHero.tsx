import React from 'react';
import { 
  ArrowRight, MapPin, CheckCircle2, 
  BarChart3, ShieldAlert, Sparkles, Layers 
} from 'lucide-react';

interface HomeHeroProps {
  onNavigate: (tab: 'browse' | 'donate' | 'needs' | 'survey' | 'setup') => void;
  availableCount: number;
  claimedCount: number;
  ngoCount: number;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ 
  onNavigate, 
  availableCount, 
  claimedCount, 
  ngoCount 
}) => {
  return (
    <div className="space-y-12 pb-8">
      
      {/* Hero Section */}
      <section className="bg-[#FFFFFF] border border-[#D9DCD2] rounded-3xl p-6 sm:p-12 shadow-xs relative overflow-hidden">
        {/* Subtle decorative background motif */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#EBF2EE] pointer-events-none -z-0 opacity-70 blur-2xl" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-[#FDF4E5] pointer-events-none -z-0 opacity-70 blur-2xl" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#EBF2EE] text-[#1F4D3D] border border-[#1F4D3D]/15">
            <Sparkles className="w-3.5 h-3.5 text-[#E8A33D]" />
            CEP Capstone Project • Direct Pickup Model
          </div>

          <h1 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-[#1A211E] tracking-tight leading-[1.15]">
            Bridging the NGO Resource Gap Through Direct Local Pickup.
          </h1>

          <p className="text-base sm:text-lg text-[#58655E] max-w-2xl mx-auto leading-relaxed">
            A digital matching mechanism connecting nearby donor surplus with verified grassroots NGO requirements. <span className="text-[#1F4D3D] font-semibold">Zero courier fees. Zero warehouse dumping. Doorstep volunteer pickup.</span>
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('donate')}
              className="w-full sm:w-auto bg-[#E8A33D] hover:bg-[#D6912A] text-[#1A211E] font-bold text-sm px-6 py-3.5 rounded-xl shadow-xs transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>List an Item to Donate</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('browse')}
              className="w-full sm:w-auto bg-[#1F4D3D] hover:bg-[#173B2E] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-xs transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Listings &amp; Map</span>
              <MapPin className="w-4 h-4 text-[#E8A33D]" />
            </button>

            <button
              onClick={() => onNavigate('survey')}
              className="w-full sm:w-auto bg-[#F3F4EE] hover:bg-[#EBF2EE] text-[#1A211E] font-semibold text-sm px-5 py-3.5 rounded-xl border border-[#D9DCD2] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-[#1F4D3D]" />
              <span>Survey Insights</span>
            </button>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-[#D9DCD2] relative z-10 text-center">
          <div>
            <div className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-[#1F4D3D]">
              {availableCount}
            </div>
            <div className="text-xs text-[#58655E] uppercase font-bold tracking-wider mt-0.5">
              Available Items
            </div>
          </div>
          <div>
            <div className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-[#E8A33D]">
              {claimedCount}
            </div>
            <div className="text-xs text-[#58655E] uppercase font-bold tracking-wider mt-0.5">
              Claimed for Pickup
            </div>
          </div>
          <div>
            <div className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-[#1F4D3D]">
              {ngoCount}+
            </div>
            <div className="text-xs text-[#58655E] uppercase font-bold tracking-wider mt-0.5">
              Verified NGOs
            </div>
          </div>
          <div>
            <div className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-[#C86446]">
              ₹0
            </div>
            <div className="text-xs text-[#58655E] uppercase font-bold tracking-wider mt-0.5">
              Logistics Cost for NGOs
            </div>
          </div>
        </div>
      </section>

      {/* CEP Problem, Gap & Solution Triad */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8A33D]">
            Academic Framework &amp; Problem Statement
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1A211E] mt-1">
            Why Traditional Donation Drives Fail
          </h2>
          <p className="text-xs sm:text-sm text-[#58655E] mt-1">
            Investigating the structural bottlenecks faced by non-profits when procuring non-monetary material resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Problem */}
          <div className="bg-[#FFFFFF] border border-[#D9DCD2] p-6 rounded-2xl space-y-3 relative shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-sm">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="font-serif-heading text-lg font-bold text-[#1A211E]">
              1. The Delivery Dilemma
            </h3>
            <p className="text-xs text-[#58655E] leading-relaxed">
              Donors expect NGOs to arrange and pay for couriers or tempos. Small grassroots organizations run on tight operating budgets and cannot afford ₹500–₹1,500 transport bills for routine used items.
            </p>
            <div className="text-[11px] font-semibold text-rose-700 pt-2 border-t border-zinc-100">
              Field Stat: 84.8% of donation drops cancel due to freight costs.
            </div>
          </div>

          {/* Card 2: Gap */}
          <div className="bg-[#FFFFFF] border border-[#D9DCD2] p-6 rounded-2xl space-y-3 relative shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
              <Layers className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-serif-heading text-lg font-bold text-[#1A211E]">
              2. The Mismatch Crisis
            </h3>
            <p className="text-xs text-[#58655E] leading-relaxed">
              Without an active requirement broadcast, donors dump old clothing (accounting for 96% of offers), while shelter homes and night schools desperately lack dry rations, notebooks, and crutches.
            </p>
            <div className="text-[11px] font-semibold text-amber-700 pt-2 border-t border-zinc-100">
              Field Stat: 78.3% of NGOs spend critical hours sorting unusable junk.
            </div>
          </div>

          {/* Card 3: Solution */}
          <div className="bg-[#FFFFFF] border border-[#D9DCD2] p-6 rounded-2xl space-y-3 relative shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#EBF2EE] text-[#1F4D3D] flex items-center justify-center font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-[#1F4D3D]" />
            </div>
            <h3 className="font-serif-heading text-lg font-bold text-[#1A211E]">
              3. The GiveNear Mechanism
            </h3>
            <p className="text-xs text-[#58655E] leading-relaxed">
              A dual-matching system: Donors post geo-located listings for direct doorstep collection; NGOs broadcast specific verified quotas so citizens donate exactly what is needed.
            </p>
            <div className="text-[11px] font-semibold text-[#1F4D3D] pt-2 border-t border-zinc-100">
              Field Stat: 81.5% of donors actively prefer doorstep volunteer pickup.
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Workflow */}
      <section className="bg-[#FFFFFF] border border-[#D9DCD2] rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
        <div className="text-center max-w-lg mx-auto">
          <span className="text-xs uppercase font-bold tracking-widest text-[#1F4D3D]">
            Operational Workflow
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1A211E] mt-1">
            How the Direct Pickup Model Operates
          </h2>
          <p className="text-xs text-[#58655E] mt-1">
            Zero shipping labels, zero third-party couriers, zero intermediary fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1: For Donors */}
          <div className="bg-[#F3F4EE] border border-[#D9DCD2] p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#E8A33D] text-[#1A211E] text-xs font-extrabold flex items-center justify-center">
                D
              </span>
              <h3 className="font-serif-heading text-lg font-bold text-[#1A211E]">
                For Prospective Donors
              </h3>
            </div>

            <ol className="space-y-3 text-xs text-[#58655E]">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#1F4D3D] bg-white px-2 py-0.5 rounded border border-[#D9DCD2]">1</span>
                <span><strong>Post Item Details:</strong> Enter item category, condition, quantity, and convenient pickup time windows.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#1F4D3D] bg-white px-2 py-0.5 rounded border border-[#D9DCD2]">2</span>
                <span><strong>Geocode Location:</strong> Pinpoint your locality or use GPS so nearby NGOs see the listing on their map.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#1F4D3D] bg-white px-2 py-0.5 rounded border border-[#D9DCD2]">3</span>
                <span><strong>Handover at Doorstep:</strong> The NGO volunteer calls or WhatsApps you to collect the items at your specified hour.</span>
              </li>
            </ol>

            <button
              onClick={() => onNavigate('donate')}
              className="w-full bg-white hover:bg-white/80 border border-[#D9DCD2] text-[#1F4D3D] text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Post a Donation Now
            </button>
          </div>

          {/* Column 2: For NGOs */}
          <div className="bg-[#EBF2EE] border border-[#1F4D3D]/20 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#1F4D3D] text-white text-xs font-extrabold flex items-center justify-center">
                NGO
              </span>
              <h3 className="font-serif-heading text-lg font-bold text-[#1F4D3D]">
                For Grassroots NGOs &amp; Volunteers
              </h3>
            </div>

            <ol className="space-y-3 text-xs text-[#58655E]">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#1F4D3D] bg-white px-2 py-0.5 rounded border border-[#D9DCD2]">1</span>
                <span><strong>Browse Hyperlocal Map:</strong> View available supplies in your city or within 5 km of your center.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#1F4D3D] bg-white px-2 py-0.5 rounded border border-[#D9DCD2]">2</span>
                <span><strong>1-Click Claim:</strong> Reserve the listing so other non-profits know your volunteer is dispatching.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-[#1F4D3D] bg-white px-2 py-0.5 rounded border border-[#D9DCD2]">3</span>
                <span><strong>Coordinate via WhatsApp:</strong> Auto-generate a WhatsApp handshake with the donor and complete pickup.</span>
              </li>
            </ol>

            <button
              onClick={() => onNavigate('browse')}
              className="w-full bg-[#1F4D3D] hover:bg-[#173B2E] text-white text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Explore Available Donations
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
