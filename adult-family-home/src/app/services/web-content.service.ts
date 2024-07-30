import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, map } from 'rxjs';
import { Business } from '../model/business-questions.model';

export interface Employee {
  id?: string;
  name: string;
  role: string;
  bio: string;
  photoPath: string;
}

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
  getBusinessData(id:string): Observable<Business | undefined> {
    if (id == null || id == undefined || id == ''){
      id = this.defaultBusinessId;
    }
    console.log(`Fetching business data for ID: ${id}`);
    return this.firestore.collection('businesses').doc<Business>(id).snapshotChanges().pipe(
      map((action: { payload: { data: () => any; id: any; }; }) => {
        const data = action.payload.data();
        if (data) {
          const id = action.payload.id;
          return { id, ...data } as Business;
        } else {
          console.error('No data found for the given ID');
          return undefined;
        }
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
    const ref = this.storage.ref(photoPath);
    return ref.getDownloadURL();
  }
}
