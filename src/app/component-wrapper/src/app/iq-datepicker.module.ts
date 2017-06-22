import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IqDatepickerComponent} from './iq-datepicker/iq-datepicker.component';
import {IqCalendarComponent} from './iq-calendar/iq-calendar.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule
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
