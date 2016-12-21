/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { QueryParamsHelperService } from './query-params-helper.service';

describe('QueryParamsHelperService', () => {

  let queryParamsHelperService:QueryParamsHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryParamsHelperService]
    });
  });

  beforeEach(inject([QueryParamsHelperService], (_queryParamsHelperService: QueryParamsHelperService) => {
    queryParamsHelperService = _queryParamsHelperService;
  }));

  it('should be defined', () => {
    expect(queryParamsHelperService ).toBeDefined();
  });


});
