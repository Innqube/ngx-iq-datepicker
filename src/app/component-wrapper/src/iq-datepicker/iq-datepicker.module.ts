import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IqDatepickerComponent} from './iq-datepicker.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [IqDatepickerComponent],
    exports: [
        IqDatepickerComponent
    ]
})
export class IqDatepickerModule {
}
