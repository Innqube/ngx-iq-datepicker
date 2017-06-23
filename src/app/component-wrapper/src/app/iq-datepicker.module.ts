import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IqDatepickerComponent} from './iq-datepicker/iq-datepicker.component';
import {IqCalendarComponent} from './iq-calendar/iq-calendar.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TextMaskModule} from 'angular2-text-mask';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TextMaskModule
    ],
    declarations: [
        IqDatepickerComponent,
        IqCalendarComponent
    ],
    exports: [
        IqDatepickerComponent
    ]
})
export class IqDatepickerModule {
}
