import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {IqDatepickerModule} from './component-wrapper/src/iq-datepicker.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        IqDatepickerModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
