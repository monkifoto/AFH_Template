import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

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

  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
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
      this.uploadFile(file);
    }
  }

  private uploadFile(file: File) {
    const filePath = `businesses/${this.businessId}/gallery/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task: AngularFireUploadTask = this.storage.upload(filePath, file);

    // Observe percentage changes
    this.uploadProgress[file.name] = task.percentageChanges().pipe(
      map(progress => progress ?? 0) // Provide a default value if progress is undefined
    );

    // Get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.firestore.collection('businesses').doc(this.businessId)
            .collection('gallery').add({ url });
          this.uploadedImages[file.name] = url;  // Store the uploaded image URL
        });
      })
    ).subscribe();
  }
}
