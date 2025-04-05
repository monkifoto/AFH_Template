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
    styleUrls: ['./photo-gallery-upload.component.css'],
    standalone: false
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
      // const title = prompt('Enter image title:');
      // const description = prompt('Enter image description:');
      // const link = prompt('Enter image link:');
      // const order = prompt('Enter image order:');
      // const { uploadProgress, downloadUrl } = this.uploadService.uploadFile(file, this.businessId, this.uploadLocation);
      const title :string = '';
      const description :string = '';
      const link :string = '';
      const order :string = '';
      const { uploadProgress, downloadUrl } = this.uploadService.uploadFile(file, this.businessId, this.uploadLocation, title || '', description || '', link || '', order ||'');
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
          // Step 3: Update the local array
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
      this.images = filteredImages.map(img => ({
        ...img,
        title: img.title || '',
        description: img.description || '',
        link: img.link || '',
        order: img.order || ''
      }));
    });

  }

  onImageClick(imageUrl: string) {
    this.selectedImageUrl = imageUrl;
  }

  onCloseModal() {
    this.selectedImageUrl = null;
  }

  saveImageDetails(image: any) {
    this.firestore
      .collection('businesses')
      .doc(this.businessId)
      .collection(this.uploadLocation)
      .ref.where('url', '==', image.url)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({ title: image.title, description: image.description, link: image.link, order:image.order });
        });
      })
      .catch((error) => console.error('Error updating image details:', error));
  }


}
