import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { AboutUsComponent } from './component/about-us/about-us.component';
import { ServicesComponent } from './component/services/services.component';
import { ContactUsComponent } from './component/contact-us/contact-us.component';
import { PhotoGalleryComponent } from './component/photo-gallery/photo-gallery.component';
import { authGuard } from './auth.guard';
import { LoginComponent } from './admin/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  //{ path: ':id', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'gallery', component: PhotoGalleryComponent },
  { path: 'login', component: LoginComponent },

  // { path: 'gallery', component: PhotoGalleryComponent},
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  // { path: '**', redirectTo: '/home' },
  // { path: 'bqs', component: BusinessQuestionFormComponent },
  // { path: 'bls', component: BusinessListComponent},
  // { path: 'business/new', component: BusinessQuestionFormComponent },
  // { path: 'business/edit/:id', component: EditBusinessComponent },

  // { path: 'businessList', component: BusinessListComponent },
  // { path: 'new-business', component: BusinessQuestionFormComponent },
  // { path: 'edit-business/:id', component: EditBusinessComponent },
  // { path: 'gallery-upload', component: PhotoGalleryUploadComponent},


    // Admin routes (must come before the dynamic :id route to avoid conflicts)
    { path: 'login', component: LoginComponent },
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },

    // Dynamic route for HomeComponent
    { path: ':id', component: HomeComponent },

    // Default redirect
    { path: '', redirectTo: '/home', pathMatch: 'full' },

    // Wildcard redirect
   { path: '**', redirectTo: '/home' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
