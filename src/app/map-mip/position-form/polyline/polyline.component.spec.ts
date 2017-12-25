import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PolylineComponent } from './polyline.component';
import { PositionFormService } from '../position-form.service';
import { RouterTestingModule } from '@angular/router/testing';
import { CalcService } from '../../services/calc-service';

describe('PolylineComponent', () => {
  let component: PolylineComponent;
  let fixture: ComponentFixture<PolylineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [PositionFormService, CalcService],
      declarations: [PolylineComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolylineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
