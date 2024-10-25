import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { Business } from '../model/business-questions.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private basePath = 'businesses';
  private defaultBusinessId = 'vfCMoPjAu2ROVBbKvk0D';
  constructor(private afs: AngularFirestore, private storage: AngularFireStorage) {}

  // Create a new business
  createBusiness(business: Business):  Observable<Business> {
    console.log('Business Created');
    const id = this.afs.createId();
     this.afs.doc(`${this.basePath}/${id}`).set({ ...business, id });
     return this.afs.doc<Business>(`${this.basePath}/${id}`).valueChanges().pipe(
      map(business => {
        // Ensure that we only emit a Business object or throw an error
        if (!business) {
          throw new Error('Business not found after creation');
        }
        return business;
      })
    );
  }

  // Get a list of businesses
  getBusinesses(): Observable<Business[]> {
    return this.afs.collection<Business>(this.basePath).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Business;
        const id = a.payload.doc.id;
        // Remove the existing id property if present
        const { id: _, ...rest } = data;
        return { id, ...rest };
      }))
    );
  }



  getAllBusinesses(): Observable<Business[]> {
    return this.afs.collection<Business>(this.basePath).valueChanges({ idField: 'id' });
  }

  getActiveBusinesses(): Observable<Business[]> {
    return this.afs.collection<Business>(this.basePath, ref => ref.where('isActive', '==', true)).valueChanges({ idField: 'id' });
  }


  // Get a single business by id
  getBusiness(id: string): Observable<Business | undefined> {
    return this.getBusinessData(id);//this.afs.doc<Business>(`${this.basePath}/${id}`).valueChanges();
  }


  getBusinessData(businessId: string | null | undefined): Observable<Business | undefined> {

    //console.log("Get Business Data businessId", businessId);
    const resolvedBusinessId = businessId && businessId.trim() ? businessId : this.defaultBusinessId;


    //console.log("Get Business Data resolvedBusinessId", resolvedBusinessId);

    return this.afs.collection('businesses').doc<Business>(resolvedBusinessId).snapshotChanges().pipe(
      map(action => {
        const data = action.payload.data();
        const docId = action.payload.id;
        if (data) {
          // Remove the existing id property if present
          const { id: _, ...rest } = data;
          return { id: docId, ...rest };
        }
       // console.log("Get business Data:", data);
        return undefined;
      })
    );
  }

  // Update an existing business
  updateBusiness(id: string, business: Partial<Business>): Promise<void> {
    return this.afs.doc(`${this.basePath}/${id}`).update(business);
  }

  // Delete a business
  deleteBusiness(id: string): Promise<void> {
    return this.afs.doc(`${this.basePath}/${id}`).delete();
  }

  // Upload a file to storage
  uploadFile(filePath: string, file: File): AngularFireUploadTask {
    return this.storage.upload(filePath, file);
  }

  // Get the download URL for a file
  getDownloadURL(filePath: string): Observable<string> {
    return this.storage.ref(filePath).getDownloadURL();
  }





}
