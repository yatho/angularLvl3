import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoFilterDropDownComponent, OptionValue } from './auto-filter-drop-down.component';

describe('AutoFilterDropDownComponent', () => {
  let component: AutoFilterDropDownComponent<OptionValue>;
  let fixture: ComponentFixture<AutoFilterDropDownComponent<OptionValue>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutoFilterDropDownComponent]
    });
    fixture = TestBed.createComponent(AutoFilterDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
