import { NgModule, inject, provideAppInitializer } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { AboutUsComponent } from './component/PAGES/about-us/about-us.component';
import { ServicesComponent } from './component/PAGES/services/services.component';
import { ContactUsComponent } from './component/PAGES/contact-us/contact-us.component';
import { NavigationComponent } from './component/navigation/navigation.component';
import { environment } from 'src/environments/environment.prod';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { SplitCommaPipe } from './pipe/split-comma.pipe';
import { MeetTheTeamComponent } from './component/UI/meet-the-team/meet-the-team.component';
import { FooterComponent } from './component/footer/footer.component';
import { EditBusinessComponent } from './admin/edit-business/edit-business.component';
import { RouterModule } from '@angular/router';
// import { HeroCarouselComponent } from './component/hero-carousel/hero-carousel.component';
import { PhotoGalleryComponent } from './component/PAGES/photo-gallery/photo-gallery.component';
import { PhotoGalleryUploadComponent } from './admin/photo-gallery-upload/photo-gallery-upload.component';
import { ImageViewerModalComponent } from './component/image-viewer-modal/image-viewer-modal.component';
import { ConfirmationDialogComponent } from './component/UI/confirmation-dialog/confirmation-dialog.component';
import { TestimonialsComponent } from './component/testimonials/testimonials.component';
import { InformationComponent } from './component/UI/Deprecated/information/information.component';
import { OurServicesHomeComponent } from './component/our-services-home/our-services-home.component';
import { ConsultationComponent } from './component/UI/consultation/consultation.component';
import { FeaturesComponent } from './component/UI/features/features.component';
import { WhyUsComponent } from './component/UI/why-us/why-us.component';
import { BasicInfoComponent } from './admin/basic-info/basic-info.component';
import { EmployeeComponent } from './admin/employee/employee.component';
import { PhotosComponent } from './admin/photos/photos.component';
import { ReviewsComponent } from './admin/reviews/reviews.component';
import { ServicesPageComponent } from './admin/services-page/services-page.component';
import { SectionManagerComponent } from './admin/section-manager/section-manager.component';
import { ContactUsPageComponent } from './admin/contact-us-page/contact-us-page.component';
import { ColorAdminComponent } from './admin/color-admin/color-admin.component';
import { ThemeInitializerService } from './services/theme-initializer.service';
import { BusinessDataService } from './services/business-data.service';
import { ResidentIntakeFormComponent } from './component/PAGES/resident-intake-form/resident-intake-form.component';
import { CenterTextComponent } from './component/UI/center-text/center-text.component';
import { RightTextComponent } from './component/UI/right-text/right-text.component';
import { LeftTextComponent } from './component/UI/left-text/left-text.component';
import { ItemListComponent } from './component/UI/item-list/item-list.component';
import { IconListComponent } from './component/UI/Deprecated/icon-list/icon-list.component';
import { HeroComponent } from './component/UI/hero/hero.component';
import { TestimonialImageComponent } from './component/UI/testimonial-image/testimonial-image.component';
import { CallToActionComponent } from './component/UI/call-to-action/call-to-action.component';
<<<<<<< HEAD
import { UiTestComponent } from './component/UI/DEMO COMPONENTS/ui-test/ui-test.component';
=======
import { UiTestComponent } from './component/UI/ui-test/ui-test.component';
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
import { TestimonialsListComponent } from './component/PAGES/testimonials/testimonials.component';
import { ParallaxTextComponent } from './component/UI/parallax-text/parallax-text.component';
import { StatsComponent } from './component/UI/stats/stats.component';
import { HeroSliderComponent } from './component/UI/hero-slider/hero-slider.component';
import { ExpandableNavigationComponent } from './component/UI/expandable-navigation/expandable-navigation.component';
import { TestimonialCarouselComponent } from './component/UI/testimonial-carousel/testimonial-carousel.component';
import { AdminHeroSliderComponent } from './admin/admin-hero-slider/admin-hero-slider.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleMapsComponent } from './component/UI/google-maps/google-maps.component';
import { GoogleReviewsComponent } from './component/UI/Deprecated/google-reviews/google-reviews.component';
import { InstagramFeedComponent } from './component/UI/Deprecated/instagram-feed/instagram-feed.component';
import { SectionTitleComponent } from './component/UI/section-title/section-title.component';
import { VideoComponent } from './component/UI/video/video.component';
import { Tour3DComponent } from './component/UI/tour-3-d/tour-3-d.component';
import { SectionFilterPipe } from './pipe/section-filter.pipe';
import { ReplaceKeywordPipe } from './pipe/replace-keyword.pipe';
import { LatestProductsComponent } from './component/UI/latest-products/latest-products.component';
import { FaqComponent } from './component/UI/faq/faq.component';
import { SpGalleryComponentComponent } from './component/UI/sp-gallery-component/sp-gallery-component.component';
import { SpContactUsComponentComponent } from './component/UI/sp-contact-us-component/sp-contact-us-component.component';
import { SpHeroComponentComponent } from './component/UI/sp-hero-component/sp-hero-component.component';
import { DynamicThemeLoaderComponent } from './component/dynamic-theme-loader/dynamic-theme-loader.component';
import { SafeUrlPipe } from './pipe/safe-url.pipe';
import { BusinessLocationsComponent } from './admin/business-locations/business-locations.component';
import { LocationPageComponent } from './component/PAGES/location-page/location-page.component';
import { PhoneFormatPipe } from './pipe/phone-format.pipe';
import { ItemListImageComponent } from './component/UI/item-list-image/item-list-image.component';
import { HeroManagerComponent } from './admin/hero-manager/hero-manager.component';
import { TextWrapperComponent } from './component/text-wrapper/text-wrapper.component';
<<<<<<< HEAD
import { BloatingBubblesComponent } from './component/UI/DEMO COMPONENTS/bloating-bubbles/bloating-bubbles.component';
import { SERVER_REQUEST } from './tokens/server-request.token';
import { Request } from 'express';
import { MetaService } from './services/meta-service.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LoginComponent } from './admin/login/login.component';
import { firstValueFrom } from 'rxjs';
=======
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4


    // Map hostnames to business IDs
    const businessIdMap: { [key: string]: string } = {
      "helpinghandafh.com": "vfCMoPjAu2ROVBbKvk0D",
      "www.helpinghandafh.com": "vfCMoPjAu2ROVBbKvk0D",

      "aefamilyhome.com": "UiSDf9elSjwcbQs2HZb1",
      "www.aefamilyhome.com": "UiSDf9elSjwcbQs2HZb1",

      'elderlyhomecareafh.com':'SJgFxBYkopnPR4WibCAf',
      'www.elderlyhomecareafh.com':'SJgFxBYkopnPR4WibCAf',

      "prestigecareafh.com": "pDJgpl34XUnRblyIlBA7",
      "www.prestigecareafh.com": "pDJgpl34XUnRblyIlBA7",

      "countrycrestafh.com": "yrNc50SvfPqwTSkvvygA",
      "www.countrycrestafh.com": "yrNc50SvfPqwTSkvvygA",

      "sbmediahub.com": "MGou3rzTVIbP77OLmZa7",
      "sp.sbmediahub.com": "KyQfU7hjez0uXRfAjqcu",
      "elderlyhc.sbmediahub.com": "SJgFxBYkopnPR4WibCAf",
      "prestige.sbmediahub.com": "pDJgpl34XUnRblyIlBA7",
      "cc.sbmediahub.com": "yrNc50SvfPqwTSkvvygA",
      "hh.sbmediahub.com": "vfCMoPjAu2ROVBbKvk0D",
      "ae.sbmediahub.com": "UiSDf9elSjwcbQs2HZb1",
      "www.sbmediahub.com": "MGou3rzTVIbP77OLmZa7",
    };


