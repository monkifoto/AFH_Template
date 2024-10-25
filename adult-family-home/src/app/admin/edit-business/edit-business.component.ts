import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/business.service';
import { UploadService } from 'src/app/services/upload.service';
import { Business } from 'src/app/model/business-questions.model';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-edit-business',
  templateUrl: './edit-business.component.html',
  styleUrls: ['./edit-business.component.css']
})
export class EditBusinessComponent implements OnInit {
  business: Business | undefined;
  businessForm!: FormGroup;
  uploadProgress: { [key: string]: Observable<number | undefined> } = {};
  businessId!: string;
  confirmationMessage: string = '';
  showConfirmation: boolean = false;
  // Variables for temporary holding the new service data
  serviceForm!: FormGroup;
  benefitsForm!: FormGroup;


  uploads: { uploadProgress: number, downloadUrl?: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private uploadService: UploadService,
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();

   }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.businessId = params.get('id')!;
     // console.log('Business ID:', this.businessId); // Debugging line
      if (this.businessId) {
        this.loadBusinessData();
      }
      else{
        this.loadDefaultData();
        //to do: When loading default values we are missing alot of controls
        //to do: reviews / photos and other pages are missing business ID
        //to do: break down so that each component saves their part and do not depend on the edit-business component
        //load defautls.
      }
    });
  }

  initializeForm(): void {
    this.businessForm = this.fb.group({
      businessName: ['', Validators.required],
      address: [''],
      phone: [''],
      fax: [''],
      email: ['', Validators.required],
      businessHours: [''],
      tagline:[''],
      businessURL: [''],
      providerName: [''],
      keyWords: [''],

      uniqueService:this.fb.array([]),
      whyChoose:this.fb.array([]),
      businessStory:[''],
      motivation:[''],
      mission:[''],
      vision:[''],
      certifications:[''],

      services: this.fb.array([]),
      benefits: this.fb.array([]),
      specialPrograms:[''],
      tours:[''],
      freeConsulting:[''],

      websiteGoals:[''],
      logoImage:[null],
      mediaFeatures:[''],
      ratings:[''],

      testimonials:this.fb.array([]),

      socialMedia: [''],
      welcomeMessage: [''],
      keyServicesHighlights: [''],
      teamValues: [''],
      contactFormDetails: [''],
      mapIframeUrl: [''],
      photoGallery: [''],
      isActive : true,
      employees: this.fb.array([])
    });
    this.serviceForm = this.fb.group({
      name: ['']
    });
    this.benefitsForm = this.fb.group({
      name: ['']
    });

  }

  employees(): FormArray {
    return this.businessForm.get('employees') as FormArray;
  }

  testimonials(): FormArray {
    return this.businessForm.get('testimonials') as FormArray;
  }

  services(): FormArray {
    return this.businessForm.get('services') as FormArray;
  }

  benefits(): FormArray {
    return this.businessForm.get('benefits') as FormArray;
  }



  loadDefaultData():void{
    this.businessForm = this.fb.group({
      businessName: ['Careful Living AFH', Validators.required],
      keyWords: [''],
      businessURL: [''],
      providerName: ['Provider Name'],
      tagline: ['Caring with compassion'],
      uniqueService: this.fb.array([]),
      whyChoose: this.fb.array([]),
      businessStory: ['Careful Living AFH was founded in 2005 by a group of healthcare professionals who wanted to provide a loving and caring environment for seniors.'],
      motivation: ['The motivation behind starting this business was to create a home where seniors can live comfortably and with dignity.'],
      mission: ['Our mission is to work hard each day to meet and exceed the expectations of our residents and their families. We provide personalized extensive care plans based on the residents needs, preferences and interests while giving their families peace of mind knowing that all their needs are being met.'],
      vision: ['Elderly Home Care is a perfect alternative for seniors who can no longer live on their own, but want to maintain their independence in a warm, friendly home-like atmosphere with 24-hour tender compassionate care. We are conveniently located 10 minutes away from Evergreen Hospital in Bellevue, bordering Kirkland'],
      certifications: ['Licensed by the state, Certified Nursing Assistants (CNA) on staff.'],
      services:  this.fb.array([]),
      specialPrograms: ['Holiday Celebrations · Birthday Parties · Outdoor activities · Exercise Program · Musical Program · Arts and Crafts · Games · Movie and Popcorn Nights · Newspaper · Gardening'],
      tours: ['Yes, we provide tours of our facility.'],
      freeConsulting: ['Yes, we offer free consulting services.'],
      websiteGoals: ['To provide information, encourage visits, and offer consultation requests.'],
      logoImage: [''],
      ownerImagesBios: ['John Doe, RN, Founder.'],
      staffImagesBios: ['Jane Smith, CNA, Head Nurse; Bob Johnson, Physical Therapist.'],
      mediaFeatures: ['Featured in Local News, Healthcare Magazine.'],
      ratings: ['Google: 4.8 stars, Yelp: 5 stars'],
      testimonials: this.fb.array([]),
      address: ['1234 Care St, Compassion City, ST 12345'],
      phone: ['(123) 456-7890'],
      fax: ['(123) 456-7891'],
      email: ['info@carefullivingafh.com', Validators.email],
      businessHours: ['Mon-Fri: 9am-5pm, Sat-Sun: 10am-4pm'],
      socialMedia: ['Facebook: facebook.com/carefullivingafh'],
      welcomeMessage: ['Welcome to Careful Living AFH, where we care with compassion.'],
      keyServicesHighlights: ['24/7 care, nutritious meals, engaging activities.'],
      teamValues: ['Our team is trained and specialized in providing care for seniors in need of, or who are diagnosed with a wide range of illnesses such as: Dementia, Alzheimer’s, Strokes, Diabetic Management, Cardiac Problems, Multiple Sclerosis, Rehabilitation and Hospice/Palliative Care', Validators.required],
      serviceBenefits:  this.fb.array([]),
      contactFormDetails: ['Name, Email, Phone, Message'],
      mapIframeUrl: [''],
      photoGallery: ['Gallery of our facility and events.',],
      employees: this.fb.array([]),
      isActive: true
    });
  }

  loadBusinessData(): void {
    this.businessService.getBusiness(this.businessId).subscribe(
      business => {
        if (business) {
          //console.log('Business data:', business); // Debugging line
          this.populateForm(business);
             // Check if the logo image is a Firebase storage path
        if (business.logoImage && this.isFirebaseStoragePath(business.logoImage)) {
          this.storage.refFromURL(business.logoImage).getDownloadURL().subscribe(url => {
            business.logoImage = url;  // Update the URL for display
          });
        }
        } else {
          console.error('Business not found');

          // Handle the case where the business is not found, e.g., navigate to an error page
        }
      },
      error => {
        console.error('Error loading business data:', error); // Debugging line
      }
    );
  }

   isFirebaseStoragePath(imagePath: string): boolean {
    return imagePath.startsWith('gs://') || imagePath.includes('firebasestorage.googleapis.com');
  }

  populateForm(business: Business): void {
    this.businessForm.patchValue(business);

      // Ensure logoImage is handled
  if (!this.businessForm.contains('logoImage')) {
    this.businessForm.addControl('logoImage', this.fb.control(null));
  }


    this.employees().clear();
    (business.employees ?? []).forEach(employee => {
      const employeeForm = this.fb.group({
        id: [employee.id],
        name: [employee.name],
        role: [employee.role],
        bio: [employee.bio],
        photoURL: [employee.photoURL]
      });
      this.employees().push(employeeForm);
    });

    this.testimonials().clear();
    (business.testimonials ?? []).forEach(testimonial => {
      const employeeForm = this.fb.group({
        id: [testimonial.id],
        name: [testimonial.name],
        quote: [testimonial.quote],
        photoURL: [testimonial.photoURL]
      });
      this.testimonials().push(employeeForm);
    });

    this.services().clear();
    (business.services ?? []).forEach(svc => {
      const servicesForm = this.fb.group({
        name: [svc.name],
      });
      this.services().push(servicesForm);
    });

    this.benefits().clear();
    (business.benefits ?? []).forEach(bnf => {
      const benefitsFormForm = this.fb.group({
        name: [bnf.name],
      });
      this.benefits().push(benefitsFormForm);
    });

    this.uniqueService().clear();
    (business.uniqueService ?? []).forEach(us => {
      const uniqueServiceForm = this.fb.group({
        name: [us.name],
        description: [us.description]
      });
      this.uniqueService().push(uniqueServiceForm);
    });

    this.whyChoose().clear();
    (business.whyChoose ?? []).forEach(why => {
      const whyChooseForm = this.fb.group({
        name: [why.name],
        description: [why.description]
      });
      this.whyChoose().push(whyChooseForm);
    });

  }

  uniqueService(): FormArray {
    return this.businessForm.get('uniqueService') as FormArray;
  }

  whyChoose(): FormArray {
    return this.businessForm.get('whyChoose') as FormArray;
  }

  onSubmit(): void {
    //console.log("submit click");
    if (this.businessForm.valid) {
      const formValue: Business = this.businessForm.value;
      console.log("form valid, this is the form", this.businessForm);
      if (this.businessId) {
        this.businessService.updateBusiness(this.businessId, formValue)
          .then(() => console.error('Business details updated successfully!'))
          .catch(err => console.error('Error updating business details', err));
      } else {
       // console.log('Submit else');
        this.businessService.createBusiness(formValue).subscribe(bus => {
          this.business = bus;
          this.confirmationMessage = "Business has been successfully created!";
          this.showConfirmation = true;
          //console.log("Business Created with ID: ", this.business?.id);

          // Ensure the business ID is not undefined before calling updateBusiness
          if (this.business && this.business.id) {
            this.businessService.updateBusiness(this.business.id, formValue)
              .then(() => console.error('Business details updated successfully!'))
              .catch(err => console.error('Error updating business details', err));
          } else {
            console.error("Business ID is undefined.");
          }
        });
      }
    }
    else{
      //console.log("Business Form  is not valid!")
    }
  }

closeConfirmation(): void {
  this.showConfirmation = false;
  this.router.navigate(['/admin/businessList']);
}


preventDefault(event: Event): void {
  event.preventDefault();
}


}
