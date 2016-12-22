/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { QueryParamsHelperService } from './query-params-helper.service';
import {Params} from "@angular/router";
import any = jasmine.any;

describe('QueryParamsHelperService', () => {

  let queryParamsHelperService:QueryParamsHelperService;
  let params:Params = {};

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

  it('queryBounds() should return array with 4 numbers', () => {
    params['bounds'] = '1,2,3,4';
    let bounds = queryParamsHelperService.queryBounds(params);
    expect(bounds).toEqual([1,2,3,4]);
  });

  it('hasQueryBounds should return Boolean if params["bounds"] is not undefined', () => {
    params['bounds'] = undefined;
    expect(queryParamsHelperService.hasQueryBounds(params)).toEqual(jasmine.any(Boolean));
    expect(queryParamsHelperService.hasQueryBounds(params) ).toBeFalsy();
    params['bounds'] = '1,2,3,4';
    expect(queryParamsHelperService.hasQueryBounds(params) ).toBeTruthy();
  });

  it('queryZoom should return Number when params["bounds"] is string, should return zero when params["bounds"] is undefined ', () => {
    params['zoom'] = '11';
    let zoomResult = queryParamsHelperService.queryZoom(params);
    expect(zoomResult).toEqual(jasmine.any(Number));
    expect(zoomResult).toEqual(11);
    params['zoom'] = undefined;
    zoomResult = queryParamsHelperService.queryZoom(params);
    expect(zoomResult).toEqual(0);
  });

  it('queryHeight should return Number when params["bounds"] is string, should return zero when params["height"] is undefined ', () => {
    params['height'] = '11.98';
    let heightResult = queryParamsHelperService.queryHeight(params);
    expect(heightResult ).toEqual(jasmine.any(Number));
    expect(heightResult ).toEqual(11.98);
    params['height'] = undefined;
    heightResult  = queryParamsHelperService.queryHeight(params);
    expect(heightResult ).toEqual(0);
  });

  it('queryPitch should return Number when params["bounds"] is string, should return -90 when params["pitch"] is undefined ', () => {
    params['pitch'] = '100.18';
    let heightResult = queryParamsHelperService.queryPitch(params);
    expect(heightResult ).toEqual(jasmine.any(Number));
    expect(heightResult ).toEqual(100.18);
    params['pitch'] = undefined;
    heightResult  = queryParamsHelperService.queryPitch(params);
    expect(heightResult ).toEqual(-90);
  });

  it('queryDim should return Number when params["bounds"] is string, should return 3 when params["dim"] is undefined ', () => {
    params['dim'] = '2';
    let heightResult = queryParamsHelperService.queryDim(params);
    expect(heightResult ).toEqual(jasmine.any(Number));
    expect(heightResult ).toEqual(2);
    params['dim'] = undefined;
    heightResult  = queryParamsHelperService.queryDim(params);
    expect(heightResult ).toEqual(3);
  });

});
