import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Business } from 'src/app/model/business-questions.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  @Input() form!: FormGroup;
  @Input() business!: Business | undefined;
  @Input() businessId!: string;
  ngOnInit(): void {

  }
}
