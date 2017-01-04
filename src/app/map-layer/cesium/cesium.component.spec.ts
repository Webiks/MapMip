/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CesiumComponent } from './cesium.component';
import {QueryParamsHelperService} from "../query-params-helper.service";
import {GeneralCanDeactivateService} from "../general-can-deactivate.service";
import {CalcService} from "../calc-service";
import {RouterTestingModule} from "@angular/router/testing";

fdescribe('CesiumComponent', () => {
  let component: CesiumComponent;
  let fixture: ComponentFixture<CesiumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ CesiumComponent ],
      providers:[QueryParamsHelperService, GeneralCanDeactivateService, CalcService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    window['CESIUM_BASE_URL'] = 'http://mapmip.webiks.com/assets/Cesium';
    fixture = TestBed.createComponent(CesiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });
});
