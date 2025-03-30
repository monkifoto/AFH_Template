import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PageHero } from '../model/business-questions.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BusinessPageHeroService {
  constructor(private firestore: AngularFirestore) {}

  generateNewId(): string {
    return this.firestore.createId();
  }


  getPageHeroes(businessId: string) {
    return this.firestore
      .collection<PageHero>(`businesses/${businessId}/pageHeroes`)
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as PageHero;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  savePageHero(businessId: string, hero: PageHero) {
    const heroRef = this.firestore.collection(`businesses/${businessId}/pageHeroes`);
    if (hero.id) {
      return heroRef.doc(hero.id).set(hero);
    } else {
      return heroRef.add(hero);
    }
  }

  deletePageHero(businessId: string, heroId: string) {
    return this.firestore.doc(`businesses/${businessId}/pageHeroes/${heroId}`).delete();
  }
}
