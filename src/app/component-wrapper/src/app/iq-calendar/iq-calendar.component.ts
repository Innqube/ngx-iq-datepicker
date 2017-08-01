import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IqDatepickerTranslations} from '../iq-datepicker/iq-datepicker-translations';
import {IqDatepickerOptions} from '../iq-datepicker/iq-datepicker-options';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'iq-calendar',
    templateUrl: './iq-calendar.component.html',
    styleUrls: ['./iq-calendar.component.css']
})
export class IqCalendarComponent implements OnInit {

    @Input() options: IqDatepickerOptions;
    @Input() translations: IqDatepickerTranslations;
    @Input() date: Date;
    @Input() selectedDate: Date;
    @Output() dateSelected = new EventEmitter<Date>();
    weeks;
    static timeMask = [/[0-2]/, /[0-9]/, ':', /[0-5]/, /[0-9]/];
    mask = IqCalendarComponent.timeMask;
    timeInput = new FormControl();

    constructor() {
    }

    ngOnInit() {
        this.date = this.selectedDate ? new Date(this.selectedDate.getTime()) : new Date();
        this.updateViewDays();
        this.emitDateOnTimeSelected();

        setTimeout(() => {
            if (this.selectedDate) {
                const hours = this.selectedDate.getHours() < 10 ? this.selectedDate.getHours() + '0' : String(this.selectedDate.getHours());
                const minutes = this.selectedDate.getMinutes() < 10 ? this.selectedDate.getMinutes() + '0' : String(this.selectedDate.getMinutes())
                this.timeInput.setValue(hours + ':' + minutes, { emitEvent: false });
            }
        }, 1);
    }

    private emitDateOnTimeSelected() {
        this.timeInput
            .valueChanges
            .subscribe(newValue => {
                const values = newValue.split(':');

                if (!isNaN(values[0]) && !isNaN(values[1]) && this.selectedDate) {
                    this.selectedDate.setHours(values[0]);
                    this.selectedDate.setMinutes(values[1]);
                    this.dateSelected.emit(this.selectedDate);
                }
            });
    }

    prevMonth() {
        const currentMonth = this.date.getMonth();

        if (currentMonth === 0) {
            this.date.setMonth(11);
            this.prevYear();
        } else {
            this.date.setMonth(currentMonth - 1);
        }

        this.updateViewDays();
    }

    nextMonth() {
        const currentMonth = this.date.getMonth();

        if (currentMonth === 11) {
            this.date.setMonth(0);
            this.nextYear();
        } else {
            this.date.setMonth(currentMonth + 1);
        }

        this.updateViewDays();
    }

    prevYear() {
        this.date.setFullYear(this.date.getFullYear() - 1);
        this.updateViewDays();
    }

    nextYear() {
        this.date.setFullYear(this.date.getFullYear() + 1);
        this.updateViewDays();
    }

    updateViewDays() {
        this.weeks = [];

        const firstDayDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
        const offset = firstDayDate.getDay()

        this.populatePreviousMonthDates(offset);
        const dayNumber = this.populateCurrentMonthDates(offset);
        this.populateNextMonthDates(dayNumber);
    }

    private populateNextMonthDates(dayNumber: any) {
        if (dayNumber < 6) {
            for (let i = ++dayNumber; i <= 6; i++) {
                this.weeks[this.weeks.length - 1][i] = {
                    currentMonth: false,
                    currentDate: false,
                    prevMonth: false,
                    nextMonth: true,
                    isSelectedDate: this.isSelectedDate(this.getNextMonth(), i - dayNumber + 1),
                    value: i - dayNumber + 1
                };
            }
        }
    }

    private getPreviousMonth() {
        return this.date.getMonth() === 0 ? 11 : this.date.getMonth() - 1;
    }

    private getNextMonth() {
        return this.date.getMonth() === 11 ? 0 : this.date.getMonth() + 1;
    }

