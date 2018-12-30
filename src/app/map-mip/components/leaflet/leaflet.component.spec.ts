import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { LeafletComponent } from './leaflet.component';
import { RouterTestingModule } from '@angular/router/testing';
import { QueryParamsHelperService } from '../../services/query-params-helper.service';
import { CalcService } from '../../services/calc-service';
import { Params, Router } from '@angular/router';
import { HttpModule } from '@angular/http';
import { PositionFormService } from '../../position-form/position-form.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapMipService } from '../../api/map-mip.service';

describe('LeafletComponent', () => {
  let component: LeafletComponent;
  let fixture: ComponentFixture<LeafletComponent>;
  let queryParamsHelperService: QueryParamsHelperService;
  let router: Router;
  let positionFormService: PositionFormService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpModule
      ],
      declarations: [LeafletComponent],
      providers: [QueryParamsHelperService, CalcService, PositionFormService, MapMipService]
    })
      .compileComponents();
  }));

  beforeEach(inject([QueryParamsHelperService, Router, PositionFormService], (_queryParamsHelperService: QueryParamsHelperService, _router: Router, _positionFormService: PositionFormService) => {
    fixture = TestBed.createComponent(LeafletComponent);
    component = fixture.componentInstance;
    queryParamsHelperService = _queryParamsHelperService;
    router = _router;
    positionFormService = _positionFormService;
    fixture.detectChanges();
  }));

  it('should component be defined', () => {
    expect(component).toBeDefined();
  });

  it('queryParams: should save currentParmas with the newParmas and prevParams with currentParams', () => {
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
