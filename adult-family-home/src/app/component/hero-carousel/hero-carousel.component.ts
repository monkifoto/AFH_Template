import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, BehaviorSubject, from, map, switchMap } from 'rxjs';
import { Business, HeroImage } from 'src/app/model/business-questions.model';
import { WebContentService } from 'src/app/services/web-content.service';
import { BusinessDataService } from 'src/app/services/business-data.service';

declare const bootstrap: any; // Declare bootstrap to use its JS API

@Component({
  selector: 'app-hero-carousel',
  templateUrl: './hero-carousel.component.html',
  styleUrls: ['./hero-carousel.component.css']
})
export class HeroCarouselComponent implements OnInit, OnDestroy {
  businessId!: string;
  business: Business | null = null;
  heroImages: HeroImage[] = [];
  layoutType: string = 'demo';
  private subscriptions = new Subscription();
  private imagesLoaded$ = new BehaviorSubject<boolean>(false); // To track if images are loaded

  private carouselInitialized = false;
  animateText = false; // Control animation
  isScrolled: boolean = false;
  scrollOpacity: number = 1; // Default opacity is fully visible

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private webContentService: WebContentService,
    private businessDataService: BusinessDataService
  ) {}

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = 1200; // Adjust this value for when the carousel is fully faded
    this.scrollOpacity = Math.max(1 - scrollPosition / maxScroll, 0); // Ensure opacity doesn't go below 0
  }

  ngOnInit(): void {
    // Subscribe to business data
    const businessSubscription = this.businessDataService.businessData$.subscribe((business) => {
      if (business) {
        this.business = business;
        this.businessId = this.business?.id ?? '';
        this.layoutType = this.business?.theme?.themeType ?? 'demo';
        this.loadHeroImages(); // Trigger image loading
      }
    });

    this.subscriptions.add(businessSubscription);

    // Initialize carousel after images are loaded
    const imageLoadedSubscription = this.imagesLoaded$.subscribe((loaded) => {
      if (loaded && !this.carouselInitialized) {
        this.initializeCarousel();
        this.animateText = true;
      }
    });

    this.subscriptions.add(imageLoadedSubscription);
  }

  loadHeroImages(): void {
    if (!this.businessId) return; // Avoid fetching without a valid business ID

    const uploadLocation = 'heroImages';

    const imageSubscription = this.webContentService
      .getBusinessUploadedImagesById(this.businessId, uploadLocation)
      .pipe(
        switchMap((images) => {
          const checks = images.map(async (image) => {
            const exists = await this.webContentService.checkImageExists(image.url);
            return exists ? image : null;
          });
          return from(Promise.all(checks));
        }),
        map((images) => images.filter((image) => image !== null))
      )
      .subscribe((images) => {
        this.heroImages = images as HeroImage[];
        console.log('Loaded hero images:', this.heroImages);

        if (this.heroImages.length > 0) {
          this.imagesLoaded$.next(true); // Signal that images are loaded
        }
      });

    this.subscriptions.add(imageSubscription);
  }

  initializeCarousel(): void {
    const carouselElement = document.querySelector('#heroCarousel');
    if (carouselElement) {
      new bootstrap.Carousel(carouselElement, {
        interval: 20000, // 10 seconds
        ride: 'carousel',
      });
      this.carouselInitialized = true;
      console.log('Carousel initialized');
    }
  }

  navigateToContact(id: string | undefined | null): void {
    this.router.navigate(['/contact-us'], { queryParams: { id } });
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions
    this.subscriptions.unsubscribe();
  }
}
