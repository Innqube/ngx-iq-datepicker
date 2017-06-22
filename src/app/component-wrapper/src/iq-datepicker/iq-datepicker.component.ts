import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    HostListener,
    Input,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {IqDatepickerOptions} from './iq-datepicker-options';
import {IqDatepickerTranslations} from './iq-datepicker-translations';
import {IqDatepickerEnglishTranslation} from './iq-datepicker-english-translation';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {IqCalendarComponent} from '../iq-calendar/iq-calendar.component';

const KEY_CODE_ENTER = 13;
const KEY_CODE_TAB = 9;
const VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => IqDatepickerComponent),
    multi: true
};

@Component({
    selector: 'iq-datepicker',
    templateUrl: './iq-datepicker.component.html',
    styleUrls: ['./iq-datepicker.component.css'],
    providers: [VALUE_ACCESSOR]
})
export class IqDatepickerComponent implements OnInit, ControlValueAccessor {

    selectedDate: Date;
    @Input() options: IqDatepickerOptions = {};
    @Input() translations: IqDatepickerTranslations = new IqDatepickerEnglishTranslation();
    @Output() dateSelected = new EventEmitter<Date>();
    @ViewChild(IqCalendarComponent) calendarComponent;
    selectedDateInput = new FormControl();
    calendarVisible = false;
    disabled = false;
    propagateChange = (_: any) => {
    };

    defaults: IqDatepickerOptions = {
        calendarBtnClass: 'btn btn-default',
        calendarBtnIcon: 'glyphicon glyphicon-calendar',
        removeBtnClass: 'btn btn-default',
        removeBtnVisible: true,
        removeBtnIcon: 'glyphicon glyphicon-remove'
    };

    constructor(private elementRef: ElementRef) {
    }

    writeValue(obj: Date): void {
        this.selectedDate = obj ? new Date(obj.getTime()) : null;
        this.onDateSelected(this.selectedDate);
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this.selectedDateInput.disable(isDisabled);
    }

    ngOnInit() {
        this.setDefaults();
    }

    private setDefaults() {
        Object
            .keys(this.defaults)
            .filter(key => this.options[key] === undefined || this.options[key] === null)
            .forEach(key => this.options[key] = this.defaults[key]);
    }

    onDateSelected(date: Date) {
        this.selectedDateInput.patchValue(this.dateToString(date));
        this.selectedDate = date ? new Date(date.getTime()) : null;
        this.propagateChange(this.selectedDate);
        this.dateSelected.emit(this.selectedDate);
        this.hideCalendar();
    }

    private dateToString(date: Date): string {
        if (date) {
            return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        } else {
            return null;
        }
    }

    clear() {
        this.onDateSelected(null);

        if (this.calendarComponent) {
            this.calendarComponent.selectedDate = null;
            this.calendarComponent.updateViewDays();
        }
    }

    showCalendar() {
        this.calendarVisible = true;
    }

    hideCalendar() {
        this.calendarVisible = false;
    }

    toggleCalendar() {
        this.calendarVisible = !this.calendarVisible;
    }

    @HostListener('keydown', ['$event'])
    handleKeyDown(event: any) {
        if (event.keyCode === KEY_CODE_ENTER || event.keyCode === KEY_CODE_TAB) {
            this.hideCalendar();
        }
    }

    @HostListener('document:click', ['$event'])
    handleClick(event: any) {
        if (this.calendarVisible && !this.elementRef.nativeElement.contains(event.target)) {
            this.hideCalendar();
        }
    }
}
