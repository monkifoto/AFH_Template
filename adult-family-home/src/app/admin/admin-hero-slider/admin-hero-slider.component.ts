import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Business } from 'src/app/model/business-questions.model';
import { BusinessService } from 'src/app/services/business.service';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-admin-hero-slider',
  templateUrl: './admin-hero-slider.component.html',
  styleUrls: ['./admin-hero-slider.component.css']
})
export class AdminHeroSliderComponent implements OnInit {
  sliderForm: FormGroup;
  // businessId: string = 'default-business-id'; // Replace with your logic to fetch business ID
  uploadProgress: number[] = [];
  isSaving = false;
  message: string | null = null;
  @Input() business!: Business | undefined;
  @Input() businessId!: string;

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private uploadService: UploadService
  ) {
    this.sliderForm = this.fb.group({
      slides: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadSliderData();
  }

  get slides(): FormArray {
    return this.sliderForm.get('slides') as FormArray;
  }

  loadSliderData(): void {
    this.businessService.getBusiness(this.businessId).subscribe((business) => {
      this.slides.clear(); // Clear existing slides to prevent duplicates
      if (business?.heroSlider) {
        business.heroSlider.forEach((slide: any) => this.addSlide(slide));
      }
    });
  }

  addSlide(slide: any = { title: '', subtitle: '', backgroundImage: '', buttons: [] }): void {
    this.slides.push(
      this.fb.group({
        title: [slide.title, Validators.required],
        subtitle: [slide.subtitle],
        backgroundImage: [slide.backgroundImage],
        buttons: this.fb.array(
          slide.buttons.map((button: any) =>
            this.fb.group({
              text: [button.text, Validators.required],
              link: [button.link, Validators.required],
              outline: [button.outline],
            })
          )
        ),
      })
    );
  }

  removeSlide(index: number): void {
    this.slides.removeAt(index);
  }

  addButton(slideIndex: number): void {
    const buttons = this.slides.at(slideIndex).get('buttons') as FormArray;
    buttons.push(
      this.fb.group({
        text: ['', Validators.required],
        link: ['', Validators.required],
        outline: [false],
      })
    );
  }

  removeButton(slideIndex: number, buttonIndex: number): void {
    const buttons = this.slides.at(slideIndex).get('buttons') as FormArray;
    buttons.removeAt(buttonIndex);
  }

  uploadImage(event: Event, slideIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const file = input.files[0];
      const { uploadProgress, downloadUrl } = this.uploadService.uploadFile(
        file,
        this.businessId,
        'heroImages'
      );

      this.uploadProgress[slideIndex] = 0;

      uploadProgress.subscribe((progress) => {
        this.uploadProgress[slideIndex] = progress;
      });

      downloadUrl.subscribe((url) => {
        this.slides.at(slideIndex).get('backgroundImage')?.setValue(url);
        this.uploadProgress[slideIndex] = 100; // Complete
      });
    } else {
      console.error('No file selected');
    }
  }

  // uploadImage(file: File, slideIndex: number): void {
  //   const { uploadProgress, downloadUrl } = this.uploadService.uploadFile(
  //     file,
  //     this.businessId,
  //     'heroImages'
  //   );

  //   this.uploadProgress[slideIndex] = 0;

  //   uploadProgress.subscribe((progress) => {
  //     this.uploadProgress[slideIndex] = progress;
  //   });

  //   downloadUrl.subscribe((url) => {
  //     this.slides.at(slideIndex).get('backgroundImage')?.setValue(url);
  //     this.uploadProgress[slideIndex] = 100; // Set to 100% on completion
  //   });
  // }

  getButtons(slide: AbstractControl): FormArray {
    return slide.get('buttons') as FormArray;
  }

  saveSliderData(): void {
    if (this.sliderForm.valid) {
      this.isSaving = true;
      const updatedData = { heroSlider: this.sliderForm.value.slides };

      this.businessService.updateBusiness(this.businessId, updatedData).then(
        () => {
          this.isSaving = false;
          this.message = 'Slider data saved successfully!';
          setTimeout(() => (this.message = null), 3000); // Clear message after 3 seconds
        },
        (error) => {
          this.isSaving = false;
          this.message = 'Failed to save slider data. Please try again.';
          console.error('Error saving slider data:', error);
        }
      );
    }
  }
}
