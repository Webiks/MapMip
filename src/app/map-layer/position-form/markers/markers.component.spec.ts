/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MarkersComponent } from './markers.component';
import {PositionFormModule} from "../position-form.module";
import {RouterTestingModule} from "@angular/router/testing";
import {QueryParamsHelperService} from "../../query-params-helper.service";
import {CalcService} from "../../calc-service";
import {Params} from "@angular/router";

describe('MarkersComponent', () => {
  let component: MarkersComponent;
  let fixture: ComponentFixture<MarkersComponent>;
  let element:any;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        PositionFormModule,
        RouterTestingModule
      ],
      providers:[QueryParamsHelperService, CalcService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkersComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();

    component.edited_markers_array = [
      {str: '1,2,3',disabled:true},
      {str: '4,5',disabled:false},
      {str: '6,7,8',disabled:false}
    ];

    component.markers_array = [
      {str: '1,2,3',disabled:true},
      {str: '4,5',disabled:true}
    ];

  });
  describe('<= Testing Instance =>', () => {

    it('should component be defined', () => {
      expect(component).toBeDefined();
    });

    it('queryParams: should get markers from queryParamsHelperService, convert them to array of objects with str, put the result on markers_array and call cloneEditedMarkers', () => {
      spyOn(component, 'cloneEditedMarkers');
      let params:Params = {
        markers: '(1,2,3),(4,5),(6,7,8)'
      };
      component.queryParams(params);
      expect(component.markers_array).toEqual([{str: '1,2,3'}, {str: '4,5,0'}, {str: '6,7,8'}]);
      expect(component.cloneEditedMarkers).toHaveBeenCalled();
    });

    it('cloneEditedMarkers: should copy markers_array values to edited_markers_array, and add each object key "disabled" with "true" value', ()=>{
      component.markers_array = [
        {str: '1,2,3'},
        {str: '4,5,6'},
      ];
      component.cloneEditedMarkers();
      expect(component.edited_markers_array).toEqual([
        {str: '1,2,3',disabled:true},
        {str: '4,5,6',disabled:true}
      ])
    });

    it('rmvMarker: should get index and remove the object at that index from "edited_markers_array"', ()=>{
      component.edited_markers_array = [
        {str: '1,2,3',disabled:true},
        {str: '4,5,6',disabled:true}
      ];
      expect(component.edited_markers_array.length).toEqual(2);
      component.rmvMarker(1);
      expect(component.edited_markers_array.length).toEqual(1);
      expect(component.edited_markers_array).toEqual([{str: '1,2,3',disabled:true}])
    });


    it('parseMarkers: should get "edited_markers_array",map only str, return the string result from queryParamsHelperService', ()=>{

      let edited_markers_array = [
        {str: '1,2,3',disabled:true},
        {str: '4,5,0',disabled:true}
      ];

      let result:string = component.parseMarkers(edited_markers_array);
      expect(result).toEqual('(1,2,3),(4,5,0)');
    });

    it('canApply: should compere between markers_array and edited_markers_array by looking for changes of "str" values and check regex validations of each "str" values', ()=> {

      component.edited_markers_array = [
        {str: '1,2,3',disabled:true},
        {str: '4,5,0',disabled:false}
      ];

      component.markers_array = [
        {str: '1,2,3',disabled:true},
        {str: '4,5,0',disabled:true}
      ];

      let no_difference_cannot_apply:boolean = component.canApply();
      expect(no_difference_cannot_apply).toBeFalsy();

      component.edited_markers_array = [
        {str: '1,2,3',disabled:true},
        {str: '4,5,0',disabled:false},
        {str: '6,7,8',disabled:false}
      ];

      component.markers_array = [
        {str: '1,2,3'},
        {str: '4,5,0'}
      ];
      fixture.detectChanges();
      let with_difference_can_apply:boolean = component.canApply();
      expect(with_difference_can_apply).toBeTruthy();

      component.edited_markers_array = [
        {str: '1,2,3',disabled:true},
        {str: '4,5,jsjsjsjsjsjsjsjs',disabled:false},
        {str: '6,7,8',disabled:false}
      ];

      component.markers_array = [
        {str: '1,2,3',disabled:true},
        {str: '4,5',disabled:true}
      ];

      let with_difference_but_invalid_regex_cannot_apply:boolean = component.canApply();
      expect(with_difference_but_invalid_regex_cannot_apply).toBeFalsy();
    });


    it('submitMarkers: should call submitMarkersEmitter.emit if canApply else should call smModal.hide', ()=> {
      spyOn(component.submitMarkersEmitter, 'emit');
      spyOn(component.smModal, 'hide');

      //cannot apply
      component.edited_markers_array = [
        {str: '1,2,3',disabled:false},
        {str: '4,5,jsjsjsjsjsjsjsjs',disabled:false},
        {str: '6,7,8',disabled:false}
      ];

      component.submitMarkers();
      expect(component.smModal.hide).toHaveBeenCalled();

      //can apply
      component.edited_markers_array = [
        {str: '1,2,3',disabled:true},
        {str: '4,5,6',disabled:false},
        {str: '6,7,8',disabled:false}
      ];

      component.submitMarkers();
      expect(component.submitMarkersEmitter.emit).toHaveBeenCalled();

    });

    it('submitAddMarkers: should call this.addModal.hide and push the markerStr to "edited_marker_array" ', ()=> {
      component.edited_markers_array = [
        {str: '1,2,3',disabled:true},
        {str: '4,5,6',disabled:false},
        {str: '6,7,8',disabled:false}
      ];
      spyOn(component.addModal, 'hide');

      expect(component.edited_markers_array.length).toEqual(3);
      component.submitAddMarkers("11,12,13");
      expect(component.addModal.hide).toHaveBeenCalled();
      expect(component.edited_markers_array.length).toEqual(4)
      expect(component.edited_markers_array[3]).toEqual({str:'11,12,13', disabled:true});
    });


    it('markerStrRegex: should check if include 3 numbers with comma between them', () => {
      let invalid_marker_str_not_a_number:string = '1,2,not_a_numberNaN';
      expect(component.markerStrRegex(invalid_marker_str_not_a_number)).toBeFalsy();

      let invalid_marker_str_4_numbers:string = '1,2,3,4';
      expect(component.markerStrRegex(invalid_marker_str_4_numbers)).toBeFalsy();

      let valid_markers:string = '1,2,3';
      expect(component.markerStrRegex(valid_markers)).toBeTruthy();
    });

  });
  describe('<= Testing template =>', () => {

    it('click cancel button should hide smModal', ()=> {
      spyOn(component.smModal, 'hide');
      let cancel_btn:any = null;
      element.querySelectorAll(".modal-md .modal-footer button").forEach((btn)=>{
        if(btn.textContent == 'Cancel') cancel_btn = btn;
      });
      cancel_btn.click();
      fixture.detectChanges();
      expect(component.smModal.hide).toHaveBeenCalled();
    });

    it('click apply button should call submitMarkers', ()=> {
      component.edited_markers_array = [
        {str: '1,2,3',disabled:true},
      ];
      fixture.detectChanges();

      spyOn(component, 'submitMarkers');
      let apply_btn:any = null;
      element.querySelectorAll(".modal-md .modal-footer button").forEach((btn)=>{
        if(btn.textContent == 'Apply') apply_btn = btn;
      });
      apply_btn.click();
      fixture.detectChanges();
      expect(component.submitMarkers).toHaveBeenCalled();

    })

    it('click ok button should call submitMarkers with "true"', ()=> {
      component.edited_markers_array = [
        {str: '1,2,3',disabled:true}
      ];
      fixture.detectChanges();

      spyOn(component, 'submitMarkers');
      let ok_btn:any = null;
      element.querySelectorAll(".modal-md .modal-footer button").forEach((btn)=>{
        if(btn.textContent == 'Ok') ok_btn = btn;
      });
      ok_btn.click();
      fixture.detectChanges();
      expect(component.submitMarkers).toHaveBeenCalledWith(true);

    })

    it('should list of markers includes items from "edited_markers_array" "disabled" value should disabled the input', ()=> {
      component.edited_markers_array = [
        {str: '1,2,3',disabled:true},
        {str: '4,5,6',disabled:true},
        {str: '7,8,9',disabled:false}
      ];

      fixture.detectChanges();
      let list_items = element.querySelectorAll(".list-group-item");
      expect(list_items.length).toEqual(3);

      let first_input = list_items[0].querySelector("input");
      expect(first_input.attributes['ng-reflect-is-disabled'].value).toEqual("true");
      let middle_input = list_items[1].querySelector("input");
      expect(middle_input.attributes['ng-reflect-is-disabled'].value).toEqual("true");
      let last_input = list_items[2].querySelector("input");
      expect(last_input.attributes['ng-reflect-is-disabled']).toBeUndefined();

    })

  })

});
