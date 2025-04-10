import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl,
} from '@angular/forms';
import { BusinessService } from 'src/app/services/business.service';
import { UploadService } from 'src/app/services/upload.service';
import {
  Business,
  BusinessModel,
} from 'src/app/model/business-questions.model';
import { Observable } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeComponent } from '../employee/employee.component';
import { ReviewsComponent } from '../reviews/reviews.component';
import { ServicesPageComponent } from '../services-page/services-page.component';
import { AboutUsComponent } from 'src/app/component/PAGES/about-us/about-us.component';
import { SectionManagerComponent } from '../section-manager/section-manager.component';
import { BusinessLocationsComponent } from '../business-locations/business-locations.component';
import {
  getDownloadURL,
  ref as storageRef,
Storage } from '@angular/fire/storage';
import { S } from '@angular/core/weak_ref.d-DOjz-6fK';
<<<<<<< HEAD
import { BusinessSectionsService } from 'src/app/services/business-sections.service';
=======
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4


@Component({
    selector: 'app-edit-business',
    templateUrl: './edit-business.component.html',
    styleUrls: ['./edit-business.component.css'],
    encapsulation: ViewEncapsulation.Emulated,
    standalone: false
})
export class EditBusinessComponent implements OnInit, AfterViewInit {
  @ViewChild(EmployeeComponent) employeeComponent!: EmployeeComponent;
  @ViewChild(ReviewsComponent) reviewComponent!: ReviewsComponent;
  @ViewChild(ServicesPageComponent) serviceComponent!: ServicesPageComponent;
  @ViewChild(SectionManagerComponent) sectionManager!: SectionManagerComponent;
  @ViewChild(BusinessLocationsComponent)
  locationsManager!: BusinessLocationsComponent;
  private isFormPopulated = false;
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
    private route: ActivatedRoute,
    private router: Router,
<<<<<<< HEAD
    private storage: Storage,
    private businessSectionsService: BusinessSectionsService
=======
    private storage: Storage
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(take(1)).subscribe((params) => {
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
    // const storage = inject(Storage);
    this.businessService.getBusiness(this.businessId).subscribe(
      (business) => {
        if (business && !this.isFormPopulated) {
          this.business = business;
          this.populateForm(business);
          this.isFormPopulated = true;

          if (business.logoImage && this.isFirebaseStoragePath(business.logoImage)) {

            const fileRef = storageRef(this.storage, business.logoImage);
            getDownloadURL(fileRef).then((url) => {
              business.logoImage = url;
            });
          }
        }
      },
      (error) => console.error('Error loading business data:', error)
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
<<<<<<< HEAD
      metaImage: [''],
=======
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
      placeId: [''],

      //Home Page
      keyServicesHighlights: [''],
      uniqueService: this.fb.array([]),
      whyChoose: this.fb.array([]),

      sections: this.fb.array([]),

      //About Us
      certifications: [''],

      //Services Page
      // services: this.fb.array([]),
      // benefits: this.fb.array([]),
      specialPrograms: [''],
      tours: [''],
      freeConsulting: [''],

      websiteGoals: [''],
      logoImage: [null],
      faviconUrl: [''],
      mediaFeatures: [''],
      ratings: [''],
      testimonials: this.fb.array([]),
      locations: this.fb.array([]),
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
<<<<<<< HEAD
      theme: this.fb.group({
        themeFileName: [''],
        themeType: [''],
        backgroundColor: [''],
        darkBackgroundColor: [''],
        primaryColor: [''],
        secondaryColor: [''],
        accentColor: [''],
        buttonColor: [''],
        buttonHoverColor: [''],
        textColor: [''],
        navBackgroundColor: [''],
        navTextColor: [''],
        navActiveBackground: [''],
        navActiveText: ['']
      }),
=======
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
    });
    this.serviceForm = this.fb.group({
      name: [''],
    });
    this.benefitsForm = this.fb.group({
      name: [''],
    });
  }

  setLocations(locations: any[]) {
    const locationArray = this.businessForm.get('locations') as FormArray;
    locationArray.clear(); // Clear existing locations before populating

    locations.forEach((location) => {
      locationArray.push(
        this.fb.group({
          name: [location.name, Validators.required],
          city: [location.city, Validators.required],
          state: [location.state, Validators.required],
          zipcode: [location.zipcode, Validators.required],
          phone: [
            location.phone,
            [Validators.required, Validators.pattern(/^\d{10}$/)],
          ],
          fax: [
            location.fax,
            [Validators.required, Validators.pattern(/^\d{10}$/)],
          ],
          email: [location.email, [Validators.required, Validators.email]],
        })
      );
    });
  }

