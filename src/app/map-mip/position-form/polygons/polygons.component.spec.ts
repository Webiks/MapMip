import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PolygonsComponent } from './polygons.component';
import { ModalModule } from 'ngx-bootstrap';
import { QueryParamsHelperService } from '../../services/query-params-helper.service';
import { PositionFormService } from '../position-form.service';
import { CalcService } from '../../services/calc-service';
import { RouterTestingModule } from '@angular/router/testing';
import { MapMipService } from '../../api/map-mip.service';

describe('PolygonsComponent', () => {
  let component: PolygonsComponent;
  let fixture: ComponentFixture<PolygonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ModalModule.forRoot()],
      providers: [QueryParamsHelperService, PositionFormService, CalcService, MapMipService],
      declarations: [PolygonsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolygonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
