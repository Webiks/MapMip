/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { QueryParamsHelperService } from './query-params-helper.service';
import {Params} from "@angular/router";
import any = jasmine.any;
import {isUndefined} from "util";

fdescribe('QueryParamsHelperService', () => {

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
  //
  // hasQueryBounds(params:Params):boolean {
  //   let boundsString = params['bounds'];
  //   return !isUndefined(boundsString)
  // }

  it('hasQueryBounds should return Boolean if params["bounds"] is not undefined', () => {
    params['bounds'] = undefined;
    expect(queryParamsHelperService.hasQueryBounds(params)).toEqual(jasmine.any(Boolean));
    expect(queryParamsHelperService.hasQueryBounds(params) ).toBeFalsy();
    params['bounds'] = '1,2,3,4';
    expect(queryParamsHelperService.hasQueryBounds(params) ).toBeTruthy();
  });

  it('queryZoom should return Number while params["bounds"] is string', () => {
    params['zoom'] = '11';
    let zoomResult = queryParamsHelperService.queryZoom(params);
    expect(zoomResult).toEqual(jasmine.any(Number));
    expect(zoomResult).toEqual(11);
  });

  it('queryZoom should return Number while params["bounds"] is string, if params["bounds"] is undefined should return 0', () => {
    params['zoom'] = '11';
    let zoomResult = queryParamsHelperService.queryZoom(params);
    expect(zoomResult).toEqual(jasmine.any(Number));
    expect(zoomResult).toEqual(11);
    params['zoom'] = undefined;
    zoomResult = queryParamsHelperService.queryZoom(params);
    expect(zoomResult).toEqual(0);
  });


  // queryZoom(params:Params):number {
  //   return +params['zoom'] || 0;
  // }
  // it('should be defined', () => {
  //   expect(queryParamsHelperService ).toBeDefined();
  // });
  //
  // it('should be defined', () => {
  //   expect(queryParamsHelperService ).toBeDefined();
  // });


});
