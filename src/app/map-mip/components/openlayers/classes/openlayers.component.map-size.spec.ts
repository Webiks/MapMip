import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { QueryParamsHelperService } from '../../../services/query-params-helper.service';
import { PositionFormService } from '../../../position-form/position-form.service';
import { CalcService } from '../../../services/calc-service';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { OpenlayersComponent } from '../openlayers.component';
import { OpenLayersMapSize } from './openlayers.component.map-size';
import { MapMipService } from '../../../api/map-mip.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContextMenuModule } from '../../context-menu/context-menu.module';


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
  describe('map_size', () => {
    let map_size: OpenLayersMapSize;

    beforeEach(() => {
      map_size = component.map_size;
    });

    it('queryParams should check if any changes on mapsize and set [width, height] if need', () => {
      spyOn(queryParamsHelperService, 'anySizeChange').and.returnValue(true);
      spyOn(queryParamsHelperService, 'querySize').and.returnValue([50, 60]);
      map_size.queryParams({});
      expect(component.container.nativeElement.style.width).toEqual('50%');
      expect(component.container.nativeElement.style.height).toEqual('60%');
    });
  });

});
