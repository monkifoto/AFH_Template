import { Component } from '@angular/core';

@Component({
  selector: 'app-latest-products',
  templateUrl: './latest-products.component.html',
  styleUrls: ['./latest-products.component.css']
})
export class LatestProductsComponent {
  products = [
    {
      title: 'Single Page Website',
      category: '$799',
      description: 'Simple, clean, and effective online presence',
      image: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FMGou3rzTVIbP77OLmZa7%2FheroImages%2FA7400076.jpg?alt=media&token=1132bd32-3d2c-4f52-be31-3759c20b5285'
    },
    {
      title: 'Essentials Website',
      category: '$1500',
      description: 'Comprehensive design with key pages for your home',
      image: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FMGou3rzTVIbP77OLmZa7%2FheroImages%2FDJI_0061.jpg?alt=media&token=24aa3da1-a50d-47ec-89ae-588eb13e42a9'
    },
    {
      title: 'Custom Lux Website',
      category: 'Pricing varies',
      description: 'Unique design, professional photos/videos, logo & business card design',
      image: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FMGou3rzTVIbP77OLmZa7%2FheroImages%2FDJI_0713%20DTE-Edit.jpg?alt=media&token=31151dd0-c6fb-4cc1-acf8-eb50d617d318'
    }
  ];
}
