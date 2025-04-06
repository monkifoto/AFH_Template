import { Component, Input, OnInit } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDocs,
  query,
  where,
  updateDoc,
} from '@angular/fire/firestore';
import {
  Storage,
  ref as storageRef,
  deleteObject,
} from '@angular/fire/storage';
import { from, Observable } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { UploadService } from 'src/app/services/upload.service';
import { WebContentService } from 'src/app/services/web-content.service';

@Component({
  selector: 'app-photo-gallery-upload',
  templateUrl: './photo-gallery-upload.component.html',
  styleUrls: ['./photo-gallery-upload.component.css'],
  standalone: false
})
export class PhotoGalleryUploadComponent implements OnInit {
  @Input() businessId!: string;
  images!: any[];
  uploadProgress: { [key: string]: Observable<number> } = {};
  uploadedImages: { [key: string]: string } = {};
  filesToUpload: File[] = [];
  uploadLocation = 'gallery';
  selectedImageUrl: string | null = null;

  constructor(
    private storage: Storage,
    private firestore: Firestore,
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private webContent: WebContentService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.businessId = params['id'];
      this.loadImages();
    });
  }

  uploadFiles(event: any) {
    const files: File[] = event.target.files;
    for (let file of files) {
      const title = '';
      const description = '';
      const link = '';
      const order = '';
      const { uploadProgress, downloadUrl } = this.uploadService.uploadFile(
        file,
        this.businessId,
        this.uploadLocation,
        title,
        description,
        link,
        order
      );
      this.uploadProgress[file.name] = uploadProgress;
      downloadUrl.subscribe((url: string) => {
        this.uploadedImages[file.name] = url;
      });
    }
  }

  deleteImage(image: any): void {
    if (confirm('Are you sure you want to delete this image?')) {
      this.uploadService
        .deleteFile(image.url, this.businessId, this.uploadLocation)
        .then(() => {
          this.images = this.images.filter((img) => img.url !== image.url);
        })
        .catch((error) => {
          console.error('Error deleting the image:', error);
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
    this.webContent
      .getBusinessUploadedImagesById(this.businessId, this.uploadLocation)
      .pipe(
        switchMap((images) => {
          const checks = images.map(async (image) => {
            const exists = await this.webContent.checkImageExists(image.url);
            return exists ? image : null;
          });
          return from(Promise.all(checks));
        }),
        map((images) => images.filter((image) => image !== null))
      )
      .subscribe((filteredImages) => {
        this.images = filteredImages.map((img) => ({
          ...img,
          title: (img as any).title || '',
          description: (img as any).description || '',
          link: (img as any).link || '',
          order: (img as any).order || '',
        }));
      });
  }

  onImageClick(imageUrl: string) {
    this.selectedImageUrl = imageUrl;
  }

  onCloseModal() {
    this.selectedImageUrl = null;
  }

  async saveImageDetails(image: any) {
    const collRef = collection(
      this.firestore,
      `businesses/${this.businessId}/${this.uploadLocation}`
    );
    const q = query(collRef, where('url', '==', image.url));
    const snapshot = await getDocs(q);
    snapshot.forEach(async (docSnap) => {
      await updateDoc(docSnap.ref, {
        title: image.title,
        description: image.description,
        link: image.link,
        order: image.order,
      });
    });
  }
}
