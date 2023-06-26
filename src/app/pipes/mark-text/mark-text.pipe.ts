import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'markText',
  standalone: true,

})
export class MarkTextPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(text: any, mark: string): SafeHtml {
    text = `${text}`;
    if (!text || !mark) return text;
    return this.sanitizer.bypassSecurityTrustHtml(text.replace(new RegExp(`(${mark})`, 'gi'), '<b class="marked-text">$1</b>'));
  }

}
