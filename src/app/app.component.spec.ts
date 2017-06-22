import {async, TestBed} from '@angular/core/testing';

import {AppComponent} from './app.component';
import {ReactiveFormsModule} from '@angular/forms';
import {IqDatepickerModule} from './component-wrapper/src/app/iq-datepicker.module';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
            imports: [
                ReactiveFormsModule,
                IqDatepickerModule
            ]
        }).compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

});
