import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { BusinessListComponent } from './business-list/business-list.component';
import { AdminComponent } from './admin/admin/admin.component';
import { EditBusinessComponent } from './edit-business/edit-business.component';
import { PhotoGalleryUploadComponent } from './photo-gallery-upload/photo-gallery-upload.component';
import { HomeComponent } from '../component/home/home.component';
<<<<<<< HEAD
=======
import { A } from '@angular/core/weak_ref.d-DOjz-6fK';
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'businessList', component: BusinessListComponent },
      { path: 'new', component: EditBusinessComponent },
      { path: 'edit-business/:id', component: EditBusinessComponent },
      { path: 'gallery-upload', component: PhotoGalleryUploadComponent },
<<<<<<< HEAD
=======
      { path: 'edit-business/:id', component: EditBusinessComponent },
      { path: 'gallery-upload', component: PhotoGalleryUploadComponent},
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
      { path: ':id', component: HomeComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
