/**
 * Created by Harel on 01/02/2017.
 */
import {TestBed, inject, async, ComponentFixture} from "@angular/core/testing";
import {QueryParamsHelperService} from "../../../services/query-params-helper.service";
import {PositionFormService} from "../../position-form/position-form.service";
import {AjaxService} from "../../../services/ajax.service";
import {CalcService} from "../../../services/calc-service";
import {HttpModule} from "@angular/http";
import {RouterTestingModule} from "@angular/router/testing";
import {CesiumComponent} from "../cesium.component";
import {CesiumMapSize} from "./cesium.component.map-size";


fdescribe('CesiumComponent', () => {
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
      providers:[QueryParamsHelperService, /*GeneralCanDeactivateService,*/ CalcService, PositionFormService]
    })
      .compileComponents();
  }));

  beforeEach(inject([QueryParamsHelperService], (_queryParamsHelperService: QueryParamsHelperService) => {
    fixture = TestBed.createComponent(CesiumComponent);
    component = fixture.componentInstance;
    queryParamsHelperService = _queryParamsHelperService;
    fixture.detectChanges();
  }));
  describe("map_size", ()=>{
    let map_size:CesiumMapSize;

    beforeEach(()=>{
      map_size = component.map_size;
    });

    it("queryParams should check if any changes on mapsize and set [width, height] if need", ()=>{
      spyOn(queryParamsHelperService, 'anySizeChange').and.returnValue(true);
      spyOn(queryParamsHelperService, 'querySize').and.returnValue([50,60]);
      map_size.queryParams({});
      expect(component.container.nativeElement.style.width).toEqual('50%');
      expect(component.container.nativeElement.style.height).toEqual('60%');
    });
  })

});
