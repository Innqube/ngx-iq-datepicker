import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IqDatepickerComponent} from './iq-datepicker.component';

describe('IqDatepickerComponent', () => {
  let component: IqDatepickerComponent;
  let fixture: ComponentFixture<IqDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IqDatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IqDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
