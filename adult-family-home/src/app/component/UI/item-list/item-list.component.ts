import { Component, Input } from '@angular/core';
import { ListItem } from 'src/app/model/business-questions.model';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent {
  @Input() services!: ListItem[];
  @Input() layoutType: string = 'demo';
}
