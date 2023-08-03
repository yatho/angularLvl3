import { Directive, ElementRef, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appBoldSearchText]'
})
export class BoldSearchTextDirective implements OnChanges {
  @Input('appBoldSearchText')
  searchText?: string;

  constructor(private el: ElementRef) {}

  ngOnChanges(change: SimpleChanges) {
    const content = this.el.nativeElement.innerText;
    if (!content || !this.searchText) return;
    const highlightedContent = content.replace(
      new RegExp(change['searchText'].currentValue, 'gi'),
      (match: string) => `<strong>${match}</strong>`
    );
    this.el.nativeElement.innerHTML = highlightedContent;
  }
}
