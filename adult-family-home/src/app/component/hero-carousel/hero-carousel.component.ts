import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { from, map, switchMap } from 'rxjs';
import { Business, HeroImage } from 'src/app/model/business-questions.model';
import { WebContentService } from 'src/app/services/web-content.service';
import { BusinessDataService } from 'src/app/services/business-data.service';
@Component({
  selector: 'app-hero-carousel',
  templateUrl: './hero-carousel.component.html',
  styleUrls: ['./hero-carousel.component.css']
})
export class HeroCarouselComponent implements OnInit {
  businessId!: string;
  business: Business | null= null; ;
  heroImages: HeroImage[] = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private webContentService: WebContentService,
    private businessDataService: BusinessDataService) {}

  ngOnInit(): void {

    this.businessDataService.businessData$.subscribe((business) => {
      this.business = business;
      this.businessId = this.business?.id || '';
      if (this.business) {
        console.log("Hero Section busines id:", this.business.id);
        this.loadHeroImages();
      }
    });
  }

  loadHeroImages(): void {
    const uploadLocation = 'heroImages'; // This is the folder in Firestore where the images are stored
    this.webContentService.getBusinessUploadedImagesById(this.businessId, uploadLocation).pipe(
      switchMap(images => {

        // Create an array of observables that check if the image exists
        const checks = images.map(async image => {
          const exists = await this.webContentService.checkImageExists(image.url);
          return exists ? image : null;  // Return image only if it exists
        });

        return from(Promise.all(checks));
      }),
      map(images =>images.filter(image => image !== null))
    ).subscribe(images => {
        this.heroImages = images; // Store the retrieved images
        //console.log("Number of images: ",this.heroImages.length);

        this.heroImages.forEach(element => {
         console.log(element.url);

        });
      });

  }

navigateToContact(id: string | undefined | null) {
  this.router.navigate(['/contact-us'], { queryParams: { id } });
}

}
