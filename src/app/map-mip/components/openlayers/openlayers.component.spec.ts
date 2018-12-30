import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { OpenlayersComponent } from './openlayers.component';
import { QueryParamsHelperService } from '../../services/query-params-helper.service';
import { CalcService } from '../../services/calc-service';
import { RouterTestingModule } from '@angular/router/testing';
import { Params, Router } from '@angular/router';
import { HttpModule } from '@angular/http';
import { PositionFormService } from '../../position-form/position-form.service';
import { MapMipService } from '../../api/map-mip.service';
import { ContextMenuModule } from '../context-menu/context-menu.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('OpenlayersComponent', () => {
  let component: OpenlayersComponent;
  let fixture: ComponentFixture<OpenlayersComponent>;
  let calcService: CalcService;
  let router: Router;
  let queryParamsHelperService: QueryParamsHelperService;
  let positionFormService: PositionFormService;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpModule, ContextMenuModule, BrowserAnimationsModule],
      declarations: [OpenlayersComponent],
      providers: [QueryParamsHelperService, CalcService, PositionFormService, MapMipService]
    })
      .compileComponents();
  }));

  beforeEach(inject([CalcService, Router, QueryParamsHelperService, PositionFormService], (_calcService: CalcService, _router: Router, _queryParamsHelperService: QueryParamsHelperService, _positionFormService: PositionFormService) => {
    fixture = TestBed.createComponent(OpenlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    calcService = _calcService;
    router = _router;
    queryParamsHelperService = _queryParamsHelperService;
    positionFormService = _positionFormService;
  }));

  it('should component be defined', () => {
    expect(component).toBeDefined();
  });

  it('queryParams should save currentParmas with the newParmas and prevParams with currentParams', () => {
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

});
