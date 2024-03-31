import { IBrand } from './../models/brand';
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'searchPipe',
    standalone: true
})
export class SearchPipe implements PipeTransform {
    transform(snapshotArr: IBrand[], searchValue: string): IBrand[] {
        if (snapshotArr && searchValue) {
            return snapshotArr.filter((snapshot: IBrand) => {
                return snapshot.name.toLowerCase().includes(searchValue.toLowerCase());
            });
        } else {
            return snapshotArr;
        }
    }
}