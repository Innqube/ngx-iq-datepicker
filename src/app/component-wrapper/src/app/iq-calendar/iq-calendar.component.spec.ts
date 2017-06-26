import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IqCalendarComponent} from './iq-calendar.component';
import {IqDatepickerEnglishTranslation} from '../iq-datepicker/iq-datepicker-english-translation';

describe('IqCalendarComponent', () => {
    let component: IqCalendarComponent;
    let fixture: ComponentFixture<IqCalendarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IqCalendarComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IqCalendarComponent);
        component = fixture.componentInstance;
        component.translations = new IqDatepickerEnglishTranslation();
        component.options = {size: 'md'};
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should go to previous month', () => {
        component.date = new Date(2017, 5, 1);
        component.prevMonth();
        expect(component.date.getMonth()).toBe(4);
    });

    it('should go to previous year if visible month is january', () => {
        component.date = new Date(2017, 0, 1);
        component.prevMonth();
        expect(component.date.getFullYear()).toBe(2016);
    });

    it('should go to last month if visible month is january', () => {
        component.date = new Date(2017, 0, 1);
        component.prevMonth();
        expect(component.date.getMonth()).toBe(11);
    });

    it('should go to next month', () => {
        component.date = new Date(2017, 5, 1);
        component.nextMonth();
        expect(component.date.getMonth()).toBe(6);
    });

    it('should go to next year if visible month is december', () => {
        component.date = new Date(2017, 11, 1);
        component.nextMonth();
        expect(component.date.getFullYear()).toBe(2018);
    });

    it('should go to first month if visible month is december', () => {
        component.date = new Date(2017, 11, 1);
        component.nextMonth();
        expect(component.date.getMonth()).toBe(0);
    });

    it('should go to previous year', () => {
        component.date = new Date(2017, 11, 1);
        component.prevYear();
        expect(component.date.getFullYear()).toBe(2016);
    });

    it('should go to next year', () => {
        component.date = new Date(2017, 11, 1);
        component.nextYear();
        expect(component.date.getFullYear()).toBe(2018);
    });

    it('should update calendar when month is selected', () => {
        spyOn(component, 'updateViewDays');
        component.date = new Date();
        component.selectMonth(2);
        expect(component.updateViewDays).toHaveBeenCalled();
    });

    it('should update calendar when year is selected', () => {
        spyOn(component, 'updateViewDays');
        component.date = new Date();
        component.setYear(2020);
        expect(component.updateViewDays).toHaveBeenCalled();
    });

    it('should emit value when date is selected', () => {
        spyOn(component.dateSelected, 'emit');
        component.date = new Date();
        component.onDateSelected(1, false, false);
        expect(component.dateSelected.emit).toHaveBeenCalled();
    });

    it('should set view on previous month if a date from previous month is selected', () => {
        spyOn(component, 'prevMonth');
        component.date = new Date();
        component.onDateSelected(30, true, false);
        expect(component.prevMonth).toHaveBeenCalled();
    });

    it('should set view on next month if a date from next month is selected', () => {
        spyOn(component, 'nextMonth');
        component.date = new Date();
        component.onDateSelected(1, false, true);
        expect(component.nextMonth).toHaveBeenCalled();
    });

    it('should set current year if input is before 1970', () => {
        component.date = new Date(2015, 11, 1);
        component.setYear(1969);
        expect(component.date.getFullYear()).toBe(new Date().getFullYear());
    });

    it('should stop propagation when entering year with enter key', () => {
        const input = fixture.nativeElement.querySelector('input');
        const event = document.createEvent('Event');
        event.initEvent('keydown', true, true);
        event['keyCode'] = 13;
        spyOn(event, 'stopPropagation');
        input.dispatchEvent(event);
        expect(event.stopPropagation).toHaveBeenCalled();
    });
});
