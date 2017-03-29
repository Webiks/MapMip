/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';
import { CesiumComponent } from './cesium.component';
import {QueryParamsHelperService} from "../../services/query-params-helper.service";
import {GeneralCanDeactivateService} from "../../services/general-can-deactivate.service";
import {CalcService} from "../../services/calc-service";
import {RouterTestingModule} from "@angular/router/testing";
import {Router, Params} from "@angular/router";
import {Observer, Observable} from "rxjs";
import {PositionFormService} from "../position-form/position-form.service";



describe('CesiumComponent', () => {
  let component: CesiumComponent;
  let fixture: ComponentFixture<CesiumComponent>;
  let router:Router;
  let queryParamsHelperService:QueryParamsHelperService;
  let calcService:CalcService;
  let positionFormService:PositionFormService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ CesiumComponent ],
      providers:[QueryParamsHelperService, GeneralCanDeactivateService, CalcService, PositionFormService]
    })
      .compileComponents();
  }));

  beforeEach(inject([Router, QueryParamsHelperService, CalcService, PositionFormService],(_router:Router, _queryParamsHelperService:QueryParamsHelperService, _calcService:CalcService, _positionFormService:PositionFormService) => {
    fixture = TestBed.createComponent(CesiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = _router;
    queryParamsHelperService = _queryParamsHelperService;
    calcService = _calcService;
    positionFormService =_positionFormService
  }));

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it("should ngOnDestory remove unsubscribe queryParamsSubscriber, and call layers,markers and map-view destroy functions", ()=>{
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

  describe('queryParams: ',() => {
    it('should save currentParmas with the newParmas and prevParams with currentParams', ()=>{
      let currentParams:Params = {
        yaya: 'tata'
      };
      let newParams:Params = {
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
