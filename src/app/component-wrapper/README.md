# ngx-iq-datepicker

[![InnQUbe](http://www.innqube.com/assets/images/badge.svg)](http://www.innqube.com/)
[![Build Status](https://travis-ci.org/Innqube/ngx-iq-datepicker.svg?branch=master)](https://travis-ci.org/Innqube/ngx-iq-datepicker)
[![codecov](https://codecov.io/gh/Innqube/ngx-iq-datepicker/branch/master/graph/badge.svg)](https://codecov.io/gh/Innqube/ngx-iq-datepicker)
[![Code Climate](https://codeclimate.com/github/Innqube/ngx-iq-datepicker/badges/gpa.svg)](https://codeclimate.com/github/Innqube/ngx-iq-datepicker)

Angular datepicker with bootstrap integration

* Bootstrap 3 based
* Forms integration: receives and returns Date
* No dependencies
* MIT License

Usage example
---
```javascript

import { IqSelect2Module } from 'ngx-iq-datepicker';

@NgModule({
    declarations: [..],
    imports: [.., IqDatepickerModule, ...],
    providers: [..]
```

*html file*
```html
<form [formGroup]="form" class="form-horizontal">
    <div class="form-group">
        <label>Date</label>
        <iq-datepicker formControlName="date" [options]="options" [translations]="translations"></iq-datepicker>
    </div>
</form>
```
*Options*
```javascript
export class IqDatepickerOptions {
    size?: 'sm' | 'md' | 'lg';
    calendarBtnClass?: string;
    removeBtnClass?: string;
    removeBtnVisible?: boolean;
    removeBtnIcon?: string;
    calendarBtnIcon?: string;
    horizontal?: boolean;
}
```

*Translations*
```javascript
export interface IqDatepickerTranslations {

    daysAbrev: string[];
    monthNames: string[];

}
```

*Translations: English example*
```javascript
export class IqDatepickerEnglishTranslation implements IqDatepickerTranslations {

    daysAbrev = [
        'S',
        'M',
        'T',
        'W',
        'T',
        'F',
        'S'
    ];
    monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
}
```
