/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';

import { PositionFormComponent } from './position-form.component';
import {RouterTestingModule} from "@angular/router/testing";
import {MapLayerComponent} from "../map-layer.component";
import {MapLayerModule} from "../map-layer.module";
import {Router} from "@angular/router";
import {AppModule} from "../../app.module";
import {AppComponent} from "../../app.component";

fdescribe('PositionFormComponent', () => {
  let component: PositionFormComponent;
  let fixture: ComponentFixture<PositionFormComponent>;
  let element: any;
  let router:Router
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        RouterTestingModule.withRoutes([
          {
            path: '',
            component:AppComponent,
            children:
            [
              { path: 'dd', component: MapLayerComponent, children:[
                { path: '', redirectTo:'/cesium', pathMatch: 'full' },
                { path: '/cesium'},
                { path: '/leaflet'},
                { path: '/openlayer'}
              ]
              },
              { path: '', redirectTo:'dd', pathMatch: 'full' }
            ]
          }
          ]),
        AppModule,
        MapLayerModule
      ],
    })
    .compileComponents();
  }));

  beforeEach(inject([Router], (_router:Router) => {
    fixture = TestBed.createComponent(PositionFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
    router = _router;
    router.navigate(['/dd']);
  }));

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should keys return all Object keys', () => {
    let test_obj = {one:null,two:null,three:null};
    let keys:Array<string> = component.keys(test_obj);
    expect(keys).toBeDefined();
    expect(keys.length).toEqual(3);
    expect(keys[0]).toEqual('one');
    expect(keys[1]).toEqual('two');
    expect(keys[2]).toEqual('three');
  });

  it('should show all params that have premision', () => {

    Object.keys(component.params).forEach((key)=>{
      component.params[key].value = Math.random();
    });
    let list = element.querySelectorAll('form-group');
  });


});
