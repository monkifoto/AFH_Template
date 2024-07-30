import { Component, OnInit } from '@angular/core';
import { WebContentService, Employee } from 'src/app/services/web-content.service';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-meet-the-team',
  templateUrl: './meet-the-team.component.html',
  styleUrls: ['./meet-the-team.component.css']
})
export class MeetTheTeamComponent implements OnInit {
  employees$!: Observable<Employee[]>;

  constructor(private employeeService: WebContentService) {}

  ngOnInit(): void {
    this.employees$ = this.employeeService.getEmployees().pipe(
      switchMap(employees => {
        const photoObservables = employees.map(employee =>
          this.employeeService.getEmployeePhoto(employee.photoPath).pipe(
            map(photoUrl => ({
              ...employee,
              photoUrl
            }))
          )
        );
        return forkJoin(photoObservables);
      })
    );
  }
}
