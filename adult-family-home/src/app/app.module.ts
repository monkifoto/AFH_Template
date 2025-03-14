import { APP_INITIALIZER, NgModule } from '@angular/core';
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
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { InformationComponent } from './component/UI/information/information.component';
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
import { IconListComponent } from './component/UI/icon-list/icon-list.component';
import { HeroComponent } from './component/UI/hero/hero.component';
import { TestimonialImageComponent } from './component/UI/testimonial-image/testimonial-image.component';
import { CallToActionComponent } from './component/UI/call-to-action/call-to-action.component';
import { UiTestComponent } from './component/UI/ui-test/ui-test.component';
import { TestimonialsListComponent } from './component/PAGES/testimonials/testimonials.component';
import { ParallaxTextComponent } from './component/UI/parallax-text/parallax-text.component';
import { ParallaxStatsComponent } from './component/UI/parallax-stats/parallax-stats.component';
import { HeroSliderComponent } from './component/UI/hero-slider/hero-slider.component';
import { ExpandableNavigationComponent } from './component/UI/expandable-navigation/expandable-navigation.component';
import { TestimonialCarouselComponent } from './component/UI/testimonial-carousel/testimonial-carousel.component';
import { AdminHeroSliderComponent } from './admin/admin-hero-slider/admin-hero-slider.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleMapsComponent } from './component/UI/google-maps/google-maps.component';
import { GoogleReviewsComponent } from './component/UI/google-reviews/google-reviews.component';
import { InstagramFeedComponent } from './component/UI/instagram-feed/instagram-feed.component';
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


    // Map hostnames to business IDs
    const businessIdMap: { [key: string]: string } = {
      "helpinghandafh.com": "vfCMoPjAu2ROVBbKvk0D",
      "www.helpinghandafh.com": "vfCMoPjAu2ROVBbKvk0D",
      "aefamilyhome.com": "UiSDf9elSjwcbQs2HZb1",
      "www.aefamilyhome.com": "UiSDf9elSjwcbQs2HZb1",
      "sbmediahub.com": "MGou3rzTVIbP77OLmZa7",
      "sp.sbmediahub.com": "KyQfU7hjez0uXRfAjqcu",
      "prestige.sbmediahub.com": "pDJgpl34XUnRblyIlBA7",
      "cc.sbmediahub.com": "yrNc50SvfPqwTSkvvygA",
      "hh.sbmediahub.com": "vfCMoPjAu2ROVBbKvk0D",
      "ae.sbmediahub.com": "UiSDf9elSjwcbQs2HZb1",
      "www.sbmediahub.com": "MGou3rzTVIbP77OLmZa7",
      "countrycrestafh.com": "yrNc50SvfPqwTSkvvygA",
      "www.countrycrestafh.com": "yrNc50SvfPqwTSkvvygA"

    };


export function themeInitializerFactory(
  themeInitializer: ThemeInitializerService,
  location: Location,
  router: Router
): () => Promise<void> {
  return () => {
    // Get the current hostname
    const hostname = window.location.hostname;
    // Use URL query parameters as fallback
    const url = new URL(window.location.href);
    let businessId = businessIdMap[hostname] || url.searchParams.get('id') || 'MGou3rzTVIbP77OLmZa7';

    console.log("themeInitializerFactory app.module businessId: " +  businessId + ' - hostname: ' + hostname);
    // Pass the businessId to ThemeInitializerService
    return themeInitializer.loadTheme(businessId);
  };
}

export function initializeBusinessData(
  businessDataService: BusinessDataService,
  location: Location,
  router: Router
) {
  const hostname = window.location.hostname;
  const url = new URL(window.location.href);
  let businessId = businessIdMap[hostname] || url.searchParams.get('id') || 'MGou3rzTVIbP77OLmZa7';
  // Get business ID based on hostname or fallback to default
  // const businessId = businessIdMap[hostname] || "Z93oAAVwFAwhmdH2lLtB"; // Default ID
  console.log("initializeBusinessData app.module businessId:: " +  businessId + ' - hostname: ' + hostname)

  return () => {
    businessDataService.loadBusinessData(businessId).toPromise().then(() => {
      console.log("Business data loaded successfully");
    }).catch(error => {
      console.error("Error loading business data:", error);
    });
  };
}

export function combinedInitializer(
  themeInitializer: ThemeInitializerService,
  businessDataService: BusinessDataService,
  location: Location,
  router: Router
): () => Promise<void> {
  return async () => {
    // Initialize theme
    const hostname = window.location.hostname;
    const url = new URL(window.location.href);
    let businessId = businessIdMap[hostname] || url.searchParams.get('id') || 'MGou3rzTVIbP77OLmZa7';

    await themeInitializer.loadTheme(businessId);

    // Initialize business data
    try {
      await businessDataService.loadBusinessData(businessId).toPromise();
      console.log("Business data loaded successfully");
    } catch (error) {
      console.error("Error loading business data:", error);
    }
  };
}

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
    ParallaxStatsComponent,
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
    LocationPageComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: themeInitializerFactory,
      deps: [ThemeInitializerService, Location, Router],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeBusinessData,
      deps: [BusinessDataService, Location, Router],
      multi: true
    }
  ],
  // providers: [
  //   {
  //     provide: APP_INITIALIZER,
  //     useFactory: combinedInitializer,
  //     deps: [ThemeInitializerService, BusinessDataService, Location, Router],
  //     multi: true
  //   }
  // ],
  bootstrap: [AppComponent],
})
export class AppModule {}
