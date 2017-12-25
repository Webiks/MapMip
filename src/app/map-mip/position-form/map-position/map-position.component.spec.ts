import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MapPositionComponent } from './map-position.component';
import { PositionFormService } from '../position-form.service';
import { QueryParamsHelperService } from '../../services/query-params-helper.service';
import { CalcService } from '../../services/calc-service';
import { RouterTestingModule } from '@angular/router/testing';
import { PopoverModule } from 'ngx-bootstrap';
import { MapMipService } from '../../api/map-mip.service';

describe('MapPositionComponent', () => {
  let component: MapPositionComponent;
  let fixture: ComponentFixture<MapPositionComponent>;
  let positionFormService: PositionFormService;
  let queryParamsHelperService: QueryParamsHelperService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MapPositionComponent],
      providers: [PositionFormService, QueryParamsHelperService, CalcService, MapMipService],
      imports: [RouterTestingModule, PopoverModule.forRoot()]

    })
      .compileComponents();
  }));

  beforeEach(inject([PositionFormService, QueryParamsHelperService], (_positionFormService: PositionFormService, _queryParamsHelperService: QueryParamsHelperService) => {
    fixture = TestBed.createComponent(MapPositionComponent);
    component = fixture.componentInstance;
    positionFormService = _positionFormService;
    queryParamsHelperService = _queryParamsHelperService;
    positionFormService.mapsCont = {};
    positionFormService.mapsCont.nativeElement = {};
    positionFormService.mapsCont.nativeElement['offsetWidth'] = 80;

    fixture.detectChanges();
  }));

  it('should create map-position component', () => {
    expect(component).toBeTruthy();
  });

  it('should test onResize', () => {
    spyOn(component, 'onPositionChanges');
    component.onResize();
    expect(component.popViewStyle.width).toEqual(`${10}px`);
    expect(component.onPositionChanges).toHaveBeenCalled();
  });

  it('should test maxBoundX', () => {
    component.popViewStyle.width = `${10}px`;
    component.dragStyle.width = `${10}px`;
    expect(component.maxBoundX()).toEqual(9);
  });

  it('should test maxBoundY', () => {
    component.popViewStyle.height = `${10}px`;
    component.dragStyle.height = `${10}px`;
    expect(component.maxBoundY()).toEqual(9);
  });

  it('should test convertPixelsToPrecnt', () => {
    component.dragStyle.left = `${10}px`;
    component.dragStyle.top = `${10}px`;
    spyOn(component, 'maxBoundX').and.returnValue(10);
    spyOn(component, 'maxBoundY').and.returnValue(10);
    expect(component.convertPixelsToPrecnt()).toEqual([100, 100]);
  });

  it('should test mouseUp case A: click event', () => {
    component.popView = { nativeElement: 'hi' };
    component.drag = { nativeElement: { clientWidth: 30, clientHeight: 40 } };
    let event = { which: 1, offsetX: 50, offsetY: 40, target: 'hi' };
    component.mouseDown = false;
    spyOn(component, 'convertPixelsToPrecnt').and.returnValue([35, 20]);
    spyOn(component.positionChange, 'emit');
    spyOn(component.submitPositionEmitter, 'emit');
    component.mouseUp(event);
    expect(component.convertPixelsToPrecnt).toHaveBeenCalledWith('35px', '20px');
    expect(component.positionChange.emit).toHaveBeenCalledWith('35,20');
    expect(component.submitPositionEmitter.emit).toHaveBeenCalled();


  });

  it('should test mouseUp case B: drag event', () => {
    let event = { which: 1, offsetX: 50, offsetY: 40 };
    component.mouseDown = true;
    component.dragStyle = { left: '35px', top: '20px', height: '', width: '' };
    spyOn(component.positionChange, 'emit');
    spyOn(component.submitPositionEmitter, 'emit');
    spyOn(component, 'convertPixelsToPrecnt').and.returnValue([35, 20]);
    component.mouseUp(event);
    expect(component.convertPixelsToPrecnt).toHaveBeenCalled();
    expect(component.positionChange.emit).toHaveBeenCalledWith('35,20');
    expect(component.submitPositionEmitter.emit).toHaveBeenCalled();


  });

  it('should test onSizeChanges', () => {
    spyOn(queryParamsHelperService, 'querySize').and.returnValue([100, 100]);
    component.onSizeChanges();
    expect(component.dragStyle.width).toEqual(`${100}%`);
    expect(component.dragStyle.height).toEqual(`${100}%`);
  });

  it('should test onPositionChanges', () => {
    spyOn(queryParamsHelperService, 'queryPosition').and.returnValue([50, 50]);
    spyOn(component, 'maxBoundX').and.returnValue(10);
    spyOn(component, 'maxBoundY').and.returnValue(10);
    component.onPositionChanges();
    expect(component.dragStyle.left).toEqual(`${5}px`);
    expect(component.dragStyle.top).toEqual(`${5}px`);
  });

  it('should test onMouseDown', () => {
    let event = { which: 1, clientX: 20, clientY: 20, target: { 'offsetLeft': 10, 'offsetTop': 10 } };
    component.onMouseDown(event);
    expect(component.drag_obj.posX).toEqual(10);
    expect(component.drag_obj.posY).toEqual(10);
    expect(component.mouseDown).toBeTruthy();

  });

  it('should test onMouseMove', () => {
    component.mouseDown = true;
    let event = { which: 1, clientX: 30, clientY: 30 };
    component.drag_obj.posX = 10;
    component.drag_obj.posY = 10;
    spyOn(component, 'maxBoundX').and.returnValue(50);
    spyOn(component, 'maxBoundY').and.returnValue(50);
    component.onMouseMove(event);
    expect(component.dragStyle.left).toEqual('20px');
    expect(component.dragStyle.top).toEqual('20px');
  });


  it('should test centerPosition', () => {
    spyOn(component.positionChange, 'emit');
    spyOn(component.submitPositionEmitter, 'emit');
    component.centerPosition();
    expect(component.positionChange.emit).toHaveBeenCalledWith('50,50');
    expect(component.submitPositionEmitter.emit).toHaveBeenCalled();
  });

});