<<<<<<< HEAD
    export function initializerFactory() {
      const req = inject(SERVER_REQUEST, { optional: true }) as Request | undefined;
      const themeService = inject(ThemeInitializerService);
      const businessDataService = inject(BusinessDataService);
      const metaService = inject(MetaService);
      const platformId = inject(PLATFORM_ID);

      let hostname = '';
      let businessId = '';

      if (req) {
        const idRaw = req.query['id'];
        const idParam = Array.isArray(idRaw) ? idRaw[0] : idRaw;
        hostname = req.hostname;
        businessId = String(businessIdMap[hostname] || idParam || 'MGou3rzTVIbP77OLmZa7');
      } else if (isPlatformBrowser(platformId)) {
        const url = new URL(window.location.href);
        hostname = window.location.hostname;
        businessId = businessIdMap[hostname] || url.searchParams.get('id') || 'MGou3rzTVIbP77OLmZa7';
      } else {
        // SSR fallback
        hostname = '';
        businessId = 'MGou3rzTVIbP77OLmZa7';
      }

      return async () => {
        console.log('✅ Initializing app...');

        // Always load theme (SSR-safe)
        try {
          await themeService.loadTheme(businessId);
        } catch (err) {
          console.error('❌ Theme error:', err);
        }

        // 🛑 Block this part during SSR to avoid Firebase issues
        if (isPlatformBrowser(platformId)) {
          try {
            const business = await firstValueFrom(businessDataService.loadBusinessData(businessId));
            if (business) {
              console.log('✅ Meta: Setting tags for', business.businessName);
              metaService.updateMetaTags({
                title: business.metaTitle || business.businessName || 'Default Title',
                description: business.metaDescription || 'Caring and comfort.',
                keywords: business.metaKeywords || 'adult care, family home, Renton, Kent',
                image: business.metaImage || '/assets/default-og.jpg',
                url: business.businessURL || `https://${hostname}`
              });
            }
          } catch (err) {
            console.error('❌ Business data error:', err);
          }
        } else {
          console.log('⛔ Skipped businessData load on SSR');
        }
      };
    }

    // export function initializerFactory() {
    //   const req = inject(SERVER_REQUEST, { optional: true }) as Request | undefined;
    //   const themeService = inject(ThemeInitializerService);
    //   const platformId = inject(PLATFORM_ID);

    //   let businessId = 'MGou3rzTVIbP77OLmZa7';

    //   // SSR-safe ID resolution
    //   if (req) {
    //     const idRaw = req.query['id'];
    //     const idParam = Array.isArray(idRaw) ? idRaw[0] : idRaw;
    //     businessId = (idParam as string) || businessId;
    //   } else if (isPlatformBrowser(platformId)) {
    //     const url = new URL(window.location.href);
    //     businessId = url.searchParams.get('id') || businessId;
    //   }

    //   return async () => {
    //     console.log('✅ AppInitializer running with businessId:', businessId);

    //     try {
    //       await themeService.loadTheme(businessId);
    //       console.log('✅ Theme loaded');
    //     } catch (err) {
    //       console.error('❌ Theme error:', err);
    //     }

    //     console.log('✅ AppInitializer complete (safe mode)');
    //   };
    // }
