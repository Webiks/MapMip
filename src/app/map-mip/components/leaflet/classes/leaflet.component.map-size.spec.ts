import { LeafletComponent } from '../leaflet.component';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { QueryParamsHelperService } from '../../../services/query-params-helper.service';
import { PositionFormService } from '../../../position-form/position-form.service';
import { CalcService } from '../../../services/calc-service';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { LeafletMapSize } from './leaflet.component.map-size';
import { MapMipService } from '../../../api/map-mip.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LeafletComponent', () => {
  let component: LeafletComponent;
  let fixture: ComponentFixture<LeafletComponent>;
  let queryParamsHelperService: QueryParamsHelperService;

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

  beforeEach(inject([QueryParamsHelperService], (_queryParamsHelperService: QueryParamsHelperService) => {
    fixture = TestBed.createComponent(LeafletComponent);
    component = fixture.componentInstance;
    queryParamsHelperService = _queryParamsHelperService;
    fixture.detectChanges();
  }));
  describe('map_size', () => {
    let map_size: LeafletMapSize;

    beforeEach(() => {
      map_size = component.map_size;
    });

    it('queryParams should check if any changes on mapsize and set [width, height] if need', () => {
      spyOn(queryParamsHelperService, 'anySizeChange').and.returnValue(true);
      spyOn(queryParamsHelperService, 'querySize').and.returnValue([50, 60]);
      spyOn(component.map, 'invalidateSize');
      map_size.queryParams({});
      expect(component.container.nativeElement.style.width).toEqual('50%');
      expect(component.container.nativeElement.style.height).toEqual('60%');
      expect(component.map.invalidateSize).toHaveBeenCalled();
    });
  });

});
