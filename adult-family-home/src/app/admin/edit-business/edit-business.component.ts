import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/business.service';
import { UploadService } from 'src/app/services/upload.service';
import {
  Business,
  BusinessModel,
} from 'src/app/model/business-questions.model';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { EmployeeComponent } from '../employee/employee.component';
import { ReviewsComponent } from '../reviews/reviews.component';
import { ServicesPageComponent } from '../services-page/services-page.component';
import { AboutUsComponent } from 'src/app/component/PAGES/about-us/about-us.component';
import { AboutUsPageComponent } from '../about-us-page/about-us-page.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-edit-business',
  templateUrl: './edit-business.component.html',
  styleUrls: ['./edit-business.component.css'],
})
export class EditBusinessComponent implements OnInit, AfterViewInit {
  @ViewChild(EmployeeComponent) employeeComponent!: EmployeeComponent;
  @ViewChild(ReviewsComponent) reviewComponent!: ReviewsComponent;
  @ViewChild(ServicesPageComponent) serviceComponent!: ServicesPageComponent;
  @ViewChild(AboutUsPageComponent) aboutUsComponent!: AboutUsPageComponent;


  business!: Business;
  businessForm!: FormGroup;
  uploadProgress: { [key: string]: Observable<number | undefined> } = {};
  businessId: string = '';
  confirmationMessage: string = '';
  showConfirmation: boolean = false;
  // Variables for temporary holding the new service data
  serviceForm!: FormGroup;
  benefitsForm!: FormGroup;
  autoSaveMessage: string = ''; // Holds the save status message
  showAutoSaveMessage: boolean = false;
  private isSubmitting: boolean = false;

