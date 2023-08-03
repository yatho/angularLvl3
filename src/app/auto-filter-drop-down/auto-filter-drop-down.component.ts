import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClickOutsideDirective } from '../click-outside.directive';

export type OptionValue = {
  name: string;
};

@Component({
  selector: 'app-auto-filter-drop-down',
  templateUrl: './auto-filter-drop-down.component.html',
  styleUrls: ['./auto-filter-drop-down.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AutoFilterDropDownComponent,
      multi: true
    }
  ]
})
export class AutoFilterDropDownComponent<T extends OptionValue> implements ControlValueAccessor {
  protected searchValue?: string;
  protected openned = false;

  set value(value: T) {
    this.searchValue = value.name;
    this.openned = false;
    this.onChange(value);
    this.onTouched();
  }

  @Input()
  options: T[] = [];
  @Input()
  placeholder: string = 'Search ...';

  private onChange = (value: T) => {};
  private onTouched = () => {};
  
  writeValue(obj?: T): void {
    if (obj)
      this.searchValue = obj.name;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onOptionClick(option: T) {
    this.value = option;
  }
}
