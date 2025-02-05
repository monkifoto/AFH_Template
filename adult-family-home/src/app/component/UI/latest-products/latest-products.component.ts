import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-latest-products',
  templateUrl: './latest-products.component.html',
  styleUrls: ['./latest-products.component.css']
})
export class LatestProductsComponent implements OnInit {
  @Input() layoutType: string = '';
  @Input() companies: { title: string; description: string; category: string; companyLogo?: string; link?: string, image:string; url:string;}[] = [
    {
    title: 'Ready Meds Farmacy',
    companyLogo: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FSJgFxBYkopnPR4WibCAf%2Fbusiness%2FReadMedsPharmacy.png?alt=media&token=3858e8a9-29b5-4497-ae67-976fabd34add',
    category: '',
    description: 'Ready Meds Pharmacy is a full-service long-term care pharmacy serving adult family homes, assisted living and long-term care facilities, as well as patients living independently.',
    image: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FSJgFxBYkopnPR4WibCAf%2Fbusiness%2FReadMedsPharmacy.png?alt=media&token=3858e8a9-29b5-4497-ae67-976fabd34add',
    url: 'https://www.readymedspharmacy.com/'
  },
  {
    title: 'Novari Primary Care',
    companyLogo: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FSJgFxBYkopnPR4WibCAf%2Fbusiness%2Fnovariprimarycar.png?alt=media&token=452b5c99-472b-4ca7-bf3d-07011e1ffba2',
    category: '',
    description: 'Novari Primary Care is a mobile primary care service designed to treat patients in the comfort of their residential care facility.',
    image: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FSJgFxBYkopnPR4WibCAf%2Fbusiness%2Fnovariprimarycar.png?alt=media&token=452b5c99-472b-4ca7-bf3d-07011e1ffba2',
    url: 'https://novariprimarycare.com'
  },
  {
    title: 'Holistia Health',
    companyLogo: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FSJgFxBYkopnPR4WibCAf%2Fbusiness%2Fhh3-logo2-WIDE.webp?alt=media&token=053879e9-bd0d-44cc-9a08-d2e298f0eb45',
    category: '',
    description: 'Holistia Health offers encompass personalized, in-person, and online programs, along with talk therapy and medication management.',
    image: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FSJgFxBYkopnPR4WibCAf%2Fbusiness%2Fhh3-logo2-WIDE.webp?alt=media&token=053879e9-bd0d-44cc-9a08-d2e298f0eb45',
    url: 'https://holistiahealth.com'
  }


   ];
  @Input() products: { title: string; description: string; category: string; companyLogo?: string; link?: string, image:string; url:string; }[] = [ {
    title: 'Single Page Website',
    companyLogo: '',
    category: '$799',
    description: 'Simple, clean, and effective online presence',
    image: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FMGou3rzTVIbP77OLmZa7%2FheroImages%2FA7400076.jpg?alt=media&token=1132bd32-3d2c-4f52-be31-3759c20b5285',
     url: 'https://www.readymedspharmacy.com/'
  },
  {
    title: 'Essentials Website',
    companyLogo: '',
    category: '$1500',
    description: 'Comprehensive design with key pages for your home',
    image: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FMGou3rzTVIbP77OLmZa7%2FheroImages%2FDJI_0061.jpg?alt=media&token=24aa3da1-a50d-47ec-89ae-588eb13e42a9',
     url: 'https://www.readymedspharmacy.com/'
  },
  {
    title: 'Custom Lux Website',
    companyLogo: '',
    category: 'Pricing varies',
    description: 'Unique design, professional photos/videos, logo & business card design',
    image: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FMGou3rzTVIbP77OLmZa7%2FheroImages%2FDJI_0713%20DTE-Edit.jpg?alt=media&token=31151dd0-c6fb-4cc1-acf8-eb50d617d318',
     url: 'https://www.readymedspharmacy.com/'
  }];

  displayItems: any[] = [];

  ngOnInit(): void {
    this.displayItems = this.layoutType === 'sb' ? this.products : this.companies;
  }

}
