export interface Business {
  id: string;
  businessName: string;
  providerName: string;
  businessURL: string;
  keyWords: string;
  tagline?: string;
  uniqueService: ListItem[];
  whyChoose: ListItem[];
  businessStory: string;
  motivation: string;
  mission: string;
  vision: string;
  certifications: string;
  services: ServiceItem[];
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
  testimonials?: Testimonial[];
  address: string;
  phone: string;
  fax?: string;
  email: string;
  businessHours: string;
  socialMedia: string;
  welcomeMessage: string;
  keyServicesHighlights: string;
  teamValues: string;
  benefits: BenefitItem[];
  contactFormDetails: string;
  mapIframeUrl: string;
  faqs: string;
  blogNews: string;
  photoGalleryText: string;
  employees?: Employee[];
  isActive: boolean;
  heroImages?: string[];
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoURL: string;
}

export interface Testimonial{
  id: string;
  name: string;
  quote: string;
  photoURL: string;
}

export interface ServiceItem{
  name:string;
}

export interface BenefitItem{
  name:string;
}

export interface ListItem{
  name:string;
  description: string;
}

export interface HeroImage {
  url: string;
  altText?: string; // Optional field for image alt text
}
