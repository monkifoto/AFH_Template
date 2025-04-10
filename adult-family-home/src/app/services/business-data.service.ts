import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { BusinessService } from './business.service';
import { BusinessPageHeroService } from './business-page-hero.service';
import { Business } from '../model/business-questions.model';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BusinessDataService {
  private businessDataSubject = new BehaviorSubject<Business | null>(null);
  private businessIdSubject = new BehaviorSubject<string | null>(null);
  private locationsSubject = new BehaviorSubject<any[]>([]);
  private pageHeroSubject = new BehaviorSubject<any[]>([]);

  public businessData$: Observable<Business | null> =
    this.businessDataSubject.asObservable();

  constructor(
    private businessService: BusinessService,
    private businessPageHeroService: BusinessPageHeroService
  ) {}

  // ✅ Called at app start
  loadBusinessData(businessId: string): Observable<Business | null> {
    console.log('BusinessDataService - loadBusinessData for ID:', businessId);

    if (this.businessDataSubject.value) {
      return this.businessDataSubject.asObservable();
    }

    return this.businessService.getBusinessData(businessId).pipe(
      map((business) => {
        if (!business) return null;

        // Ensure sections are always defined
        if (!business.sections) {
          business.sections = [];
          console.warn('⚠️ No sections found in Firestore. Initializing empty array.');
        }

        return business;
      }),
      tap((business) => {
        this.businessDataSubject.next(business);
        this.businessIdSubject.next(businessId);

        this.businessService.getLocations(businessId).subscribe((locations) => {
          this.locationsSubject.next(locations);
        });

        this.businessPageHeroService.getPageHeroes(businessId).subscribe((pageHero) => {
          this.pageHeroSubject.next(pageHero);
        });
      })
    );
  }

  getBusinessData(): Observable<Business | null> {
    return this.businessDataSubject.asObservable();
  }

  getBusinessId(): Observable<string | null> {
    return this.businessIdSubject.asObservable();
  }

  getLocations(): Observable<any[]> {
    return this.locationsSubject.asObservable();
  }

  getPageHeros(): Observable<any[]> {
    return this.pageHeroSubject.asObservable();
  }

  getLocationsForBusiness(businessId: string): Observable<any[]> {
    return this.businessService.getLocations(businessId);
  }
}
