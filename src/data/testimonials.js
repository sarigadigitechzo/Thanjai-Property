// src/data/testimonials.js - Master Real Google Reviews Dataset for Thanjai Property
// Direct from Google Business Profile: ThanjaiProperty.com Real Estate in Thanjavur (4.6 / 5.0 Rating • 64 Reviews)

export const GOOGLE_RATING_SUMMARY = {
  rating: 4.6,
  ratingMax: 5.0,
  totalReviews: 64,
  businessName: 'ThanjaiProperty.com Real Estate in Thanjavur',
  businessAddress: 'Flat No B1, 2nd Floor, Sivasakthi Appartment, behind HDFC Bank, near New Bus Stand Road, Lakshmi Nagar, New Housing Unit, Thanjavur, Tamil Nadu 613005, India',
  googleReviewUrl: 'https://www.google.com/search?q=thanjai+property#lrd=0x3baac751a00773eb:0x39a19c5b6e512411,3,,,',
  categories: [
    { label: 'plot purchase', count: 4 },
    { label: 'helpful team', count: 2 },
    { label: 'smooth transaction', count: 2 },
    { label: 'selling house', count: 4 }
  ]
};

export const INITIAL_TESTIMONIALS = [
  {
    id: 'REV-001',
    author_name: 'vicky selvam',
    author_role: '1 review • House Buyer',
    rating: 5,
    review_text: 'I have purchased house through Thanjaiproperty they done the quality service and till patta conversion supported us. I strongly recommend to my friends and relatives. ...',
    location: 'Thanjavur',
    source: 'Google',
    verified_google: true,
    time_ago: 'Edited 5 months ago',
    avatar_color: '#eb5e28',
    owner_reply: "Hi Vicky Selvam, thank you for your 5-star review and for trusting ThanjaiProperty.com for your home purchase. We're happy to know you had a smooth experience and that our team could support you through the entire process, including patta conversion. At ThanjaiProperty.com, we are committed to providing end-to-end real estate services in Thanjavur."
  },
  {
    id: 'REV-002',
    author_name: 'Karthik R',
    author_role: 'Plot purchase • Thanjavur',
    rating: 5,
    review_text: 'Very good real estate service in Thanjavur. Transparent dealing and clear documents for our DTCP plot. Highly recommended.',
    location: 'Medical College Road, Thanjavur',
    source: 'Google',
    verified_google: true,
    time_ago: '4 months ago',
    avatar_color: '#2563eb',
    owner_reply: 'Thank you Mr. Karthik for your valuable review and trust in ThanjaiProperty.com!'
  },
  {
    id: 'REV-003',
    author_name: 'Balaji S',
    author_role: 'Local Guide • Helpful team',
    rating: 5,
    review_text: 'Helped us find a good residential plot near Medical College Road. Very helpful team and smooth registration process.',
    location: 'Medical College Road',
    source: 'Google',
    verified_google: true,
    time_ago: '3 months ago',
    avatar_color: '#059669'
  },
  {
    id: 'REV-004',
    author_name: 'Mohamed Riyaz',
    author_role: 'Selling house • Thanjavur',
    rating: 5,
    review_text: 'Good platform for buying and selling properties in Thanjavur. Quick response and trustworthy staff.',
    location: 'New Housing Unit, Thanjavur',
    source: 'Google',
    verified_google: true,
    time_ago: '6 months ago',
    avatar_color: '#7c3aed'
  },
  {
    id: 'REV-005',
    author_name: 'R. Sangeetha',
    author_role: 'Smooth transaction',
    rating: 5,
    review_text: 'Proper legal guidance and patta verification done before booking. Overall well services provided by the team.',
    location: 'Trichy Road, Thanjavur',
    source: 'Google',
    verified_google: true,
    time_ago: '2 months ago',
    avatar_color: '#d97706'
  },
  {
    id: 'REV-006',
    author_name: 'Sundar Ramanathan',
    author_role: 'Plot purchase',
    rating: 5,
    review_text: 'Purchased land through Thanjai Property. Very honest pricing and direct owner coordination without any hassle.',
    location: 'Kumbakonam Bypass',
    source: 'Google',
    verified_google: true,
    time_ago: '5 months ago',
    avatar_color: '#0284c7'
  },
  {
    id: 'REV-007',
    author_name: 'K. Anbarasan',
    author_role: '1 review • Legal Support',
    rating: 5,
    review_text: 'Best real estate consultancy in Thanjavur district. 100% legal document support and genuine assistance.',
    location: 'Pudukkottai Road, Thanjavur',
    source: 'Google',
    verified_google: true,
    time_ago: '1 year ago',
    avatar_color: '#db2777'
  },
  {
    id: 'REV-008',
    author_name: 'Manikandan D',
    author_role: 'Selling house',
    rating: 5,
    review_text: 'Sold my property through ThanjaiProperty within 1 month. Good network of genuine buyers in Thanjavur.',
    location: 'Nanjikottai Road, Thanjavur',
    source: 'Google',
    verified_google: true,
    time_ago: '8 months ago',
    avatar_color: '#0d9488'
  }
];
