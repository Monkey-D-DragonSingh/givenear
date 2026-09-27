import React, { useState } from 'react';
import type { DonationCategory, ItemCondition } from '../types';
import { POPULAR_INDIAN_CITIES } from '../data/mockData';
import { 
  HeartHandshake, MapPin, Phone, User, Clock, 
  Tag, Info, CheckCircle2, Navigation, Eye, Sparkles 
} from 'lucide-react';

interface DonateFormProps {
  onSubmit: (itemData: {
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
  }) => Promise<void>;
  onCancel: () => void;
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

const CONDITIONS: ItemCondition[] = [
  'Brand New / Sealed',
  'Gently Used / Like New',
  'Good Working Condition'
];

export const DonateForm: React.FC<DonateFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DonationCategory>('Books & Stationery');
  const [quantity, setQuantity] = useState('');
  const [condition, setCondition] = useState<ItemCondition>('Gently Used / Like New');
  const [city, setCity] = useState('Delhi NCR');
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState(28.6139);
  const [lng, setLng] = useState(77.2090);
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [pickupTimes, setPickupTimes] = useState('Weekdays after 6:00 PM or weekends anytime');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [geoLocating, setGeoLocating] = useState(false);

  // Update coords when city changes
  const handleCityChange = (cityName: string) => {
    setCity(cityName);
    const found = POPULAR_INDIAN_CITIES.find(c => c.name === cityName);
    if (found) {
      const jitterLat = found.lat + (Math.random() - 0.5) * 0.04;
      const jitterLng = found.lng + (Math.random() - 0.5) * 0.04;
      setLat(Number(jitterLat.toFixed(4)));
      setLng(Number(jitterLng.toFixed(4)));
    }
  };

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(Number(pos.coords.latitude.toFixed(4)));
        setLng(Number(pos.coords.longitude.toFixed(4)));
        setGeoLocating(false);
      },
      (err) => {
        console.warn(err);
        alert('Could not determine GPS coordinates. Default city coordinates will be used.');
        setGeoLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !quantity.trim() || !location.trim() || !donorPhone.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        category,
        quantity: quantity.trim(),
        condition,
        location: location.trim(),
        city,
        lat,
        lng,
        donorName: donorName.trim() || 'Anonymous Donor',
        donorPhone: donorPhone.trim(),
        pickupTimes: pickupTimes.trim() || 'Contact donor directly',
        notes: notes.trim()
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-[#FFFFFF] border border-[#D9DCD2] rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 bg-[#EBF2EE] text-[#1F4D3D] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8A33D]">Direct Listing Published</span>
          <h2 className="font-serif-heading text-3xl font-bold text-[#1A211E] mt-1">
            Thank you for donating, {donorName || 'fellow citizen'}!
          </h2>
          <p className="text-sm text-[#58655E] mt-2 max-w-lg mx-auto">
            Your item "<strong>{title}</strong>" is now live on the GiveNear bulletin board and map. Nearby verified NGOs can view the listing and reach out to schedule volunteer doorstep pickup.
          </p>
        </div>

        <div className="bg-[#F3F4EE] border border-[#D9DCD2] p-4 rounded-2xl text-left text-xs text-[#58655E] space-y-1.5">
          <div className="font-semibold text-[#1A211E] flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#1F4D3D]" /> What happens next?
          </div>
          <p>1. An NGO volunteer in {city} will see your listing on the map.</p>
          <p>2. They will claim the item and contact you via phone/WhatsApp ({donorPhone}) to confirm pickup time.</p>
          <p>3. Zero packaging or courier costs for you — pickup is handled directly by them!</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto bg-[#1F4D3D] hover:bg-[#173B2E] text-white font-semibold text-xs py-3 px-6 rounded-xl transition-colors cursor-pointer"
          >
            View Available Listings
          </button>
          <button
            onClick={() => {
              setTitle('');
              setQuantity('');
              setLocation('');
              setNotes('');
              setSubmitted(false);
            }}
            className="w-full sm:w-auto bg-[#F3F4EE] hover:bg-[#EBF2EE] text-[#1A211E] font-semibold text-xs py-3 px-6 rounded-xl border border-[#D9DCD2] transition-colors cursor-pointer"
          >
            Post Another Item
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#FFFFFF] border border-[#D9DCD2] p-6 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#1F4D3D] uppercase tracking-wider mb-1">
          <HeartHandshake className="w-4 h-4 text-[#E8A33D]" />
          Doorstep Pickup • Zero Delivery Fees
        </div>
        <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1A211E]">
          List an Item for Nearby NGO Pickup
        </h2>
        <p className="text-sm text-[#58655E] mt-1 max-w-2xl">
          Have usable books, clothes, food, or electronics? Post your listing here. Nearby verified NGOs will view your location and coordinate volunteer pickup directly from your doorstep.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#D9DCD2] p-6 sm:p-8 rounded-2xl shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider mb-1.5">
                Item Title &amp; Headline *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 25 Sets of Class 9-10 NCERT Books, or 40 kg Packaged Rice"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F3F4EE] border border-[#D9DCD2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] focus:bg-white transition-all"
              />
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#1F4D3D]" /> Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DonationCategory)}
                  className="w-full px-3 py-2.5 bg-[#F3F4EE] border border-[#D9DCD2] rounded-xl text-sm font-medium text-[#1A211E] focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] focus:bg-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider mb-1.5">
                  Quantity / Units *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20 books / 5 kg / 2 cartons"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F3F4EE] border border-[#D9DCD2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] focus:bg-white"
                />
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider mb-1.5">
                Item Condition *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {CONDITIONS.map(cond => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setCondition(cond)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                      condition === cond
                        ? 'bg-[#1F4D3D] text-white border-[#1F4D3D] shadow-xs'
                        : 'bg-[#F3F4EE] text-[#58655E] border-[#D9DCD2] hover:bg-[#EBF2EE]'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {/* City & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#1F4D3D]" /> City *
                </label>
                <select
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#F3F4EE] border border-[#D9DCD2] rounded-xl text-sm font-medium text-[#1A211E] focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] focus:bg-white"
                >
                  {POPULAR_INDIAN_CITIES.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider mb-1.5">
                  Locality / Landmark *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indiranagar 12th Main, or South Ext II"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F3F4EE] border border-[#D9DCD2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] focus:bg-white"
                />
              </div>
            </div>

            {/* Geolocation Pin helper */}
            <div className="bg-[#F3F4EE] p-3 rounded-xl border border-[#D9DCD2] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-[#58655E]">
                Map Coordinates: <strong>{lat}, {lng}</strong>
              </div>
              <button
                type="button"
                onClick={handleUseGps}
                disabled={geoLocating}
                className="bg-white hover:bg-white/80 border border-[#D9DCD2] text-[#1F4D3D] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-[#E8A33D]" />
                {geoLocating ? 'Detecting GPS...' : 'Use My Current GPS Pin'}
              </button>
            </div>

            {/* Donor info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#1F4D3D]" /> Donor Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh K. (Optional)"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F3F4EE] border border-[#D9DCD2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#1F4D3D]" /> Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F3F4EE] border border-[#D9DCD2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] focus:bg-white"
                />
              </div>
            </div>

            {/* Pickup Timings */}
            <div>
              <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#E8A33D]" /> Preferred Pickup Windows
              </label>
              <input
                type="text"
                placeholder="e.g. Weekdays after 6:00 PM or Saturday 10 AM - 4 PM"
                value={pickupTimes}
                onChange={(e) => setPickupTimes(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F3F4EE] border border-[#D9DCD2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] focus:bg-white"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-[#1A211E] uppercase tracking-wider mb-1.5">
                Special Notes / Vehicle Requirement
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Lift is available; can easily fit in a two-wheeler, or needs a small loading tempo."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F3F4EE] border border-[#D9DCD2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3D] focus:bg-white resize-none"
              />
            </div>

            {/* Submit Bar */}
            <div className="pt-3 border-t border-[#D9DCD2] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 text-xs font-semibold text-[#58655E] hover:text-[#1A211E] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1F4D3D] hover:bg-[#173B2E] text-white text-xs font-bold py-3 px-6 rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#E8A33D]" />
                {isSubmitting ? 'Publishing to Database...' : 'Publish Listing for NGO Pickup'}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#58655E] uppercase tracking-wider">
            <Eye className="w-4 h-4 text-[#1F4D3D]" /> Live Card Preview (What NGOs will see)
          </div>

          <div className="bg-[#FFFFFF] border-2 border-dashed border-[#1F4D3D]/30 rounded-2xl p-6 shadow-sm space-y-4">
            {/* Top tags */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#EBF2EE] text-[#1F4D3D]">
                {category}
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#FDF4E5] text-[#D6912A] border border-[#E8A33D]/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8A33D]" />
                Available for Pickup
              </span>
            </div>

            {/* Title */}
            <div>
              <h3 className="font-serif-heading text-lg font-bold text-[#1A211E] leading-snug">
                {title || 'Your item headline will appear here...'}
              </h3>
              <div className="text-xs text-[#58655E] flex flex-wrap gap-2 mt-2">
                <span className="bg-[#F3F4EE] px-2 py-0.5 rounded font-medium text-[#1A211E]">
                  Qty: {quantity || 'Specified quantity'}
                </span>
                <span className="bg-[#F3F4EE] px-2 py-0.5 rounded">
                  {condition}
                </span>
              </div>
            </div>

            {/* Notes */}
            <p className="text-xs text-[#58655E] italic">
              "{notes || 'Any special instructions or vehicle notes will be shown here.'}"
            </p>

            {/* Location & Timings */}
            <div className="space-y-1.5 text-xs text-[#58655E] border-t border-[#D9DCD2] pt-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1F4D3D] shrink-0" />
                <span className="font-medium text-[#1A211E]">
                  {location || 'Locality'}, {city}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E8A33D] shrink-0" />
                <span>{pickupTimes}</span>
              </div>
              <div className="text-[11px] text-[#828F87]">
                Donor: <strong>{donorName || 'Anonymous Donor'}</strong> ({donorPhone || '+91 XXXXX XXXXX'})
              </div>
            </div>

            {/* Preview Button */}
            <div className="pt-2 border-t border-[#D9DCD2]">
              <div className="w-full bg-[#1F4D3D]/20 text-[#1F4D3D] text-xs font-bold py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 cursor-not-allowed">
                <Navigation className="w-3.5 h-3.5" />
                I'll Pick This Up (NGO Claim Button)
              </div>
            </div>
          </div>

          <div className="bg-[#EBF2EE] border border-[#1F4D3D]/15 p-4 rounded-xl text-xs text-[#1F4D3D] space-y-1">
            <div className="font-bold">🔐 Privacy &amp; Verified Contact Policy</div>
            <p className="text-[11px] text-[#58655E] leading-relaxed">
              Your phone number is never sold or used for marketing. It is strictly used by visiting NGO coordinators to schedule and confirm doorstep pickup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