    private populateCurrentMonthDates(offset: number) {
        const lastDayDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
        const numberOfDaysInMonth = lastDayDate.getDate();

        let dayNumber;
        for (let i = 0; i < numberOfDaysInMonth; i++) {
            let week = Math.floor((i + offset) / 7);
            dayNumber = (i + offset) % 7;

            if (!this.weeks[week]) {
                this.weeks.push([]);
            }

            this.weeks[week][dayNumber] = {
                currentMonth: true,
                currentDate: this.isCurrentDate(i + 1),
                prevMonth: false,
                nextMonth: false,
                isSelectedDate: this.isSelectedDate(this.date.getMonth(), i + 1),
                value: i + 1
            };
        }

        return dayNumber;
    }

    private isCurrentDate(dayNumber: number) {
        const today = new Date();
        return this.date.getFullYear() === today.getFullYear()
            && this.date.getMonth() === today.getMonth()
            && dayNumber === today.getDate();
    }

    private populatePreviousMonthDates(offset: number) {
        if (offset > 0) {
            this.weeks.push([]);

            for (let i = 0; i <= offset; i++) {
                const lastDayPreviousMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
                this.weeks[0][offset - i] = {
                    currentMonth: false,
                    currentDate: false,
                    prevMonth: true,
                    nextMonth: false,
                    isSelectedDate: this.isSelectedDate(this.getPreviousMonth(), lastDayPreviousMonth.getDate() - i + 1),
                    value: lastDayPreviousMonth.getDate() - i + 1
                };
            }
        }
    }

    selectMonth(month: number) {
        let lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

        if (this.date.getDate() === lastDay.getDate()) {
            this.date.setDate(1);
            this.date.setMonth(month);

            lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
            this.date.setDate(lastDay.getDate());
        }

        this.date.setMonth(month);
        this.updateViewDays();
    }

    setYear(year: number) {
        if (!isNaN(year) && year >= 1970 && year <= 9999) {
            this.date.setFullYear(year);
            this.updateViewDays();
        } else {
            this.date.setFullYear(new Date().getFullYear())
        }
    }
    
    setHours(hours: number) {
        let hoursStr;
        let minutesInput = this.timeInput.value;
        const minutesStr = minutesInput ? minutesInput.substring(3, 5) : '00';

        if (hours && hours >= 0 && hours <= 23) {
            this.date.setHours(hours);
            hoursStr = hours < 10 ? '0' + hours : String(hours);
        } else {
            hoursStr = '00';
        }
        this.timeInput.setValue(hoursStr + ':' + minutesStr, { emitEvent: false });
    }
    
    setMinutes(minutes: number) {
        let hoursInput = this.timeInput.value;
        const hoursStr = hoursInput ? hoursInput.substring(0, 2) : '00';
        let minutesStr;

        if (minutes && minutes >= 0 && minutes <= 59) {
            this.date.setMinutes(minutes);
            minutesStr = minutes < 10 ? '0' + minutes : String(minutes);
        } else {
            minutesStr = '00';
        }
        this.timeInput.setValue(hoursStr + ':' + minutesStr, { emitEvent: false });
    }

    onDateSelected(date: number, prevMonth: boolean, nextMonth: boolean) {
        this.date.setDate(date);

        if (prevMonth) {
            this.prevMonth();
        }

        if (nextMonth) {
            this.nextMonth();
        }

        this.selectedDate = this.date;
        this.dateSelected.emit(this.date);
        this.updateViewDays();
    }

    private isSelectedDate(month: number, date: number): boolean {
        if (!this.selectedDate) {
            return false;
        } else {
            return this.selectedDate.getFullYear() === this.date.getFullYear()
                && this.selectedDate.getMonth() === month
                && this.selectedDate.getDate() === date;
        }
    }

    onKeyDown(event: any) {
        if (event.keyCode === 13) {
            this.setYear(event.target.value);
            event.stopPropagation();
        }
    }
}
