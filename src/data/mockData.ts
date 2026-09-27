import type { DonationItem, NgoNeed, CepSurveyStats } from '../types';

export const INITIAL_DONATIONS: DonationItem[] = [
  {
    id: 'DON-101',
    timestamp: '2026-09-26 14:30',
    title: '35 Sets of NCERT & State Board Books (Class 8-10)',
    category: 'Books & Stationery',
    quantity: '35 Complete Sets',
    condition: 'Gently Used / Like New',
    location: '12th Main, Indiranagar',
    city: 'Bengaluru',
    lat: 12.9784,
    lng: 77.6408,
    donorName: 'Ananya Sharma',
    donorPhone: '+91 98450 12345',
    pickupTimes: 'Weekdays after 6:00 PM or Saturday 10 AM - 4 PM',
    notes: 'Covered and well-kept. Includes Science, Mathematics and Social Science textbooks.',
    status: 'available',
  },
  {
    id: 'DON-102',
    timestamp: '2026-09-26 16:15',
    title: '60 kg Packaged Rice & Toor Dal (Unopened 10kg bags)',
    category: 'Dry Rations & Food',
    quantity: '6 Bags (60 kg total)',
    condition: 'Brand New / Sealed',
    location: 'Lokhandwala Complex, Andheri West',
    city: 'Mumbai',
    lat: 19.1415,
    lng: 72.8258,
    donorName: 'Rajesh Mehta',
    donorPhone: '+91 98200 98765',
    pickupTimes: 'Anytime between 9:00 AM and 8:00 PM with 1 hour prior notice',
    notes: 'Surplus from family function grocery procurement. Expiry date is late 2027.',
    status: 'available',
  },
  {
    id: 'DON-103',
    timestamp: '2026-09-25 11:20',
    title: '40 Heavy Woolen Blankets & Thermal Inners (Winter Drive)',
    category: 'Clothes & Blankets',
    quantity: '40 Blankets, 25 Inners',
    condition: 'Brand New / Sealed',
    location: 'Block C, South Extension II',
    city: 'Delhi',
    lat: 28.5684,
    lng: 77.2219,
    donorName: 'Kavita Chawla',
    donorPhone: '+91 98110 54321',
    pickupTimes: 'Daily 11:00 AM - 6:00 PM',
    notes: 'Purchased for community winter shelter distribution. Vacuum packed in cardboard boxes.',
    status: 'available',
  },
  {
    id: 'DON-104',
    timestamp: '2026-09-24 18:45',
    title: '4 Foldable Wheelchairs & 8 Aluminum Walking Crutches',
    category: 'Medical & Hygiene',
    quantity: '4 Wheelchairs + 8 Crutches',
    condition: 'Good Working Condition',
    location: 'Sector 5, Salt Lake',
    city: 'Kolkata',
    lat: 22.5804,
    lng: 88.4285,
    donorName: 'Dr. Subhash Sen',
    donorPhone: '+91 98301 77665',
    pickupTimes: 'Monday to Friday 2:00 PM - 5:00 PM',
    notes: 'Surplus clinic inventory after renovation. Fully serviced with brakes and clean tires.',
    status: 'available',
  },
  {
    id: 'DON-105',
    timestamp: '2026-09-24 09:10',
    title: '15 Solid Wood Study Desks & 30 Chairs for Learning Center',
    category: 'Furniture & Utensils',
    quantity: '15 Desks + 30 Chairs',
    condition: 'Gently Used / Like New',
    location: 'Sector 62, Electronic City Phase 1',
    city: 'Noida',
    lat: 28.6280,
    lng: 77.3649,
    donorName: 'Arjun Verma (Tech Startup Surplus)',
    donorPhone: '+91 99100 88221',
    pickupTimes: 'Saturdays or Sundays 9:00 AM - 1:00 PM (Requires small loading tempo)',
    notes: 'Ideal for an after-school tuition center or orphanage study room. Ground floor pickup.',
    status: 'available',
  },
  {
    id: 'DON-106',
    timestamp: '2026-09-23 15:00',
    title: 'Box of 150 STEM Educational Puzzles, Crayons & Sketchbooks',
    category: 'Toys & Learning Kits',
    quantity: '2 Large Cartons',
    condition: 'Brand New / Sealed',
    location: 'Vipul Khand, Gomti Nagar',
    city: 'Lucknow',
    lat: 26.8504,
    lng: 80.9984,
    donorName: 'Priya Srivastava',
    donorPhone: '+91 94150 33441',
    pickupTimes: 'Evenings 5:00 PM - 8:30 PM',
    notes: 'Suitable for primary school children aged 4-11 years. Clean and unused stationary.',
    status: 'claimed',
    claimedByNgo: 'Asha Kiran Shiksha Samiti',
    ngoRepresentative: 'Ramesh Maurya',
    ngoPhone: '+91 94520 11223',
    pickupDate: '2026-09-28',
    claimedAt: '2026-09-25 16:30'
  },
  {
    id: 'DON-107',
    timestamp: '2026-09-22 17:30',
    title: '6 Refurbished Core-i5 Desktop Towers with Monitors',
    category: 'Electronics & Devices',
    quantity: '6 Workstations',
    condition: 'Good Working Condition',
    location: 'Kothrud, Near Paud Road',
    city: 'Pune',
    lat: 18.5074,
    lng: 73.8077,
    donorName: 'Sameer Joshi',
    donorPhone: '+91 98811 44556',
    pickupTimes: 'Weekends 11:00 AM - 5:00 PM',
    notes: 'Freshly formatted with Ubuntu Linux and LibreOffice. Ready for free student computer lab.',
    status: 'available',
  }
];

