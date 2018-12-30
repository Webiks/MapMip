import { inject, TestBed } from '@angular/core/testing';
import { AjaxService } from './ajax.service';
import { Http, HttpModule } from '@angular/http';

let ajaxService: AjaxService;
let http: Http;

describe('AjaxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AjaxService],
      imports: [HttpModule]
    });
  });
  beforeEach(inject([AjaxService, Http], (_ajaxService: AjaxService, _http: Http) => {
    ajaxService = _ajaxService;
    http = _http;
  }));

  it('should be defined', () => {
    expect(ajaxService).toBeDefined();
  });

  // // it('getTmsmapresource should get url and return xml string and parse it to js object with xml2js ', async(()=> {
  // //   let fake_url = "fake_tms_url";
  // //   let xml_string = 'xml_string_text';
  // //   let fake_http_get = {subscribe: (callback) => callback({_body: xml_string})};
  // //   spyOn(http, 'get').and.callFake(() => fake_http_get);
  // //   spyOn(xml2js, 'parseString').and.callFake((xml_string, callback) => callback("error msg", `fake_parsing_${xml_string}`));
  // //
  // //   ajaxService.getTmsmapresource(fake_url).subscribe((res) => {
  // //     expect(http.get).toHaveBeenCalledWith(`${fake_url}/tilemapresource.xml`);
  // //     expect(xml2js.parseString).toHaveBeenCalled();
  // //     expect(res).toEqual(`fake_parsing_${xml_string}`);
  // //   });
  //
  // }))
});
