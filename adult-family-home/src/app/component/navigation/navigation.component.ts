import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessDataService } from 'src/app/services/business-data.service'; // Import BusinessDataService
import { Business } from 'src/app/model/business-questions.model';
<<<<<<< HEAD
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
=======
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css'],
    standalone: false
})

export class NavigationComponent implements OnInit {
  businessId: string = '';
  business: Business | null = null;
  menuActive: boolean = false;
  menuOpen: boolean = false;
  layoutType?: string = 'demo';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
<<<<<<< HEAD
    private businessDataService: BusinessDataService,
    @Inject(PLATFORM_ID) private platformId: Object
=======
    private businessDataService: BusinessDataService // Inject BusinessDataService here
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  ) {}

  ngOnInit(): void {
    // Subscribe to the businessId from the service
    this.businessDataService.getBusinessId().subscribe((businessId) => {
      if (businessId) {
        this.businessId = businessId;
        this.businessDataService.getBusinessData().subscribe((data) => {
          this.business = data;
          this.layoutType = this.business?.theme.themeType;
          //console.log("Navigation Logo", this.business?.logoImage);
          //console.log("Navigation ID", this.business?.id);
        });
      }
    });
  }




  navigateTo(page: string): void {
    const queryParams = this.businessId ? { id: this.businessId } : {};
    //console.log('This Business id from query string:', this.businessId);
    this.closeMenu();
    this.router.navigate([`/${page}`], { queryParams }).then(success => {
      if (!success) {
        console.error('Navigation failed!');
      }
    });
  }

  scrollToSection(sectionId: string) {
<<<<<<< HEAD
    if (isPlatformBrowser(this.platformId)) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      this.menuOpen = false;
    }
=======
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.menuOpen = false; // Close menu after clicking (optional)
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
