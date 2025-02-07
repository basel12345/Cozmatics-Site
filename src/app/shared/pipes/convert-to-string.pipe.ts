import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertToString',
  standalone: true
})
export class ConvertToStringPipe implements PipeTransform {

  transform(value: any[], name: any): string {
    if (value) return value.map(res => res[name]).join("-");
    else return ""
  }

}
