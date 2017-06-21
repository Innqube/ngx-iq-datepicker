import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IqCalendarComponent} from './iq-calendar.component';

describe('IqCalendarComponent', () => {
  let component: IqCalendarComponent;
  let fixture: ComponentFixture<IqCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IqCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IqCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
