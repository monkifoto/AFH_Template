import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Section } from '../model/section.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessSectionsService {
  private collectionName = 'businesses';

  constructor(private firestore: AngularFirestore) {}

  /**
   * Fetches sections for a given business ID and page.
   * @param businessId The unique identifier of the business.
   * @param page The page where the sections should appear (e.g., 'home').
   * @returns Observable of section data
   */
  getBusinessSections(businessId: string, page: string): Observable<Section[]> {
    console.log(`Fetching Sections for Business ID: ${businessId}, Page: ${page}`);

    return this.firestore
      .collection('businesses')
      .doc(businessId)
      .collection<Section>('sections', ref => ref.where('page', '==', page))
      .snapshotChanges() // Using snapshotChanges for debugging
      .pipe(
        map(actions => {
          console.log("Firestore Raw Actions:", actions); // Log raw actions to check if query is returning results
          const sections = actions.map(a => {
            const data = a.payload.doc.data() as Section;
            return { ...data, id: a.payload.doc.id }; // Ensure each section has an ID
          });
          console.log("Retrieved Sections from Firestore:", sections);
          return sections;
        })
      );
  }


  /**
   * Maps section type to the appropriate Angular component.
   * @param sectionType The section type stored in Firestore
   * @returns Corresponding Angular component identifier
   */
  private mapComponent(sectionType: string): string {
    const componentMap: { [key: string]: string } = {
      'center-text': 'center-text',
      'item-list': 'item-list',
      'features': 'features',
      'testimonials': 'testimonials',
      'why-us': 'why-us',
      'contact-form': 'contact-form',
      'gallery': 'gallery'
    };
    return componentMap[sectionType] || 'default-component';
  }
}
