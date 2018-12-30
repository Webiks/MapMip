import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MapLightingComponent } from './map-lighting.component';
import { MapMipService } from '../../api/map-mip.service';
import { PositionFormService } from '../position-form.service';
import { RouterTestingModule } from '@angular/router/testing';
import { QueryParamsHelperService } from '../../services/query-params-helper.service';
import { CalcService } from '../../services/calc-service';

describe('MapLightingComponent', () => {
  let component: MapLightingComponent;
  let fixture: ComponentFixture<MapLightingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [MapMipService, PositionFormService, QueryParamsHelperService, CalcService],
      declarations: [MapLightingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapLightingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
