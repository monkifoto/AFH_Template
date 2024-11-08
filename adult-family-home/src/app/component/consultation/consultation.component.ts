import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.css']
})
export class ConsultationComponent  {
 @Input() id: string | null = null;
 @Input() layoutType: string = 'demo';

  constructor(private router: Router) {}

  navigateToContact(id: string | undefined | null) {
    this.router.navigate(['/contact-us'], { queryParams: { id } });
  }
}
