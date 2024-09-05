import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-our-services-home',
  templateUrl: './our-services-home.component.html',
  styleUrls: ['./our-services-home.component.css']
})


export class OurServicesHomeComponent {
  @Input() services!: { icon: string, title: string, description: string }[];
}
