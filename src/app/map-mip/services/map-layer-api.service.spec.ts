/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MapLayerApiService } from './map-layer-api.service';

describe('MapLayerApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapLayerApiService]
    });
  });

  it('should ...', inject([MapLayerApiService], (service: MapLayerApiService) => {
    expect(service).toBeTruthy();
  }));
});
