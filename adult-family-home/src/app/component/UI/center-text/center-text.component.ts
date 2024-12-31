import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-center-text',
  templateUrl: './center-text.component.html',
  styleUrls: ['./center-text.component.css']
})
export class CenterTextComponent {
  @Input() title!: string;
  @Input() showBtn!: boolean;

  private _content!: string;
  sanitizedContent!: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  @Input()
  set content(value: string) {
    this._content = value;
    this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(value);
  }

  get content(): string {
    return this._content;
  }
}
