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
   { url: 'assets/sharedAssets/istockphoto-478915838-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-480743801-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-502998071-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-613308420-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-653191338-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-655931804-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-804432288-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-912405752-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-918529390-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-941789670-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1022730404-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1066099806-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1097353864-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1162510523-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1170514008-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1207318385-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1307432717-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1315315044-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1319783351-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1324090651-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1335866199-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1344063915-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1432890664-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1453597643-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1551967154-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-2012854188-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-2032240867-2048x2048.jpg' },
    { url: 'assets/sharedAssets/5388429572_df9a403081_k.jpg' },
    { url: 'assets/sharedAssets/9676303919_32372bf834_o.jpg' },
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

  onBusinessImageSelection(url: string) {
    this.form.patchValue({
      businessStoryImageUrl: url
    });
    if (this.business) {
      this.business.businessStoryImageUrl = url;  // Save selected URL in business model
    }
  }

  onMotivationImageSelection(url: string) {
    this.form.patchValue({
      motivationImageUrl: url
    });
    if (this.business) {
      this.business.motivationImageUrl = url;  // Save selected URL in business model
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
