import { getProperties } from '../utils/propertiesStore.js';

const rawLocations = [
  {
    id: "thanjavur",
    name: "THANJAVUR",
    tagline: "The Cultural Capital & Temple Heart",
    defaultImage: "/images/tn_loc_thanjavur.jpg",
    popularAreas: ["Medical College Road", "Vallam Bypass", "Pillaiyarpatti", "New Bus Stand", "Karanthai"],
    description: "Famous for royal heritage, heritage villas, DTCP plots, and serene living."
  },
  {
    id: "trichy",
    name: "TRICHY",
    tagline: "Central Tamil Nadu Growth Hub",
    defaultImage: "/images/tn_loc_trichy.jpg",
    popularAreas: ["Thillai Nagar", "K.K. Nagar", "Cantonment", "Srirangam"],
    description: "Commercial corridors, luxury apartments, and strategic connectivity."
  },
  {
    id: "madurai",
    name: "MADURAI",
    tagline: "Temple City & Commercial Capital",
    defaultImage: "/images/tn_loc_madurai.jpg",
    popularAreas: ["Anna Nagar", "K.K. Nagar", "Mattuthavani", "TVS Nagar"],
    description: "Vibrant high-street retail, modern residences, and heritage enclaves."
  },
  {
    id: "chennai",
    name: "CHENNAI",
    tagline: "Metropolitan Coastal Luxury",
    defaultImage: "/images/tn_loc_chennai.jpg",
    popularAreas: ["ECR Oceanfront", "Anna Nagar", "OMR IT Belt", "Velachery"],
    description: "Ultra-luxury beachfront villas, IT corridor apartments, and high-yielding assets."
  },
  {
    id: "coimbatore",
    name: "COIMBATORE",
    tagline: "Manchester of South India",
    defaultImage: "/images/tn_loc_coimbatore.jpg",
    popularAreas: ["Race Course", "RS Puram", "Avinashi Road", "Saravanampatti"],
    description: "Serene foothill weather, eco villas, gated communities, and industrial parks."
  },
  {
    id: "kumbakonam",
    name: "KUMBAKONAM",
    tagline: "Kaveri Delta Heritage & Farmlands",
    defaultImage: "/images/tn_loc_kumbakonam.jpg",
    popularAreas: ["Papanasam", "Swamimalai", "Town Hall Road", "Darasuram"],
    description: "Fertile Kaveri farm estates, temple town plots, and heritage bungalows."
  }
];

export const LOCATIONS = rawLocations.map(loc => ({
  ...loc,
  get count() {
    try {
      const properties = getProperties();
      const matchCount = properties.filter(p => {
        const d = (p.district || '').toLowerCase();
        const l = (p.location || '').toLowerCase();
        const target = loc.id.toLowerCase();
        return d.includes(target) || l.includes(target);
      }).length;

      if (matchCount === 0) return '0 Properties';
      if (matchCount === 1) return '1 Property';
      return `${matchCount} Properties`;
    } catch (e) {
      return '0 Properties';
    }
  },
  get propertiesCount() {
    try {
      const properties = getProperties();
      return properties.filter(p => {
        const d = (p.district || '').toLowerCase();
        const l = (p.location || '').toLowerCase();
        const target = loc.id.toLowerCase();
        return d.includes(target) || l.includes(target);
      }).length;
    } catch (e) {
      return 0;
    }
  },
  get image() {
    return loc.defaultImage;
  }
}));
