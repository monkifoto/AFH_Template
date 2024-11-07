import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Business } from 'src/app/model/business-questions.model';
import { WebContentService } from 'src/app/services/web-content.service';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent {

  business!: Business;

  constructor(private webContent: WebContentService, private route: ActivatedRoute){}
  @Input() uniqueService!: {  name: string, description: string }[];

}
