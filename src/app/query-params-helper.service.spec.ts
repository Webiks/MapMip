/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { QueryParamsHelperService } from './query-params-helper.service';

describe('QueryParamsHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryParamsHelperService]
    });
  });

  it('should ...', inject([QueryParamsHelperService], (service: QueryParamsHelperService) => {
    expect(service).toBeTruthy();
  }));
});
