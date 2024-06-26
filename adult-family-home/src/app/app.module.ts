import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { AboutUsComponent } from './component/about-us/about-us.component';
import { ServicesComponent } from './component/services/services.component';
import { ContactUsComponent } from './component/contact-us/contact-us.component';
import { NavigationComponent } from './component/navigation/navigation.component';
import { BusinessFormComponent } from './component/admin/business-form/business-form.component';
import { BusinessListComponent } from './component/admin/business-list/business-list.component';
import { BusinessQuestionFormComponent } from './component/admin/business-question-form/business-question-form.component';
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



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutUsComponent,
    ServicesComponent,
    ContactUsComponent,
    NavigationComponent,
    BusinessFormComponent,
    BusinessListComponent,
    BusinessQuestionFormComponent,
    SplitCommaPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(()=> initializeApp(environment.firebase)),
    provideFirestore(()=>getFirestore()),
    provideStorage(()=> getStorage()),
    ReactiveFormsModule,
    FormsModule


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