  uploads: { uploadProgress: number; downloadUrl?: string }[] = [];

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
    this.route.paramMap.pipe(take(1)).subscribe((params) => { // ✅ Take only the first subscription
      this.businessId = params.get('id')!;

      if (this.businessId) {
        console.log('Edit-Business: ngOnInit: Business', this.business);
        this.loadBusinessData();
      } else {
        console.log('Loading default data');
        this.loadDefaultData();
      }
    });
  }


  loadBusinessData(): void {
    this.businessService.getBusiness(this.businessId).subscribe(
      (business) => {
        if (business) {
          //console.log('Business data:', business); // Debugging line
          this.business = business;
          this.populateForm(business);
          // Check if the logo image is a Firebase storage path
          if (
            business.logoImage &&
            this.isFirebaseStoragePath(business.logoImage)
          ) {
            this.storage
              .refFromURL(business.logoImage)
              .getDownloadURL()
              .subscribe((url) => {
                business.logoImage = url; // Update the URL for display
              });
          }
        }
      },
      (error) => {
        console.error('Error loading business data:', error); // Debugging line
      }
    );
  }

  initializeForm(): void {
    this.businessForm = this.fb.group({
      //Business Info
      businessName: ['', Validators.required],
      address: [''],
      phone: [''],
      fax: [''],
      email: ['', Validators.required],
      businessHours: [''],
      tagline: [''],
      businessURL: [''],
      providerName: [''],
      keyWords: [''],
      metaTitle: [''],
      metaKeywords: [''],
      metaDescription: [''],
      placeId: [''],

      //Home Page
      keyServicesHighlights: [''],
      uniqueService: this.fb.array([]),
      whyChoose: this.fb.array([]),

      sections: this.fb.array([]),
      //About Us
      certifications: [''],

      //Services Page
      services: this.fb.array([]),
      benefits: this.fb.array([]),
      specialPrograms: [''],
      tours: [''],
      freeConsulting: [''],

      websiteGoals: [''],
      logoImage: [null],
      faviconUrl: [''],
      mediaFeatures: [''],
      ratings: [''],
      testimonials: this.fb.array([]),
      socialMedia: [''],

      //Contact Us Page
      contactFormDetails: [''],
      contactUsImageUrl: [''],

      //Gallery Page
      photoGallery: [''],
      // photoGalleryText: [''],

      isActive: true,

      //Employee Page
      employees: this.fb.array([]),
    });
    this.serviceForm = this.fb.group({
      name: [''],
    });
    this.benefitsForm = this.fb.group({
      name: [''],
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

  uniqueService(): FormArray {
    return this.businessForm.get('uniqueService') as FormArray;
  }

  whyChoose(): FormArray {
    return this.businessForm.get('whyChoose') as FormArray;
  }

  loadDefaultData(): void {
    this.business = BusinessModel.getDefaultBusiness();
    const defaultBusiness = BusinessModel.getDefaultBusiness();

    this.businessForm = this.fb.group({
      businessName: [defaultBusiness.businessName],
      metaTitle: [defaultBusiness.metaTitle],
      metaKeywords: [defaultBusiness.metaKeywords],
      metaDescription: [defaultBusiness.metaDescription],
      keyWords: [defaultBusiness.keyWords],
      businessURL: [defaultBusiness.businessURL],
      providerName: [defaultBusiness.providerName],
      tagline: [defaultBusiness.tagline],
      certifications: [defaultBusiness.certifications],
      logoImage: [defaultBusiness.logoImage],
      faviconUrl: [defaultBusiness.faviconUrl],

      address: [defaultBusiness.address],
      phone: [defaultBusiness.phone],
      fax: [defaultBusiness.fax],
      email: [defaultBusiness.email],
      businessHours: [defaultBusiness.businessHours],
      socialMedia: [defaultBusiness.socialMedia],

      contactFormDetails: [defaultBusiness.contactFormDetails],
      contactUsImageUrl: [defaultBusiness.contactUsImageUrl],
      isActive: [defaultBusiness.isActive],
      theme: [defaultBusiness.theme],
      placeId: [defaultBusiness.placeId],

      // Initialize FormArrays
      uniqueService: this.fb.array(
        (defaultBusiness.uniqueService ?? []).map((service) =>
          this.fb.group({
            name: [service.name],
            description: [service.description],
          })
        )
      ),

      whyChoose: this.fb.array(
        defaultBusiness.whyChoose.map((choice) =>
          this.fb.group({
            name: [choice.name],
            description: [choice.description],
          })
        )
      ),

      services: this.fb.array(
        defaultBusiness.services.map((service) =>
          this.fb.group({
            name: [service.name],
          })
        )
      ),

      benefits: this.fb.array(
        defaultBusiness.benefits.map((benefit) =>
          this.fb.group({
            name: [benefit.name],
          })
        )
      ),

      testimonials: this.fb.array(
        (defaultBusiness.testimonials ?? []).map((testimonial) =>
          this.fb.group({
            name: [testimonial.name],
            relationship: [testimonial.relationship],
            quote: [testimonial.quote],
            photoUrl: [testimonial.photoURL],
          })
        )
      ),

      employees: this.fb.array(
        (defaultBusiness.employees ?? []).map((employee) =>
          this.fb.group({
            name: [employee.name],
            role: [employee.role],
            bio: [employee.bio],
            photoURL: [employee.photoURL],
          })
        )
      ),
      sections: this.fb.array(
        (defaultBusiness.sections ?? []).map((section) =>
          this.fb.group({
            sectionName: [section.sectionName || ''],
            sectionTitle: [section.sectionTitle || ''],
            sectionSubTitle: [section.sectionSubTitle || ''],
            sectionContent: [section.sectionContent || ''],
            sectionImageUrl: [section.sectionImageUrl || ''],
            sectionType: [section.sectionType || ''],
            sectionStyle: [section.sectionStyle || ''],
          })
        )
      ),
    });
  }

  // Helper function to populate form arrays
  private populateFormArray(formArray: FormArray, items: any[]) {
    formArray.clear(); // Clear any existing controls
    items.forEach((item) => formArray.push(this.fb.control(item))); // Add each item as a form control
  }

  isFirebaseStoragePath(imagePath: string): boolean {
    return (
      imagePath.startsWith('gs://') ||
      imagePath.includes('firebasestorage.googleapis.com')
    );
  }

  populateForm(business: Business): void {
    this.businessForm.patchValue(business);

    if (this.employeeComponent) {
      this.employeeComponent.populateEmployees(business.employees ?? []);
    }

    if (this.reviewComponent) {
      this.reviewComponent.populateTestimonials(business.testimonials ?? []);
    }

    if (this.serviceComponent) {
      this.serviceComponent.populateServices(business.services ?? []);
      this.serviceComponent.populateBenefits(business.benefits ?? []);
    }

    if (this.aboutUsComponent) {
      // this.aboutUsComponent.populateUniqueService(business.uniqueService ?? []);
      // this.aboutUsComponent.populateWhyChoose(business.whyChoose ?? []);
      //this.aboutUsComponent.pupulateSection(business.sections);
    }

    if (this.reviewComponent) {
      this.reviewComponent.populateTestimonials(business.testimonials ?? []);
    }

    // Ensure logoImage is handled
    if (!this.businessForm.contains('logoImage')) {
      this.businessForm.addControl('logoImage', this.fb.control(null));
    }
  }

  ngAfterViewInit(): void {
    // Attach event listener after view initialization
    const tabs = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabs.forEach((tab) => {
      tab.addEventListener('shown.bs.tab', (event: any) => {
        this.autoSave();
      });
    });
  }

  autoSave(): void {
    if (this.businessForm.valid) {
      const formValue = this.businessForm.value;
      this.businessService
        .updateBusiness(this.businessId, formValue)
        .then(() => {
          this.autoSaveMessage = 'Changes saved!';
          this.showAutoSaveMessage = true;

          // Hide the message after 2 seconds
          setTimeout(() => {
            this.showAutoSaveMessage = false;
          }, 2000);
        })
        .catch((err) => console.error('Error auto-saving', err));
    }
  }

  private getExistingSectionCounter(page: string, location: string): number {
    const sections = this.businessForm.get('sections') as FormArray;
    let counter = 1; // Default counter if no section exists

    // Loop through existing sections to check if one with the same Page and Location exists
    sections.controls.forEach((section, index) => {
      const sectionPage = section.get('sectionName')?.value.split('Section')[0]; // Extract Page + Location part of sectionName
      if (sectionPage === `${page}${location}`) {
        counter++; // Increment the counter if a matching section is found
      }
    });

    return counter;
  }

  onSubmit(): void {
    if (this.isSubmitting) return; // Prevent multiple submissions
    this.isSubmitting = true;

    console.log("onSubmit() called"); // Debugging

    if (this.businessForm.valid) {

      const formValue: Business = this.businessForm.value;

      if (this.businessId) {
        this.businessService
          .updateBusiness(this.businessId, formValue)
          .then(() => {
            console.log("Business details updated successfully!");
            this.isSubmitting = false;
          })
          .catch((err) => {
            console.error("Error updating business details", err);
            this.isSubmitting = false;
          });
      } else {
        this.businessService.createBusiness(formValue)
          .pipe(take(1)) // ✅ Ensure only one execution
          .subscribe((bus) => {
            if (bus && bus.id) {
              this.business = bus;
              this.businessId = bus.id; // ✅ Save the new business ID
              console.log("Business created with ID:", this.businessId);
            }
            this.confirmationMessage = "Business has been successfully created!";
            this.showConfirmation = true;
            this.isSubmitting = false;
          }, (err) => {
            console.error("Error creating business:", err);
            this.isSubmitting = false;
          });
      }
    } else {
      console.log("Business Form is not valid!");
      this.isSubmitting = false;
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
