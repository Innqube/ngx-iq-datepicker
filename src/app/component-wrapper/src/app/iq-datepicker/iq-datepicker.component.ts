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
        dateFormat: 'dd/mm/yyyy',
        showPlaceholder: true
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

                    if (!isNaN(year) && this.calendarComponent) {
                        this.calendarComponent.setYear(year);
                    }

                    if (!isNaN(month) && this.calendarComponent) {
                        this.calendarComponent.selectMonth(month - 1);
                    }

                    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                        let date = new Date(year, month - 1, day);
                        this.onDateSelected(date);
                    }
                } else {
                    this.onDateSelected(null);
                }
            });
        this.yearIndex = this.options.dateFormat.indexOf('yyyy');
        this.monthIndex = this.options.dateFormat.indexOf('mm');
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
            let dateStr: string = this.options.dateFormat;
            let month = date.getMonth() + 1;
            let day = date.getDate();

            dateStr = dateStr.replace(/dd/g, day < 10 ? '0' + day : String(day));
            dateStr = dateStr.replace(/mm/g, month < 10 ? '0' + month : String(month));
            dateStr = dateStr.replace(/yyyy/g, String(date.getFullYear()));
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

            if (event.keyCode === KEY_CODE_ENTER && !this.selectedDateInput.value) {
                this.onDateSelected(new Date());
            }

            this.hideCalendar();
        }
    }

    @HostListener('document:click', ['$event'])
    handleClick(event: any) {
        if (this.calendarVisible && !this.elementRef.nativeElement.contains(event.target)) {
            this.hideCalendar();
        }
    }

    private buildDateMask() {
        const items = [];
        items[this.options.dateFormat.indexOf('dd')] = this.dayMask;
        items[this.options.dateFormat.indexOf('mm')] = this.monthMask;
        items[this.options.dateFormat.indexOf('yyyy')] = this.yearMask;

        Object.keys(items).forEach((key, i) => {
            if (i > 0) {
                this.dateMask.push(['/']);
            }
            items[key].forEach(item => this.dateMask.push(item));
        });
    }
}
