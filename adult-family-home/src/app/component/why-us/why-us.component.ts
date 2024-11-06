import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Business } from 'src/app/model/business-questions.model';
import { WebContentService } from 'src/app/services/web-content.service';

@Component({
  selector: 'app-why-us',
  templateUrl: './why-us.component.html',
  styleUrls: ['./why-us.component.css']
})
export class WhyUsComponent implements OnInit{

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
  }

}
