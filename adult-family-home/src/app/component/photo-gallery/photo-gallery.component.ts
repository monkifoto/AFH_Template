import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { WebContentService } from 'src/app/services/web-content.service';

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.css']
})
export class PhotoGalleryComponent implements OnInit {
  @Input()
  businessId!: string;
  images$!: Observable<any[]>;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: WebContentService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.businessId = params['id'];
      this.loadImages();
    });
  }

  loadImages(): void {
    if (this.businessId) {
      this.images$ = this.firestoreService.getBusinessGalleryImagesById(this.businessId);
    }
  }
}
