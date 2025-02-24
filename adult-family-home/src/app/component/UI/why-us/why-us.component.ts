import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-why-us',
  templateUrl: './why-us.component.html',
  styleUrls: ['./why-us.component.css']
})
export class WhyUsComponent {
  @Input() sectionTitle: string = 'Our Services';  // ✅ Dynamically set from the section
  @Input() items: any[] = []; // ✅ List of items in the section
  @Input() isMinimal: boolean = false; // ✅ Controls minimal/full view
  @Input() showLearnMore: boolean = false; // ✅ Toggle Learn More button
  @Input() sectionImageUrl: string | null = null; // ✅ Background image
  @Input() isParallax: boolean = true; // ✅ Controls whether parallax effect is applied
  @Input() layoutType: string ='demo';


  constructor( private route: ActivatedRoute){}

}

