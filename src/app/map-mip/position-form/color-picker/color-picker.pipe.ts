import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colorPicker'
})
export class ColorPickerPipe implements PipeTransform {

  transform(value: any[], iconsPerRow = 1): any {
    // if(iconsPerRow  ===  1) {
    //   return value;
    // }

    let rowsArray = [];
    let rowArray = [];

    value.forEach((value, index, array) => {
      rowArray.push(value);
      if ((index + 1) % iconsPerRow === 0) {
        rowsArray.push(rowArray);
        rowArray = [];
      } else if (index === (array.length - 1)) {
        rowsArray.push(rowArray);
      }
    });

    return rowsArray;
  }

}
