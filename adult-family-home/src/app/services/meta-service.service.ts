import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Meta, Title } from '@angular/platform-browser';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  private defaultBusinessId = 'vfCMoPjAu2ROVBbKvk0D';
  constructor(private meta: Meta, private title: Title, private firestore: AngularFirestore,) {}

  updateMetaTags(metaData: { title: string; description: string; keywords: string }) {
    this.title.setTitle(metaData.title);
    this.meta.updateTag({ name: 'description', content: metaData.description });
    this.meta.updateTag({ name: 'keywords', content: metaData.keywords });
    this.meta.updateTag({ property: 'og:title', content: metaData.title });
    this.meta.updateTag({ property: 'og:description', content: metaData.description });
  }

  getMetaData(businessId: string): Observable<{ title: string; description: string; keywords: string }> {
    if(businessId == undefined || businessId == "" || businessId ==="" ){
      businessId = this.defaultBusinessId;
    }
    return this.firestore.collection('businesses').doc(businessId).valueChanges().pipe(
      map((data: any) => {
        console.log('Fetched business metadata:', data); // Debug log
        if (!data) {
          return {
            title: 'Default Title',
            description: 'Default Description',
            keywords: 'default, keywords',
          };
        }

        return {
          title: data.metaTitle || 'Default Title',
          description: data.metaDescription || 'Default Description',
          keywords: data.metaKeywords || 'default, keywords',
        };
      })
    );
  }
}
