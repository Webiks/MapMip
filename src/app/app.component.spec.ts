import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from './utils/mock-component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let compnent: AppComponent;
  let element: any;
  const navbar = MockComponent({ selector: 'app-navbar' });
  const mapmip = MockComponent({ selector: 'map-mip' });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        navbar,
        mapmip
      ],
      imports: [RouterTestingModule]
    });
    TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    compnent = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('component should be defined', () => {
    expect(compnent).toBeDefined();
  });

});
