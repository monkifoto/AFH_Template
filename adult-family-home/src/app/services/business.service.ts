import { Injectable } from '@angular/core';
import {
  Firestore, collection, collectionData, doc, docData, getDoc,
  setDoc, updateDoc, deleteDoc, addDoc, query, where
} from '@angular/fire/firestore';
import {
  Storage, ref as storageRef, uploadBytesResumable, getDownloadURL as storageGetDownloadURL
} from '@angular/fire/storage';
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Business, Theme } from '../model/business-questions.model';
import { Section } from '../model/section.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private basePath = 'businesses';
  private defaultBusinessId = 'Z93oAAVwFAwhmdH2lLtB';

  constructor(private firestore: Firestore, private storage: Storage) {}

  createBusiness(business: Business): Observable<Business> {
    const newDocRef = doc(collection(this.firestore, this.basePath));
    return from(setDoc(newDocRef, { ...business, id: newDocRef.id })).pipe(
      switchMap(() => docData(newDocRef) as Observable<Business>)
    );
  }

  getBusinesses(): Observable<Business[]> {
    return collectionData(collection(this.firestore, this.basePath), { idField: 'id' }) as Observable<Business[]>;
  }

  getAllBusinesses(): Observable<Business[]> {
    return this.getBusinesses();
  }

  getActiveBusinesses(): Observable<Business[]> {
    const q = query(collection(this.firestore, this.basePath), where('isActive', '==', true));
    return collectionData(q, { idField: 'id' }) as Observable<Business[]>;
  }

  getBusiness(id: string): Observable<Business | undefined> {
    return this.getBusinessData(id);
  }

  getBusinessData(businessId: string | null | undefined): Observable<Business | undefined> {
    const resolvedBusinessId = businessId?.trim() || this.defaultBusinessId;
    const businessRef = doc(this.firestore, `${this.basePath}/${resolvedBusinessId}`);

    return docData(businessRef).pipe(
      switchMap((business) => {
        if (!business) return of(undefined);
        const businessWithId = { ...business, id: resolvedBusinessId } as Business;

        const sectionsRef = collection(this.firestore, `${this.basePath}/${resolvedBusinessId}/sections`);
        return collectionData(sectionsRef, { idField: 'id' }).pipe(
          switchMap((sections) => {
            const typedSections = sections as Section[];
            const updatedBusiness = { ...businessWithId, sections: typedSections };
            const themeRef = doc(this.firestore, `${this.basePath}/${resolvedBusinessId}/theme/themeDoc`);

            return from(getDoc(themeRef)).pipe(
              map(themeSnap => {
                const themeData = themeSnap.exists() ? themeSnap.data() as Theme : this.getDefaultTheme();
                updatedBusiness.theme = themeData;
                return updatedBusiness;
              })
            );
          })
        );
      })
    );
  }

  updateBusiness(id: string, business: Partial<Business>): Promise<void> {
    return updateDoc(doc(this.firestore, `${this.basePath}/${id}`), business);
  }

  deleteBusiness(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, `${this.basePath}/${id}`));
  }

  uploadFile(filePath: string, file: File) {
    const fileRef = storageRef(this.storage, filePath);
    return uploadBytesResumable(fileRef, file);
  }

  getDownloadURL(filePath: string): Observable<string> {
    const fileRef = storageRef(this.storage, filePath);
    return from(storageGetDownloadURL(fileRef));
  }

  updateThemeFileName(themeFileName: string, businessId: string = this.defaultBusinessId): Promise<void> {
    return updateDoc(doc(this.firestore, `${this.basePath}/${businessId}`), {
      'theme.themeFileName': themeFileName
    });
  }

  async getThemeFileName(businessId: string = this.defaultBusinessId): Promise<string> {
    const themeRef = doc(this.firestore, `${this.basePath}/${businessId}/theme/themeDoc`);
    const themeSnap = await getDoc(themeRef);
    return themeSnap.exists() ? (themeSnap.data()?.['themeFileName'] || 'styles.css') : 'default.css';
  }

  createSection(businessId: string, section: any): Promise<any> {
    const sectionsRef = collection(this.firestore, `${this.basePath}/${businessId}/sections`);
    return addDoc(sectionsRef, section);
  }

  getSections(businessId: string): Observable<any[]> {
    const sectionsRef = collection(this.firestore, `${this.basePath}/${businessId}/sections`);
    return collectionData(sectionsRef, { idField: 'sectionId' });
  }

  updateSection(businessId: string, sectionId: string, section: any): Promise<void> {
    return updateDoc(doc(this.firestore, `${this.basePath}/${businessId}/sections/${sectionId}`), section);
  }

  deleteSection(businessId: string, sectionId: string): Promise<void> {
    return deleteDoc(doc(this.firestore, `${this.basePath}/${businessId}/sections/${sectionId}`));
  }

  addLocation(businessId: string, location: any): Promise<void> {
    const locationsRef = collection(this.firestore, `${this.basePath}/${businessId}/locations`);
    const newId = doc(locationsRef).id;
    return setDoc(doc(locationsRef, newId), { id: newId, ...location });
  }

  getLocations(businessId: string): Observable<any[]> {
    const locationsRef = collection(this.firestore, `${this.basePath}/${businessId}/locations`);
    return collectionData(locationsRef, { idField: 'id' });
  }

  updateLocation(businessId: string, locationId: string, location: any): Promise<void> {
    return updateDoc(doc(this.firestore, `${this.basePath}/${businessId}/locations/${locationId}`), location);
  }

  deleteLocation(businessId: string, locationId: string): Promise<void> {
    return deleteDoc(doc(this.firestore, `${this.basePath}/${businessId}/locations/${locationId}`));
  }

  private getDefaultTheme(): Theme {
    return {
      themeFileName: 'styles.css',
      primaryColor: '#fffaf2',
      secondaryColor: '#f8f3f0',
      accentColor: '#F0C987',
      backgroundColor: '#F5F3E7',
      darkBackgroundColor: '#4C6A56',
      textColor: '#2F2F2F',
      navBackgroundColor: '#F5F3E7',
      navTextColor: '#33372C',
      navActiveBackground: '#33372C',
      navActiveText: '#ffffff',
      buttonColor: '#D9A064',
      buttonHoverColor: '#c9605b',
      themeType: 'demo',
    };
  }
}
