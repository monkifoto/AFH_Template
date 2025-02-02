import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Business, ListItem } from 'src/app/model/business-questions.model';

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

  collapsedServices: boolean[] = [];
  collapsedBenefits: boolean[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize serviceForm with necessary fields
    this.newServiceForm = this.fb.group({
      name: ['', Validators.required],
      icon: [''],
      description:[]

    });

    // Initialize benefitsForm with necessary fields
    this.newBenefitsForm = this.fb.group({
      name: ['', Validators.required],
      icon: [''],
      description:[]
    });
  }

  populateServices(services: ListItem[]): void {

    this.services.clear();
    (services ?? []).forEach((svc) => {
      const servicesForm = this.fb.group({
        name: [svc.name],
        icon: [svc.icon],
        description:[svc.description]
      });
      this.services.push(servicesForm);
    });
  }

  populateBenefits(benefits: ListItem[]): void {
    this.benefits.clear();
    (benefits ?? []).forEach((bnf) => {
      const benefitsFormForm = this.fb.group({
        name: [bnf.name],
        icon: [bnf.icon],
        description:[bnf.description]
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

  initializeCollapsedStates() {
    this.collapsedServices = this.services.controls.map(() => false);
    this.collapsedBenefits = this.benefits.controls.map(() => false);
  }

  toggleService(index: number) {
    this.collapsedServices[index] = !this.collapsedServices[index];
  }

  toggleBenefit(index: number) {
    this.collapsedBenefits[index] = !this.collapsedBenefits[index];
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
