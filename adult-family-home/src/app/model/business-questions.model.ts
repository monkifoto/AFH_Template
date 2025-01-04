export interface Business {
  businessData: {};
  [x: string]: {};
  id: string;

  //Business Information

  businessName: string;
  providerName: string;
  businessURL: string;
  keyWords: string;
  tagline: string;
  address: string;
  phone: string;
  fax: string;
  email: string;

  uniqueService: ListItem[];

  whyChoose: ListItem[];

  businessStory: string;

  isActive: boolean;
  isLive:boolean;

  heroImages: string[];

  motivation: string;

  missionImageUrl:string;
  missionTitle: string;
  mission: string;

  visionImageUrl:string;
  visionTitle: string;
  vision: string;

  certifications: string;

  services: ServiceItem[];

  specialPrograms: string;

  toursImageUrl: string;
  tours: string;

  freeConsulting: string;
  consultingImageUrl: string;

  websiteGoals: string;

  logoImage: string;
  logoText: string;
  faviconUrl:string;


  facilityImages: string[];
  lifestyleImages: string[];
  mediaFeatures: string;
  ratings: string;

  testimonials: Testimonial[];

  businessHours: string;
  socialMedia: string;
  welcomeMessage: string;
  keyServicesHighlights: string;
  teamValues: string;
  benefits: BenefitItem[];

  //Contact us page
  contactFormDetails: string;
  contactUsImageUrl: string;
  mapIframeUrl: string;

  faqs: string;
  blogNews: string;
  photoGalleryText: string;

  //Employyes
  employees: Employee[];
  ownerImagesBios: string;
  staffImagesBios: string;


  metaTitle:string;
  metaKeywords:string;
  metaDescription:string;



  theme: Theme;

  // Hero Slider
  heroSlider: HeroSlide[];

}

export interface HeroSlide {
  title: string; // Title for the slide
  subtitle: string; // Subtitle for the slide
  backgroundImage: string; // URL for the slide's background image
  buttons: HeroButton[]; // Array of buttons for the slide
}

export interface HeroButton {
  text: string; // Button text
  link: string; // URL the button links to
  outline: boolean; // Whether the button has an outline style
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
  iconURL?:string;
  name:string;
  description: string;
}

export interface HeroImage {
  url: string;
  altText?: string; // Optional field for image alt text
}

export interface Theme {
  themeFileName?: string;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  accentColor: string;
  darkBackgroundColor: string;
  navTextColor:string;
  navBackgroundColor: string;
  navActiveBackground: string;
  navActiveText:string;
  buttonColor: string;
  buttonHoverColor: string;

  themeType: string;
}

