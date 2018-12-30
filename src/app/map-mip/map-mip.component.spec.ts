import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MapLayerComponent } from './map-mip.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from '../utils/mock-component';
import { PositionFormService } from './position-form/position-form.service';

describe('MapLayerComponent', () => {
  let component: MapLayerComponent;
  let fixture: ComponentFixture<MapLayerComponent>;
  let element: any;
  const MockComponents = [
    MockComponent({ selector: 'app-position-form' }),
    MockComponent({ selector: 'app-context-menu' }),
    MockComponent({ selector: 'app-new-tab' })
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [PositionFormService],
      declarations: [MapLayerComponent, ...MockComponents]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapLayerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });
});
