import { Injectable } from '@angular/core';
import {
  Firestore, doc, docData, collection, collectionData, getDoc
} from '@angular/fire/firestore';
import {
  Storage, ref as storageRef, getDownloadURL
} from '@angular/fire/storage';
import { Observable, catchError, map, of, from } from 'rxjs';
import { Business, Employee, HeroImage } from '../model/business-questions.model';

@Injectable({
  providedIn: 'root'
})
export class WebContentService {
  private defaultBusinessId = 'Z93oAAVwFAwhmdH2lLtB';
  private defaultImage = 'assets/sharedAssets/missingTestimonialImage.png';

  constructor(private firestore: Firestore, private storage: Storage) {}

  getBusinessData(businessId: string | null | undefined): Observable<Business | undefined> {
    const resolvedId = businessId?.trim() || this.defaultBusinessId;
    const businessRef = doc(this.firestore, `businesses/${resolvedId}`);

    return docData(businessRef).pipe(
      map(data => {
        if (!data) return undefined;
        const { id: _, testimonials = [], ...rest } = data as Business;

        const updatedTestimonials = testimonials.map(t => ({
          ...t,
          photoURL: t.photoURL?.trim() ? t.photoURL : this.defaultImage
        }));

        return { id: resolvedId, testimonials: updatedTestimonials, ...rest };
      })
    );
  }

  getDefaultBusinessData(): Observable<Business | undefined> {
    return this.getBusinessData(this.defaultBusinessId);
  }

  getEmployees(): Observable<Employee[]> {
    const employeesRef = collection(this.firestore, 'employees');
    return collectionData(employeesRef, { idField: 'id' }) as Observable<Employee[]>;
  }

  getEmployeePhoto(photoPath: string): Observable<string> {
    const fileRef = storageRef(this.storage, photoPath);
    return from(getDownloadURL(fileRef)).pipe(
      catchError(error => {
        console.error('Error fetching photo URL:', error);
        return of('');
      })
    );
  }

  getEmployeesByBusinessId(businessId: string): Observable<Employee[]> {
    const resolvedId = businessId?.trim() || this.defaultBusinessId;
    const businessRef = doc(this.firestore, `businesses/${resolvedId}`);

    return from(getDoc(businessRef)).pipe(
      map(docSnap => {
        if (!docSnap.exists()) {
          console.warn('Business document does not exist.');
          return [];
        }

        const data = docSnap.data();
        return (data && data['employees']) ? data['employees'] : [];
      }),
      catchError(error => {
        console.error('Error fetching employees:', error);
        return of([]);
      })
    );
  }

  getBusinessGalleryImagesById(businessId: string): Observable<any[]> {
    const resolvedId = businessId?.trim() || this.defaultBusinessId;
    const galleryRef = collection(this.firestore, `businesses/${resolvedId}/gallery`);
    return collectionData(galleryRef);
  }

  getBusinessLifeStyleGalleryImagesById(businessId: string): Observable<any[]> {
    return this.getBusinessGalleryImagesById(businessId); // Assuming same collection for now
  }

  getBusinessUploadedImagesById(businessId: string, uploadLocation: string): Observable<HeroImage[]> {
    const resolvedId = businessId?.trim() || this.defaultBusinessId;
    const uploadRef = collection(this.firestore, `businesses/${resolvedId}/${uploadLocation}`);
    return collectionData(uploadRef) as Observable<HeroImage[]>;
  }

  checkImageExists(imageUrl: string): Promise<boolean> {
    const ref = storageRef(this.storage, imageUrl);
    return getDownloadURL(ref)
      .then(() => true)
      .catch(() => false);
  }
}
