import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { WebContentService } from '../../services/web-content.service';
import { Business } from '../../model/business-questions.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  business$!: Observable<Business | undefined>;

  constructor(
    private route: ActivatedRoute,
    private webContentService: WebContentService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id'] || this.webContentService.getDefaultBusinessData();
      console.log('footer param', id);
      this.business$ = this.webContentService.getDefaultBusinessData();
      console.log(this.business$);
    });
  }
}
