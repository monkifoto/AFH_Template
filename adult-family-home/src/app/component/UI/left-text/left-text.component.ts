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
  @Input() themeType!: string;

  get titleParts(): { part1: string; part2: string | null } {
    if (this.title.includes('|')) {
      const [part1, part2] = this.title.split('|').map(part => part.trim());
      return { part1, part2 };
    }
    return { part1: this.title, part2: null };
  }
}
