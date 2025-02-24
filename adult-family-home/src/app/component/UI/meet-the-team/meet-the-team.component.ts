import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebContentService } from 'src/app/services/web-content.service';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Business, Employee } from 'src/app/model/business-questions.model';

@Component({
  selector: 'app-meet-the-team',
  templateUrl: './meet-the-team.component.html',
  styleUrls: ['./meet-the-team.component.css']
})
export class MeetTheTeamComponent implements OnInit {
  @Input() businessId!: string;
  employees$!: Observable<Employee[]>;

  constructor(
    private route: ActivatedRoute,
    private employeeService: WebContentService
  ) {}

  ngOnInit(): void {
    this.employees$ = this.route.queryParamMap.pipe(
      map(params => params.get('id') || ''), // Default to empty string if id is not provided
      switchMap(businessId => {
        // if (!businessId) {
        //   throw new Error('Business ID is required');
        // }
        return this.employeeService.getEmployeesByBusinessId(businessId);
      }),
      catchError(error => {
        console.error('Error fetching employees:', error);
        return of([] as Employee[]); // Return an empty array in case of error
      })
    );
  }

  // ngOnInit(): void {
  //   console.log(this.businessId);
  //   if (this.businessId) {
  //     this.employees$ = this.employeeService.getEmployeesByBusinessId(this.businessId).pipe(
  //       switchMap(employees => {
  //         console.log(employees);
  //         const photoObservables = employees.map(employee =>
  //           this.employeeService.getEmployeePhoto(employee.photoPath).pipe(
  //             map(photoUrl => ({
  //               ...employee,
  //               photoUrl
  //             }))
  //           )
  //         );
  //         return forkJoin(photoObservables);
  //       })
  //     );
  //   }
  // }
  // ngOnInit(): void {
  //   this.employees$ = this.route.paramMap.pipe(
  //     switchMap(params => {
  //       const businessId = params.get('id');
  //       if (!businessId) {
  //         throw new Error('Business ID is required');
  //       }
  //       return this.employeeService.getEmployeesByBusinessId(businessId).pipe(
  //         switchMap(employees => {
  //           const photoObservables = employees.map(employee =>
  //             this.employeeService.getEmployeePhoto(employee.photoPath).pipe(
  //               map(photoUrl => ({
  //                 ...employee,
  //                 photoUrl
  //               }))
  //             )
  //           );
  //           return forkJoin(photoObservables);
  //         })
  //       );
  //     })
  //   );
  // }
}
