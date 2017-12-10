import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LayersComponent } from './layers.component';
import { QueryParamsHelperService } from '../../services/query-params-helper.service';
import { CalcService } from '../../services/calc-service';
import { BsDropdownModule, ModalModule, PositioningService, TooltipModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
import { AjaxService } from '../../services/ajax.service';
import { RouterTestingModule } from '@angular/router/testing';
import { fake_Ajax_Service } from '../position-form.component.spec';
import { SwitchLayersComponent } from './switch-layers/switch-layers.component';
import { ReversePipe } from '../reverse.pipe';
import { DragItemDirective } from './drag-item.directive';
import { FormsModule } from '@angular/forms';
import { MapMipService } from '../../api/map-mip.service';
import { PositionFormService } from '../position-form.service';

declare const Cesium;

describe('LayersComponent', () => {
  let component: LayersComponent;
  let fixture: ComponentFixture<LayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpModule, ModalModule.forRoot(), TooltipModule.forRoot(), BsDropdownModule.forRoot(), FormsModule],
      declarations: [LayersComponent, SwitchLayersComponent, ReversePipe, DragItemDirective],
      providers: [PositionFormService, QueryParamsHelperService, CalcService, MapMipService, {
        provide: AjaxService,
        useValue: fake_Ajax_Service
      }, PositioningService]
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

  it('delete key should rmv key from object by getting the object and the key', () => {
    let obj = { key1: 'val1', key2: 'val2' };
    expect(Object.keys(obj).length).toEqual(2);
    component.deleteKey(obj, 'key1');
    expect(Object.keys(obj).length).toEqual(1);
    expect(obj.key1).toBeUndefined();
  });

  it('expandParams should get item and toggle "expand" value', () => {
    let tms_obj = { expand: false };
    component.expandParams(tms_obj);
    expect(tms_obj.expand).toBeTruthy();
    component.expandParams(tms_obj);
    expect(tms_obj.expand).toBeFalsy();
  });


});
