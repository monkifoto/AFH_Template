import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-about-us-page',
  templateUrl: './about-us-page.component.html',
  styleUrls: ['./about-us-page.component.css'],
})
export class AboutUsPageComponent implements OnInit {
  @Input() form!: FormGroup;
  // Separate form for adding a unique service and why choose us
  newUniqueServiceForm!: FormGroup;
  newWhyChooseForm!: FormGroup;

  showUniqueServiceForm = false;
  showWhyChooseForm = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize the forms here
    this.newUniqueServiceForm = this.fb.group({
      name: [''],
      description: [''],
    });

    this.newWhyChooseForm = this.fb.group({
      name: [''],
      description: [''],
    });
  }

  get uniqueServices(): FormArray {
    return this.form.get('uniqueService') as FormArray;
  }

  get whyChoose(): FormArray {
    return this.form.get('whyChoose') as FormArray;
  }

  toggleUniqueServiceForm(): void {
    this.showUniqueServiceForm = !this.showUniqueServiceForm;
  }

  toggleWhyChooseForm(): void {
    this.showWhyChooseForm = !this.showWhyChooseForm;
  }

  addUniqueService(): void {
    const newService = this.fb.group(this.newUniqueServiceForm.value);
    this.uniqueServices.push(newService);
    this.newUniqueServiceForm.reset();
    this.showUniqueServiceForm = false;
  }

  addWhyChoose(): void {
    const newReason = this.fb.group(this.newWhyChooseForm.value);
    this.whyChoose.push(newReason);
    this.newWhyChooseForm.reset();
    this.showWhyChooseForm = false;
  }

  removeUniqueService(index: number): void {
    this.uniqueServices.removeAt(index);
  }

  removeWhyChoose(index: number): void {
    this.whyChoose.removeAt(index);
  }
}
