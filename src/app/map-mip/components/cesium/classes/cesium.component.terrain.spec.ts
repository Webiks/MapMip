import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { QueryParamsHelperService } from '../../../services/query-params-helper.service';
import { PositionFormService } from '../../../position-form/position-form.service';
import { CalcService } from '../../../services/calc-service';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { CesiumComponent } from '../cesium.component';
import { CesiumTerrian } from './cesium.component.terrain';
import { MapMipService } from '../../../api/map-mip.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


xdescribe('CesiumComponent', () => {
  let component: CesiumComponent;
  let fixture: ComponentFixture<CesiumComponent>;
  let queryParamsHelperService: QueryParamsHelperService;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpModule,
        BrowserAnimationsModule
      ],
      declarations: [CesiumComponent],
      providers: [QueryParamsHelperService, MapMipService, CalcService, PositionFormService]
    })
      .compileComponents();
  }));

  beforeEach(inject([QueryParamsHelperService], (_queryParamsHelperService: QueryParamsHelperService) => {
    fixture = TestBed.createComponent(CesiumComponent);
    component = fixture.componentInstance;
    queryParamsHelperService = _queryParamsHelperService;
    fixture.detectChanges();
  }));
  describe('Terrain', () => {
    let terrain: CesiumTerrian;

    beforeEach(() => {
      terrain = component.terrain;
    });

    it('queryParams should check if any changes on terrain if need', () => {
      let params = { terrain: '//assets.agi.com/stk-terrain/world' };
      spyOn(queryParamsHelperService, 'anyTerrainChange').and.returnValue(true);
      spyOn(queryParamsHelperService, 'queryTerrain').and.returnValue('//assets.agi.com/stk-terrain/world');
      terrain.queryParams(params);
      expect(component.viewer.terrainProvider.hasOwnProperty('_url')).toBeTruthy();
    });
  });

});
