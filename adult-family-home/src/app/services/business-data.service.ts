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
    console.log('BusinessDataService - loadBusinessData for ID:', businessId);
    return this.businessService.getBusinessData(businessId).pipe(
      map((business) => business ?? null),
      tap((business) => {
        console.log('BusinessDataService - Business fetched:', business);
        this.businessDataSubject.next(business); // Update subject
        this.businessIdSubject.next(businessId);
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
