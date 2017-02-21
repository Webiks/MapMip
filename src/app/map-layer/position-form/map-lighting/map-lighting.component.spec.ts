/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MapLightingComponent } from './map-lighting.component';

describe('MapLightingComponent', () => {
  let component: MapLightingComponent;
  let fixture: ComponentFixture<MapLightingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapLightingComponent ]
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
