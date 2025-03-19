import { Injectable } from '@angular/core';
import { BusinessService } from './business.service';
import { Business } from '../model/business-questions.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BusinessDataService {
  private businessDataSubject = new BehaviorSubject<Business | null>(null);
  private businessIdSubject = new BehaviorSubject<string | null>(null);
  private locationsSubject = new BehaviorSubject<any[]>([]);
  public businessData$: Observable<Business | null> =
    this.businessDataSubject.asObservable();

  constructor(private businessService: BusinessService) {}

  // Method to load business data on app initialization
  loadBusinessData(businessId: string): Observable<Business | null> {
    console.log('BusinessDataService - loadBusinessData for ID:', businessId);

    if (this.businessDataSubject.value) {
      return this.businessDataSubject.asObservable();
    }

    return this.businessService.getBusinessData(businessId).pipe(
      map((business) => {
        if (!business) return null;

        // Ensure sections are included
        if (!business.sections) {
          business.sections = [];
          console.warn('⚠️ No sections found in Firestore. Initializing empty array.');
        }

        return business;
      }),
      tap((business) => {
        //console.log('✅ BusinessDataService - Business fetched:', business);
        this.businessDataSubject.next(business); // Update state with business and sections
        this.businessIdSubject.next(businessId);

        this.businessService.getLocations(businessId).subscribe((locations) => {
          // console.log("📍 Firestore Locations Retrieved:", locations);
          this.locationsSubject.next(locations);
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
}
