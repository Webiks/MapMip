/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TmsComponent } from './tms.component';
import {QueryParamsHelperService} from "../../query-params-helper.service";
import {CalcService} from "../../calc-service";
import {Ng2BootstrapModule} from "ng2-bootstrap";
import {element} from "protractor";

describe('TmsComponent', () => {
  let component: TmsComponent;
  let fixture: ComponentFixture<TmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[Ng2BootstrapModule],
      declarations: [ TmsComponent ],
      providers:[QueryParamsHelperService, CalcService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should component instance be defined', () => {
    expect(component).toBeDefined();
  });

  // it('togleEnabled should: change disabled of the input , call select and call focus', () => {
  //   let fake_input_element = {disabled: true, select: () => undefined, focus: () => undefined }
  //   spyOn(fake_input_element, 'select');
  //   spyOn(fake_input_element, 'focus');
  //   component.togleEnabled(fake_input_element);
  //   expect(fake_input_element.disabled).toBeFalsy();
  //   expect(fake_input_element.select).toHaveBeenCalled();
  //   expect(fake_input_element.focus).toHaveBeenCalled();
  // });

  it('removeTms should rmv tms element from tmsArray by getting the index of item', ()=>{
    component.tmsArray = [1,2,3,4];
    spyOn(component.tmsArray, 'splice');
    component.removeTms(2);
    expect(component.tmsArray.splice).toHaveBeenCalledWith(2, 1);
  });

  it('delete key should rmv key from object by getting the object and the key', ()=>{
    let obj =  {key1: 'val1', key2: 'val2'};
    expect(Object.keys(obj).length).toEqual(2);
    component.deleteKey(obj, 'key1');
    expect(Object.keys(obj).length).toEqual(1);
    expect(obj.key1).toBeUndefined();
  });

  it('expandParams should get item and toggle "expand" value', ()=>{
    let tms_obj = {expand: false};
    component.expandParams(tms_obj);
    expect(tms_obj.expand).toBeTruthy();
    component.expandParams(tms_obj);
    expect(tms_obj.expand).toBeFalsy();
  });


});
