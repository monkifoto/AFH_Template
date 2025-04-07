import { Component, OnInit } from '@angular/core';
import { WebContentService } from 'src/app/services/web-content.service';
import { Business } from 'src/app/model/business-questions.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MetaService } from 'src/app/services/meta-service.service';
// import { Modal } from 'bootstrap';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EmailService } from 'src/app/services/email.service';

@Component({
    selector: 'app-sp-contact-us-component',
    templateUrl: './sp-contact-us-component.component.html',
    styleUrls: ['./sp-contact-us-component.component.css'],
    standalone: false
})
export class SpContactUsComponentComponent implements OnInit {
  business: Business | null = null;

  layoutType: string | undefined = 'demo';

  formData = {
    name: '',
    email: '',
    message: '',
    website: this.extractBaseDomain(window.location.hostname),
  };

  modalTitle: string = '';
  modalMessage: string = '';
  // responseModal!: Modal; // Modal instance

  constructor(
    private sanitizer: DomSanitizer,
    private businessDataService: BusinessDataService,
    private webContent: WebContentService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private emailService: EmailService,
    private metaService: MetaService
  ) {}

  get sanitizedBusinessHours(): SafeHtml {
    return this.business?.businessHours
      ? this.sanitizer.bypassSecurityTrustHtml(this.business.businessHours)
      : '';
  }

  ngOnInit(): void {
    this.businessDataService.businessData$.subscribe((business) => {
      this.business = business;

      if (business?.id) {
        this.metaService.loadAndApplyMeta(business?.id);
        this.layoutType = this.business?.theme.themeType;
      }
    });
  }

  onSubmit() {
    console.log(this.formData);
        // Use the EmailService to send the email
        this.emailService.sendEmail(this.formData).subscribe(
          response => {
            this.modalTitle = 'Message Sent';
            this.modalMessage = 'Thank you for your message! We will get back to you soon.';
            // this.showModal();
          },
          error => {
            console.error('Error sending email', error);
            this.modalTitle = 'Error';
            this.modalMessage = 'There was an issue sending your message. Please try again later.';
            // this.showModal();
          }
        );
  }

  private extractBaseDomain(hostname: string): string {
    const parts = hostname.split('.');
    // Check if hostname has subdomains (e.g., subdomain.example.com)
    if (parts && parts.length > 2) {
      return parts.slice(-2).join('.'); // Keep the last two parts (e.g., example.com)
    }
    return hostname; // If no subdomains, return as is
  }

  // showModal() {
  //   if (this.responseModal) {
  //     this.responseModal.show(); // Use the Bootstrap modal instance to show the modal
  //   }
  // }
}