  employees(): FormArray {
    return this.businessForm.get('employees') as FormArray;
  }

  testimonials(): FormArray {
    return this.businessForm.get('testimonials') as FormArray;
  }

  // services(): FormArray {
  //   return this.businessForm.get('services') as FormArray;
  // }

  // benefits(): FormArray {
  //   return this.businessForm.get('benefits') as FormArray;
  // }

  uniqueService(): FormArray {
    return this.businessForm.get('uniqueService') as FormArray;
  }

  whyChoose(): FormArray {
    return this.businessForm.get('whyChoose') as FormArray;
  }

  loadDefaultData(): void {
<<<<<<< HEAD
    const defaultBusiness = BusinessModel.getDefaultBusiness();
    this.business = defaultBusiness;

    // ✅ Patch flat fields
    this.businessForm.patchValue({
      businessName: defaultBusiness.businessName,
      metaTitle: defaultBusiness.metaTitle,
      metaKeywords: defaultBusiness.metaKeywords,
      metaDescription: defaultBusiness.metaDescription,
      keyWords: defaultBusiness.keyWords,
      businessURL: defaultBusiness.businessURL,
      providerName: defaultBusiness.providerName,
      tagline: defaultBusiness.tagline,
      certifications: defaultBusiness.certifications,
      logoImage: defaultBusiness.logoImage,
      faviconUrl: defaultBusiness.faviconUrl,
      address: defaultBusiness.address,
      phone: defaultBusiness.phone,
      fax: defaultBusiness.fax,
      email: defaultBusiness.email,
      businessHours: defaultBusiness.businessHours,
      socialMedia: defaultBusiness.socialMedia,
      contactFormDetails: defaultBusiness.contactFormDetails,
      contactUsImageUrl: defaultBusiness.contactUsImageUrl,
      isActive: defaultBusiness.isActive,
      placeId: defaultBusiness.placeId,
      sliderConfig: defaultBusiness.sliderConfig
    });
    (this.businessForm.get('theme') as FormGroup).patchValue(defaultBusiness.theme);
    // ✅ Set heroSlider array
    this.businessForm.setControl(
      'heroSlider',
      this.fb.array(
        (defaultBusiness.heroSlider ?? []).map((slide) =>
          this.fb.group({
            title: [slide.title],
            subtitle: [slide.subtitle],
            backgroundImage: [slide.backgroundImage],
            buttons: this.fb.array(
              (slide.buttons ?? []).map((btn) =>
                this.fb.group({
                  text: [btn.text],
                  link: [btn.link],
                  outline: [btn.outline],
                })
              )
            )
          })
        )
      )
    );

    // ✅ Set other arrays
    this.businessForm.setControl(
      'uniqueService',
      this.fb.array(
=======
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
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
        (defaultBusiness.uniqueService ?? []).map((service) =>
          this.fb.group({
            name: [service.name],
            description: [service.description],
          })
        )
<<<<<<< HEAD
      )
    );

    this.businessForm.setControl(
      'whyChoose',
      this.fb.array(
        (defaultBusiness.whyChoose ?? []).map((choice) =>
=======
      ),

      whyChoose: this.fb.array(
        defaultBusiness.whyChoose.map((choice) =>
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
          this.fb.group({
            name: [choice.name],
            description: [choice.description],
          })
        )
<<<<<<< HEAD
      )
    );

    this.businessForm.setControl(
      'testimonials',
      this.fb.array(
=======
      ),

      testimonials: this.fb.array(
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
        (defaultBusiness.testimonials ?? []).map((testimonial) =>
          this.fb.group({
            name: [testimonial.name],
            relationship: [testimonial.relationship],
            quote: [testimonial.quote],
            photoUrl: [testimonial.photoURL],
          })
        )
<<<<<<< HEAD
      )
    );

    this.businessForm.setControl(
      'employees',
      this.fb.array(
=======
      ),

      employees: this.fb.array(
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
        (defaultBusiness.employees ?? []).map((employee) =>
          this.fb.group({
            name: [employee.name],
            role: [employee.role],
            bio: [employee.bio],
            photoURL: [employee.photoURL],
          })
        )
<<<<<<< HEAD
      )
    );

    this.businessForm.setControl(
      'locations',
      this.fb.array(
        (defaultBusiness.locations ?? []).map((location) =>
          this.fb.group({
            locationName: [location.locationName],
            street: [location.street],
            city: [location.city],
            state: [location.state],
=======
      ),

      locations: this.fb.array(
        (defaultBusiness.locations ?? []).map((location) =>
          this.fb.group({
            street: [location.street],
            city: [location.city],
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
            zipcode: [location.zipcode],
            phone: [location.phone],
            fax: [location.fax],
            email: [location.email],
<<<<<<< HEAD
            image: [location.image],
            businessHours: [location.businessHours],
          })
        )
      )
    );

    this.businessForm.setControl(
      'sections',
      this.fb.array(
        (defaultBusiness.sections ?? []).map((section) =>
          this.fb.group({
            id: [section.id],
            isActive: [section.isActive],
            page: [section.page],
            location: [section.location],
            component: [section.component],
            sectionTitle: [section.sectionTitle],
            sectionSubTitle: [section.sectionSubTitle],
            sectionContent: [section.sectionContent],
            order: [section.order],
            backgroundColor: [section.backgroundColor],
            textColor: [section.textColor],
            textFontSize: [section.textFontSize],
            textFontStyle: [section.textFontStyle],
            titleColor: [section.titleColor],
            subtitleColor: [section.subtitleColor],
            fullWidth: [section.fullWidth],
            showButton: [section.showButton],
            buttonText: [section.buttonText],
            buttonLink: [section.buttonLink],
            alignText: [section.alignText],
            boxShadow: [section.boxShadow],
            borderRadius: [section.borderRadius],
            paddingTop: [section.paddingTop],
            paddingBottom: [section.paddingBottom],
            paddingLeft: [section.paddingLeft],
            paddingRight: [section.paddingRight],
            contentPadding: [section.contentPadding],
            sectionImageUrl: [section.sectionImageUrl],
            showImage: [section.showImage],
            isMinimal: [section.isMinimal],
            isParallax: [section.isParallax],
            titleFontSize: [section.titleFontSize],
            titleFontStyle: [section.titleFontStyle],
            subtitleFontSize: [section.subtitleFontSize],
            subtitleFontStyle: [section.subtitleFontStyle],
            items: this.fb.array([]),
          })
        )
      )
    );
  }


=======
          })
        )
      ),
    });
  }

