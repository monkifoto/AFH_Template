import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Observable,of } from 'rxjs';
import { map,switchMap, finalize } from 'rxjs/operators';
import { Business, Theme } from '../model/business-questions.model';
import { Section } from '../model/section.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private basePath = 'businesses';
  private defaultBusinessId = 'Z93oAAVwFAwhmdH2lLtB';
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
    const resolvedBusinessId = businessId && businessId.trim() ? businessId : 'defaultBusinessId';

    return this.afs.collection('businesses').doc<Business>(resolvedBusinessId).snapshotChanges().pipe(
      switchMap(action => {
        const data = action.payload.data();
        const docId = action.payload.id;

        if (!data) {
          return of(undefined);
        }

        const businessData: Business = { ...data, id: docId };

        return this.afs.collection('sections', ref => ref.where('businessId', '==', docId)).snapshotChanges().pipe(
          map(sectionActions => {
            const sections = sectionActions.map(a => {
              const sectionData = a.payload.doc.data() as Section;
              return { ...sectionData, id: a.payload.doc.id };
            });

            console.log("🔥 Loaded Sections from Firestore Collection:", sections);
            return { ...businessData, sections };
          }),
          switchMap(updatedBusiness => {
            const defaultTheme: Theme = {
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

            return this.afs.collection(`businesses/${docId}/theme`).doc<Theme>('themeDoc').snapshotChanges().pipe(
              map(themeAction => {
                const themeData = themeAction.payload.data() || defaultTheme;
                updatedBusiness.theme = themeData;
                return updatedBusiness;
              })
            );
          })
        );
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

  updateThemeFileName(themeFileName: string, businessId: string = this.defaultBusinessId): Promise<void> {
    return this.afs.doc(`${this.basePath}/${businessId}`).update({
      'theme.themeFileName': themeFileName
    });
  }

  getThemeFileName(businessId: string = this.defaultBusinessId): Promise<string> {
    const businessDocRef = this.afs.collection<Business>(this.basePath).doc(businessId);
    const themeDocRef = businessDocRef.collection('theme').doc('themeDoc');

    console.log(`Fetching theme for business ID: ${businessId}`);

    return themeDocRef.get().toPromise().then(doc => {
      if (doc && doc.exists) {
        const themeData = doc.data();
        console.log(`Theme document found:`, themeData);

        // Accessing the themeFileName directly without folder structure
        const themeFileName = themeData?.['themeFileName'] || 'styles.css';
        console.log(`Retrieved themeFileName: ${themeFileName}`);
        return themeFileName; // Ensure this is just the filename
      } else {
        console.warn(`No theme document found for business ID: ${businessId}. Using default theme.`);
        return 'default.css';
      }
    }).catch(error => {
      console.error(`Error fetching theme file name for business ID: ${businessId}`, error);
      return 'default.css';
    });
  }

  // Add section to Firestore
  createSection(businessId: string, section: any): Promise<any> {
    return this.afs.collection(`${this.basePath}/${businessId}/sections`).add(section);
  }

  getSections(businessId: string): Observable<any[]> {
    return this.afs.collection(`${this.basePath}/${businessId}/sections`)
      .snapshotChanges() // Get real-time changes
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const sectionId = a.payload.doc.id; // The document ID is the sectionId
          // console.log("🔥 Fetched section from Firestore:", { sectionId, ...data }); // Log the section with sectionId
          return { sectionId, ...data }; // Ensure the sectionId is merged correctly
        }))
      );
  }


  updateSection(businessId: string, sectionId: string, section: any): Promise<void> {
    return this.afs.doc(`${this.basePath}/${businessId}/sections/${sectionId}`).update(section);
  }

  deleteSection(businessId: string, sectionId: string): Promise<void> {
    return this.afs.doc(`${this.basePath}/${businessId}/sections/${sectionId}`).delete();
  }

  addLocation(businessId: string, location: any): Promise<void> {
    const locationRef = this.afs.collection(`businesses/${businessId}/locations`);
    const newLocationId = this.afs.createId(); // Generate unique ID for the location
    return locationRef.doc(newLocationId).set({ id: newLocationId, ...location });
  }

  /** 📌 Get All Locations for a Business */
  getLocations(businessId: string): Observable<any[]> {
    return this.afs.collection(`businesses/${businessId}/locations`).snapshotChanges().pipe(
      map(actions => {
        if (!actions.length) {
          console.warn(`⚠️ No locations found in Firestore for Business ID: ${businessId}`);
        }
        return actions.map(a => {
          const data = a.payload.doc.data();
          if (typeof data === 'object' && data !== null) {
            return { id: a.payload.doc.id, ...data }; // ✅ Include document ID
          } else {
            console.error(`❌ Firestore data format error:`, data);
            return { id: a.payload.doc.id }; // ✅ At least return ID
          }
        });
      })
    );
  }

  /** 📌 Update an Existing Location */
  updateLocation(businessId: string, locationId: string, location: any): Promise<void> {
    return this.afs.doc(`businesses/${businessId}/locations/${locationId}`).update(location);
  }

  /** 📌 Delete a Location */
  deleteLocation(businessId: string, locationId: string): Promise<void> {
    return this.afs.doc(`businesses/${businessId}/locations/${locationId}`).delete();
  }

}
