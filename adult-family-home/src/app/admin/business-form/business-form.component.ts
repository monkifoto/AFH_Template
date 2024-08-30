import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-business-form',
  templateUrl: './business-form.component.html',
  styleUrls: ['./business-form.component.css']
})
export class BusinessFormComponent implements OnInit {
  businessForm!: FormGroup;

  // constructor(private fb: FormBuilder, private db: AngularFireDatabase) { }

  ngOnInit(): void {
  //   this.businessForm = this.fb.group({
  //     businessName: [''],
  //     tagline: [''],
  //     // Initialize other form controls similarly
  //   });
  }

  // onSubmit(): void {
  //   if (this.businessForm.valid) {
  //     const formValue = this.businessForm.value;
  //     this.db.list('businesses').push(formValue)
  //       .then(() => alert('Business details saved successfully!'))
  //       .catch(err => console.error('Error saving business details', err));
  //   }
  // }

}
