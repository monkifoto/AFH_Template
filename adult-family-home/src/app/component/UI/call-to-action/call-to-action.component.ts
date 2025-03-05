import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-call-to-action',
  templateUrl: './call-to-action.component.html',
  styleUrls: ['./call-to-action.component.css']
})
export class CallToActionComponent implements OnInit {
  @Input() title : string = 'Come Meet Our Family!';
  @Input() content: string = 'Questions before getting started?';
  @Input() buttonText: string = 'Get in touch';
  @Input() isButton: boolean = false;
  @Input() bgColor?: string = '#344E5C';
  @Input() textColor?: string = '#FFFFFF';


  constructor() {};
  ngOnInit(): void {
    console.log("CTA, background color: ", this.bgColor);
    console.log("CTA, text color: ", this.textColor);
  }

}
