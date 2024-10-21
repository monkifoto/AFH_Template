import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { from, map, switchMap } from 'rxjs';
import { Business, HeroImage } from 'src/app/model/business-questions.model';
import { WebContentService } from 'src/app/services/web-content.service';

@Component({
  selector: 'app-hero-carousel',
  templateUrl: './hero-carousel.component.html',
  styleUrls: ['./hero-carousel.component.css']
})
export class HeroCarouselComponent implements OnInit {
  businessId!: string;
  business!: Business | undefined;
  heroImages: HeroImage[] = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private webContentService: WebContentService) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.businessId = params['id'];
      this.webContentService.getBusinessData(this.businessId).subscribe(data => {
        if (data) {
          this.business = data;
          this.loadHeroImages();
        }
      });
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
         // console.log(element.altText);

        });
      });

  }

navigateToContact(id: string | undefined | null) {
  this.router.navigate(['/contact-us'], { queryParams: { id } });
}

}