=======
    // export function themeInitializerFactory() {
    //   const themeService = inject(ThemeInitializerService);
    //   const location = inject(Location);
    //   const router = inject(Router);

    //   const hostname = window.location.hostname;
    //   const url = new URL(window.location.href);
    //   const businessId = businessIdMap[hostname] || url.searchParams.get('id') || 'MGou3rzTVIbP77OLmZa7';

    //   return () => themeService.loadTheme(businessId);
    // }

    // // ✅ Initializer for business data
    // export function initializeBusinessDataFactory() {
    //   const businessDataService = inject(BusinessDataService);
    //   const location = inject(Location);
    //   const router = inject(Router);

    //   const hostname = window.location.hostname;
    //   const url = new URL(window.location.href);
    //   const businessId = businessIdMap[hostname] || url.searchParams.get('id') || 'MGou3rzTVIbP77OLmZa7';

    //   return () =>
    //     businessDataService.loadBusinessData(businessId).toPromise().catch((err) => {
    //       console.error('Error loading business data:', err);
    //     });
    // }

// export function combinedInitializer(
//   themeInitializer: ThemeInitializerService,
//   businessDataService: BusinessDataService,
//   location: Location,
//   router: Router
// ): () => Promise<void> {
//   return async () => {
//     // Initialize theme
//     const hostname = window.location.hostname;
//     const url = new URL(window.location.href);
//     let businessId = businessIdMap[hostname] || url.searchParams.get('id') || 'MGou3rzTVIbP77OLmZa7';

