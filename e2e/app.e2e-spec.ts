import { MapmipPage } from './app.po';

describe('mapmip App', function() {
  let page: MapmipPage;

  beforeEach(() => {
    page = new MapmipPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
