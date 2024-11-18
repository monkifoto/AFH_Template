import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent {
  @Input() services!: { icon: string, title: string, description: string }[];
  @Input() layoutType: string = 'demo';
}
