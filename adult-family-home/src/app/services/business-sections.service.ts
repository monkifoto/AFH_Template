import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Section } from '../model/section.model';
import { UploadService } from './upload.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessSectionsService {
  private collectionName = 'businesses';

  constructor(private firestore: AngularFirestore, private uploadService: UploadService) {}

  generateNewId(): string {
    return this.firestore.createId();
  }

  getAllBusinesses(): Observable<any[]> {
    return this.firestore.collection('businesses').valueChanges();
  }
  /**
   * Fetches all sections for a given business ID.
   * @param businessId The unique identifier of the business.
   * @returns Observable of section data
   */
  getAllBusinessSections(businessId: string): Observable<Section[]> {
    //console.log(`Fetching All Sections from Collection for Business ID: ${businessId}`);

    return this.firestore
      .collection(this.collectionName)
      .doc(businessId)
      .collection<Section>('sections')
      .snapshotChanges()
      .pipe(
        map(actions => {
          //console.log("Firestore Raw Actions:", actions);

          return actions.map(a => {
            const data = a.payload.doc.data() as Section;
            return { ...data, id: a.payload.doc.id };
          });
        })
      );
  }

  /**
   * Fetches sections for a specific business and page.
   * @param businessId The unique identifier of the business.
   * @param page The page where the sections should appear (e.g., 'home').
   * @returns Observable of section data
   */
  getBusinessSections(businessId: string, page: string): Observable<Section[]> {
   // console.log(`Fetching Sections for Business ID: ${businessId}, Page: ${page}`);

    return this.firestore
      .collection(this.collectionName)
      .doc(businessId)
      .collection<Section>('sections', ref => ref.where('page', '==', page))
      .snapshotChanges()
      .pipe(
        map(actions => {
          //console.log("Firestore Raw Actions:", actions);
          return actions.map(a => {
            const data = a.payload.doc.data() as Section;
            return { ...data, id: a.payload.doc.id };
          });
        })
      );
  }

  /**
   * Creates or updates a section document in Firestore.
   * @param businessId The unique identifier of the business.
   * @param section The section data to save.
   * @returns A promise that resolves when the save is complete.
   */
  saveSection(businessId: string, section: Section): Promise<void> {
    console.log("🔄 Attempting to save section:", section);

    // Ensure section ID is NOT overwritten if it already exists
    if (!section.id || section.id.trim() === '') {
      section.id = this.firestore.createId();  // ✅ Generate ID only for new sections
    } else {
      console.log("✏️ Updating existing section with ID:", section.id);
    }

    return this.firestore
      .collection(this.collectionName)
      .doc(businessId)
      .collection('sections')
      .doc(section.id)
      .set(section, { merge: true });  // ✅ Merge ensures it updates instead of replacing everything
  }

  /**
   * Deletes a section from Firestore.
   * @param businessId The unique identifier of the business.
   * @param sectionId The section ID to delete.
   * @returns A promise that resolves when the delete is complete.
   */
  deleteSection(businessId: string, sectionId: string): Promise<void> {
    return this.firestore
      .collection(this.collectionName)
      .doc(businessId)
      .collection('sections')
      .doc(sectionId)
      .delete();
  }

  /**
   * Uploads an image and ensures a valid URL is returned.
   * @param file The file to upload.
   * @param businessId The business ID for reference.
   * @param sectionId The section ID for storage reference.
   * @param title (Optional) Title associated with the upload.
   * @param description (Optional) Description for the uploaded image.
   * @param link (Optional) External link for the image.
   * @param order (Optional) Order of the image.
   * @returns A promise that resolves with the image URL, or an empty string if no URL is returned.
   */
  async uploadImage(
    file: File,
    businessId: string,
    sectionId: string,
    title: string = '',
    description: string = '',
    link: string = '',
    order: string = ''
  ): Promise<string> {
    try {
      const { downloadUrl } = this.uploadService.uploadFile(file, businessId, 'sections', title, description, link, order);

      return new Promise((resolve, reject) => {
        downloadUrl.subscribe({
          next: (url) => {
            if (!url) {
              reject("❌ Image URL is undefined.");
            } else {
              console.log("✅ Image uploaded successfully:", url);
              resolve(url);
            }
          },
          error: (error) => {
            console.error("❌ Error getting image URL:", error);
            reject(error);
          }
        });
      });

    } catch (error) {
      console.error("❌ Error uploading image:", error);
      return "";
    }
  }

  /**
   * Maps section type to the appropriate Angular component.
   * @param sectionType The section type stored in Firestore.
   * @returns Corresponding Angular component identifier.
   */
  private mapComponent(sectionType: string): string {
    const componentMap: { [key: string]: string } = {
      'center-text': 'center-text',
      'left-text': 'left-text',
      'right-text': 'right-text',
      'list-item': 'list-item',
      // 'features': 'features',
      // 'why-us': 'why-us',
      // 'contact-form': 'contact-form',
      // 'gallery': 'gallery'
    };
    return componentMap[sectionType] || 'default-component';
  }
}
