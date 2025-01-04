import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin/admin.component';
import { BusinessListComponent } from './business-list/business-list.component';
// import { AdminHeroSliderComponent } from './admin-hero-slider/admin-hero-slider.component';
// import { ColorAdminComponent } from './color-admin/color-admin.component';



@NgModule({
  declarations: [
    LoginComponent,
    AdminComponent,
    BusinessListComponent,
    // AdminHeroSliderComponent,
    // ColorAdminComponent,

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule
  ]
})
export class AdminModule { }
