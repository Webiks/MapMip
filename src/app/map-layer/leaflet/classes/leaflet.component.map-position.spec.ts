/**
 * Created by Harel on 05/02/2017.
 */

import {LeafletComponent} from "../leaflet.component";
import {TestBed, inject, async, ComponentFixture} from "@angular/core/testing";
import {QueryParamsHelperService} from "../../query-params-helper.service";
import {PositionFormService} from "../../position-form/position-form.service";
import {AjaxService} from "../../ajax.service";
import {CalcService} from "../../calc-service";
import {HttpModule} from "@angular/http";
import {RouterTestingModule} from "@angular/router/testing";
import {LeafletMapPosition} from "./leaflet.component.map-position";

describe('LeafletComponent', () => {
  let component: LeafletComponent;
  let fixture: ComponentFixture<LeafletComponent>;
  let queryParamsHelperService: QueryParamsHelperService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpModule
      ],
      declarations: [LeafletComponent],
      providers: [QueryParamsHelperService, CalcService, AjaxService, PositionFormService]
    })
      .compileComponents();
  }));

  beforeEach(inject([QueryParamsHelperService], (_queryParamsHelperService: QueryParamsHelperService) => {
    fixture = TestBed.createComponent(LeafletComponent);
    component = fixture.componentInstance;
    queryParamsHelperService = _queryParamsHelperService;
    fixture.detectChanges();
  }));
  describe("map_position", ()=>{
    let map_position:LeafletMapPosition;

    beforeEach(()=>{
      map_position = component.map_position;
      component.positionFormService.mapsCont ={};
      component.positionFormService.mapsCont.nativeElement = {};
      component.positionFormService.mapsCont.nativeElement['offsetWidth'] = 500;
      component.positionFormService.mapsCont.nativeElement['offsetHeight'] = 400;
    });

    it("queryParams should check if any changes on map position and set [width, height] if need", ()=>{
      spyOn(queryParamsHelperService, 'anySizeChange').and.returnValue(true);
      spyOn(queryParamsHelperService, 'anyPositionChange').and.returnValue(true);
      spyOn(queryParamsHelperService, 'querySize').and.returnValue([50,50]);
      spyOn(queryParamsHelperService, 'queryPosition').and.returnValue([50,50]);
      map_position.queryParams({});
      expect(component.container.nativeElement.style.left).toEqual('125px');
      expect(component.container.nativeElement.style.top).toEqual('100px');
    });
  })

});
