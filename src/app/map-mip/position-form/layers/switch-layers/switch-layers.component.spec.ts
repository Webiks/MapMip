import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SwitchLayersComponent } from './switch-layers.component';

describe('SwitchLayersComponent', () => {
  let component: SwitchLayersComponent;
  let fixture: ComponentFixture<SwitchLayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SwitchLayersComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchLayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