export const INITIAL_NGO_NEEDS: NgoNeed[] = [
  {
    id: 'NEED-201',
    ngoName: 'Vidya Jyoti Remedial Centers',
    regNumber: 'REG-DEL-2019-8812',
    city: 'Delhi',
    location: 'Seelampur & Yamuna Khadar',
    representative: 'Sunita Sharma (Field Coordinator)',
    phone: '+91 98712 34567',
    title: 'Urgent: 80 School Backpacks & Geometry Boxes for Slum Remedial Batch',
    category: 'Books & Stationery',
    urgency: 'Critical',
    quantityNeeded: '80 Units',
    reason: 'New batch of 80 first-generation learners enrolling for October board exam prep. Students currently carry books in polythene bags.',
    targetDate: '2026-10-05',
    status: 'Open'
  },
  {
    id: 'NEED-202',
    ngoName: 'Annapurna Seva Trust',
    regNumber: 'REG-KA-2018-4451',
    city: 'Bengaluru',
    location: 'Shivajinagar Community Kitchen',
    representative: 'Farhan Qureshi',
    phone: '+91 99001 23890',
    title: 'Monthly Dry Rations: 100 kg Wheat Flour (Atta) and Cooking Oil',
    category: 'Dry Rations & Food',
    urgency: 'High',
    quantityNeeded: '100 kg Atta, 20 L Cooking Oil',
    reason: 'Feeds 150 daily-wage migrant workers and unattended elderly twice a week. Current dry storage running critically low.',
    targetDate: '2026-10-02',
    status: 'Open'
  },
  {
    id: 'NEED-203',
    ngoName: 'Navjeevan Old Age Care Home',
    regNumber: 'REG-MH-2016-1092',
    city: 'Mumbai',
    location: 'Dharavi Slum Border, Sion',
    representative: 'Sister Mary Fernandez',
    phone: '+91 98210 65432',
    title: 'Adult Diapers (L/XL) & 30 Waterproof Mattress Protectors',
    category: 'Medical & Hygiene',
    urgency: 'Critical',
    quantityNeeded: '12 Packs Adult Diapers, 30 Protectors',
    reason: 'Providing compassionate care to 35 bedridden senior citizens abandoned by families.',
    targetDate: '2026-09-30',
    status: 'Open'
  },
  {
    id: 'NEED-204',
    ngoName: 'Prathamik Vikas Kendra',
    regNumber: 'REG-UP-2021-3329',
    city: 'Lucknow',
    location: 'Chinhat Industrial Belt',
    representative: 'Amitabh Verma',
    phone: '+91 94150 99881',
    title: '20 Ceiling Fans or Wall Mount Fans for Community Shelter',
    category: 'Furniture & Utensils',
    urgency: 'Medium',
    quantityNeeded: '20 Fans',
    reason: 'Upgrading temporary classroom sheds during high humidity months.',
    targetDate: '2026-10-15',
    status: 'Open'
  }
];

