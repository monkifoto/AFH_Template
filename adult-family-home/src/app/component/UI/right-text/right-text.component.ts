import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-right-text',
  templateUrl: './right-text.component.html',
  styleUrls: ['./right-text.component.css']
})
export class RightTextComponent {
  @Input() themeType!: string;
  @Input() title!: string;
  @Input() subTitle!: string;
  @Input() imageURL!: string;
  @Input() showBtn: boolean = false;
  @Input() showImage: boolean =false;
  @Input() _businessName: string = '';

  private _content!: string;
  sanitizedContent!: SafeHtml;

  constructor(private sanitizer: DomSanitizer, private router: Router) {}
  ngOnInit(): void {
    console.log('Right Text Component Loaded , themeType: '+ this.themeType+  ' Business Name:' + this._businessName + ' Title: ' + this.title);
  }

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
