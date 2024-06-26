import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitComma'
})
export class SplitCommaPipe implements PipeTransform {
  transform(value: string): any[] {
    return value ? JSON.parse(value) : [];
  }
}
