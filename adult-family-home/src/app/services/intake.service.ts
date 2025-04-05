import { Injectable } from '@angular/core';
import {
  Firestore, collection, collectionData, doc, docData, setDoc,
  updateDoc, deleteDoc
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IntakeForm } from '../model/intake-form.model';

@Injectable({
  providedIn: 'root'
})
export class IntakeService {
  private basePath = 'businesses';

  constructor(private firestore: Firestore) {}

  saveIntakeForm(intakeForm: IntakeForm, businessId: string): Observable<IntakeForm> {
    const intakeId = doc(collection(this.firestore, `${this.basePath}/${businessId}/intake`)).id;
    const intakeRef = doc(this.firestore, `${this.basePath}/${businessId}/intake/${intakeId}`);

    return new Observable(observer => {
      setDoc(intakeRef, intakeForm).then(() => {
        observer.next(intakeForm);
        observer.complete();
      }).catch(error => {
        console.error('Error saving intake form data', error);
        observer.error(error);
      });
    });
  }

  getIntakeForms(businessId: string): Observable<IntakeForm[]> {
    const intakeRef = collection(this.firestore, `${this.basePath}/${businessId}/intake`);
    return collectionData(intakeRef, { idField: 'id' }) as Observable<IntakeForm[]>;
  }

  getIntakeForm(businessId: string, intakeId: string): Observable<IntakeForm | undefined> {
    const intakeDocRef = doc(this.firestore, `${this.basePath}/${businessId}/intake/${intakeId}`);
    return docData(intakeDocRef).pipe(
      map(data => data as IntakeForm | undefined)
    );
  }

  updateIntakeForm(businessId: string, intakeId: string, intakeForm: Partial<IntakeForm>): Promise<void> {
    const intakeDocRef = doc(this.firestore, `${this.basePath}/${businessId}/intake/${intakeId}`);
    return updateDoc(intakeDocRef, intakeForm);
  }

  deleteIntakeForm(businessId: string, intakeId: string): Promise<void> {
    const intakeDocRef = doc(this.firestore, `${this.basePath}/${businessId}/intake/${intakeId}`);
    return deleteDoc(intakeDocRef);
  }
}
