import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-parallax-stats',
  templateUrl: './parallax-stats.component.html',
  styleUrls: ['./parallax-stats.component.css']
})
export class ParallaxStatsComponent {
  @Input() backgroundImage: string = '';
  @Input() yearsOfExperience: number = 0;
  @Input() happyFamilies: number = 0;
  @Input() servicesOffered: number = 0;
  @Input() trainedStaff: number = 0;
}
