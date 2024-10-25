import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Business } from 'src/app/model/business-questions.model';

@Component({
  selector: 'app-contact-us-page',
  templateUrl: './contact-us-page.component.html',
  styleUrls: ['./contact-us-page.component.css']
})
export class ContactUsPageComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() business!: Business | undefined;
  @Input() businessId!: string;

  predefinedImages = [
    { url: 'assets/sharedAssets/image_fx_(1).jpg' },
    { url: 'assets/sharedAssets/image_fx_(2).jpg' },
    { url: 'assets/sharedAssets/image_fx_(3).jpg' },
    { url: 'assets/sharedAssets/image_fx_(4).jpg' },
    { url: 'assets/sharedAssets/image_fx_(5).jpg' },
  ];

  //to do: allow user to select one of the 5 images to show on the contact us page, or to upload a photos under the business dir and save the url to busines.contactUsImageUrl
  //to do also use the personalize contact us page message currently not used.

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