//     await themeInitializer.loadTheme(businessId);

//     // Initialize business data
//     try {
//       await businessDataService.loadBusinessData(businessId).toPromise();
//       console.log("Business data loaded successfully");
//     } catch (error) {
//       console.error("Error loading business data:", error);
//     }
//   };
// }
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutUsComponent,
    ServicesComponent,
    ContactUsComponent,
    NavigationComponent,
    SplitCommaPipe,
    MeetTheTeamComponent,
    FooterComponent,
    EditBusinessComponent,
    PhotoGalleryComponent,
    PhotoGalleryUploadComponent,
    ImageViewerModalComponent,
    ConfirmationDialogComponent,
    TestimonialsComponent,
    InformationComponent,
    OurServicesHomeComponent,
    ConsultationComponent,
    FeaturesComponent,
    WhyUsComponent,
    BasicInfoComponent,
    EmployeeComponent,
    PhotosComponent,
    ReviewsComponent,
    ServicesPageComponent,
    SectionManagerComponent,
    ContactUsPageComponent,
    ColorAdminComponent,
    ResidentIntakeFormComponent,
    CenterTextComponent,
    RightTextComponent,
    LeftTextComponent,
    ItemListComponent,
    IconListComponent,
    HeroComponent,
    TestimonialImageComponent,
    CallToActionComponent,
    UiTestComponent,
    TestimonialsListComponent,
    ParallaxTextComponent,
    StatsComponent,
    HeroSliderComponent,
    ExpandableNavigationComponent,
    TestimonialCarouselComponent,
    AdminHeroSliderComponent,
    GoogleMapsComponent,
    GoogleReviewsComponent,
    InstagramFeedComponent,
    SectionTitleComponent,
    VideoComponent,
    Tour3DComponent,
    SectionFilterPipe,
    ReplaceKeywordPipe,
    LatestProductsComponent,
    FaqComponent,
    SpGalleryComponentComponent,
    SpContactUsComponentComponent,
    SpHeroComponentComponent,
    DynamicThemeLoaderComponent,
    SafeUrlPipe,
    BusinessLocationsComponent,
    LocationPageComponent,
    PhoneFormatPipe,
    ItemListImageComponent,
    HeroManagerComponent,
<<<<<<< HEAD
    TextWrapperComponent,
    BloatingBubblesComponent,
    LoginComponent
=======
    TextWrapperComponent
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
<<<<<<< HEAD
    // BrowserModule.withServerTransition({ appId: 'serverApp' }),
  ],
  providers: [
     provideFirebaseApp(() => initializeApp(environment.firebase)),
     provideFirestore(() => getFirestore()),
     provideStorage(() => getStorage()),
     provideAuth(() => getAuth()),
    provideAppInitializer(() => initializerFactory()())
=======
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()),

    provideAppInitializer(() => {
      const themeService = inject(ThemeInitializerService);
      const location = inject(Location);
      const router = inject(Router);

      const hostname = window.location.hostname;
      const url = new URL(window.location.href);
      const businessId = businessIdMap[hostname] || url.searchParams.get('id') || 'MGou3rzTVIbP77OLmZa7';

      return themeService.loadTheme(businessId).catch((err) => {
        console.error('Error loading theme:', err);
      });
    }),

    provideAppInitializer(() => {
      const themeService = inject(ThemeInitializerService);
      const businessDataService = inject(BusinessDataService);
      const location = inject(Location);
      const router = inject(Router);
      const hostname = window.location.hostname;
      const url = new URL(window.location.href);
      const businessId = businessIdMap[hostname] || url.searchParams.get('id') || 'MGou3rzTVIbP77OLmZa7';

      return (async () => {
        try {
          await themeService.loadTheme(businessId);
        } catch (err) {
          console.error('Error loading theme:', err);
        }

        try {
          await businessDataService.loadBusinessData(businessId).toPromise();
        } catch (err) {
          console.error('Error loading business data:', err);
        }
      })();
    }),
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
