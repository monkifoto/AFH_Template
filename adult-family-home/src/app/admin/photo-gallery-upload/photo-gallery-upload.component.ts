import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { UploadService } from 'src/app/services/upload.service';
import { WebContentService } from 'src/app/services/web-content.service';

@Component({
  selector: 'app-photo-gallery-upload',
  templateUrl: './photo-gallery-upload.component.html',
  styleUrls: ['./photo-gallery-upload.component.css']
})
export class PhotoGalleryUploadComponent implements OnInit {
  @Input()
  businessId!: string;
  images!: any[];
  uploadProgress: { [key: string]: Observable<number> } = {};  // Track progress for each file
  uploadedImages: { [key: string]: string } = {};  // Store the uploaded image URLs
  filesToUpload: File[] = [];  // Files selected for upload
  uploadLocation = 'gallery'; // Default location
  selectedImageUrl: string | null = null;

  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private webContent: WebContentService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.businessId = params['id'];
      this.loadImages();
    });
  }

  uploadFiles(event: any) {
    const files: File[] = event.target.files;
    for (let file of files) {
      const { uploadProgress, downloadUrl } = this.uploadService.uploadFile(file, this.businessId, this.uploadLocation);
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

  loadImages(): void {
    this.webContent.getBusinessUploadedImagesById(this.businessId, this.uploadLocation).pipe(
      switchMap(images => {
        // Create an array of observables that check if the image exists
        const checks = images.map(async image => {
          const exists = await this.webContent.checkImageExists(image.url);
          return exists ? image : null;  // Return image only if it exists
        });

        // Resolve all checks
        return from(Promise.all(checks));
      }),
      map(images => images.filter(image => image !== null))  // Filter out null values
    ).subscribe(filteredImages => {
      this.images = filteredImages;
    });

  }

  onImageClick(imageUrl: string) {
    this.selectedImageUrl = imageUrl;
  }

  onCloseModal() {
    this.selectedImageUrl = null;
  }


}
