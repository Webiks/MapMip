/**
 * Created by Harel on 09/02/2017.
 */
/**
 * Created by Harel on 01/02/2017.
 */
import {TestBed, inject, async, ComponentFixture} from "@angular/core/testing";
import {QueryParamsHelperService} from "../../query-params-helper.service";
import {PositionFormService} from "../../position-form/position-form.service";
import {AjaxService} from "../../ajax.service";
import {CalcService} from "../../calc-service";
import {HttpModule} from "@angular/http";
import {RouterTestingModule} from "@angular/router/testing";
import {GeneralCanDeactivateService} from "../../general-can-deactivate.service";
import {CesiumComponent} from "../cesium.component";
import {CesiumMapSize} from "./cesium.component.map-size";
import {CesiumTerrian} from "./cesium.component.terrain";


describe('CesiumComponent', () => {
  let component: CesiumComponent;
  let fixture: ComponentFixture<CesiumComponent>;
  let queryParamsHelperService: QueryParamsHelperService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpModule
      ],
      declarations: [CesiumComponent],
      providers:[QueryParamsHelperService, GeneralCanDeactivateService, CalcService, PositionFormService]
    })
      .compileComponents();
  }));

  beforeEach(inject([QueryParamsHelperService], (_queryParamsHelperService: QueryParamsHelperService) => {
    fixture = TestBed.createComponent(CesiumComponent);
    component = fixture.componentInstance;
    queryParamsHelperService = _queryParamsHelperService;
    fixture.detectChanges();
  }));
  describe("Terrain", ()=>{
    let terrain:CesiumTerrian;

    beforeEach(()=>{
      terrain = component.terrain;
    });

    it("queryParams should check if any changes on terrain if need", ()=>{
      let params = {terrain:"//assets.agi.com/stk-terrain/world"}
      spyOn(queryParamsHelperService, 'anyTerrainChange').and.returnValue(true);
      spyOn(queryParamsHelperService, 'queryTerrain').and.returnValue("//assets.agi.com/stk-terrain/world");
      terrain.queryParams(params);
      expect(component.viewer.terrainProvider.hasOwnProperty("_url")).toBeTruthy();
    });
  })

});
