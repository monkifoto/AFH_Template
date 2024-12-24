import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IntakeForm } from '../model/intake-form.model'; // Create this model for your intake form data

@Injectable({
  providedIn: 'root'
})
export class IntakeService {
  private basePath = 'businesses';

  constructor(private afs: AngularFirestore) {}

  // Save the intake form data under the business ID
  saveIntakeForm(intakeForm: IntakeForm, businessId: string): Observable<IntakeForm> {
    const intakeId = this.afs.createId(); // Creates a new unique ID for the intake document
    const intakeRef = this.afs.collection(`${this.basePath}/${businessId}/intake`).doc(intakeId);

    // Set the intake form data in the Firestore document
    return new Observable(observer => {
      intakeRef.set(intakeForm).then(() => {
        // After the data is saved, return the saved data
        observer.next(intakeForm);
        observer.complete();
      }).catch(error => {
        console.error('Error saving intake form data', error);
        observer.error(error);
      });
    });
  }

  // Get all intake form data for a specific business
  getIntakeForms(businessId: string): Observable<IntakeForm[]> {
    return this.afs.collection(`${this.basePath}/${businessId}/intake`).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IntakeForm;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  // Get a specific intake form by its ID
  getIntakeForm(businessId: string, intakeId: string): Observable<IntakeForm | undefined> {
    return this.afs.collection(`${this.basePath}/${businessId}/intake`).doc<IntakeForm>(intakeId).valueChanges().pipe(
      map(intakeForm => intakeForm ? intakeForm : undefined)
    );
  }

  // Update an existing intake form
  updateIntakeForm(businessId: string, intakeId: string, intakeForm: Partial<IntakeForm>): Promise<void> {
    return this.afs.collection(`${this.basePath}/${businessId}/intake`).doc(intakeId).update(intakeForm);
  }

  // Delete an intake form
  deleteIntakeForm(businessId: string, intakeId: string): Promise<void> {
    return this.afs.collection(`${this.basePath}/${businessId}/intake`).doc(intakeId).delete();
  }
}
