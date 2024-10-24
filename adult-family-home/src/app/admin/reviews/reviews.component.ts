import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { finalize, Observable } from 'rxjs';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {
  @Input() form!: FormGroup;
  businessId!: ""; //to do: need this value for uploading images
  uploadProgress: { [key: string]: Observable<number | undefined> } = {};

  constructor(private fb: FormBuilder,
    private uploadService: UploadService,
  ) {}



  get testimonials(): FormArray {
    return this.form.get('testimonials') as FormArray;
  }

  addTestimonial(): void {
    const testimonialForm = this.fb.group({
      id: [''],
      name: [''],
      quote: [''],
      photoURL: ['']
    });
    this.testimonials.push(testimonialForm);
  }

  removeTestimonial(index: number): void {
    this.testimonials.removeAt(index);
  }

  onTestimonialFileChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const { uploadProgress, downloadUrl } = this.uploadService.uploadFile(file, this.businessId, 'testimonail');

      this.uploadProgress[`testimonails_${index}`] = uploadProgress;

      downloadUrl.pipe(
        finalize(() => {
          downloadUrl.subscribe(url => {
            this.testimonials.at(index).patchValue({ photoURL: url });
          });
        })
      ).subscribe();
    }
  }
}
