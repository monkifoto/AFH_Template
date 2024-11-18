import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-left-text',
  templateUrl: './left-text.component.html',
  styleUrls: ['./left-text.component.css']
})
export class LeftTextComponent {
  @Input() title!: string;
  @Input() content!: string;
  @Input() imageURL!: string;
}
