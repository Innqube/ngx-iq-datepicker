import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IqDatepickerComponent} from './iq-datepicker.component';
import {ReactiveFormsModule} from '@angular/forms';
import {IqDatepickerEnglishTranslation} from './iq-datepicker-english-translation';
import {IqCalendarComponent} from '../iq-calendar/iq-calendar.component';

describe('IqDatepickerComponent', () => {
    let component: IqDatepickerComponent;
    let fixture: ComponentFixture<IqDatepickerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                IqDatepickerComponent,
                IqCalendarComponent
            ],
            imports: [
                ReactiveFormsModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IqDatepickerComponent);
        component = fixture.componentInstance;
        component.translations = new IqDatepickerEnglishTranslation();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
