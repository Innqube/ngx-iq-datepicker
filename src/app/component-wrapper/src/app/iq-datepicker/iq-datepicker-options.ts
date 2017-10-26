/**
 * Created by diego on 6/21/17.
 */
export class IqDatepickerOptions {
    size?: 'sm' | 'md' | 'lg';
    calendarBtnClass?: string;
    removeBtnClass?: string;
    removeBtnVisible?: boolean;
    removeBtnIcon?: string;
    calendarBtnIcon?: string;
    horizontal?: boolean;
    showPlaceholder?: boolean;
    dateFormat?: 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy/MM/dd' | 'yyyy/dd/MM';
    time?: boolean;
    minimalMode?: boolean;
}
