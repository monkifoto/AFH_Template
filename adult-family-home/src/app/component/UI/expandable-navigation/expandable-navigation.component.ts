import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Business } from 'src/app/model/business-questions.model';
import { BusinessDataService } from 'src/app/services/business-data.service';

@Component({
  selector: 'app-expandable-navigation',
  templateUrl: './expandable-navigation.component.html',
  styleUrls: ['./expandable-navigation.component.css']
})
export class ExpandableNavigationComponent  implements OnInit {
  businessId: string = '';
  business: Business | null = null;
  layoutType?: string = 'demo';
  locations: any;
  isShrunk: boolean = false;
  menuOpen: boolean = false;
  locationsOpen: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private businessDataService: BusinessDataService // Inject BusinessDataService here
  ) {}

  ngOnInit(): void {
    // Subscribe to the businessId from the service
    this.businessDataService.getBusinessId().subscribe((businessId) => {
      if (businessId) {
        this.businessId = businessId;
        this.businessDataService.getBusinessData().subscribe((data) => {
          this.business = data;
          this.layoutType = this.business?.theme.themeType;
          console.log("Navigation Logo", this.business?.logoImage);
          console.log("Navigation ID", this.business?.id);
        });
      }
    });

    this.checkScroll();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkScroll();
  }

  private checkScroll(): void {
    this.isShrunk = window.scrollY > 100;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  navigateTo(page: string): void {
    const queryParams = this.businessId ? { id: this.businessId } : {};
    console.log('This Business id from query string:', this.businessId);
    this.closeMenu();
    this.router.navigate([`/${page}`], { queryParams }).then(success => {
      if (!success) {
        console.error('Navigation failed!');
      }
    });
  }

  toggleLocations(): void {
    this.locationsOpen = !this.locationsOpen;
    console.log('toggle location menu', this.locationsOpen);
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
