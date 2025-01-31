import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-right-text',
  templateUrl: './right-text.component.html',
  styleUrls: ['./right-text.component.css']
})
export class RightTextComponent {
  @Input() title!: string;
  // @Input() content!: string;
  @Input() imageURL!: string;
  @Input() themeType!: string;
  @Input()
  set content(value: string) {
    this._content = value;
    this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(value);
  }

    private _content!: string;
    sanitizedContent!: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {}

  get titleParts(): { part1: string; part2: string | null } {
    if (this.title.includes('|')) {
      const [part1, part2] = this.title.split('|').map(part => part.trim());
      return { part1, part2 };
    }
    return { part1: this.title, part2: null };
  }

  get content(): string {
    return this._content;
  }

}
