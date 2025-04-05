import { Injectable } from '@angular/core';
import {
  Storage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from '@angular/fire/storage';
import {
  Firestore,
  doc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private storage: Storage, private firestore: Firestore) {}

  uploadFile(
    file: File,
    businessId: string,
    location: string,
    title: string = '',
    description: string = '',
    link: string = '',
    order: string = ''
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
      case 'lifeStyle':
        filePath = `businesses/${businessId}/lifeStyle/${file.name}`;
        break;
      case 'sectionsImages':
        filePath = `businesses/${businessId}/sectionsImages/${file.name}`;
        break;
      case 'gallery':
      default:
        filePath = `businesses/${businessId}/gallery/${file.name}`;
        break;
    }

    const fileRef = storageRef(this.storage, filePath);
    const task = uploadBytesResumable(fileRef, file);

    const uploadProgress = new Observable<number>((observer) => {
      task.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          observer.next(progress);
        },
        (error) => observer.error(error),
        () => observer.complete()
      );
    });

    const downloadUrl = new Observable<string>((observer) => {
      task.on(
        'state_changed',
        () => {},
        (error) => observer.error(error),
        async () => {
          const url = await getDownloadURL(fileRef);
          await addDoc(collection(this.firestore, `businesses/${businessId}/${location}`), {
            url,
            title,
            description,
            link,
            order
          });
          observer.next(url);
          observer.complete();
        }
      );
    });

    return { uploadProgress, downloadUrl };
  }

  async deleteFile(imageUrl: string, businessId: string, location: string): Promise<void> {
    try {
      const pathSegments = imageUrl.split('/');
      const fileNameWithQuery = pathSegments[pathSegments.length - 1];
      const fileName = decodeURIComponent(fileNameWithQuery.split('?')[0]);
      const fullPath = `businesses/${businessId}/${location}/${fileName}`;

      const fileRef = storageRef(this.storage, fullPath);
      await deleteObject(fileRef);

      const q = query(
        collection(this.firestore, `businesses/${businessId}/${location}`),
        where('url', '==', imageUrl)
      );

      const querySnapshot = await getDocs(q);
      for (const docSnap of querySnapshot.docs) {
        await deleteDoc(docSnap.ref);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}