export const CEP_SURVEY_FINDINGS: CepSurveyStats = {
  totalNgoRespondents: 46,
  totalDonorRespondents: 124,
  ngoDifficulties: [
    {
      difficulty: 'Lack of Transport / High Courier Costs',
      percentage: 84.8,
      description: 'NGOs lack vehicles to collect donations; donors expect NGOs to pay shipping or delivery costs.'
    },
    {
      difficulty: 'Receiving Irrelevant / Damaged Items',
      percentage: 78.3,
      description: 'Donors treat NGOs as clearinghouses for unusable or torn junk, wasting valuable volunteer sorting hours.'
    },
    {
      difficulty: 'Unpredictable Timing & Supply Spikes',
      percentage: 67.4,
      description: 'Massive unannounced dumping during festival seasons, followed by acute shortages of essential items for months.'
    },
    {
      difficulty: 'High Friction in Donor Follow-up',
      percentage: 60.9,
      description: 'No verified phone numbers or specific pickup time windows, leading to repeated failed volunteer visits.'
    },
    {
      difficulty: 'Warehouse & Storage Bottlenecks',
      percentage: 52.2,
      description: 'Small grassroots NGOs operate out of single-room sheds with zero space for bulky unneeded items.'
    }
  ],
  pickupWillingness: [
    { category: 'Yes, if NGO picks up directly from doorstep', value: 81.5, color: '#1F4D3D' },
    { category: 'Willing only if distance is within 3-5 km', value: 12.1, color: '#E8A33D' },
    { category: 'Prefer central community drop-off points', value: 6.4, color: '#C86446' }
  ],
  mismatchMatrix: [
    { category: 'Educational Books', ngoDemand: 89, donorSupply: 36 },
    { category: 'Dry Food Rations', ngoDemand: 94, donorSupply: 48 },
    { category: 'Old Apparel & Clothes', ngoDemand: 38, donorSupply: 96 },
    { category: 'Medical & Mobility Aids', ngoDemand: 82, donorSupply: 14 },
    { category: 'Digital / Laptops', ngoDemand: 76, donorSupply: 22 },
    { category: 'Bedding & Blankets', ngoDemand: 85, donorSupply: 52 }
  ],
  pickupRadiusPreference: [
    { distance: 'Under 3 km (Walking/Bicycle)', percentage: 41 },
    { distance: '3 to 7 km (Two-wheeler)', percentage: 39 },
    { distance: '7 to 15 km (Volunteer Auto/Van)', percentage: 16 },
    { distance: 'Above 15 km (Requires Logistics Budget)', percentage: 4 }
  ],
  keyFindings: [
    'The "Old Clothes Dumping" Paradox: 96% of donors offer used clothes, while 89% of grassroots NGOs primarily need dry rations and school learning materials.',
    'Logistics is the Single Biggest Barrier: 84.8% of surveyed NGOs cited transport cost as the reason donations fall through.',
    'The "Direct Pickup" Solution: 81.5% of donors actively confirm they will donate immediate surplus if an NGO volunteer picks it up directly from their doorstep.',
    'Verified Needs Verification: 91% of donors state they are 3x more likely to donate when an NGO posts a specific, verified numerical requirement (e.g., "Need 40 school bags") instead of vague appeals.'
  ]
};

export const POPULAR_INDIAN_CITIES = [
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  { name: 'Delhi NCR', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 }
];
