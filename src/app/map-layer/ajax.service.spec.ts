/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AjaxService } from './ajax.service';

describe('AjaxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AjaxService]
    });
  });

  it('should ...', inject([AjaxService], (service: AjaxService) => {
    expect(service).toBeTruthy();
  }));
});
