/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LayersComponent } from './layers.component';
import {QueryParamsHelperService} from "../../query-params-helper.service";
import {CalcService} from "../../calc-service";
import {
  Ng2BootstrapModule, ComponentLoaderFactory, PositioningService, DropdownConfig,
  TooltipConfig
} from "ng2-bootstrap";
import {HttpModule} from "@angular/http";
import {AjaxService} from "../../ajax.service";
import {RouterTestingModule} from "@angular/router/testing";
import {fake_Ajax_Service} from "../position-form.component.spec";
import {SwitchLayersComponent} from "./switch-layers/switch-layers.component";
import {ReversePipe} from "../reverse.pipe";
import {DragItemDirective} from "./drag-item.directive";

describe('LayersComponent', () => {
  let component: LayersComponent;
  let fixture: ComponentFixture<LayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[RouterTestingModule, Ng2BootstrapModule, HttpModule],
      declarations: [ LayersComponent , SwitchLayersComponent, ReversePipe, DragItemDirective],
      providers:[QueryParamsHelperService, CalcService, {provide: AjaxService, useValue: fake_Ajax_Service},ComponentLoaderFactory,PositioningService,DropdownConfig,TooltipConfig]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should component instance be defined', () => {
    expect(component).toBeDefined();
  });

  it('delete key should rmv key from object by getting the object and the key', ()=>{
    let obj =  {key1: 'val1', key2: 'val2'};
    expect(Object.keys(obj).length).toEqual(2);
    component.deleteKey(obj, 'key1');
    expect(Object.keys(obj).length).toEqual(1);
    expect(obj.key1).toBeUndefined();
  });

  it('expandParams should get item and toggle "expand" value', ()=>{
    let tms_obj = {expand: false};
    component.expandParams(tms_obj);
    expect(tms_obj.expand).toBeTruthy();
    component.expandParams(tms_obj);
    expect(tms_obj.expand).toBeFalsy();
  });


});