export class BusinessModel {
  static getDefaultBusiness(): Business {
    return {
      heroImages: [''],
      heroSlider: [
        {
          title: 'Welcome to Careful Living AFH',
          subtitle: 'Caring with compassion for every senior.',
          backgroundImage: '../assets/heroImages/hero1.jpg',
          buttons: [
            {
              text: 'Learn More',
              link: '/about',
              outline: false,
            },
            {
              text: 'Contact Us',
              link: '/contact',
              outline: true,
            },
          ],
        },
        {
          title: 'Exceptional Senior Care',
          subtitle: 'Personalized, compassionate, and dedicated.',
          backgroundImage: '../assets/heroImages/hero2.jpg',
          buttons: [
            {
              text: 'Our Services',
              link: '/services',
              outline: false,
            },
          ],
        },
      ],
      businessData: '',
      logoText: '',
      facilityImages: [''],
      lifestyleImages: [''],
      id: '',
      faqs: '',
      blogNews: '',
      toursImageUrl: '',
      consultingImageUrl: '',
      businessName: 'Careful Living AFH',
      keyWords: 'senior care, compassionate care, assisted living',
      businessURL: 'https://www.carefullivingafh.com',
      providerName: 'Sarah Caregiver',
      tagline: 'Caring with compassion for every senior',
      businessStory:
        'Founded by healthcare professionals passionate about senior care, Careful Living AFH aims to provide a nurturing environment for the elderly.',
      motivation:
        'To offer high-quality, compassionate care for seniors, respecting their independence and dignity.',
      mission:
        'To exceed the expectations of our residents and their families, with personalized care and a homelike atmosphere.',
      missionImageUrl: '',
      missionTitle: 'Our Mission',
      vision:
        'A community where seniors can live independently with compassionate, round-the-clock care and support.',
      visionImageUrl: '',
      visionTitle: 'Our Vision',
      certifications:
        'State Licensed, Certified Nursing Assistants (CNA), First Aid/CPR Certified',
      specialPrograms:
        'Holiday celebrations, birthday parties, outdoor activities, exercise programs, arts & crafts, movie nights.',
      tours: 'Yes, facility tours are available by appointment.',
      freeConsulting: 'Yes, initial consulting services are offered for free.',
      websiteGoals:
        'To inform, encourage visits, and offer a means to request consultations.',
      logoImage: '../assets/sharedAssets/Demologo2.png',
      faviconUrl: '../../assets/sharedAssets/icons/hh_favicon.ico',
      ownerImagesBios: 'Sarah Caregiver, RN, Founder.',
      staffImagesBios:
        'Emily Nurse, CNA, Head Nurse; Jack Therapist, PT, Physical Therapist',
      mediaFeatures: 'Featured in Healthcare Journal, Senior Care Monthly.',
      ratings: 'Google: 4.8 stars, Yelp: 5 stars',
      address: '4567 Compassionate Ln, Kindness City, ST 56789',
      phone: '(987) 654-3210',
      fax: '(987) 654-3211',
      email: 'contact@carefullivingafh.com',
      businessHours: 'Mon-Fri: 8am-6pm, Sat-Sun: 9am-5pm',
      socialMedia:
        'Facebook: facebook.com/carefullivingafh; Instagram: instagram.com/carefullivingafh',
      welcomeMessage:
        'Welcome to Careful Living AFH - where our residents are family.',
      keyServicesHighlights: '24/7 care, balanced meals, therapeutic activities.',
      teamValues:
        'Dedicated team specialized in elderly care for dementia, Alzheimer’s, stroke recovery, diabetic management, cardiac care, and rehabilitation.',
      contactFormDetails:
        'Please provide name, email, phone number, and message for inquiries.',
      contactUsImageUrl: '',
      mapIframeUrl: '<iframe src="https://maps.google.com/..."></iframe>',
      photoGalleryText:
        'A collection of images showcasing our facilities, activities, and care staff.',
      isActive: true,
      isLive: false,
      uniqueService: [
        {
          description:
            'Residents receive customized care plans that adapt to their specific health conditions, preferences, and evolving needs.',
          name: 'Personalized Care',
        },
        {
          name: 'Homelike Environment',
          description:
            'We offer private rooms and shared common living spaces, such as kitchens, dining rooms, and living areas, providing a cozy, familiar atmosphere.',
        },
        // Other unique services...
      ],
      whyChoose: [
        {
          name: 'One-on-One Care',
          description:
            'Our caregivers truly get to know each resident’s needs, preferences, and routines, ensuring tailored care and a personal connection.',
        },
        // Other reasons...
      ],
      services: [
        { name: '24/7 Personalized Care' },
        { name: 'Medication Management' },
        // Other services...
      ],
      benefits: [
        { name: 'Personalized Care' },
        { name: '24/7 Support' },
        // Other benefits...
      ],
      testimonials: [
        {
          id: '',
          name: 'Sarah Thompson',
          quote:
            'Finding this Adult Family Home for my mother was the best decision we ever made.',
          photoURL: '',
        },
        // Other testimonials...
      ],
      employees: [
        {
          name: 'Alex',
          photoURL: '../assets/employees/alex.jpg',
          id: '',
          bio: '17 years as a software engineer and 10 years as a professional photographer',
          role: 'Programmer/Designer',
        },
        // Other employees...
      ],
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      theme: {
        themeFileName: 'styles.css',
        primaryColor: '#fffaf2',
        secondaryColor: '#f8f3f0',
        accentColor: '#F0C987',
        backgroundColor: '#F5F3E7',
        darkBackgroundColor: '#4C6A56',
        textColor: '#2F2F2F',
        navBackgroundColor: '#F5F3E7',
        navTextColor: '#33372C',
        navActiveBackground: '#33372C',
        navActiveText: '#ffffff',
        buttonColor: '#D9A064',
        buttonHoverColor: '#c9605b',
        themeType: 'demo',
      },
    };
  }
}

