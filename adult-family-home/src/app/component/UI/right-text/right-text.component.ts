import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-right-text',
  templateUrl: './right-text.component.html',
  styleUrls: ['./right-text.component.css']
})
export class RightTextComponent {
  @Input() title!: string;
  @Input() content!: string;
  @Input() imageURL!: string;
}
