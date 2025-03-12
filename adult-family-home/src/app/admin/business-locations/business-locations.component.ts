import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/business.service';

@Component({
  selector: 'app-business-locations',
  templateUrl: './business-locations.component.html',
  styleUrls: ['./business-locations.component.css']
})
export class BusinessLocationsComponent implements OnInit {
  @Input() businessId!: string;
  locationForm: FormGroup;
  isSaving = false;
  message: string | null = null;

  constructor(private fb: FormBuilder, private businessService: BusinessService) {
    this.locationForm = this.fb.group({
      locations: this.fb.array([])
    });
  }

  ngOnInit(): void {
    if (this.businessId) {
      this.loadLocations();
    }
  }

  get locations(): FormArray {
    return this.locationForm.get('locations') as FormArray;
  }

  loadLocations(): void {
    this.businessService.getBusiness(this.businessId).subscribe(business => {
      if (business?.locations) {
        this.locations.clear();
        business.locations.forEach(location => this.addLocation(location));
      }
    });
  }

  addLocation(location: any = { name: '', address: '', phone: '' }): void {
    this.locations.push(
      this.fb.group({
        name: [location.name, Validators.required],
        address: [location.address, Validators.required],
        phone: [location.phone, [Validators.required, Validators.pattern(/^\d{10}$/)]]
      })
    );
  }

  removeLocation(index: number): void {
    this.locations.removeAt(index);
  }

  saveLocations(): void {
    if (this.locationForm.valid) {
      this.isSaving = true;
      const updatedData = { locations: this.locationForm.value.locations };

      this.businessService.updateBusiness(this.businessId, updatedData).then(
        () => {
          this.isSaving = false;
          this.message = 'Locations saved successfully!';
          setTimeout(() => (this.message = null), 3000);
        },
        (error) => {
          this.isSaving = false;
          this.message = 'Failed to save locations. Please try again.';
          console.error('Error saving locations:', error);
        }
      );
    }
  }
}
