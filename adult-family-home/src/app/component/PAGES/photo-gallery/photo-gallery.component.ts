import { Component, OnInit, Input } from '@angular/core';
import { from, map, Observable, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { WebContentService } from 'src/app/services/web-content.service';
import { Business } from 'src/app/model/business-questions.model';
import { MetaService } from 'src/app/services/meta-service.service';
import { BusinessDataService } from 'src/app/services/business-data.service';

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.css']
})
export class PhotoGalleryComponent implements OnInit {
  @Input()
  businessId!: string;
  images!: any[];
  business: Business | null = null;
  selectedImageUrl: string | null = null;
  layoutType: string = 'demo';

  constructor(
    private businessDataService: BusinessDataService,
    private route: ActivatedRoute,
    private webContent: WebContentService,
    private metaService: MetaService,
    private router: Router){}

  ngOnInit(): void {
    this.businessDataService.businessData$.subscribe((business) => {
      this.business = business;
      this.layoutType = business?.theme.themeType || '';
      if (business?.id) {
        this.businessId = business.id;

        this.metaService.getMetaData(business.id).subscribe((metaData: { title: string; description: string; keywords: string }) => {
          this.metaService.updateMetaTags(metaData);
          this.loadImages();
        });
      }
    });
  }



  closeLightbox() {
    this.selectedImageUrl = null;
  }

  loadImages(): void {
    this.webContent.getBusinessGalleryImagesById(this.businessId).pipe(
      switchMap(images => {
        // Create an array of observables that check if the image exists
        const checks = images.map(async image => {
          const exists = await this.webContent.checkImageExists(image.url);
          return exists ? image : null;  // Return image only if it exists
        });

        // Resolve all checks
        return from(Promise.all(checks));
      }),
      map(images => images.filter(image => image !== null))  // Filter out null values
    ).subscribe(filteredImages => {
      this.images = filteredImages;
    });

  }


  onImageClick(imageUrl: string) {
    this.selectedImageUrl = imageUrl;
  }

  onCloseModal() {
    this.selectedImageUrl = null;
  }


  navigateToContact(id: string | null | undefined) {
    //console.log('navigateToContact id', id);
    this.router.navigate(['/contact-us'], { queryParams: { id } });
  }

}
