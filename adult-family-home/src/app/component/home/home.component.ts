import { Component, OnInit } from '@angular/core';
import { WebContentService } from 'src/app/services/web-content.service';
import { Business } from 'src/app/model/business-questions.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  business!: Business;

  constructor(private webContent: WebContentService, private route: ActivatedRoute){}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      let businessId = params['id'] ;
      this.webContent.getBusinessData(businessId).subscribe(data => {
        if(data)
        this.business = data;
      });
    });

    // this.webContent.getBusinessData('St95t3fx6YQmakMhdu3W').subscribe(data => {
    //   if (data) {
    //     console.log('Homepage data', data);
    //     this.business = data;
    //     // this.business.businessName = data.businessName;
    //     // this.business.tagline = data.tagline;
    //     // this.business.whyChoose = data.whyChooseUs;
    //   }
    // });
  }

}
