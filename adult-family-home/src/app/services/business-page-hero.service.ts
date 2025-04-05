import { Injectable } from '@angular/core';
import {
  Firestore, collection, collectionData, doc, setDoc,
  deleteDoc, addDoc
} from '@angular/fire/firestore';
import { PageHero } from '../model/business-questions.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusinessPageHeroService {
  constructor(private firestore: Firestore) {}

  generateNewId(): string {
    return doc(collection(this.firestore, 'temp')).id; // For ID generation only
  }

  getPageHeroes(businessId: string): Observable<PageHero[]> {
    const heroesRef = collection(this.firestore, `businesses/${businessId}/pageHeroes`);
    return collectionData(heroesRef, { idField: 'id' }) as Observable<PageHero[]>;
  }

  savePageHero(businessId: string, hero: PageHero): Promise<void | any> {
    const heroRef = collection(this.firestore, `businesses/${businessId}/pageHeroes`);
    if (hero.id) {
      return setDoc(doc(this.firestore, `businesses/${businessId}/pageHeroes/${hero.id}`), hero);
    } else {
      return addDoc(heroRef, hero);
    }
  }

  deletePageHero(businessId: string, heroId: string): Promise<void> {
    const heroDocRef = doc(this.firestore, `businesses/${businessId}/pageHeroes/${heroId}`);
    return deleteDoc(heroDocRef);
  }
}
