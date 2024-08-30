import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-photo-gallery-upload',
  templateUrl: './photo-gallery-upload.component.html',
  styleUrls: ['./photo-gallery-upload.component.css']
})
export class PhotoGalleryUploadComponent implements OnInit {
  @Input()
  businessId!: string;

  uploadProgress: { [key: string]: Observable<number> } = {};  // Track progress for each file
  uploadedImages: { [key: string]: string } = {};  // Store the uploaded image URLs
  filesToUpload: File[] = [];  // Files selected for upload

  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    private uploadService: UploadService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.businessId = params['id'];
    });
  }

  uploadFiles(event: any) {
    const files: File[] = event.target.files;
    for (let file of files) {
      const { uploadProgress, downloadUrl } = this.uploadService.uploadFile(file, this.businessId, 'gallery');
      this.uploadProgress[file.name] = uploadProgress;
      downloadUrl.subscribe((url: string) => {
        this.uploadedImages[file.name] = url;
      });
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer!.dropEffect = 'copy';
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const files: File[] = Array.from(event.dataTransfer!.files);
    this.filesToUpload = files;

    this.uploadFiles({ target: { files } });
  }

}
