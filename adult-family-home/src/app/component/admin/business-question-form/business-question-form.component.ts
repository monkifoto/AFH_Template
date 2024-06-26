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
      businessName: ['Careful Living AFH', Validators.required],
      tagline: ['Caring with compassion'],
      uniqueService: ['Personalized 24/7 care'],
      whyChoose: ['We provide personalized care tailored to each resident\'s needs.'],
      businessStory: ['Careful Living AFH was founded in 2005 by a group of healthcare professionals who wanted to provide a loving and caring environment for seniors.', Validators.required],
      motivation: ['The motivation behind starting this business was to create a home where seniors can live comfortably and with dignity.'],
      mission: ['Our mission is to provide exceptional care and support to our residents.', Validators.required],
      vision: ['To be the leading provider of adult family home care in our community.', Validators.required],
      certifications: ['Licensed by the state, Certified Nursing Assistants (CNA) on staff.', Validators.required],
      targetAudience: ['Seniors in need of assisted living services, families looking for quality care for their loved ones.',],
      services: ['Assisted living, personal care, medication management, daily activities.', Validators.required],
      specialPrograms: ['Memory care, respite care, physical therapy.'],
      tours: ['Yes, we provide tours of our facility.'],
      freeConsulting: ['Yes, we offer free consulting services.'],
      websiteGoals: ['To provide information, encourage visits, and offer consultation requests.', Validators.required],
      logoImage: [''],
      ownerImagesBios: ['John Doe, RN, Founder.', Validators.required],
      staffImagesBios: ['Jane Smith, CNA, Head Nurse; Bob Johnson, Physical Therapist.', Validators.required],
      facilityImages: [''],
      lifestyleImages: [''],
      mediaFeatures: ['Featured in Local News, Healthcare Magazine.'],
      ratings: ['Google: 4.8 stars, Yelp: 5 stars'],
      testimonials: ['John Doe\'s family: "Amazing care!"'],
      address: ['1234 Care St, Compassion City, ST 12345', Validators.required],
      phone: ['(123) 456-7890', Validators.required],
      fax: ['(123) 456-7891'],
      email: ['info@carefullivingafh.com', Validators.email],
      businessHours: ['Mon-Fri: 9am-5pm, Sat-Sun: 10am-4pm', Validators.required],
      socialMedia: ['Facebook: facebook.com/carefullivingafh'],
      welcomeMessage: ['Welcome to Careful Living AFH, where we care with compassion.', Validators.required],
      keyServicesHighlights: ['24/7 care, nutritious meals, engaging activities.', Validators.required],
      teamValues: ['Compassion, respect, integrity.', Validators.required],
      serviceBenefits: ['Personalized care, safe environment, professional staff.', Validators.required],
      pricingStructure: ['Contact us for pricing details.', Validators.required],
      contactFormDetails: ['Name, Email, Phone, Message', Validators.required],
      mapDirections: ['Included map and directions to our facility.'],
      photoGallery: ['Gallery of our facility and events.',]
    });
  }

  onFileChange(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `uploads/${file.name}`;
      const task = this.businessService.uploadFile(filePath, file);

      this.uploadProgress[controlName] = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          this.businessService.getDownloadURL(filePath).subscribe(url => {
                const currentValue = this.businessForm.get('controlName')?.value;
                if (Array.isArray(currentValue)) {
                  this.businessForm.patchValue({ [controlName]: [...currentValue, url] });
                } else {
                  this.businessForm.patchValue({ [controlName]: url });
                }

          });
        })
      ).subscribe();
    }
  }

  onSubmit(): void {
    console.log('Submit Click', this.businessForm.valid);
    if (this.businessForm.valid) {
      const formValue: Business = this.businessForm.value;
      console.log(formValue);
      this.businessService.createBusiness(formValue)
        .then(() => alert('Business details saved successfully!'))
        .catch(err => console.error('Error saving business details', err));
    }
  }
}
