import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ 
    name: 'trimDecimalPipe',
	standalone: true
})
export class TrimDecimalPipe implements PipeTransform {
    transform(num: number): number {
        return +num.toFixed(2);
    }
}