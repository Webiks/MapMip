/* tslint:disable:no-unused-variable */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './navbar/navbar.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let compnent: AppComponent;
  let element: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NavbarComponent
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
