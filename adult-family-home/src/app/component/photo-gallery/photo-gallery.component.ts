import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { WebContentService } from 'src/app/services/web-content.service';
import { Business } from 'src/app/model/business-questions.model';

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.css']
})
export class PhotoGalleryComponent implements OnInit {
  @Input()
  businessId!: string;
  images$!: Observable<any[]>;
  business!: Business;

  constructor(
    private route: ActivatedRoute,
    private webContent: WebContentService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.businessId = params['id'];
      this.loadImages();
    });
    this.webContent.getBusinessData(this.businessId).subscribe(data => {
      if(data)
      this.business = data;
    });
  }

  loadImages(): void {
    if (this.businessId) {
      this.images$ = this.webContent.getBusinessGalleryImagesById(this.businessId);
    }
  }
}
