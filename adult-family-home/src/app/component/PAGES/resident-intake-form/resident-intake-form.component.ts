import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IntakeForm } from 'src/app/model/intake-form.model';
import { IntakeService } from 'src/app/services/intake.service';
import { BusinessDataService } from 'src/app/services/business-data.service';

@Component({
  selector: 'app-resident-intake-form',
  templateUrl: './resident-intake-form.component.html',
  styleUrls: ['./resident-intake-form.component.css']
})
export class ResidentIntakeFormComponent implements OnInit {
  businessId: string | null = null;
  intakeForm: FormGroup;

  constructor(private fb: FormBuilder, private intakeService: IntakeService, private businessDataService: BusinessDataService,) {
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
  ngOnInit(): void {
    // Subscribe to the businessId from the BusinessDataService
    this.businessDataService.getBusinessId().subscribe((id) => {
      this.businessId = id;
    });
  }

  onSubmit() {
    if (this.intakeForm.valid) {
      console.log(this.intakeForm.value);
      const formData: IntakeForm = this.intakeForm.value;
      if(this.businessId)
      this.intakeService.saveIntakeForm(formData, this.businessId ).subscribe(
        response => {
          console.log('Intake form saved successfully!', response);
        },
        error => {
          console.error('Error saving intake form:', error);
        }
      );
    }
  }
}
