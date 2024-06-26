import { Component, OnInit } from '@angular/core';
import { WebContentService } from 'src/app/services/web-content.service';
import { Business } from 'src/app/model/business-questions.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit{

  business!: Business;

  constructor(private webContent: WebContentService, private route: ActivatedRoute,){}

  ngOnInit(): void {
    // const businessId = 'ZLD5TNBA4lwnCqGYI73T';
    this.route.queryParams.subscribe(params => {
      const businessId = params['id'] || this.webContent.getDefaultBusinessData();
      this.webContent.getBusinessData(businessId).subscribe(data => {
        if(data)
        this.business = data;
      });
    });
  }

}
