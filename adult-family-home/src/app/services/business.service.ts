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
  constructor(private afs: AngularFirestore, private storage: AngularFireStorage) {}

  // Create a new business
  createBusiness(business: Business): Promise<void> {
    console.log('Business Created');
    const id = this.afs.createId();
    return this.afs.doc(`${this.basePath}/${id}`).set({ ...business, id });
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

  // Get a single business by id
  getBusiness(id: string): Observable<Business | undefined> {
    return this.afs.doc<Business>(`${this.basePath}/${id}`).valueChanges();
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
