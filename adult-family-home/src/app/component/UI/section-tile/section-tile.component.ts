import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-tile',
  templateUrl: './section-tile.component.html',
  styleUrls: ['./section-tile.component.css']
})
export class SectionTileComponent {
  @Input() title!: string;
}
