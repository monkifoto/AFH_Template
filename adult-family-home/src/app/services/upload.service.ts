import { Injectable } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore
  ) {}

  uploadFile(
    file: File,
    businessId: string,
    location: string,
  ): { uploadProgress: Observable<number>; downloadUrl: Observable<string> } {
    let filePath: string;

    switch (location) {
      case 'testimonail':
        filePath = `businesses/${businessId}/testimonail/${file.name}`;
        break;
      case 'employee':
        filePath = `businesses/${businessId}/employee/${file.name}`;
        break;
      case 'business':
        filePath = `businesses/${businessId}/business/${file.name}`;
        break;
      case 'heroImages':
        filePath = `businesses/${businessId}/heroImages/${file.name}`;
        break;
      case 'gallery':
      default:
        filePath = `businesses/${businessId}/gallery/${file.name}`;
        break;
    }

    const fileRef = this.storage.ref(filePath);
    const task: AngularFireUploadTask = this.storage.upload(filePath, file);

    // Observe percentage changes
    const uploadProgress = task.percentageChanges().pipe(
      map((progress) => progress ?? 0) // Provide a default value if progress is undefined
    );

    // Get notified when the download URL is available
    const downloadUrl = new Observable<string>((observer) => {
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              // Save the URL to Firestore (you can customize this part if needed)
              this.firestore
                .collection('businesses')
                .doc(businessId)
                .collection(location)
                .add({ url });
              observer.next(url);
              observer.complete();
            });
          })
        )
        .subscribe();
    });

    return { uploadProgress, downloadUrl };
  }
}
