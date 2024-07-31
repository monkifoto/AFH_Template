import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/business.service';
import { Business } from 'src/app/model/business-questions.model';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-business',
  templateUrl: './edit-business.component.html',
  styleUrls: ['./edit-business.component.css']
})
export class EditBusinessComponent implements OnInit {
  businessForm!: FormGroup;
  uploadProgress: { [key: string]: Observable<number | undefined> } = {};
  businessId!: string;

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private route: ActivatedRoute
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
      uniqueService:[''],
      whyChoose:[''],
      businessStory:[''],
      motivation:[''],
      mission:[''],
      vision:[''],
      certifications:[''],
      targetAudience:[''],
      services:[''],
      specialPrograms:[''],
      tours:[''],
      freeConsulting:[''],
      websiteGoals:[''],
      logoImage:[''],
      ownerImagesBios:[''],
      staffImagesBios:[''],
      mediaFeatures:[''],
      ratings:[''],
      testimonials:[''],
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
      serviceBenefits: ['', Validators.required],
      pricingStructure: ['', Validators.required],
      contactFormDetails: ['', Validators.required],
      mapDirections: [''],
      photoGallery: [''],
      employees: this.fb.array([])
    });
  }

  employees(): FormArray {
    return this.businessForm.get('employees') as FormArray;
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

  onEmployeeFileChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const filePath = `employees/${this.businessId}/${file.name}`;
      const task = this.businessService.uploadFile(filePath, file);

      this.uploadProgress[`employee_${index}`] = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          this.businessService.getDownloadURL(filePath).subscribe(url => {
            this.employees().at(index).patchValue({ photoURL: url });
          });
        })
      ).subscribe();
    }
  }

  onFileChange(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      const filePath = `${field}/${this.businessId}/${file.name}`;
      const task = this.businessService.uploadFile(filePath, file);

      this.uploadProgress[field] = task.percentageChanges();

      task.snapshotChanges().pipe(
        finalize(() => {
          this.businessService.getDownloadURL(filePath).subscribe(url => {
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
  }

  onSubmit(): void {
    if (this.businessForm.valid) {
      const formValue: Business = this.businessForm.value;
      if (this.businessId) {
        this.businessService.updateBusiness(this.businessId, formValue)
          .then(() => alert('Business details updated successfully!'))
          .catch(err => console.error('Error updating business details', err));
      }
    }
  }
}
