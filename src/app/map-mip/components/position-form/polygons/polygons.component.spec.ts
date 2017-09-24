import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolygonsComponent } from './polygons.component';

describe('PolygonsComponent', () => {
  let component: PolygonsComponent;
  let fixture: ComponentFixture<PolygonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
