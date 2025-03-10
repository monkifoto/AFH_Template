import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-call-to-action',
  templateUrl: './call-to-action.component.html',
  styleUrls: ['./call-to-action.component.css']
})
export class CallToActionComponent implements OnInit {
  @Input() title: string = 'Come Meet Our Family!';
  @Input() content: string = 'Questions before getting started?';
  @Input() buttonText: string = 'Get in touch';
  @Input() isButton: boolean = false;
  @Input() bgColor: string = 'var(--background-color)';
  @Input() textColor: string = 'var(--text-color)';
  @Input() titleColor: string = 'var(--accent-color)';
  @Input() contentColor: string = 'var(--secondary-color)';
  @Input() buttonBgColor: string = 'var(--button-color)';
  @Input() buttonTextColor: string = 'var(--button-text-color)';
  @Input() borderRadius: string = '10px';
  @Input() boxShadow: string = '0px 4px 6px rgba(0, 0, 0, 0.2)';
  @Input() page: string = 'contact-us';
  @Input() layout: 'full-width' | 'centered' = 'centered';
  @Input() businessId: string ='';
  @Input() themeType!: string;
  @Input() subTitle!: string;
  @Input() imageURL!: string;
  @Input() showImage: boolean =false;
  @Input() _businessName: string = '';
  @Input() location: string ='';
  @Input() backgroundColor: string = '#ffffff';
  @Input() titleFontSize: string = '34';
  @Input() subtitleColor: string = '#000000';
  @Input() subtitleFontSize: string = '14';
  @Input() fullWidth: boolean = false;
  @Input() showButton: boolean = false;
  @Input() buttonLink: string ='contact-us';
  @Input() alignText: string= 'left';
  @Input() items: any[] = []; // ✅ List of items in the section
  @Input() isMinimal: boolean = false; // ✅ Controls minimal/full view
  @Input() showLearnMore: boolean = false; // ✅ Toggle Learn More button
  @Input() sectionImageUrl: string | null = null; // ✅ Background image
  @Input() isParallax: boolean = true; // ✅ Controls whether parallax effect is applied

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log("CTA Initialized with:", {
      bgColor: this.bgColor,
      textColor: this.textColor,
      titleColor: this.titleColor,
      buttonBgColor: this.buttonBgColor,
      buttonTextColor: this.buttonTextColor,
      layout: this.layout
    });
    this.fullWidth = this.convertToBoolean(this.fullWidth);
  }

  navigate() {
    if (this.page && this.businessId) {
      this.router.navigate([this.page]);
      this.router.navigate([this.page], { queryParams: { id: this.businessId } });
    }
  }

  private convertToBoolean(value: any): boolean {
    if (typeof value === 'boolean') return value; // Already boolean
    if (typeof value === 'string') return value.toLowerCase() === 'true'; // Convert string to boolean
    return false; // Default case
  }

}
