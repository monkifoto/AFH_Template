import { Injectable } from '@angular/core';
import { BusinessService } from './business.service';
import { Business } from '../model/business-questions.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BusinessDataService {
  private businessDataSubject = new BehaviorSubject<Business | null>(null);
  private businessIdSubject = new BehaviorSubject<string | null>(null);
  public businessData$: Observable<Business | null> = this.businessDataSubject.asObservable();

  constructor(private businessService: BusinessService) {}

  // Method to load business data on app initialization
  loadBusinessData(businessId: string): Observable<Business | null> {
    return this.businessService.getBusinessData(businessId).pipe(
      // Convert undefined to null to match the expected type
      map(business => business ?? null),
      tap(business => {
        // Update business data and businessIdSubject with the provided businessId
        this.businessDataSubject.next(business);
        this.businessIdSubject.next(businessId); // Update the businessId
      })
    );
  }
  // Accessor method for components to get the latest business data
  // get businessData(): Business | null {
  //   return this.businessDataSubject.value;
  // }

  getBusinessData(): Observable<Business | null> {
    return this.businessDataSubject.asObservable();
  }

  getBusinessId(): Observable<string | null> {
    return this.businessIdSubject.asObservable();
  }
}
