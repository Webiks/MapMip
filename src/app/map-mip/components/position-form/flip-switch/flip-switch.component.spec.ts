import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlipSwitchComponent } from './flip-switch.component';

describe('FlipSwitchComponent', () => {
  let component: FlipSwitchComponent;
  let fixture: ComponentFixture<FlipSwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlipSwitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlipSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
