import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Business } from 'src/app/model/business-questions.model';
import { WebContentService } from 'src/app/services/web-content.service';

@Component({
  selector: 'app-why-us',
  templateUrl: './why-us.component.html',
  styleUrls: ['./why-us.component.css']
})
export class WhyUsComponent {
 @Input() whyChooseUs!: {  name: string, description: string }[];
 @Input() layoutType: string = 'demo';
  business!: Business;

  constructor(private webContent: WebContentService, private route: ActivatedRoute){}

}
