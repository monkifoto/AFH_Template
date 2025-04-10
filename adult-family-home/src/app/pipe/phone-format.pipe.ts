import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'phoneFormat',
    standalone: false
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string | number | undefined): string {
    if (!value) return ''; // ✅ Return empty string if value is undefined or null

    let phone = value.toString().replace(/\D/g, ''); // Remove non-numeric characters

<<<<<<< HEAD
    if (phone && phone.length !== 10) return value.toString(); // ✅ Return original if not 10 digits
=======
    if (phone.length !== 10) return value.toString(); // ✅ Return original if not 10 digits
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4

    return `${phone.slice(0, 3)}.${phone.slice(3, 6)}.${phone.slice(6)}`;
  }
}
