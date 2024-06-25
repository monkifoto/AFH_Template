import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/business.service';
import { Business } from 'src/app/model/business-questions.model';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';



@Component({
  selector: 'app-business-question-form',
  templateUrl: './business-question-form.component.html',
  styleUrls: ['./business-question-form.component.css']
})
export class BusinessQuestionFormComponent implements OnInit {
  businessForm!: FormGroup;
  uploadProgress: { [key: string]: Observable<number | undefined> } = {};

  constructor( private fb: FormBuilder, private businessService: BusinessService ) { }

  ngOnInit(): void {
    this.businessForm = this.fb.group({
      businessName: ['', Validators.required],
      tagline: [''],
      uniqueService: ['', Validators.required],
      whyChoose: ['', Validators.required],
      businessStory: ['', Validators.required],
      motivation: ['', Validators.required],
      mission: ['', Validators.required],
      vision: ['', Validators.required],
      certifications: ['', Validators.required],
      targetAudience: ['', Validators.required],
      services: ['', Validators.required],
      specialPrograms: ['', Validators.required],
      tours: ['', Validators.required],
      freeConsulting: ['', Validators.required],
      websiteGoals: ['', Validators.required],
      logoImage: [''],
      ownerImagesBios: ['', Validators.required],
      staffImagesBios: ['', Validators.required],
      facilityImages: [''],
      lifestyleImages: [''],
      mediaFeatures: ['', Validators.required],
      ratings: ['', Validators.required],
      testimonials: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      fax: [''],
      email: ['', Validators.required],
      businessHours: ['', Validators.required],
      socialMedia: ['', Validators.required],
      welcomeMessage: ['', Validators.required],
      keyServicesHighlights: ['', Validators.required],
      teamValues: ['', Validators.required],
      serviceBenefits: ['', Validators.required],
      pricingStructure: ['', Validators.required],
      contactFormDetails: ['', Validators.required],
      mapDirections: ['', Validators.required],
      faqs: ['', Validators.required],
      blogNews: ['', Validators.required],
      photoGallery: ['', Validators.required]
    });
  }

  onFileChange(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `uploads/${file.name}`;
      //const task = this.businessService.uploadFile(filePath, file);

      // this.uploadProgress[controlName] = task.percentageChanges();

      // task.snapshotChanges().pipe(
      //   finalize(() => {
      //     this.businessService.getDownloadURL(filePath).subscribe(url => {
      //           const currentValue = this.businessForm.get('controlName')?.value;
      //           if (Array.isArray(currentValue)) {
      //             this.businessForm.patchValue({ [controlName]: [...currentValue, url] });
      //           } else {
      //             this.businessForm.patchValue({ [controlName]: url });
      //           }

      //     });
      //   })
      // ).subscribe();
    }
  }

  onSubmit(): void {
    if (this.businessForm.valid) {
      const formValue: Business = this.businessForm.value;
      // this.businessService.createBusiness(formValue)
      //   .then(() => alert('Business details saved successfully!'))
      //   .catch(err => console.error('Error saving business details', err));
    }
  }
}
