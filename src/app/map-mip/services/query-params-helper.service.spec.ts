import { inject, TestBed } from '@angular/core/testing';
import { QueryParamsHelperService } from './query-params-helper.service';
import { Params } from '@angular/router';
import { CalcService } from './calc-service';
import { RouterTestingModule } from '@angular/router/testing';
import { MapMipService } from '../api/map-mip.service';
import { PositionFormService } from '../position-form/position-form.service';

describe('QueryParamsHelperService', () => {

  let queryParamsHelperService: QueryParamsHelperService;
  let params: Params = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [PositionFormService, QueryParamsHelperService, CalcService, MapMipService]
    });
  });

  beforeEach(inject([QueryParamsHelperService], (_queryParamsHelperService: QueryParamsHelperService) => {
    queryParamsHelperService = _queryParamsHelperService;
  }));

  it('should be defined', () => {
    expect(queryParamsHelperService).toBeDefined();
  });

  it('queryBounds() should return array with 4 numbers', () => {
    params['bounds'] = '1,2,3,4';
    let bounds = queryParamsHelperService.queryBounds(params);
    expect(bounds).toEqual([1, 2, 3, 4]);
  });

  it('hasQueryBounds should return Boolean if params["bounds"] is not undefined', () => {
    params['bounds'] = undefined;
    expect(queryParamsHelperService.hasQueryBounds(params)).toEqual(jasmine.any(Boolean));
    expect(queryParamsHelperService.hasQueryBounds(params)).toBeFalsy();
    params['bounds'] = '1,2,3,4';
    expect(queryParamsHelperService.hasQueryBounds(params)).toBeTruthy();
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
    expect(heightResult).toEqual(jasmine.any(Number));
    expect(heightResult).toEqual(11.98);
    params['height'] = undefined;
    heightResult = queryParamsHelperService.queryHeight(params);
    expect(heightResult).toEqual(0);
  });

  it('queryPitch should return Number when params["bounds"] is string, should return -90 when params["pitch"] is undefined ', () => {
    params['pitch'] = '100.18';
    let heightResult = queryParamsHelperService.queryPitch(params);
    expect(heightResult).toEqual(jasmine.any(Number));
    expect(heightResult).toEqual(100.18);
    params['pitch'] = undefined;
    heightResult = queryParamsHelperService.queryPitch(params);
    expect(heightResult).toEqual(-90);
  });

  it('queryMode3d should return Number when params["bounds"] is string, should return 3 when params["dim"] is undefined ', () => {
    params['mode3d'] = '0';
    let mode3dResult = queryParamsHelperService.queryMode3d(params);
    expect(mode3dResult).toEqual(jasmine.any(Number));
    expect(mode3dResult).toEqual(0);
    params['mode3d'] = undefined;
    mode3dResult = queryParamsHelperService.queryMode3d(params);
    expect(mode3dResult).toEqual(1);
  });


  it('queryMarkers should call markersStrToArray with markers_str', () => {
    spyOn(queryParamsHelperService, 'markersStrToArray');
    let markers = '(1 , 2)  ,  (1,2,3) , (1 ,2 ,green)  , (1 ,2 ,3, yellow)';
    params['markers'] = markers;
    queryParamsHelperService.queryMarkers(params);
    expect(queryParamsHelperService.markersStrToArray).toHaveBeenCalledWith(markers);
  });

  it('queryMarkersNoHeight should return Array of markers with only 2 numbers(lng,lat)', () => {
    params['markers'] = '(1 , 2)  ,  (1,2,3) , (1 ,2 ,green)  , (1 ,2 ,3, yellow)';
    let markersResult = queryParamsHelperService.queryMarkersNoHeight(params);
    expect(markersResult).toEqual(jasmine.any(Array));
    expect(markersResult.length).toEqual(4);
    expect(markersResult[0]).toEqual({ position: [1, 2] });
    expect(markersResult[1]).toEqual({ position: [1, 2] });
    expect(markersResult[2]).toEqual({ position: [1, 2], color: 'green' });
    expect(markersResult[3]).toEqual({ position: [1, 2], color: 'yellow' });
  });

  it('markersStrToArray should return Array of markers with 3 numbers(lng,lat,height), in addition should ignore spaces', () => {
    let markerStr = '(1 , 2)  ,  (1,2,3) , (1 ,2 ,green)  , (1 ,2 ,3, yellow)';
    let markersResult = queryParamsHelperService.markersStrToArray(markerStr);
    expect(markersResult).toEqual(jasmine.any(Array));
    expect(markersResult.length).toEqual(4);
    expect(markersResult[0]).toEqual({ position: [1, 2] });
    expect(markersResult[1]).toEqual({ position: [1, 2, 3] });
    expect(markersResult[2]).toEqual({ position: [1, 2], color: 'green' });
    expect(markersResult[3]).toEqual({ position: [1, 2, 3], color: 'yellow' });
  });

  it('markersArrayToStr should get array of positions of markers and parsing them to string', () => {
    let markersArray = [{ position: [1, 2] }, { position: [1, 2, 3] }, {
      position: [1, 2],
      color: 'green'
    }, { position: [1, 2, 3], color: 'yellow' }];
    let markerStr: string = queryParamsHelperService.markersArrayToStr(markersArray);
    expect(markerStr).toEqual('(1,2),(1,2,3),(1,2,green),(1,2,3,yellow)');
  });

  it('anyMarkersParamsChanges should return compere markers between two params object', () => {
    let prevParams: Params = {
      markers: '( 1 , 2 , 3 ) , ( 4 , 5 , 6 ) , (7, 8 ,9)'
    };
    let currentParams: Params = {
      markers: '(1,2,3),(4,5,6),(7,8,9)'
    };
    expect(queryParamsHelperService.anyMarkersParamsChanges(prevParams, currentParams)).toBeFalsy();
    prevParams['markers'] = '(1,2,red),(3,4)';
    currentParams['markers'] = '(1,2),(3,4)';
    expect(queryParamsHelperService.anyMarkersParamsChanges(prevParams, currentParams)).toBeTruthy();
  });

  it('layerObjectToUrl should get object and parse him to url', () => {
    let url_obj = {
      url: 'the_tms_of_url',
      p1: 'p1_value',
      p2: 'p2_value'
    };
    let url_string: string = queryParamsHelperService.layerObjectToUrl(url_obj);
    expect(url_string).toEqual(`${url_obj.url}?p1=${url_obj.p1}&p2=${url_obj.p2}`);
  });

  it('queryLayers should return array of strings with layers urls', () => {
    let params: Params = {};

    let layers_array: Array<Object> = queryParamsHelperService.queryLayers(params);
    expect(layers_array.length).toEqual(0);

    params = {
      layers: '(url: layer_url1, q1: a, q2: b), (url: layer_url2, q3: c, q4: d)'
    };

    layers_array = queryParamsHelperService.queryLayers(params);
    expect(layers_array.length).toEqual(2);
  });

  it('querySize should get size from params and return array with [width, height], if size empty should return [100,100]', () => {
    let params: Params = { size: '20,70' };
    expect(queryParamsHelperService.querySize(params)).toEqual([20, 70]);
    params = { size: '' };
    expect(queryParamsHelperService.querySize(params)).toEqual([100, 100]);
  });

});
