import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-center-text',
  templateUrl: './center-text.component.html',
  styleUrls: ['./center-text.component.css']
})
export class CenterTextComponent {
  @Input() title!: string;
  @Input() content!: string;
  @Input() showBtn!: boolean;

}
