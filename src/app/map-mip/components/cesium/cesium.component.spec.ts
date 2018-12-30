import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { CesiumComponent } from './cesium.component';
import { QueryParamsHelperService } from '../../services/query-params-helper.service';
import { CalcService } from '../../services/calc-service';
import { RouterTestingModule } from '@angular/router/testing';
import { Params } from '@angular/router';
import { PositionFormService } from '../../position-form/position-form.service';
import { MapMipService } from '../../api/map-mip.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


xdescribe('CesiumComponent', () => {
  let component: CesiumComponent;
  let fixture: ComponentFixture<CesiumComponent>;
  let queryParamsHelperService: QueryParamsHelperService;
  let calcService: CalcService;
  let positionFormService: PositionFormService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, BrowserAnimationsModule],
      declarations: [CesiumComponent],
      providers: [QueryParamsHelperService, MapMipService, CalcService, PositionFormService]
    })
      .compileComponents();
  }));

  beforeEach(inject([QueryParamsHelperService, CalcService, PositionFormService], (_queryParamsHelperService: QueryParamsHelperService, _calcService: CalcService, _positionFormService: PositionFormService) => {
    fixture = TestBed.createComponent(CesiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    queryParamsHelperService = _queryParamsHelperService;
    calcService = _calcService;
    positionFormService = _positionFormService;
  }));

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should ngOnDestory remove unsubscribe queryParamsSubscriber, and call layers,markers and map-view destroy functions', () => {
    spyOn(component.queryParamsSubscriber, 'unsubscribe');
    spyOn(component.markers, 'destroy');
    spyOn(component.map_view, 'destroy');
    spyOn(component.layers, 'destroy');
    component.ngOnDestroy();
    expect(component.markers.destroy).toHaveBeenCalled();
    expect(component.map_view.destroy).toHaveBeenCalled();
    expect(component.layers.destroy).toHaveBeenCalled();
    expect(component.queryParamsSubscriber.unsubscribe).toHaveBeenCalled();
  });

  describe('queryParams: ', () => {
    it('should save currentParmas with the newParmas and prevParams with currentParams', () => {
      let currentParams: Params = {
        yaya: 'tata'
      };
      let newParams: Params = {
        tata: 'yaya'
      };
      component.currentParams = currentParams;
      component.queryParams(newParams);
      expect(component.prevParams).toEqual(currentParams);
      expect(component.currentParams).toEqual(newParams);
    });

  });

  it('initializeMap: should set cesium viewer, put bingDefultkey and add moveEnd event', () => {


  });


});
