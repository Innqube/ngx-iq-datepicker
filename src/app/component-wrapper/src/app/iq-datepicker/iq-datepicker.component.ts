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
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

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

    dateMask = [];
    yearMask = [/[1-3]/, /\d/, /\d/, /\d/];
    monthMask = [/[0-1]/, /\d/];
    dayMask = [/[0-3]/, /\d/];
    yearIndex;
    monthIndex;
    dayIndex;

    propagateChange = (_: any) => {
    };

    defaults: IqDatepickerOptions = {
        size: 'md',
        calendarBtnClass: 'btn btn-default',
        calendarBtnIcon: 'glyphicon glyphicon-calendar',
        removeBtnClass: 'btn btn-default',
        removeBtnVisible: true,
        removeBtnIcon: 'glyphicon glyphicon-remove',
        horizontal: false,
        dateFormat: 'dd/MM/yyyy',
        showPlaceholder: true,
        time: false
    };

    constructor(private elementRef: ElementRef) {
    }

    writeValue(obj: any): void {
        let date = obj;
        if (typeof obj === 'string' || typeof obj === 'number') {
            date = new Date(date);
        }
        this.onDateSelected(date);
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
        this.buildDateMask();
        this.selectedDateInput
            .valueChanges
            .debounceTime(100)
            .distinctUntilChanged()
            .subscribe(newValue => {
                if (newValue) {
                    const year = newValue.substring(this.yearIndex, this.yearIndex + 4);
                    const month = newValue.substring(this.monthIndex, this.monthIndex + 2);
                    const day = newValue.substring(this.dayIndex, this.dayIndex + 2);
                    const hours = Number(newValue.substring(11, 13));
                    const minutes = Number(newValue.substring(14, 16));

                    if (this.calendarComponent) {
                        if (!isNaN(month)) {
                            this.calendarComponent.selectMonth(month - 1);
                        }

                        if (!isNaN(year)) {
                            this.calendarComponent.setYear(year);
                        }

                        this.calendarComponent.setHours(isNaN(hours) ? 0 : hours);
                        this.calendarComponent.setMinutes(isNaN(minutes) ? 0 : minutes);
                    }

                    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {

                        if (!this.options.time) {
                            this.onDateSelected(new Date(year, month - 1, day));
                        } else {
                            if (!isNaN(hours) && !isNaN(minutes)) {
                                this.onDateSelected(new Date(year, month, day, hours, minutes));
                            }
                        }
                    }
                } else {
                    this.onDateSelected(null);
                }
            });
        this.yearIndex = this.options.dateFormat.indexOf('yyyy');
        this.monthIndex = this.options.dateFormat.indexOf('MM');
        this.dayIndex = this.options.dateFormat.indexOf('dd');
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
            let dateStr: string = this.getDateFormat();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hours = date.getHours();
            let minutes = date.getMinutes();

            dateStr = dateStr
                .replace(/dd/g, day < 10 ? '0' + day : String(day))
                .replace(/MM/g, month < 10 ? '0' + month : String(month))
                .replace(/yyyy/g, String(date.getFullYear()))
                .replace(/hh/g, hours < 10 ? '0' + hours : String(hours))
                .replace(/mm/g, minutes < 10 ? '0' + minutes : String(minutes));
            return dateStr;
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
            this.completeValuesAndHide(event);
        }
    }

    private completeValuesAndHide(event: any) {
        const textInput = this.selectedDateInput.value;

        if (textInput && this.options.time) {
            const year = textInput.substring(this.yearIndex, this.yearIndex + 4);
            const month = textInput.substring(this.monthIndex, this.monthIndex + 2);
            const day = textInput.substring(this.dayIndex, this.dayIndex + 2);
            const hours = textInput.substring(11, 13);
            const minutes = textInput.substring(14, 16);

            let date;

            if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                date = new Date(year, month - 1, day);
            }

            date.setHours(isNaN(hours) ? 0 : hours);
            date.setMinutes(isNaN(minutes) ? 0 : minutes);

            this.onDateSelected(date);
        } else if (event.keyCode === KEY_CODE_ENTER) {
            this.onDateSelected(new Date());
        }

        this.hideCalendar();
    }

    @HostListener('document:click', ['$event'])
    handleClick(event: any) {
        if (this.calendarVisible && !this.elementRef.nativeElement.contains(event.target)) {
            this.completeValuesAndHide(event);
        }
    }

    private buildDateMask() {
        const items = [];
        items[this.options.dateFormat.indexOf('dd')] = this.dayMask;
        items[this.options.dateFormat.indexOf('MM')] = this.monthMask;
        items[this.options.dateFormat.indexOf('yyyy')] = this.yearMask;

        Object.keys(items).forEach((key, i) => {
            if (i > 0) {
                this.dateMask.push('/');
            }
            items[key].forEach(item => this.dateMask.push(item));
        });

        if (this.options.time) {
            this.dateMask.push(' ');
            this.dateMask.push(...IqCalendarComponent.timeMask);
        }
    }

    getMask() {
        return this.dateMask;
    }

    private getDateFormat(): string {
        return this.options.dateFormat + (this.options.time ? ' hh:mm' : '');
    }

    getPlaceholder(): string {
        return this.options.showPlaceholder ? this.getDateFormat() : '';
    }
}
