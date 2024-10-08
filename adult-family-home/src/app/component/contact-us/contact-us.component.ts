import { Component, OnInit } from '@angular/core';
import { WebContentService } from 'src/app/services/web-content.service';
import { Business } from 'src/app/model/business-questions.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MetaService } from 'src/app/services/meta-service.service';
import { Modal } from 'bootstrap';


@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent  implements OnInit{

  business!: Business;

  formData = {
    name: '',
    email: '',
    message: ''
  };

  modalTitle: string = '';
  modalMessage: string = '';
  responseModal!: Modal; // Modal instance

  constructor(private webContent: WebContentService, private route: ActivatedRoute,private http: HttpClient,  private metaService: MetaService){}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let businessId = params['id'];

      this.metaService.getMetaData(businessId).subscribe((metaData: { title: string; description: string; keywords: string; }) => {
        this.metaService.updateMetaTags(metaData);
      });

      this.webContent.getBusinessData(businessId).subscribe(data => {
        if(data)
        this.business = data;
      });
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const modalElement = document.getElementById('responseModal');
      if (modalElement) {
        this.responseModal = new Modal(modalElement); // Bootstrap modal instance
      } else {
        console.error('Modal element not found.');
      }
    }, 0); // This delays execution to the next event loop cycle, ensuring the DOM is fully loaded
  }

  onSubmit() {
    console.log(this.formData);
    this.http.post('https://us-central1-afhdynamicwebsite.cloudfunctions.net/sendContactEmail', this.formData)
      .subscribe(
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
  }

  showModal() {
    if (this.responseModal) {
      this.responseModal.show();  // Use the Bootstrap modal instance to show the modal
    }
  }
}
