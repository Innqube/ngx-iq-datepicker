import {Component, Input, OnInit} from '@angular/core';
import {IqDatepickerOptions} from './iq-datepicker-options';

@Component({
    selector: 'iq-datepicker',
    templateUrl: './iq-datepicker.component.html',
    styleUrls: ['./iq-datepicker.component.css']
})
export class IqDatepickerComponent implements OnInit {

    @Input() options: IqDatepickerOptions = {};
    defaults: IqDatepickerOptions = {
        calendarBtnClass: 'btn btn-default',
        calendarBtnIcon: 'glyphicon glyphicon-calendar',
        removeBtnClass: 'btn btn-default',
        removeBtnVisible: true,
        removeBtnIcon: 'glyphicon glyphicon-remove'
    };

    constructor() {

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
}
