import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Business, ServiceItem } from 'src/app/model/business-questions.model';

@Component({
  selector: 'app-services-page',
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.css']
})
export class ServicesPageComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() business!: Business | undefined;
  @Input() businessId!: string;
  newServiceForm!: FormGroup;
  newBenefitsForm!: FormGroup;


  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize serviceForm with necessary fields
    this.newServiceForm = this.fb.group({
      name: ['', Validators.required]
    });

    // Initialize benefitsForm with necessary fields
    this.newBenefitsForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  populateServices(services: ServiceItem[]): void {

    this.services.clear();
    (services ?? []).forEach((svc) => {
      const servicesForm = this.fb.group({
        name: [svc.name],
      });
      this.services.push(servicesForm);
    });
  }

  populateBenefits(benefits: ServiceItem[]): void {
    this.benefits.clear();
    (benefits ?? []).forEach((bnf) => {
      const benefitsFormForm = this.fb.group({
        name: [bnf.name],
      });
      this.benefits.push(benefitsFormForm);
    });
  }


  get services(): FormArray {
    return this.form.get('services') as FormArray;
  }

  get benefits(): FormArray {
    return this.form.get('benefits') as FormArray;
  }


  addService() {
    if (this.newServiceForm.valid) {
      this.services.push(this.fb.group(this.newServiceForm.value));
      this.newServiceForm.reset();
    }
  }

  removeService(index: number): void {
    this.services.removeAt(index);
  }

  addBenefit() {
    if (this.newBenefitsForm.valid) {
      this.benefits.push(this.fb.group(this.newBenefitsForm.value));
      this.newBenefitsForm.reset();
    }
  }

  removeBenefit(index: number): void {
    this.benefits.removeAt(index);
  }


}
