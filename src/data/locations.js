import { getSiteImage } from '../utils/siteImagesStore.js';

const rawLocations = [
  {
    id: "thanjavur",
    name: "THANJAVUR",
    tagline: "The Cultural Capital & Temple Heart",
    defaultImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    propertiesCount: 142,
    popularAreas: ["Medical College Road", "Vallam Bypass", "Pillaiyarpatti", "New Bus Stand", "Karanthai"],
    description: "Famous for royal heritage, heritage villas, DTCP plots, and serene living."
  },
  {
    id: "trichy",
    name: "TRICHY",
    tagline: "Central Tamil Nadu Growth Hub",
    defaultImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80",
    propertiesCount: 98,
    popularAreas: ["Thillai Nagar", "K.K. Nagar", "Cantonment", "Srirangam"],
    description: "Commercial corridors, luxury apartments, and strategic connectivity."
  },
  {
    id: "madurai",
    name: "MADURAI",
    tagline: "Temple City & Commercial Capital",
    defaultImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
    propertiesCount: 86,
    popularAreas: ["Anna Nagar", "K.K. Nagar", "Mattuthavani", "TVS Nagar"],
    description: "Vibrant high-street retail, modern residences, and heritage enclaves."
  },
  {
    id: "chennai",
    name: "CHENNAI",
    tagline: "Metropolitan Coastal Luxury",
    defaultImage: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80",
    propertiesCount: 110,
    popularAreas: ["ECR Oceanfront", "Anna Nagar", "OMR IT Belt", "Velachery"],
    description: "Ultra-luxury beachfront villas, IT corridor apartments, and high-yielding assets."
  },
  {
    id: "coimbatore",
    name: "COIMBATORE",
    tagline: "Manchester of South India",
    defaultImage: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80",
    propertiesCount: 75,
    popularAreas: ["Race Course", "RS Puram", "Avinashi Road", "Saravanampatti"],
    description: "Serene foothill weather, eco villas, gated communities, and industrial parks."
  },
  {
    id: "kumbakonam",
    name: "KUMBAKONAM",
    tagline: "Kaveri Delta Heritage & Farmlands",
    defaultImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
    propertiesCount: 64,
    popularAreas: ["Papanasam", "Swamimalai", "Town Hall Road", "Darasuram"],
    description: "Fertile Kaveri farm estates, temple town plots, and heritage bungalows."
  }
];

export const LOCATIONS = rawLocations.map(loc => ({
  ...loc,
  get image() {
    return getSiteImage(`loc_${loc.id}`) || loc.defaultImage;
  }
}));
