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
    // Check if controls exist; if not, add them with default values
    if (!this.form.contains('contactUsImageUrl')) {
      this.form.addControl('contactUsImageUrl', this.fb.control(this.form.value.contactUsImageUrl || ''));
    }

    if (!this.form.contains('contactFormDetails')) {
      this.form.addControl('contactFormDetails', this.fb.control(this.form.value.contactFormDetails || ''));
    }
  }

  onImageSelection(url: string) {
    console.log("Admin: Contact Us: onImageSelected: url: ", url)
    this.form.patchValue({
      contactUsImageUrl: url
    });
    if (this.business) {
      this.business.contactUsImageUrl = url;  // Save selected URL in business model
    }
  }

}
