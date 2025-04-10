import { Component, OnInit } from '@angular/core';
import { WebContentService } from 'src/app/services/web-content.service';
import { Business } from 'src/app/model/business-questions.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MetaService } from 'src/app/services/meta-service.service';
<<<<<<< HEAD
// import { Modal } from 'bootstrap';
=======
import { Modal } from 'bootstrap';
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
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
<<<<<<< HEAD
=======

>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  layoutType: string | undefined = 'demo';

  formData = {
    name: '',
    email: '',
    message: '',
<<<<<<< HEAD
    website: '', // defer initialization
=======
    website: this.extractBaseDomain(window.location.hostname),
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  };

  modalTitle: string = '';
  modalMessage: string = '';
<<<<<<< HEAD
=======
  responseModal!: Modal; // Modal instance
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4

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
<<<<<<< HEAD
    // ✅ SSR-safe window check
    if (typeof window !== 'undefined') {
      this.formData.website = this.extractBaseDomain(window.location.hostname);
    }

=======
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
    this.businessDataService.businessData$.subscribe((business) => {
      this.business = business;

      if (business?.id) {
<<<<<<< HEAD
        this.metaService.loadAndApplyMeta(business.id);
        this.layoutType = business?.theme?.themeType;
=======
        this.metaService.loadAndApplyMeta(business?.id);
        this.layoutType = this.business?.theme.themeType;
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
      }
    });
  }

  onSubmit() {
    console.log(this.formData);
<<<<<<< HEAD

    this.emailService.sendEmail(this.formData).subscribe(
      () => {
        this.modalTitle = 'Message Sent';
        this.modalMessage = 'Thank you for your message! We will get back to you soon.';
      },
      error => {
        console.error('Error sending email', error);
        this.modalTitle = 'Error';
        this.modalMessage = 'There was an issue sending your message. Please try again later.';
      }
    );
=======
        // Use the EmailService to send the email
        this.emailService.sendEmail(this.formData).subscribe(
          response => {
            this.modalTitle = 'Message Sent';
            this.modalMessage = 'Thank you for your message! We will get back to you soon.';
            this.showModal();
          },
          error => {
            console.error('Error sending email', error);
            this.modalTitle = 'Error';
            this.modalMessage = 'There was an issue sending your message. Please try again later.';
            this.showModal();
          }
        );
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  }

  private extractBaseDomain(hostname: string): string {
    const parts = hostname.split('.');
<<<<<<< HEAD
    return parts.length > 2 ? parts.slice(-2).join('.') : hostname;
=======
    // Check if hostname has subdomains (e.g., subdomain.example.com)
    if (parts.length > 2) {
      return parts.slice(-2).join('.'); // Keep the last two parts (e.g., example.com)
    }
    return hostname; // If no subdomains, return as is
  }

  showModal() {
    if (this.responseModal) {
      this.responseModal.show(); // Use the Bootstrap modal instance to show the modal
    }
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  }
}
