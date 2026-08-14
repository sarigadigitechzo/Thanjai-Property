import { getSiteImage } from '../utils/siteImagesStore.js';

const rawCategories = [
  {
    id: "villas",
    name: "Luxury Villas",
    count: "45 Properties",
    defaultImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    description: "Architectural estates & private courtyard residences"
  },
  {
    id: "houses",
    name: "Independent Houses",
    count: "68 Properties",
    defaultImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    description: "Independent homes with custom floor layouts"
  },
  {
    id: "apartments",
    name: "Modern Apartments",
    count: "82 Properties",
    defaultImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    description: "High-rise apartments & luxury penthouses"
  },
  {
    id: "plots",
    name: "Residential Plots",
    count: "120 Plots",
    defaultImage: "https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=800&q=80",
    description: "DTCP & RERA approved villa layout plots"
  },
  {
    id: "agricultural",
    name: "Agricultural Land",
    count: "35 Farms",
    defaultImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    description: "Fertile Kaveri delta coconut & paddy farmlands"
  },
  {
    id: "commercial",
    name: "Commercial Spaces",
    count: "29 Spaces",
    defaultImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    description: "Showrooms, prime retail plots & corporate offices"
  },
  {
    id: "industrial",
    name: "Industrial Land",
    count: "18 Units",
    defaultImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    description: "SIPCOT adjacent industrial plots & logistics parks"
  }
];

export const CATEGORIES = rawCategories.map(cat => ({
  ...cat,
  get image() {
    return getSiteImage(`cat_${cat.id}`) || cat.defaultImage;
  }
}));
