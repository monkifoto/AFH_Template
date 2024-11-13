import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-call-to-action',
  templateUrl: './call-to-action.component.html',
  styleUrls: ['./call-to-action.component.css']
})
export class CallToActionComponent {
  @Input() text: string = 'Questions before getting started?';
  @Input() buttonText: string = 'Get in touch';
  @Input() isButton: boolean = false;
  @Input() bgColor?: string = '#344E5C';
  @Input() textColor?: string = '#FFFFFF';
}