>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
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
    if (!this.businessForm) {
      console.error("❌ businessForm is not initialized!");
      return;
    }
    this.businessForm.patchValue(business);

  if (business.locations && business.locations.length) {
    this.businessForm.setControl(
      'locations',
      new FormArray(
        business.locations.map((loc) =>
          this.fb.group({
            street: [loc.street, Validators.required],
            city: [loc.city, Validators.required],
            state: [loc.state, Validators.required],
            zipcode: [loc.zipcode, Validators.required],
            phone: [loc.phone, [Validators.required, Validators.pattern(/^\d{10}$/)]],
            fax: [loc.fax, [Validators.required, Validators.pattern(/^\d{10}$/)]],
            email: [loc.email, [Validators.required, Validators.email]],
          })
        )
      )
    );
   // console.log('Locations populated in form:', this.businessForm.get('locations')?.value); // Debugging
  } else {
    console.warn('⚠️ No locations found to populate the form.');
  }

    if (this.employeeComponent) {
      this.employeeComponent.populateEmployees(business.employees ?? []);
    }

    if (this.reviewComponent) {
      this.reviewComponent.populateTestimonials(business.testimonials ?? []);
    }

    if (this.locationsManager) {
      this.locationsManager.loadLocations();
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

  updateLocations(locations: any) {
    //console.log('Locations received from child:', locations); // ✅ Debugging

    if (this.businessForm.get('locations')) {
      this.businessForm.patchValue({ locations: locations });
    } else {
      console.error('Locations form control is missing!');
    }
  }

  onSubmit(): void {
    if (this.isSubmitting) return; // Prevent multiple submissions
    this.isSubmitting = true;

<<<<<<< HEAD
    console.log('onSubmit() called');

    // 🔥 Mark all controls as touched to trigger validation UI
    this.markAllControlsTouched(this.businessForm);

    if (this.businessForm.valid) {
      const formValue: Business = {
        ...this.businessForm.value,
        locations: this.businessForm.get('locations')?.value || [],
      };
=======
    console.log('onSubmit() called'); // Debugging
    const locations = this.businessForm.get('locations')?.value || [];
    const formValue: Business = {
      ...this.businessForm.value,
      locations: this.businessForm.get('locations')?.value || [], // 🔥 Ensure locations are included
    };

   // console.log('Final Data to Save:', formValue); // ✅ Debugging

    if (this.businessForm.valid) {
   //  console.log('Form Value Before Saving:', this.businessForm.value); // 🔍 Debugging
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4

      if (this.businessId) {
        this.businessService
          .updateBusiness(this.businessId, formValue)
          .then(() => {
<<<<<<< HEAD
            console.log('✅ Business details updated successfully!');
            this.isSubmitting = false;
          })
          .catch((err) => {
            console.error('❌ Error updating business details', err);
=======
            console.log('Business details updated successfully!');
            this.isSubmitting = false;
          })
          .catch((err) => {
            console.error('Error updating business details', err);
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
            this.isSubmitting = false;
          });
      } else {
        this.businessService
          .createBusiness(formValue)
<<<<<<< HEAD
          .pipe(take(1))
=======
          .pipe(take(1)) // ✅ Ensure only one execution
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
          .subscribe(
            (bus) => {
              if (bus && bus.id) {
                this.business = bus;
<<<<<<< HEAD
                this.businessId = bus.id;
              }
              this.confirmationMessage = '✅ Business has been successfully created!';
              this.showConfirmation = true;
              this.isSubmitting = false;
              this.saveSectionsToFirestore();
              this.saveLocationsToFirestore();
            },
            (err) => {
              console.error('❌ Error creating business:', err);
=======
                this.businessId = bus.id; // ✅ Save the new business ID
                //console.log('Business created with ID:', this.businessId);
              }
              this.confirmationMessage =
                'Business has been successfully created!';
              this.showConfirmation = true;
              this.isSubmitting = false;
            },
            (err) => {
              console.error('Error creating business:', err);
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
              this.isSubmitting = false;
            }
          );
      }
    } else {
<<<<<<< HEAD
      console.warn('❌ Business Form is not valid!');

      // 🔍 Log invalid controls and missing required fields
      Object.entries(this.businessForm.controls).forEach(([key, ctrl]) => {
        if (ctrl.invalid) {
          const errors = ctrl.errors;
          if (errors?.['required']) {
            console.warn(`⚠️ Required field missing: ${key}`);
          } else {
            console.warn(`❌ Invalid field: ${key}`, errors);
          }
        }
      });

      // Extra: Log issues inside FormArrays like locations
      const locationsArray = this.businessForm.get('locations') as FormArray;
      if (locationsArray && locationsArray.controls.length) {
        locationsArray.controls.forEach((locCtrl, index) => {
          if (locCtrl.invalid) {
            console.warn(`❌ Invalid Location[${index}]`, locCtrl.errors);
            Object.entries((locCtrl as FormGroup).controls).forEach(([field, control]) => {
              if (control.invalid) {
                console.warn(`⚠️ Location[${index}].${field} is invalid`, control.errors);
              }
            });
          }
        });
      }

=======
      console.log('Business Form is not valid!');
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
      this.isSubmitting = false;
    }
  }

<<<<<<< HEAD
  private markAllControlsTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllControlsTouched(control);
      }
    });
  }

  private saveSectionsToFirestore(): void {
    const sectionsArray = this.businessForm.get('sections') as FormArray;

    if (!sectionsArray || !sectionsArray.length) return;

    sectionsArray.controls.forEach(sectionControl => {
      const section = sectionControl.value;

      this.businessSectionsService
        .saveSection(this.businessId, section)
        .then(() => console.log(`✅ Section saved: ${section.sectionTitle || 'Untitled'}`))
        .catch(err => console.error('❌ Error saving section:', err));
    });
  }


  private saveLocationsToFirestore(): void {
    const locationsArray = this.businessForm.get('locations') as FormArray;

    if (!locationsArray || !locationsArray.length) return;

    locationsArray.controls.forEach(locationControl => {
      const location = locationControl.value;

      this.businessService
        .addLocation(this.businessId, location)
        .then(() => console.log(`✅ Location saved: ${location.locationName || 'Unnamed'}`))
        .catch(err => console.error('❌ Error saving location:', err));
    });
  }

  // Optional UUID fallback if you don't have generateNewId()
  private generateUUID(): string {
    return crypto.randomUUID();
  }



=======
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  closeConfirmation(): void {
    this.showConfirmation = false;
    this.router.navigate(['/admin/businessList']);
  }

  preventDefault(event: Event): void {
    event.preventDefault();
  }
}
