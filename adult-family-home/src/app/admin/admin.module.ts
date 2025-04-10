import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
<<<<<<< HEAD
// import { LoginComponent } from './login/login.component';
=======
import { LoginComponent } from './login/login.component';
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
import { AdminComponent } from './admin/admin/admin.component';
import { BusinessListComponent } from './business-list/business-list.component';
// import { BusinessLocationsComponent } from './business-locations/business-locations.component';


@NgModule({
  declarations: [
<<<<<<< HEAD
    // LoginComponent,
=======
    LoginComponent,
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
    AdminComponent,
    BusinessListComponent,
    // HeroManagerComponent,
    // BusinessLocationsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule
  ],
  exports:[
    // BusinessLocationsComponent
  ]
})
export class AdminModule { }
