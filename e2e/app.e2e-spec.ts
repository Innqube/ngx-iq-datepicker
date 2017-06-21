import { NgxIqDatepickerPage } from './app.po';

describe('ngx-iq-datepicker App', () => {
  let page: NgxIqDatepickerPage;

  beforeEach(() => {
    page = new NgxIqDatepickerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
