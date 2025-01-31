import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-center-text',
  templateUrl: './center-text.component.html',
  styleUrls: ['./center-text.component.css']
})
export class CenterTextComponent {
  @Input() themeType!: string;
  @Input() title!: string;
  @Input() imageURL!: string;
  @Input() showBtn: boolean = false;
  @Input() showImage: boolean =false;

  private _content!: string;
  sanitizedContent!: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  @Input()
  set content(value: string) {
    this._content = value;
    this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(value);
  }

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
