/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import {CalcService} from "./calc-service";

describe('CalcServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalcService]
    });
  });

  it('should ...', inject([CalcService], (service: CalcService) => {
    expect(service).toBeTruthy();
  }));
});
