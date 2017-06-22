import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {IqDatepickerOptions} from './iq-datepicker-options';
import {IqDatepickerTranslations} from './iq-datepicker-translations';
import {IqDatepickerEnglishTranslation} from './iq-datepicker-english-translation';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';

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
    selectedDateInput = new FormControl();
    propagateChange = (_: any) => {
    };

    defaults: IqDatepickerOptions = {
        calendarBtnClass: 'btn btn-default',
        calendarBtnIcon: 'glyphicon glyphicon-calendar',
        removeBtnClass: 'btn btn-default',
        removeBtnVisible: true,
        removeBtnIcon: 'glyphicon glyphicon-remove'
    };

    constructor() {
    }

    writeValue(obj: Date): void {
        this.selectedDate = new Date(obj.getTime());
        this.onDateSelected(this.selectedDate);
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
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
        this.selectedDate = new Date(date.getTime());
        this.propagateChange(this.selectedDate);
        this.dateSelected.emit(this.selectedDate);
    }

    private dateToString(date: Date): string {
        if (date) {
            return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        } else {
            return null;
        }
    }
}
