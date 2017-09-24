/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MapLayerComponent } from './map-mip.component';
import { MapMipModule } from './map-mip.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('MapLayerComponent', () => {
  let component: MapLayerComponent;
  let fixture: ComponentFixture<MapLayerComponent>;
  let element: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MapMipModule,
        RouterTestingModule
      ]
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
