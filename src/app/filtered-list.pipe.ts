import { Pipe, PipeTransform } from '@angular/core';
import { OptionValue } from './auto-filter-drop-down/auto-filter-drop-down.component';

@Pipe({
  name: 'filteredList'
})
export class FilteredListPipe<T extends OptionValue> implements PipeTransform {

  transform(list: T[], inputValue: string): T[] {
    if (!inputValue || inputValue.trim() === '') {
      return list;
    }

    const lowercasedInput = inputValue.toLowerCase();
    return list.filter((value) => value.name.toLowerCase().includes(lowercasedInput));
  }

}
