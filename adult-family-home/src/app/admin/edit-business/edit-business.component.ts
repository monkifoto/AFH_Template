import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/business.service';
import { UploadService } from 'src/app/services/upload.service';  // Import the UploadService
import { Business } from 'src/app/model/business-questions.model';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

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
  whyChooseForm!: FormGroup;
  uniqueServiceForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private uploadService: UploadService,  // Inject the UploadService
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.route.paramMap.subscribe(params => {
      this.businessId = params.get('id')!;
      console.log('Business ID:', this.businessId); // Debugging line
      if (this.businessId) {
        this.loadBusinessData();
      }
    });
  }

  initializeForm(): void {
    this.businessForm = this.fb.group({
      tagline:[''],
      uniqueService:this.fb.array([]),
      whyChoose:this.fb.array([]),
      businessStory:[''],
      motivation:[''],
      mission:[''],
      vision:[''],
      certifications:[''],
      targetAudience:[''],
      services: this.fb.array([]),
      benefits: this.fb.array([]),
      specialPrograms:[''],
      tours:[''],
      freeConsulting:[''],
      websiteGoals:[''],
      logoImage:[''],
      mediaFeatures:[''],
      ratings:[''],
      testimonials:this.fb.array([]),
      businessName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      fax: [''],
      email: ['', Validators.required],
      businessHours: ['', Validators.required],
      socialMedia: [''],
      welcomeMessage: [''],
      keyServicesHighlights: ['', Validators.required],
      teamValues: ['', Validators.required],
      pricingStructure: ['', Validators.required],
      contactFormDetails: ['', Validators.required],
      mapDirections: [''],
      photoGallery: [''],
      employees: this.fb.array([])
    });
    this.serviceForm = this.fb.group({
      name: ['', Validators.required]
    });
    this.benefitsForm = this.fb.group({
      name: ['', Validators.required]
    });
    this.uniqueServiceForm = this.fb.group({
      name: ['', Validators.required],
      description:['']
    });
    this.whyChooseForm = this.fb.group({
      name: ['', Validators.required],
      description:['']
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



  addEmployee(): void {
    const employeeForm = this.fb.group({
      id: [''],
      name: [''],
      role: [''],
      bio: [''],
      photoURL: ['']
    });
    this.employees().push(employeeForm);
  }

  removeEmployee(index: number): void {
    this.employees().removeAt(index);
  }

  addTestimonial(): void {
    const testimonialForm = this.fb.group({
      id: [''],
      name: [''],
      quote: [''],
      photoURL: ['']
    });
    this.testimonials().push(testimonialForm);
  }

  removeTestimonial(index: number): void {
    this.testimonials().removeAt(index);
  }

  addService() {
    if (this.serviceForm.valid) {
      this.services().push(this.fb.group(this.serviceForm.value));
      this.serviceForm.reset();
    }
  }

  removeService(index: number): void {
    this.services().removeAt(index);
  }

  addBenefit() {
    if (this.benefitsForm.valid) {
      this.benefits().push(this.fb.group(this.benefitsForm.value));
      this.benefitsForm.reset();
    }
  }

  removeBenefit(index: number): void {
    this.benefits().removeAt(index);
  }

  addUniqueService() {
    if (this.uniqueServiceForm.valid) {
      this.uniqueService().push(this.fb.group(this.uniqueServiceForm.value));
      this.uniqueServiceForm.reset();
    }
  }

  removeUniqueService(index: number): void {
    this.uniqueService().removeAt(index);
  }

  addWhyChoose() {
    if (this.whyChooseForm.valid) {
      this.whyChoose().push(this.fb.group(this.whyChooseForm.value));
      this.whyChooseForm.reset();
    }
  }

  removeWhyChoose(index: number): void {
    this.whyChoose().removeAt(index);
  }

  onEmployeeFileChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const { uploadProgress, downloadUrl } = this.uploadService.uploadFile(file, this.businessId, 'employee');

      this.uploadProgress[`employee_${index}`] = uploadProgress;

      downloadUrl.pipe(
        finalize(() => {
          downloadUrl.subscribe(url => {
            this.employees().at(index).patchValue({ photoURL: url });
          });
        })
      ).subscribe();
    }
  }

  onTestimonialFileChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const { uploadProgress, downloadUrl } = this.uploadService.uploadFile(file, this.businessId, 'testimonail');

      this.uploadProgress[`testimonails_${index}`] = uploadProgress;

      downloadUrl.pipe(
        finalize(() => {
          downloadUrl.subscribe(url => {
            this.testimonials().at(index).patchValue({ photoURL: url });
          });
        })
      ).subscribe();
    }
  }

  onFileChange(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      let location: 'gallery' | 'employee' | 'business' | 'testimonail';

      // Determine location based on the field
      if (field === 'photoGallery') {
        location = 'gallery';
      } else if (field === 'testimonial') {
          location = 'gallery';
      } else if (field === 'logoImage' || field === 'facilityImages' || field === 'lifestyleImages') {
        location = 'business';
      } else {
        location = 'employee';
      }

      const { uploadProgress, downloadUrl } = this.uploadService.uploadFile(file, this.businessId, location);

      this.uploadProgress[field] = uploadProgress;

      downloadUrl.pipe(
        finalize(() => {
          downloadUrl.subscribe(url => {
            this.businessForm.patchValue({ [field]: url });
          });
        })
      ).subscribe();
    }
  }

  loadBusinessData(): void {
    this.businessService.getBusiness(this.businessId).subscribe(
      business => {
        if (business) {
          console.log('Business data:', business); // Debugging line
          this.populateForm(business);
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

  populateForm(business: Business): void {
    this.businessForm.patchValue(business);

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

  onSubmit(): void {
    if (this.businessForm.valid) {
      const formValue: Business = this.businessForm.value;
      if (this.businessId) {
        this.businessService.updateBusiness(this.businessId, formValue)
          .then(() => alert('Business details updated successfully!'))
          .catch(err => console.error('Error updating business details', err));
      }else{
        this.businessService.createBusiness(formValue).subscribe(bus =>{
          this.business = bus;
          this.confirmationMessage = "Business has been successfully created!";
          this.showConfirmation = true;
          console.log("Business Created with ID: ", this.business?.id);
      });
    }
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
