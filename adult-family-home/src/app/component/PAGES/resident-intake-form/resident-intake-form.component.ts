import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-resident-intake-form',
  templateUrl: './resident-intake-form.component.html',
  styleUrls: ['./resident-intake-form.component.css']
})
export class ResidentIntakeFormComponent {
  intakeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.intakeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      referralSource: ['', Validators.required],
      relationToResident: ['', Validators.required],
      residentName: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      medicalHistory: ['', Validators.required],
      height: ['', Validators.required],
      weight: ['', Validators.required],
      reasonForMoving: ['', Validators.required],
      rnAssessment: ['', Validators.required],
      eating: ['', Validators.required],
      personalHygiene: ['', Validators.required],
      bathing: ['', Validators.required],
      toileting: ['', Validators.required],
      mobility: ['', Validators.required],
      transfers: ['', Validators.required],
      medicationAssistance: ['', Validators.required],
      memoryIssues: ['', Validators.required],
      behavior: [''],
      skinCondition: [''],
      additionalInfo: [''],
      currentLivingSituation: ['', Validators.required],
      targetMoveInDate: ['', Validators.required],
      disclosureSummary: [''],
      questions: ['']
    });
  }

  onSubmit() {
    if (this.intakeForm.valid) {
      console.log(this.intakeForm.value);
      // Process the form data, e.g., save to the server or database
    }
  }
}
