import { Pipe, PipeTransform } from '@angular/core';
import { Section } from 'src/app/model/section.model';

@Pipe({
  name: 'sectionFilter'
})
export class SectionFilterPipe implements PipeTransform {
  transform(sections: Section[] | undefined, sectionName: string): Section | null {
    if (!sections || !sectionName) return null;
    return sections.find(section => section.sectionName === sectionName) || null;
  }
}
