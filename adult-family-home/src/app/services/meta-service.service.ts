import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Meta, Title } from '@angular/platform-browser';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  private defaultBusinessId = 'Z93oAAVwFAwhmdH2lLtB';
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
        if (!data) {
          return {
            title: 'No Metadata Title',
            description: 'No Default Description',
            keywords: 'default, keywords',
          };
        }

        return {
          title: data.metaTitle || 'Adult Family Home',
          description: data.metaDescription || 'Best Adult Family home in Washington State',
          keywords: data.metaKeywords || 'default, keywords',
        };
      })
    );
  }
}
