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

  // getBusinessData(id:string): Observable<any> {
  //   console.log('WebContent Service call');
  //   return this.firestore.collection('business').doc(id).valueChanges();
  // }

  // getBusinessData(id:string): Observable<Business | undefined> {
  //   return this.firestore.collection('business').doc<Business>(id).valueChanges();
  // }
  // getBusinessData(id:string): Observable<Business | undefined> {
  //   if (id == null || id == undefined || id == ''){
  //     id = this.defaultBusinessId;
  //   }
  //   console.log(`Fetching business data for ID: ${id}`);
  //   return this.firestore.collection('businesses').doc<Business>(id).snapshotChanges().pipe(
  //     map((action: { payload: { data: () => any; id: any; }; }) => {
  //       const data = action.payload.data();
  //       if (data) {
  //         const id = action.payload.id;
  //         return { id, ...data } as Business;
  //       } else {
  //         console.error('No data found for the given ID');
  //         return undefined;
  //       }
  //     })
  //   );

  // }

  getBusinessData(id: string): Observable<Business | undefined> {
    if (!id) {
      id = this.defaultBusinessId;
    }
    return this.firestore.collection('businesses').doc<Business>(id).snapshotChanges().pipe(
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

  // getEmployeePhoto(photoPath: string): Observable<string> {
  //   const ref = this.storage.ref(photoPath);
  //   return ref.getDownloadURL();
  // }

  getEmployeePhoto(photoPath: string): Observable<string> {
    return this.storage.ref(photoPath).getDownloadURL().pipe(
      catchError(error => {
        console.error('Error fetching photo URL:', error);
        return of(''); // Return an empty string or default URL in case of error
      })
    );
  }

  // getEmployeesByBusinessId(businessId: string): Observable<Employee[]> {
  //   console.log(businessId);
  //   return this.firestore.collection(`businesses/${businessId}/employees`).valueChanges() as Observable<Employee[]>;
  // }

  // getEmployeesByBusinessId(businessId: string): Observable<Employee[]> {
  //   console.log('Fetching employees for business ID:', businessId);

  //   const mockEmployees: Employee[] = [
  //     { id: '1', name: 'John Doe', role: 'Manager', bio: 'Experienced manager', photoPath: '' },
  //     { id: '2', name: 'Jane Smith', role: 'Nurse', bio: 'Caring nurse', photoPath: '' }
  //   ];

  //   return of(mockEmployees).pipe(
  //     tap(employees => {
  //       if (employees.length === 0) {
  //         console.warn('No mock employees found.');
  //       } else {
  //         console.log('Fetched mock employees:', employees);
  //       }
  //     })
  //   );
  // }
  getEmployeesByBusinessId(businessId: string): Observable<Employee[]> {
    console.log('Fetching employees for business ID:', businessId);

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
    return this.firestore.collection('businesses').doc(businessId)
      .collection('gallery').valueChanges();
  }
}
