import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GeojsonLayerComponent } from './geojson-layer.component';
import { FormsModule } from '@angular/forms';
import { QueryParamsHelperService } from '../../services/query-params-helper.service';
import { AjaxService } from '../../services/ajax.service';
import { ModalModule } from 'ngx-bootstrap';
import { CalcService } from '../../services/calc-service';
import { RouterTestingModule } from '@angular/router/testing';
import { MapMipService } from '../../api/map-mip.service';
import { PositionFormService } from '../position-form.service';

describe('GeojsonLayerComponent', () => {
  let component: GeojsonLayerComponent;
  let fixture: ComponentFixture<GeojsonLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, ModalModule.forRoot()],
      providers: [QueryParamsHelperService, AjaxService, CalcService, MapMipService, PositionFormService],
      declarations: [GeojsonLayerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeojsonLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
