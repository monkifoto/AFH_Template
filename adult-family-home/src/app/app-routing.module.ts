import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { AboutUsComponent } from './component/about-us/about-us.component';
import { ServicesComponent } from './component/services/services.component';
import { ContactUsComponent } from './component/contact-us/contact-us.component';
import { BusinessQuestionFormComponent } from './component/admin/business-question-form/business-question-form.component';
import { BusinessListComponent } from './component/admin/business-list/business-list.component';
import { EditBusinessComponent } from './component/admin/edit-business/edit-business.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // { path: '**', redirectTo: '/home' },
  { path: 'bqs', component: BusinessQuestionFormComponent },
  { path: 'bls', component: BusinessListComponent},
  { path: 'business/new', component: BusinessQuestionFormComponent },
  { path: 'business/edit/:id', component: EditBusinessComponent },

  { path: 'businessList', component: BusinessListComponent },
  { path: 'new-business', component: BusinessQuestionFormComponent },
  { path: 'edit-business/:id', component: EditBusinessComponent },
  { path: ':id', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
