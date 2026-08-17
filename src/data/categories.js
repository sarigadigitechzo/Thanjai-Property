import { getProperties } from '../utils/propertiesStore.js';

const rawCategories = [
  {
    id: "villas",
    name: "Luxury Villas",
    unitSingular: "Villa",
    unitPlural: "Properties",
    defaultImage: "/images/tn_villas.jpg",
    description: "Architectural estates & private courtyard residences"
  },
  {
    id: "houses",
    name: "Independent Houses",
    unitSingular: "House",
    unitPlural: "Properties",
    defaultImage: "/images/tn_houses.jpg",
    description: "Independent homes with custom floor layouts"
  },
  {
    id: "apartments",
    name: "Modern Apartments",
    unitSingular: "Apartment",
    unitPlural: "Properties",
    defaultImage: "/images/tn_apartments.jpg",
    description: "High-rise apartments & luxury penthouses"
  },
  {
    id: "plots",
    name: "Residential Plots",
    unitSingular: "Plot",
    unitPlural: "Plots",
    defaultImage: "/images/tn_plots.jpg",
    description: "DTCP & RERA approved villa layout plots"
  },
  {
    id: "agricultural",
    name: "Agricultural Land",
    unitSingular: "Farm",
    unitPlural: "Farms",
    defaultImage: "/images/tn_agricultural.jpg",
    description: "Fertile Kaveri delta coconut & paddy farmlands"
  },
  {
    id: "commercial",
    name: "Commercial Spaces",
    unitSingular: "Space",
    unitPlural: "Spaces",
    defaultImage: "/images/tn_commercial.jpg",
    description: "Showrooms, prime retail plots & corporate offices"
  },
  {
    id: "industrial",
    name: "Industrial Land",
    unitSingular: "Unit",
    unitPlural: "Units",
    defaultImage: "/images/tn_industrial.jpg",
    description: "SIPCOT adjacent industrial plots & logistics parks"
  }
];

export const CATEGORIES = rawCategories.map(cat => ({
  ...cat,
  get count() {
    try {
      const properties = getProperties();
      const matchingProps = properties.filter(p => p.category === cat.id);
      const countNum = matchingProps.length;
      if (countNum === 0) return `0 ${cat.unitPlural}`;
      if (countNum === 1) return `1 ${cat.unitSingular}`;
      return `${countNum} ${cat.unitPlural}`;
    } catch (e) {
      return `0 ${cat.unitPlural}`;
    }
  },
  get image() {
    return cat.defaultImage;
  }
}));
