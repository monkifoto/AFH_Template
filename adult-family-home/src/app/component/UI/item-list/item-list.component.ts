import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  @Input() title: string = 'Our Services';  // ✅ Dynamically set from the section
  @Input() subTitle:string ='';
  @Input() items: any[] = []; // ✅ List of items in the section
  @Input() isMinimal: boolean = false; // ✅ Controls minimal/full view
  @Input() showLearnMore: boolean = false; // ✅ Toggle Learn More button
  @Input() sectionImageUrl: string | null = null; // ✅ Background image
  @Input() isParallax: boolean = true; // ✅ Controls whether parallax effect is applied
  @Input() themeType: string = 'demo';
   // ✅ New inputs
   @Input() page: string ='';
   @Input() location: string ='';
   @Input() backgroundColor: string = '#ffffff';
   @Input() textColor: string = '#000000';
   @Input() titleColor: string = '#000000';
   @Input() titleFontSize: string = '34';
   @Input() subtitleColor: string = '#000000';
   @Input() subtitleFontSize: string = '14';
   @Input() fullWidth: boolean = false;
   @Input() showButton: boolean = false;
   @Input() buttonText: string ='Learn More';
   @Input() buttonLink: string ='contact-us';
   @Input() alignText: string= 'left';
   @Input() boxShadow: boolean = false;
   @Input() borderRadius: number = 0;

  constructor() {}

  ngOnInit(): void {
    console.log("📌 Item List Initialized:", {
      title: this.title,
      subTitle: this.subTitle,
      items: this.items,
      isMinimal: this.isMinimal,
      sectionImageUrl: this.sectionImageUrl,
      isParallax: this.isParallax,
      backgroundColor: this.backgroundColor,
      titleColor : this.titleColor,
      subtitleColor: this.subtitleColor,
      textColor: this.textColor,
      fullWidth: this.fullWidth
    });
  }
}
