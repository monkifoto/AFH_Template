import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-list',
  templateUrl: './icon-list.component.html',
  styleUrls: ['./icon-list.component.css']
})
export class IconListComponent {
  @Input() services: Array<{ icon: string, title: string, description: string }> = [];
}
