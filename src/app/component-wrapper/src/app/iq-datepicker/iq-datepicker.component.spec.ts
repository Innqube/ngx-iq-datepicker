import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {IqDatepickerComponent} from './iq-datepicker.component';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {IqDatepickerEnglishTranslation} from './iq-datepicker-english-translation';
import {IqCalendarComponent} from '../iq-calendar/iq-calendar.component';
import {Component, OnInit, ViewChild} from '@angular/core';
import {TextMaskModule} from 'angular2-text-mask';

describe('IqDatepickerComponent', () => {
    let component: IqDatepickerComponent;
    let fixture: ComponentFixture<IqDatepickerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                IqDatepickerComponent,
                IqCalendarComponent,
                TestHostComponent,
                TestHostComponentDisabled
            ],
            imports: [
                ReactiveFormsModule,
                TextMaskModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IqDatepickerComponent);
        component = fixture.componentInstance;
        component.translations = new IqDatepickerEnglishTranslation();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set value when initializing from form', () => {
        let parent = TestBed.createComponent(TestHostComponent);
        let hostComponent: TestHostComponent = parent.componentInstance;
        parent.detectChanges();
        expect(hostComponent.datePicker.selectedDate.getDate()).toBe(22);
    });

    it('form initialization should fire selection selected', () => {
        spyOn(component, 'onDateSelected');
        component.writeValue(new Date());
        expect(component.onDateSelected).toHaveBeenCalled();
    });

    it('clear button should clear selected value', () => {
        let parent = TestBed.createComponent(TestHostComponent);
        let hostComponent: TestHostComponent = parent.componentInstance;
        parent.detectChanges();
        const selectors = parent.nativeElement.querySelector('button');
        selectors.dispatchEvent(new Event('click'));
        expect(hostComponent.datePicker.selectedDate).toBeNull();
    });

    it('should start with hidden calendar', () => {
        const selectors = fixture.nativeElement.querySelectorAll('button');
        selectors[1].dispatchEvent(new Event('click'));
        expect(component.calendarVisible).toBeTruthy();
    });

    it('should show calendar when calendar button is clicked', () => {
        const selectors = fixture.nativeElement.querySelectorAll('button');
        selectors[1].dispatchEvent(new Event('click'));
        expect(component.calendarVisible).toBeTruthy();
    });

    it('should show calendar on focus', () => {
        const selector = fixture.nativeElement.querySelector('input');
        selector.dispatchEvent(new Event('focus'));
        expect(component.calendarVisible).toBeTruthy();
    });

    it('clear button should update calendar', () => {
        component.calendarVisible = true;
        fixture.detectChanges();
        spyOn(component.calendarComponent, 'updateViewDays');
        const selectors = fixture.nativeElement.querySelector('button');
        selectors.dispatchEvent(new Event('click'));
        expect(component.calendarComponent.updateViewDays).toHaveBeenCalled();
    });

    it('enter should hide calendar', () => {
        spyOn(component, 'hideCalendar');
        component.handleKeyDown({keyCode: 13});
        expect(component.hideCalendar).toHaveBeenCalled();
    });

    it('tab should hide calendar', () => {
        spyOn(component, 'hideCalendar');
        component.handleKeyDown({keyCode: 9});
        expect(component.hideCalendar).toHaveBeenCalled();
    });

    it('should disable input', () => {
        let parent = TestBed.createComponent(TestHostComponentDisabled);
        parent.detectChanges();
        const selector = parent.nativeElement.querySelector('input');
        expect(selector.disabled).toBeTruthy();
    });

    it('should disable clear button', () => {
        let parent = TestBed.createComponent(TestHostComponentDisabled);
        parent.detectChanges();
        const selector = parent.nativeElement.querySelector('button');
        expect(selector.disabled).toBeTruthy();
    });

    it('should disable calendar button', () => {
        let parent = TestBed.createComponent(TestHostComponentDisabled);
        parent.detectChanges();
        const selectors = parent.nativeElement.querySelectorAll('button');
        expect(selectors[1].disabled).toBeTruthy();
    });

    it('should not show clear button', () => {
        component.options = {removeBtnVisible: false};
        fixture.detectChanges();
        const selectors = fixture.nativeElement.querySelectorAll('button');
        expect(selectors.length).toBe(1);
    });

    it('should set selected date after valid input is entered', fakeAsync(() => {
        const input = fixture.nativeElement.querySelector('input');
        input.value = '14/11/1985';
        input.dispatchEvent(new Event('input'));
        tick(200);
        expect(component.selectedDate.getFullYear()).toBe(1985);
        expect(component.selectedDate.getMonth()).toBe(10);
        expect(component.selectedDate.getDate()).toBe(14);
    }));

    it('should update calendar year after entering as text', fakeAsync(() => {
        component.calendarVisible = true;
        fixture.detectChanges();
        const input = fixture.nativeElement.querySelector('input');
        input.value = '14/11/1985';
        input.dispatchEvent(new Event('input'));
        tick(200);
        expect(component.calendarComponent.date.getFullYear()).toBe(1985);
    }));

    it('should update calendar month after entering as text', fakeAsync(() => {
        component.calendarVisible = true;
        fixture.detectChanges();
        const input = fixture.nativeElement.querySelector('input');
        input.value = '14/11/1985';
        input.dispatchEvent(new Event('input'));
        tick(200);
        expect(component.calendarComponent.date.getMonth()).toBe(10);
    }));

    it('should accept an iso date', () => {
        let parent = TestBed.createComponent(TestHostComponent);
        parent.detectChanges();
        const component = parent.componentInstance;
        component.form.patchValue({date: '2017-06-26T19:06:42.916Z'});
        expect(component.form.value.date.getFullYear()).toBe(2017);
        expect(component.form.value.date.getMonth()).toBe(5);
        expect(component.form.value.date.getDate()).toBe(26);
    });

    it('should accept a unix date', () => {
        let parent = TestBed.createComponent(TestHostComponent);
        parent.detectChanges();
        const component = parent.componentInstance;
        component.form.patchValue({date: 1498505806668});
        expect(component.form.value.date.getFullYear()).toBe(2017);
        expect(component.form.value.date.getMonth()).toBe(5);
        expect(component.form.value.date.getDate()).toBe(26);
    });

    it('should hide calendar when clicking outside component', () => {
        spyOn(component, 'hideCalendar');
        component.calendarVisible = true;
        fixture.detectChanges();
        component.handleClick({});
        expect(component.hideCalendar).toHaveBeenCalled();
    });

    it('enter should set current date if not set', () => {
        component.handleKeyDown({keyCode: 13});
        expect(component.selectedDate.getFullYear()).toBe(new Date().getFullYear());
        expect(component.selectedDate.getMonth()).toBe(new Date().getMonth());
        expect(component.selectedDate.getDate()).toBe(new Date().getDate());
    });

    it('enter should not override with current date if date already set', () => {
        component.writeValue('14/11/1985');
        component.handleKeyDown({keyCode: 13});
        expect(component.selectedDate.getFullYear()).not.toBe(new Date().getFullYear());
        expect(component.selectedDate.getMonth()).not.toBe(new Date().getMonth());
        expect(component.selectedDate.getDate()).not.toBe(new Date().getDate());
    });

});

@Component({
    template: `
        <form [formGroup]="form">
            <iq-datepicker formControlName="date"></iq-datepicker>
        </form>
    `
})
class TestHostComponent implements OnInit {

    @ViewChild(IqDatepickerComponent)
    datePicker: IqDatepickerComponent;
    form: FormGroup;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            date: new Date(2017, 5, 22)
        });
    }

}

@Component({
    template: `
        <form [formGroup]="form">
            <iq-datepicker formControlName="date"></iq-datepicker>
        </form>
    `
})
class TestHostComponentDisabled implements OnInit {

    @ViewChild(IqDatepickerComponent)
    datePicker: IqDatepickerComponent;
    form: FormGroup;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            date: [{
                value: new Date(2017, 5, 22),
                disabled: true
            }]
        });
    }

}
