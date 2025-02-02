import { Component, Input, OnInit } from '@angular/core';
import { ListItem } from 'src/app/model/business-questions.model';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  @Input() services!: ListItem[];
  @Input() layoutType: string = 'demo';

  ngOnInit(): void{
    console.log("List Items: ", this.services);
    console.log("List Items layoutType", this.layoutType);
  }
}
