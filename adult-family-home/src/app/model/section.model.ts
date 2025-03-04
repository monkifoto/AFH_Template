export  interface Section {
  subtitleColor: any;
  titleColor: any;
  textColor: any;
  backgroundColor: any;
  fullWidth: false,
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
  showButton?: boolean;
  buttonText: string;
  buttonLink: string;
  sectionImageUrl?: string;
  showImage?:string;
  items?: any[];
  order: number;
  isMinimal:boolean;
  isParallax:boolean;
  alignText:string;
  boxShadow:boolean;
  borderRadius:number;
}
