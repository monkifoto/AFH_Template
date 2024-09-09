import { Component, OnInit } from '@angular/core';
import { WebContentService } from 'src/app/services/web-content.service';
import { Business } from 'src/app/model/business-questions.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit{

  business!: Business;

  constructor(private webContent: WebContentService, private route: ActivatedRoute,private router: Router){}

  navigateToContact() {
    this.router.navigate(['/contact-us']);
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let businessId = params['id'] ;
      this.webContent.getBusinessData(businessId).subscribe(data => {
        if(data)
        this.business = data;
      });
    });
  }

}
