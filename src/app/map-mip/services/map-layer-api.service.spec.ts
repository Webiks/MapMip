import { inject, TestBed } from '@angular/core/testing';
import { MapLayerApiService } from './map-layer-api.service';
import { QueryParamsHelperService } from './query-params-helper.service';
import { CalcService } from './calc-service';
import { RouterTestingModule } from '@angular/router/testing';
import { MapMipService } from '../api/map-mip.service';
import { PositionFormService } from '../position-form/position-form.service';

describe('MapLayerApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [MapLayerApiService, QueryParamsHelperService, CalcService, MapMipService, PositionFormService]
    });
  });

  it('should ...', inject([MapLayerApiService], (service: MapLayerApiService) => {
    expect(service).toBeTruthy();
  }));
});
