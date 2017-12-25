import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { QueryParamsHelperService } from '../../../services/query-params-helper.service';
import { PositionFormService } from '../../../position-form/position-form.service';
import { CalcService } from '../../../services/calc-service';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { OpenlayersComponent } from '../openlayers.component';
import { OpenlayersMapPosition } from './openlayers.component.map-position';
import { MapMipService } from '../../../api/map-mip.service';
import { ContextMenuModule } from '../../context-menu/context-menu.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('OpenLayersComponent', () => {
  let component: OpenlayersComponent;
  let fixture: ComponentFixture<OpenlayersComponent>;
  let queryParamsHelperService: QueryParamsHelperService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpModule, ContextMenuModule, BrowserAnimationsModule],
      declarations: [OpenlayersComponent],
      providers: [QueryParamsHelperService, CalcService, PositionFormService, MapMipService]
    })
      .compileComponents();
  }));

  beforeEach(inject([QueryParamsHelperService], (_queryParamsHelperService: QueryParamsHelperService) => {
    fixture = TestBed.createComponent(OpenlayersComponent);
    component = fixture.componentInstance;
    queryParamsHelperService = _queryParamsHelperService;
    fixture.detectChanges();
  }));
  describe('map_position', () => {
    let map_position: OpenlayersMapPosition;

    beforeEach(() => {
      map_position = component.map_position;
      component.positionFormService.mapsCont = {};
      component.positionFormService.mapsCont.nativeElement = {};
      component.positionFormService.mapsCont.nativeElement['offsetWidth'] = 500;
      component.positionFormService.mapsCont.nativeElement['offsetHeight'] = 400;
    });

    it('queryParams should check if any changes on map position and set [width, height] if need', () => {
      spyOn(queryParamsHelperService, 'anySizeChange').and.returnValue(true);
      spyOn(queryParamsHelperService, 'anyPositionChange').and.returnValue(true);
      spyOn(queryParamsHelperService, 'querySize').and.returnValue([50, 50]);
      spyOn(queryParamsHelperService, 'queryPosition').and.returnValue([50, 50]);
      map_position.queryParams({});
      expect(component.container.nativeElement.style.left).toEqual('125px');
      expect(component.container.nativeElement.style.top).toEqual('100px');
    });
  });

});
