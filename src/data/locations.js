import { getProperties } from '../utils/propertiesStore.js';
import { getSiteImage } from '../utils/siteImagesStore.js';

const rawLocations = [
  {
    id: "medical_college_road",
    markerId: 1,
    name: "Medical College Road",
    zone: "Arterial",
    category: "Arterial",
    isOuterLocation: false,
    latitude: 10.7574,
    longitude: 79.1079,
    zoom: 15,
    searchQuery: "Medical College Road, Thanjavur, Tamil Nadu, India",
    districtLabel: "Thanjavur",
    priceFrom: "₹ 2.3 Lakhs / Cent",
    propertyType: "Residential",
    areaPotential: "High Appreciation",
    approval: "DTCP Approved",
    tagline: "Healthcare Corridor & Premium Residential Hub",
    locationImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Medical College Road, Thanjavur, Tamil Nadu",
    popularAreas: ["Sarafojinagar", "Easwari Nagar", "EVP Nagar", "Sundaram Nagar"],
    description: "Prime residential corridor in Thanjavur near Thanjavur Medical College with high appreciation, multi-speciality hospitals, and DTCP approved layouts."
  },
  {
    id: "trichy_road",
    markerId: 2,
    name: "Trichy Road",
    zone: "Arterial",
    category: "Arterial",
    isOuterLocation: false,
    latitude: 10.7781,
    longitude: 79.1381,
    zoom: 14,
    searchQuery: "Trichy Road, Thanjavur, Tamil Nadu, India",
    districtLabel: "Thanjavur",
    priceFrom: "₹ 2.8 Lakhs / Cent",
    propertyType: "Commercial & Residential",
    areaPotential: "Fast Commercial Growth",
    approval: "DTCP & RERA",
    tagline: "Major Commercial Highway & Gated Villas",
    locationImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Trichy Road (NH 83) Highway Corridor, Thanjavur",
    popularAreas: ["Thanjavur Junction", "New Bus Stand Bypass", "Pillaiyarpatti", "NH 83 Corridor"],
    description: "High-traffic commercial artery (NH 83) connecting Thanjavur to Trichy, ideal for retail spaces, commercial land, and gated communities."
  },
  {
    id: "pudukkottai_road",
    markerId: 3,
    name: "Pudukkottai Road",
    zone: "Arterial",
    category: "Arterial",
    isOuterLocation: false,
    latitude: 10.7650,
    longitude: 79.1250,
    zoom: 14,
    searchQuery: "Pudukkottai Road, Thanjavur, Tamil Nadu, India",
    districtLabel: "Thanjavur",
    priceFrom: "₹ 2.1 Lakhs / Cent",
    propertyType: "Residential & Plots",
    areaPotential: "High Rental Yield",
    approval: "DTCP Approved",
    tagline: "Educational Belt & Residential Plot Layouts",
    locationImage: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Pudukkottai Road Educational Corridor, Thanjavur",
    popularAreas: ["Parisutham Nagar", "Yagappa Nagar", "Tamil University Sector", "Air Force Gate"],
    description: "Rapidly developing institutional zone opposite Tamil University featuring premium house sites, schools, and quiet family neighborhoods."
  },
  {
    id: "madhakottai_road",
    markerId: 4,
    name: "Madhakottai Road",
    zone: "Residential",
    category: "Residential",
    isOuterLocation: false,
    latitude: 10.7521,
    longitude: 79.1124,
    zoom: 15,
    searchQuery: "Madhakottai Road, Thanjavur, Tamil Nadu, India",
    districtLabel: "Thanjavur",
    priceFrom: "₹ 2.1 Lakhs / Cent",
    propertyType: "Residential & Villas",
    areaPotential: "Rapid Expansion",
    approval: "DTCP Approved",
    tagline: "Rapid Urban Expansion & Modern Villas",
    locationImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Madhakottai Road Residential Corridor, Thanjavur",
    popularAreas: ["Raja Serfoji Govt College Area", "Madhakottai Junction", "Holy Cross Extension"],
    description: "Fastest-growing residential expansion zone near Raja Serfoji Government College featuring contemporary villa developments and clear Patta plots."
  },
  {
    id: "nanjikottai_road",
    markerId: 5,
    name: "Nanjikottai Road",
    zone: "Residential",
    category: "Residential",
    isOuterLocation: false,
    latitude: 10.7453,
    longitude: 79.1289,
    zoom: 15,
    searchQuery: "Nanjikottai Road, Thanjavur, Tamil Nadu, India",
    districtLabel: "Thanjavur",
    priceFrom: "₹ 2.4 Lakhs / Cent",
    propertyType: "Residential Enclaves",
    areaPotential: "Established Prime",
    approval: "DTCP Approved",
    tagline: "Serene Residential Enclaves & Townhouses",
    locationImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Nanjikottai Road Residential Enclave, Thanjavur",
    popularAreas: ["Nanjikottai Junction", "EB Colony", "Kuberan Nagar", "Vasantham City"],
    description: "Established peaceful residential corridor with excellent groundwater, top schools, and independent homes south of Thanjavur city."
  },
  {
    id: "villar_road",
    markerId: 6,
    name: "Villar Road",
    zone: "Suburban",
    category: "Suburban",
    isOuterLocation: false,
    latitude: 10.7330,
    longitude: 79.1500,
    zoom: 14,
    searchQuery: "Villar Road, Thanjavur, Tamil Nadu, India",
    districtLabel: "Thanjavur Taluk",
    priceFrom: "₹ 1.6 Lakhs / Cent",
    propertyType: "Suburban Plots & Farmlands",
    areaPotential: "High ROI Potential",
    approval: "DTCP & Patta",
    tagline: "Suburban Growth & Investment Plot Layouts",
    locationImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Villar Road Agricultural & Suburban Layouts, Thanjavur",
    popularAreas: ["Vilar Panchayat", "Nanjikottai Bypass Area", "Kaveri Layout"],
    description: "High-potential suburban investment corridor in Vilar area offering budget-friendly residential and agricultural land opportunities, PIN 613006."
  },
  {
    id: "pattukottai_bypass",
    markerId: 7,
    name: "Pattukottai Bypass",
    zone: "Bypass",
    category: "Bypass",
    isOuterLocation: true,
    latitude: 10.4236,
    longitude: 79.3195,
    zoom: 13,
    searchQuery: "Pattukottai Bypass, Pattukkottai, Thanjavur district, Tamil Nadu, India",
    districtLabel: "Pattukkottai, Thanjavur District",
    priceFrom: "₹ 1.2 Lakhs / Cent",
    propertyType: "Commercial & Highway Plots",
    areaPotential: "Commercial Hub",
    approval: "DTCP Approved",
    tagline: "Pattukkottai Town Bypass & Highway Frontage",
    locationImage: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Pattukkottai Bypass Highway Corridor, Thanjavur District",
    popularAreas: ["Pattukkottai Town Centre", "Bypass Junction", "Highway Commercial Belt"],
    description: "Strategic bypass road skirting Pattukkottai town in Thanjavur district — prime frontage for warehouses, commercial showrooms, and highway plots."
  },
  {
    id: "mariyamman_kovil_road",
    markerId: 8,
    name: "Mariyamman Kovil Road",
    zone: "Heritage",
    category: "Suburban",
    isOuterLocation: false,
    latitude: 10.7854,
    longitude: 79.1895,
    zoom: 15,
    searchQuery: "Mariyamman Kovil Road, Thanjavur, Tamil Nadu, India",
    districtLabel: "Thanjavur",
    priceFrom: "₹ 1.8 Lakhs / Cent",
    propertyType: "Heritage & Residential",
    areaPotential: "Cultural Heritage",
    approval: "Clear Patta",
    tagline: "Heritage & Temple Neighborhood Corridor",
    locationImage: "https://images.unsplash.com/photo-1602621585695-a25e8d81f7e1?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Punnainallur Mariyamman Temple Road Corridor, Thanjavur",
    popularAreas: ["Punnainallur", "Mariamman Temple Road", "Kovil Bypass", "Sri Rama Nagar"],
    description: "Culturally rich residential belt near Punnainallur Mariyamman Temple (~5 km east of Thanjavur) with traditional independent homes, PIN 613501."
  },
  {
    id: "srinivasapuram",
    markerId: 9,
    name: "Srinivasapuram",
    zone: "Residential",
    category: "Residential",
    isOuterLocation: false,
    latitude: 10.7861,
    longitude: 79.1268,
    zoom: 15,
    searchQuery: "Srinivasapuram, Thanjavur, Tamil Nadu, India",
    districtLabel: "Thanjavur",
    priceFrom: "₹ 2.9 Lakhs / Cent",
    propertyType: "Upscale Housing",
    areaPotential: "Ultra Luxury",
    approval: "DTCP Approved",
    tagline: "Established Upscale Neighborhood & Individual Houses",
    locationImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Srinivasapuram Upscale Residential Avenue, Thanjavur",
    popularAreas: ["Srinivasapuram Main Road", "Bankers Colony", "Court Road Link"],
    description: "Prestigious central Thanjavur residential colony featuring luxury independent residences and excellent civic infrastructure."
  },
  {
    id: "reddipalayam_road",
    markerId: 10,
    name: "Reddipalayam Road",
    zone: "Residential",
    category: "Residential",
    isOuterLocation: false,
    latitude: 10.7620,
    longitude: 79.1050,
    zoom: 15,
    searchQuery: "Reddipalayam Road, Thanjavur, Tamil Nadu, India",
    districtLabel: "Thanjavur",
    priceFrom: "₹ 1.9 Lakhs / Cent",
    propertyType: "Gated Layouts",
    areaPotential: "Emerging Layouts",
    approval: "DTCP & RERA",
    tagline: "Gated Community & Modern Layouts",
    locationImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Reddipalayam Road Gated Community Layout, Thanjavur",
    popularAreas: ["Reddipalayam Junction", "Eashwari Nagar", "Cauvery Nagar", "PIN 613009"],
    description: "Well-planned residential sector in western Thanjavur with RERA-approved house sites and modern gated community projects near Medical College area."
  },
  {
    id: "kumbakonam_bypass",
    markerId: 11,
    name: "Kumbakonam Bypass",
    zone: "Bypass",
    category: "Bypass",
    isOuterLocation: true,
    latitude: 10.9621,
    longitude: 79.3912,
    zoom: 13,
    searchQuery: "Kumbakonam Bypass, Kumbakonam, Thanjavur district, Tamil Nadu, India",
    districtLabel: "Kumbakonam, Thanjavur District",
    priceFrom: "₹ 2.5 Lakhs / Cent",
    propertyType: "Highway & Agro Assets",
    areaPotential: "Strategic Asset",
    approval: "DTCP & Patta",
    tagline: "Delta Highway & Strategic Land Assets",
    locationImage: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Kumbakonam Bypass Highway Corridor, Thanjavur District",
    popularAreas: ["Kumbakonam Town Bypass", "Papanasam Highway", "Delta Agro Belts"],
    description: "Major bypass road in Kumbakonam town, Thanjavur district — popular for commercial investments and farmlands along the Thanjavur–Kumbakonam corridor."
  }
];

export const LOCATIONS = rawLocations.map(loc => ({
  ...loc,
  get matchingProperties() {
    try {
      const properties = getProperties();
      return properties.filter(p => {
        const d = (p.district || '').toLowerCase();
        const l = (p.location || '').toLowerCase();
        const address = (p.address || p.area || '').toLowerCase();
        const title = (p.title || '').toLowerCase();
        const target = loc.name.toLowerCase();
        const altTarget = loc.id.replace(/_/g, ' ');
        return l.includes(target) || d.includes(target) || address.includes(target) || title.includes(target) || l.includes(altTarget);
      });
    } catch (e) {
      return [];
    }
  },
  get propertiesCount() {
    return this.matchingProperties.length;
  },
  get hasProperties() {
    return this.propertiesCount > 0;
  },
  get count() {
    const cnt = this.propertiesCount;
    if (cnt === 0) return '0 Properties';
    if (cnt === 1) return '1 Property';
    return `${cnt} Active Listings`;
  },
  get image() {
    return getSiteImage(`loc_corridor_${loc.id}`) || loc.locationImage;
  }
}));
