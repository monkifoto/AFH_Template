import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Business } from 'src/app/model/business-questions.model';
import { BusinessDataService } from 'src/app/services/business-data.service';
<<<<<<< HEAD
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
=======
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4

@Component({
    selector: 'app-expandable-navigation',
    templateUrl: './expandable-navigation.component.html',
    styleUrls: ['./expandable-navigation.component.css'],
    standalone: false
})
export class ExpandableNavigationComponent  implements OnInit {
  businessId: string = '';
  business: Business | null = null;
  layoutType?: string = 'demo';
<<<<<<< HEAD
  locations: any[] = [];
=======
  locations: any;
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  isShrunk: boolean = false;
  menuOpen: boolean = false;
  locationsOpen: boolean = false;
  selectedLocation: any = null;
  expandedDropdownIndex: number | null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
<<<<<<< HEAD
    private businessDataService: BusinessDataService ,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
=======
    private businessDataService: BusinessDataService // Inject BusinessDataService here
  ) {}

  ngOnInit(): void {
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
    this.businessDataService.getBusinessId().subscribe((businessId) => {
      if (businessId) {
        this.businessId = businessId;

        this.businessDataService.getBusinessData().subscribe((data) => {
          this.business = data;
          this.layoutType = this.business?.theme.themeType;
<<<<<<< HEAD
=======
          // this.locations = this.business?.locations || []; // Store locations

          // console.log("🔍 Loaded Locations:", this.locations); // ✅ Debugging
          // if (this.locations.length === 0) {
          //   console.warn("⚠️ No locations found for this business.");
          // }
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
        });

        this.businessDataService.getLocations().subscribe((locations) => {
          this.locations = locations;
<<<<<<< HEAD
=======
         // console.log("📍 Locations Updated in Navigation:", this.locations);
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
        });
      }
    });

    this.checkScroll();
  }
<<<<<<< HEAD
  }
=======
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkScroll();
  }

  private checkScroll(): void {
<<<<<<< HEAD
    if (isPlatformBrowser(this.platformId)) {
    this.isShrunk = window.scrollY > 100;
    }
=======
    this.isShrunk = window.scrollY > 100;
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
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

  toggleDropdown(index: number) {
    this.expandedDropdownIndex = this.expandedDropdownIndex === index ? null : index;
  }


  selectLocation(index: number): void {
    //console.log("📍 Selected Location Index:", index);

    const queryParams: any = { locationIndex: index };

    if (this.businessId) {
      queryParams.id = this.businessId; // Ensure businessId is included
    }

    //console.log("🚀 Navigating to location with Params:", queryParams);

    this.router.navigate(['/location'], { queryParams }).then(success => {
      if (!success) {
        console.error('❌ Navigation failed!');
      } else {
        this.closeMenu();  // 🔥 Close menu after selecting a location
      }
    });
  }

  toggleLocations(): void {
    this.locationsOpen = !this.locationsOpen;
    //"📂 Locations Dropdown Toggled:", this.locationsOpen);
    //console.log("🔍 Locations Array:", this.locations);
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
