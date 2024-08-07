export interface Business {
  id: string;
  businessName: string;
  tagline?: string;
  uniqueService: string;
  whyChoose: string;
  businessStory: string;
  motivation: string;
  mission: string;
  vision: string;
  certifications: string;
  targetAudience: string;
  services: string;
  specialPrograms: string;
  tours: string;
  freeConsulting: string;
  websiteGoals: string;
  logoImage?: string;
  logoText?: string;
  ownerImagesBios: string;
  staffImagesBios: string;
  facilityImages?: string[];
  lifestyleImages?: string[];
  mediaFeatures: string;
  ratings: string;
  testimonials: string;
  address: string;
  phone: string;
  fax?: string;
  email: string;
  businessHours: string;
  socialMedia: string;
  welcomeMessage: string;
  keyServicesHighlights: string;
  teamValues: string;
  serviceBenefits: string;
  pricingStructure: string;
  contactFormDetails: string;
  mapDirections: string;
  faqs: string;
  blogNews: string;
  photoGallery: string;
  mapIframe: string;
  employees?: Employee[];
  isActive: boolean;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoURL: string;
}
