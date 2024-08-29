import { Component, OnInit } from '@angular/core';
import { WebContentService } from 'src/app/services/web-content.service';
import { Business } from 'src/app/model/business-questions.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  constructor(private webContent: WebContentService, private route: ActivatedRoute,private http: HttpClient){}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let businessId = params['id'];
      this.webContent.getBusinessData(businessId).subscribe(data => {
        if(data)
        this.business = data;
      });
    });
  }


  onSubmit() {
    console.log(this.formData);
    this.http.post('https://us-central1-afhdynamicwebsite.cloudfunctions.net/sendContactEmail', this.formData)
      .subscribe(
        response => console.log('Email sent successfully', response),
        error => console.error('Error sending email', error)
      );
  }

}
