import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addVat',
  standalone: true
})
export class AddVatPipe implements PipeTransform {
  transform(value: number, percentage: number = 15): number {
    if (isNaN(value)) {
      return 0;
    }
    return value + (value * percentage / 100);
  }
}
