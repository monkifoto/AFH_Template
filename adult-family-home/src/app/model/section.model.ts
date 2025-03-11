export  interface Section {
  id?: string;
  order: number;
  page: string;
  location: string;
  component: string;

  isActive: boolean,

  sectionTitle: string;
  titleFontStyle?: string;
  titleFontSize?: number;
  titleColor: any;

  sectionSubTitle?: string;
  subtitleColor: any;
  subtitleFontSize?: number;
  subtitleFontStyle?: string;

  alignText:string;
  textColor: any;
  sectionContent?: string;

  items?: any[];

  showButton?: boolean;
  buttonText: string;
  buttonLink: string;

  sectionImageUrl?: string;
  showImage?:string;

  isMinimal:boolean;
  isParallax:boolean;
  fullWidth: boolean,
  backgroundColor: any;
  boxShadow:boolean;
  borderRadius:number;
}
