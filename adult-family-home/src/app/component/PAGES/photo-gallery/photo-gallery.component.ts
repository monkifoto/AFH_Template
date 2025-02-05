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

  heroImages: any[] = [];
  images: any[] = [];
  businessImages: any[] = [];
  lifeStyleImages: any[] = [];
  employeeImages: any[] = [];

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
        this.loadImages();
        this.metaService.loadAndApplyMeta(this.businessId);
      }
    });
  }



  closeLightbox() {
    this.selectedImageUrl = null;
  }

  // loadImages(): void {
  //   type GalleryTarget = 'heroImages' | 'images' | 'businessImages' | 'lifeStyleImages' | 'employeeImages';

  //   const imageCategories: { key: string; target: GalleryTarget }[] = [
  //     { key: 'heroImages', target: 'heroImages' },
  //     { key: 'gallery', target: 'images' },
  //     { key: 'business', target: 'businessImages' },
  //     { key: 'lifeStyle', target: 'lifeStyleImages' },
  //     { key: 'employee', target: 'employeeImages' },
  //   ];

  //   imageCategories.forEach(({ key, target }) => {
  //     this.webContent.getBusinessUploadedImagesById(this.businessId, key).pipe(
  //       switchMap((images) => {
  //         const checks = images.map(async (image) => {
  //           const exists = await this.webContent.checkImageExists(image.url);
  //           return exists ? image : null; // Return image only if it exists
  //         });

  //         return from(Promise.all(checks));
  //       }),
  //       map((images) => images.filter((image) => image !== null))
  //     ).subscribe((filteredImages) => {
  //       this[target] = filteredImages.map(img => ({
  //         ...img,
  //         title: img.title || '',
  //         description: img.description || '',
  //         order: img.order || '',
  //         link: img.link || ''

  //       }));
  //     });
  //   });
  // }
  loadImages(): void {
    type GalleryTarget = 'heroImages' | 'images' | 'businessImages' | 'lifeStyleImages' | 'employeeImages';

    const imageCategories: { key: string; target: GalleryTarget }[] = [
      { key: 'heroImages', target: 'heroImages' },
      { key: 'gallery', target: 'images' },
      { key: 'business', target: 'businessImages' },
      { key: 'lifeStyle', target: 'lifeStyleImages' },
      { key: 'employee', target: 'employeeImages' },
    ];

    imageCategories.forEach(({ key, target }) => {
      this.webContent.getBusinessUploadedImagesById(this.businessId, key).pipe(
        switchMap((images) => {
          console.log(`Raw Firestore images for ${key}:`, images); // Debugging Step 1

          // Convert async calls to a Promise array
          const checks = images.map(async (image) => {
            const exists = await this.webContent.checkImageExists(image.url);
            return exists ? image : null;
          });

          return from(Promise.all(checks));
        }),
        map((images) => images.filter((image) => image !== null)),
        map((filteredImages) => {
          console.log(`Filtered images for ${target}:`, filteredImages); // Debugging Step 2

          return filteredImages
            .map(img => ({
              url: img.url,
              title: img.title || 'No Title',
              description: img.description || 'No Description',
              link: img.link || 'No Link',
              order: !isNaN(Number(img.order)) ? Number(img.order) : 999 // Ensure valid number
            }))
            .sort((a, b) => a.order - b.order);
        })
      ).subscribe((sortedImages) => {
        console.log(`Sorted images for ${target}:`, sortedImages); // Debugging Step 3

        // Ensure target exists
        if (!this[target]) {
          this[target] = [];
        }

        this[target] = sortedImages;
      });
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
