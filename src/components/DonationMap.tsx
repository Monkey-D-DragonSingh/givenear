import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { DonationItem } from '../types';
import { MapPin, Phone, Clock, CheckCircle2, Navigation } from 'lucide-react';

interface DonationMapProps {
  items: DonationItem[];
  onClaimClick: (item: DonationItem) => void;
  selectedCity?: string;
}

// Custom SVG-based Leaflet pin with custom colors
function createCustomPin(category: string, isClaimed: boolean) {
  const bg = isClaimed ? '#71717A' : '#1F4D3D';
  const border = isClaimed ? '#A1A1AA' : '#E8A33D';
  const iconText = category.includes('Book') ? '📚' :
                   category.includes('Food') ? '🍲' :
                   category.includes('Cloth') ? '👕' :
                   category.includes('Medical') ? '💊' :
                   category.includes('Furniture') ? '🪑' :
                   category.includes('Toy') ? '🧸' :
                   category.includes('Electronic') ? '💻' : '📦';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${bg};
        border: 2px solid ${border};
        color: white;
        width: 38px;
        height: 38px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
        cursor: pointer;
      ">
        <span style="transform: rotate(45deg); font-size: 16px;">${iconText}</span>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export const DonationMap: React.FC<DonationMapProps> = ({ items, onClaimClick }) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([22.5, 78.9]);
  const [mapZoom, setMapZoom] = useState<number>(5);

  useEffect(() => {
    const validItems = items.filter(i => i.lat && i.lng && i.lat !== 0);
    if (validItems.length > 0) {
      const avgLat = validItems.reduce((acc, curr) => acc + curr.lat, 0) / validItems.length;
      const avgLng = validItems.reduce((acc, curr) => acc + curr.lng, 0) / validItems.length;
      setMapCenter([avgLat, avgLng]);
      setMapZoom(validItems.length === 1 ? 13 : 11);
    }
  }, [items]);

  return (
    <div className="w-full h-[540px] rounded-xl overflow-hidden border border-[#D9DCD2] bg-[#FFFFFF] shadow-sm relative">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={mapCenter} zoom={mapZoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {items.map((item) => {
          if (!item.lat || !item.lng) return null;
          const isClaimed = item.status === 'claimed';

          return (
            <Marker
              key={item.id}
              position={[item.lat, item.lng]}
              icon={createCustomPin(item.category, isClaimed)}
            >
              <Popup>
                <div className="p-1 min-w-[220px] max-w-[280px]">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#1F4D3D]/10 text-[#1F4D3D]">
                      {item.category}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      isClaimed ? 'bg-zinc-100 text-zinc-600' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isClaimed ? 'Claimed' : 'Available for Pickup'}
                    </span>
                  </div>

                  <h4 className="font-semibold text-sm text-[#1A211E] mb-1 leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs text-[#58655E] mb-2 line-clamp-2">
                    {item.quantity} • {item.condition}
                  </p>

                  <div className="space-y-1 text-xs text-[#58655E] border-t border-[#D9DCD2] pt-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#1F4D3D] shrink-0" />
                      <span className="truncate">{item.location}, {item.city}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#E8A33D] shrink-0" />
                      <span className="truncate">{item.pickupTimes}</span>
                    </div>
                    {item.donorPhone && (
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span>Donor: {item.donorName}</span>
                      </div>
                    )}
                  </div>

                  {isClaimed ? (
                    <div className="bg-[#EBF2EE] text-[#1F4D3D] text-xs p-2 rounded flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#1F4D3D]" />
                      <span>Claimed by {item.claimedByNgo || 'NGO Volunteer'}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onClaimClick(item)}
                      className="w-full bg-[#1F4D3D] hover:bg-[#173B2E] text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      I'll Pick This Up (NGO Claim)
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-sm border border-[#D9DCD2] p-2.5 rounded-lg shadow-sm text-xs space-y-1.5 max-w-[200px]">
        <div className="font-semibold text-[#1A211E] text-[11px] uppercase tracking-wider">Map Legend</div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#1F4D3D] inline-block border border-[#E8A33D]" />
          <span className="text-[#58655E]">Available for Pickup</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-zinc-500 inline-block border border-zinc-400" />
          <span className="text-[#58655E]">Claimed by NGO</span>
        </div>
        <div className="text-[10px] text-zinc-400 pt-1 border-t border-zinc-200">
          Click any pin to inspect &amp; claim
        </div>
      </div>
    </div>
  );
};
