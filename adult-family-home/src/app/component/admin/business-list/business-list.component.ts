import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';



@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css']
})
export class BusinessListComponent implements OnInit {
  businesses$!: Observable<any[]>;

  constructor() { }

  ngOnInit(): void {

  }

}
