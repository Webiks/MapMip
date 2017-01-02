/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { QueryParamsHelperService } from './query-params-helper.service';
import {Params} from "@angular/router";
import any = jasmine.any;
import {CalcService} from "./calc-service";

describe('QueryParamsHelperService', () => {

  let queryParamsHelperService:QueryParamsHelperService;
  let params:Params = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryParamsHelperService, CalcService]
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

  it('queryMode3d should return Number when params["bounds"] is string, should return 3 when params["dim"] is undefined ', () => {
    params['mode3d'] = '0';
    let mode3dResult = queryParamsHelperService.queryMode3d(params);
    expect(mode3dResult ).toEqual(jasmine.any(Number));
    expect(mode3dResult ).toEqual(0);
    params['mode3d'] = undefined;
    mode3dResult  = queryParamsHelperService.queryMode3d(params);
    expect(mode3dResult).toEqual(1);
  });


  it('queryMarkers should return Array of markers with 3 numbers(lng,lat,height), in addition should ignore spaces', () => {
    params['markers'] = '(1 , 2)  ,  (4 ,5 ,6)  ,  (7 , 8 , 9)';
    let markersResult = queryParamsHelperService.queryMarkers(params);
    expect(markersResult).toEqual(jasmine.any(Array));
    expect(markersResult.length).toEqual(3);
    expect(markersResult[0]).toEqual([1,2,0]);
    expect(markersResult[1]).toEqual([4,5,6]);
    expect(markersResult[2]).toEqual([7,8,9]);
  });

  it('queryMarkersNoHeight should return Array of markers with only 2 numbers(lng,lat)', () => {
    params['markers'] = '(1 , 2)  ,  (4 ,5 ,6654654654)  ,  (7 , 8 , 913133131)';
    let markersResult = queryParamsHelperService.queryMarkersNoHeight(params);
    expect(markersResult).toEqual(jasmine.any(Array));
    expect(markersResult.length).toEqual(3);
    expect(markersResult[0]).toEqual([1,2]);
    expect(markersResult[1]).toEqual([4,5]);
    expect(markersResult[2]).toEqual([7,8]);
  });

  it('markersStrToArray should get string of markers and parsing them to array of positions', () => {
    let markerStr:string = '(1 , 2)  ,  (4 ,5 ,6.654654654)  ,  (7 , 8 , 9.13133131)';
    let markersArray:Array<[number, number, number]> = queryParamsHelperService.markersStrToArray(markerStr);
    expect(markersArray[0]).toEqual([1,2,0]);
    expect(markersArray[1]).toEqual([4,5,6.654654654])
    expect(markersArray[2]).toEqual([7,8,9.13133131])

  });

  it('markersArrayToStr should get array of positions of markers and parsing them to string', () => {
    let markersArray:Array<[number, number, number]> = [[1,2,0],[4,5,6.654654654], [7,8,9.13133131]];
    let markerStr:string = queryParamsHelperService.markersArrayToStr(markersArray);
    expect(markerStr).toEqual('(1,2,0),(4,5,6.654654654),(7,8,9.13133131)');
  });

  it('anyMarkersParamsChanges should return compere markers between two params object', () => {
    let prevParams:Params = {
      markers: '( 1 , 2 , 3 ) , ( 4 , 5 , 6 ) , (7, 8 ,9)'
    };
    let currentParams:Params = {
      markers: '(1,2,3),(4,5,6),(7,8,9)'
    };
    let result:boolean = queryParamsHelperService.anyMarkersParamsChanges(prevParams, currentParams);
    expect(result).toBeFalsy();
    prevParams['markers']    = '(1,2),(3,4)';
    currentParams['markers'] = '(1,2,8.666),(3,4)';
    result= queryParamsHelperService.anyMarkersParamsChanges(prevParams, currentParams);
    expect(result).toBeTruthy();
  });


});
