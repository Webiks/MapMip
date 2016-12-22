/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MapLayerComponent } from './map-layer.component';
import {MapLayerModule} from "./map-layer.module";
import {RouterTestingModule} from "@angular/router/testing";

describe('MapLayerComponent', () => {
  let component: MapLayerComponent;
  let fixture: ComponentFixture<MapLayerComponent>;
  let element: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        MapLayerModule,
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
