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



  theme: {
    themeFileName?: string;
    backgroundColor: string;
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    accentColor: string;
    darkBackgroundColor: string;
    navBackgroundColor: string;
    navTextColor: string;
    navActiveBackground: string;
    navActiveText: string;
    buttonColor: string;
    buttonHoverColor: string;
    themeType: string;
  };

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
      heroImages:[''],
      businessData:'',
      logoText:'',
      facilityImages:[''],
      lifestyleImages:[''],
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
        missionImageUrl:'',
        missionTitle: 'Our Mission',

        vision:'A community where seniors can live independently with compassionate, round-the-clock care and support.',
        visionImageUrl:'',
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
      keyServicesHighlights:
        '24/7 care, balanced meals, therapeutic activities.',
      teamValues:
        'Dedicated team specialized in elderly care for dementia, Alzheimer’s, stroke recovery, diabetic management, cardiac care, and rehabilitation.',
      contactFormDetails:
        'Please provide name, email, phone number, and message for inquiries.',
        contactUsImageUrl : '',
      mapIframeUrl: '<iframe src="https://maps.google.com/..."></iframe>',
      photoGalleryText:
        'A collection of images showcasing our facilities, activities, and care staff.',
      isActive: true,
      uniqueService: [
        {
          description:
            'Residents receive customized care plans that adapt to their specific health conditions, preferences, and evolving needs.',
          name: 'Personalized Care',
        },
        {
          name: 'Homelike Environment',
          description:
            'We offer private rooms and share common living spaces, such as kitchens, dining rooms, and living areas, providing a cozy, familiar atmosphere.',
        },
        {
          description:
            'We offer a stable environment where residents can "age in place," with no need for relocation when their health declines, unless the care required exceeds the home’s capacity.',
          name: 'Continuity of Care',
        },
        {
          name: 'Diverse Care Options',
          description:
            'We offer a wide range of care services, from basic assistance with daily living activities (such as bathing, dressing, and meal preparation) to more complex care, such as medication management, dementia care, and end-of-life care.',
        },
        {
          description:
            'We provide services for individuals with specific medical conditions or special needs, including dementia, mental health issues, developmental disabilities, physical disabilities, or chronic illnesses.',
          name: 'Inclusive Care for Specialized Needs',
        },
        {
          name: 'Family-Like Atmosphere',
          description:
            'We strive to create strong, family-like bonds can form between the residents, caregivers.',
        },
        {
          name: 'Flexible Scheduling and Daily Routines',
          description:
            'We offer personalized activities based on the interests and capabilities of the residents, including gardening, arts and crafts, or outings in the local community.',
        },
        {
          description:
            'We accept Medicaid as well as private pay, making us a viable option for individuals who are not able to afford the costs of larger, institutional care settings.',
          name: 'Affordable Care Option',
        },
        {
          description:
            'We meet state requirements for safety, including fire safety protocols and ensuring the home is accessible for residents with mobility issues.',
          name: 'Enhanced Safety and Security',
        },
        {
          name: 'End-of-Life and Hospice Care',
          description:
            'We provide end-of-life care in a compassionate and supportive environment, allowing residents to remain in a familiar setting surrounded by caregivers they know well, and sometimes even their own family members.',
        },
      ],
      whyChoose: [
        {
          name: 'One-on-One Care',
          description:
            ' Our caregivers truly get to know each resident’s needs, preferences, and routines, ensuring tailored care and a personal connection.',
        },
        {
          name: 'Homelike Environment',
          description:
            'We foster a family-like atmosphere that promotes emotional well-being and a sense of belonging.',
        },
        {
          description:
            'Our dedicated caregivers are not only well-trained in senior care but also passionate about making a positive difference in the lives of our residents.',
          name: 'Compassionate Staff',
        },
        {
          description:
            "We focus on creating a flexible daily routine that fits our residents' preferences and lifestyles. ",
          name: 'Resident-Centered Living',
        },
      ],
      services: [
        {
          name: '24/7 Personalized Care',
        },
        {
          name: 'Medication Management',
        },
        {
          name: 'Nutritional Meal Planning',
        },
        {
          name: 'Housekeeping & Laundry Services',
        },
        {
          name: 'Health Monitoring',
        },
        {
          name: 'Social and Recreational Activities',
        },
        {
          name: 'Respite and Hospice Care',
        },
        {
          name: 'Memory Care for Dementia and Alzheimer’s',
        },
        {
          name: 'Transportation Services',
        },
        {
          name: 'Family Support & Communication',
        },
        {
          name: 'test 123',
        },
      ],
      benefits: [
        {
          name: 'Personalized Care',
        },
        {
          name: '24/7 Support',
        },
        {
          name: 'Home-Like Environment',
        },
        {
          name: 'Trained and Compassionate Staff',
        },
        {
          name: 'Nutritious Meals and Dietary Accommodations',
        },
        {
          name: 'Small Community Setting',
        },
        {
          name: 'Medication Management',
        },
        {
          name: 'Health Monitoring',
        },
        {
          name: 'Engaging Activities',
        },
        {
          name: 'Housekeeping & Laundry',
        },
        {
          name: 'Memory Care Services',
        },
        {
          name: 'Family Communication and Support',
        },
        {
          name: 'Transportation Assistance',
        },
        {
          name: 'Peace of Mind for Families',
        },
        {
          name: 'Flexible Services',
        },
        {
          name: 'test234',
        },
      ],
      testimonials: [
        {
          id: '',
          name: 'Sarah Thompson',
          quote:
            'Finding this Adult Family Home]for my mother was the best decision we ever made. The staff truly cares about her, and the personal attention she receives has made such a difference in her quality of life. It feels like a second family, and we couldn’t be more grateful.',
          photoURL: '',
        },
        {
          id: '',
          name: 'James Rodriguez',
          photoURL: '',
          quote:
            'The moment I stepped into this Adult Family Home, I knew it was the right place for my father. The environment is warm and welcoming, and the caregivers are attentive to his every need. He’s happier and more comfortable here than I ever imagined he could be',
        },
        {
          name: 'Linda Jefferson',
          id: '',
          quote:
            'My sister has been living at this Adult Family Home for over a year now, and the difference is night and day compared to where she was before. The staff here treats her with dignity and respect, and I love how they tailor her care to her specific needs. It’s truly a special place.',
          photoURL: '',
        },
        {
          id: '',
          photoURL:
            'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2Fundefined%2Ftestimonail%2Ftriumph-trident-660-2021-cafe-racer-5k-3840x2160-3143.jpg?alt=media&token=a8b0381d-d5cd-4bc5-82d0-f5f9e085d70f',
          quote: 'Test',
          name: 'Alexander Haugard',
        },
      ],
      employees: [
        {
          name: 'Alex',
          photoURL:
            'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FZ93oAAVwFAwhmdH2lLtB%2Femployee%2FDSC00376-Edit.jpg?alt=media&token=bca8ff47-f638-4ef1-b165-5b449f21c51b',
          id: '',
          bio: '17 years as a software engineer and 10 years as a proffesional photgrapher',
          role: 'Programer/ Designer',
        },
        {
          name: 'Tibi',
          photoURL:
            'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FZ93oAAVwFAwhmdH2lLtB%2Femployee%2FA7407993-Edit.jpg?alt=media&token=6a914025-5a3b-433a-8022-e9596e8ba84a',
          role: 'Marketing Director',
          id: '',
          bio: '20 years experience as Adult Family Home Markeing director and asparing musician',
        },
      ],
      metaTitle:'',
      metaDescription:'',
      metaKeywords:'',
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
        themeType:'demo',
      },
    };
  }
}
