import { Component, OnInit } from '@angular/core';
import { WebContentService } from 'src/app/services/web-content.service';
import { Business } from 'src/app/model/business-questions.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MetaService } from 'src/app/services/meta-service.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit{
  businessId!: string;
  business!: Business;

  constructor(private webContent: WebContentService, private route: ActivatedRoute,private router: Router, private metaService: MetaService){}

  navigateToContact() {
    this.router.navigate(['/contact-us']);
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.businessId = params['id'] ;
    });

    this.metaService.getMetaData(this.businessId).subscribe((metaData: { title: string; description: string; keywords: string; }) => {
      this.metaService.updateMetaTags(metaData);
    });

    this.webContent.getBusinessData(this.businessId).subscribe(data => {
      if(data)
      this.business = data;
    });

  }

}
