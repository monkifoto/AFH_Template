import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebContentService } from 'src/app/services/web-content.service';
import { Business } from 'src/app/model/business-questions.model';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})

export class NavigationComponent implements OnInit{
  businessId: string = '';
  business: Business | undefined;
  menuActive: boolean = false;
  menuOpen: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private content: WebContentService) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.businessId = params['id'] || ''; // Default to empty string if id is undefined
      this.content.getBusinessData(this.businessId).subscribe(data => {
        this.business = data;
      });
    });
  }

  navigateTo(page: string): void {
    const queryParams = this.businessId ? { id: this.businessId } : {};
    console.log('This Business id form query string',this.businessId);
    this.closeMenu();
    this.router.navigate([`/${page}`], { queryParams }).then(success => {
      if (!success) {
        console.error('Navigation failed!');
      }
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

}
