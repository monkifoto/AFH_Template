import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { AboutUsComponent } from './component/about-us/about-us.component';
import { ServicesComponent } from './component/services/services.component';
import { ContactUsComponent } from './component/contact-us/contact-us.component';
import { NavigationComponent } from './component/navigation/navigation.component';
import { environment } from 'src/environments/environment.prod';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { provideStorage, getStorage} from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SplitCommaPipe } from './pipe/split-comma.pipe';
import { MeetTheTeamComponent } from './component/meet-the-team/meet-the-team.component';
import { FooterComponent } from './component/footer/footer.component';
import { EditBusinessComponent } from './admin/edit-business/edit-business.component';
import { RouterModule } from '@angular/router';
import { HeroCarouselComponent } from './component/hero-carousel/hero-carousel.component';
import { PhotoGalleryComponent } from './component/photo-gallery/photo-gallery.component';
import { PhotoGalleryUploadComponent } from './admin/photo-gallery-upload/photo-gallery-upload.component';
import { ImageViewerModalComponent } from './component/image-viewer-modal/image-viewer-modal.component';
import { ConfirmationDialogComponent } from './component/confirmation-dialog/confirmation-dialog.component';
import { TestimonialsComponent } from './component/testimonials/testimonials.component';
import { InformationComponent } from './component/information/information.component';
import { OurServicesHomeComponent } from './component/our-services-home/our-services-home.component';
import { WelcomeComponent } from './component/welcome/welcome.component';
import { ConsultationComponent } from './component/consultation/consultation.component';
import { FeaturesComponent } from './component/features/features.component';
import { WhyUsComponent } from './component/why-us/why-us.component';
import { MapIframeComponent } from './component/map-iframe/map-iframe.component';



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
    HeroCarouselComponent,
    PhotoGalleryComponent,
    PhotoGalleryUploadComponent,
    ImageViewerModalComponent,
    ConfirmationDialogComponent,
    TestimonialsComponent,
    InformationComponent,
    OurServicesHomeComponent,
    WelcomeComponent,
    ConsultationComponent,
    FeaturesComponent,
    WhyUsComponent,
    MapIframeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(()=> initializeApp(environment.firebase)),
    provideFirestore(()=>getFirestore()),
    provideStorage(()=> getStorage()),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
