import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Business, ListItem } from 'src/app/model/business-questions.model';

@Component({
  selector: 'app-about-us-page',
  templateUrl: './about-us-page.component.html',
  styleUrls: ['./about-us-page.component.css'],
})
export class AboutUsPageComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() business!: Business | undefined;
  @Input() businessId!: string;
  newUniqueServiceForm!: FormGroup;
  newWhyChooseForm!: FormGroup;

  showUniqueServiceForm = false;
  showWhyChooseForm = false;

  predefinedImages = [
    { url: 'assets/sharedAssets/image_fx_(1).jpg' },
    { url: 'assets/sharedAssets/image_fx_(2).jpg' },
    { url: 'assets/sharedAssets/image_fx_(3).jpg' },
    { url: 'assets/sharedAssets/image_fx_(4).jpg' },
    { url: 'assets/sharedAssets/image_fx_(5).jpg' },
  ];


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

  populateUniqueService(uniqueService: ListItem[]): void {
    this.uniqueServices.clear();
    (uniqueService ?? []).forEach((us) => {
      const uniqueServiceForm = this.fb.group({
        name: [us.name],
        description: [us.description],
      });
      this.uniqueServices.push(uniqueServiceForm);
    });
  }

  populateWhyChoose(whyChoose: ListItem[]): void {
    this.whyChoose.clear();
    (whyChoose ?? []).forEach((why) => {
      const whyChooseForm = this.fb.group({
        name: [why.name],
        description: [why.description],
      });
      this.whyChoose.push(whyChooseForm);
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

  onMissionImageSelection(url: string) {
    this.form.patchValue({
      missionImageUrl: url
    });
    if (this.business) {
      this.business.missionImageUrl = url;  // Save selected URL in business model
    }
  }

  onVisionImageSelection(url: string) {
    this.form.patchValue({
      visionImageUrl: url
    });
    if (this.business) {
      this.business.visionImageUrl = url;  // Save selected URL in business model
    }
  }
}
