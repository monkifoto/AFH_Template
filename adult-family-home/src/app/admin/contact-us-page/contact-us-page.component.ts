import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-contact-us-page',
  templateUrl: './contact-us-page.component.html',
  styleUrls: ['./contact-us-page.component.css']
})
export class ContactUsPageComponent implements OnInit {
  @Input() form!: FormGroup;

  predefinedImages = [
    { url: 'assets/sharedAssets/image_fx_(1).jpg' },
    { url: 'assets/sharedAssets/image_fx_(2).jpg' },
    { url: 'assets/sharedAssets/image_fx_(3).jpg' },
    { url: 'assets/sharedAssets/image_fx_(4).jpg' },
    { url: 'assets/sharedAssets/image_fx_(5).jpg' },
  ];



  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize the form with necessary controls
    this.form = this.fb.group({
      selectedImageUrl: [''],  // Control for image selection
      contactFormDetails: [''],
      mapIframeUrl: ['']
    });
  }

  onImageSelection(url: string) {
    this.form.patchValue({
      selectedImageUrl: url
    });
  }

}
