export  interface Section {
  id?: string;
  sectionType: string;
  sectionName: string;
  sectionStyle:string;
  page: string;
  location: string;
  sectionTitle: string;
  sectionSubTitle?: string;
  sectionContent?: string;
  component: string;
  titleFontSize?: number;
  subtitleFontSize?: number;
  titleFontStyle?: string;
  subtitleFontStyle?: string;
  showLearnMore?: boolean;
  sectionImageUrl?: string;
  showImage?:string;
  items?: any[];
  order: number;
  isMinimal:boolean;
  isParallax:boolean;
}
