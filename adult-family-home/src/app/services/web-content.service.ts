import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Business, Employee } from '../model/business-questions.model';


@Injectable({
  providedIn: 'root'
})
export class WebContentService {
  private defaultBusinessId = 'vfCMoPjAu2ROVBbKvk0D';
  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  getBusinessData(businessId: string): Observable<Business | undefined> {
    if(businessId == undefined || businessId == "" || businessId ==="" ){
      businessId = this.defaultBusinessId;
    }
    return this.firestore.collection('businesses').doc<Business>(businessId).snapshotChanges().pipe(
      map(action => {
        const data = action.payload.data();
        const docId = action.payload.id;
        if (data) {
          // Remove the existing id property if present
          const { id: _, ...rest } = data;
          return { id: docId, ...rest };
        }
        return undefined;
      })
    );
  }
  getDefaultBusinessData(): Observable<Business | undefined> {
    return this.getBusinessData(this.defaultBusinessId);
  }

  getEmployees(): Observable<Employee[]> {
    return this.firestore.collection<Employee>('employees').valueChanges({ idField: 'id' });
  }

  getEmployeePhoto(photoPath: string): Observable<string> {
    return this.storage.ref(photoPath).getDownloadURL().pipe(
      catchError(error => {
        console.error('Error fetching photo URL:', error);
        return of(''); // Return an empty string or default URL in case of error
      })
    );
  }


  getEmployeesByBusinessId(businessId: string): Observable<Employee[]> {
    //console.log('Fetching employees for business ID:', businessId);

    if(businessId == undefined || businessId == "" || businessId ==="" ){
      businessId = this.defaultBusinessId;
    }

    return this.firestore.collection<Business>('businesses').doc(businessId).get().pipe(
      map(doc => {
        if (doc.exists) {
          const data = doc.data();
          if (data && data.employees) {
            console.log('Fetched employees:', data.employees);
            return data.employees;
          } else {
            console.warn('No employees found in the document.');
            return [] as Employee[];
          }
        } else {
          console.warn('Business document does not exist.');
          return [] as Employee[];
        }
      }),
      catchError(error => {
        console.error('Error fetching employees:', error);
        return of([] as Employee[]); // Return an empty array in case of error
      })
    );
  }

  getBusinessGalleryImagesById(businessId: string): Observable<any[]> {
    console.log("Webcontent getBusinessGalleryImagesByID: " , businessId);
    if(businessId == undefined || businessId == "" || businessId ===""  ){
      businessId = this.defaultBusinessId;
    }
    return this.firestore.collection('businesses').doc(businessId)
      .collection('gallery').valueChanges();
  }
}
