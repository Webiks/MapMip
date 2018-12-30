import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlipSwitchComponent } from './flip-switch.component';
import { TooltipModule } from 'ngx-bootstrap';

describe('FlipSwitchComponent', () => {
  let component: FlipSwitchComponent;
  let fixture: ComponentFixture<FlipSwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TooltipModule.forRoot()],
      declarations: [FlipSwitchComponent]
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
