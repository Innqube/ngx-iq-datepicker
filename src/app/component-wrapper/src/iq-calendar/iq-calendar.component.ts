import {Component, Input, OnInit} from '@angular/core';
import {IqDatepickerTranslations} from '../iq-datepicker/iq-datepicker-translations';

@Component({
    selector: 'iq-calendar',
    templateUrl: './iq-calendar.component.html',
    styleUrls: ['./iq-calendar.component.css']
})
export class IqCalendarComponent implements OnInit {

    @Input() translations: IqDatepickerTranslations;
    @Input() date: Date = new Date();
    weeks;

    constructor() {
    }

    ngOnInit() {
        this.updateViewDays();
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
                    value: i - dayNumber + 1
                };
            }
        }
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
                    value: lastDayPreviousMonth.getDate() - i + 1
                };
            }
        }
    }

    selectMonth(index: number) {
        this.date.setMonth(index);
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

}
