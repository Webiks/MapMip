import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MarkersComponent } from './markers.component';
import { RouterTestingModule } from '@angular/router/testing';
import { QueryParamsHelperService } from '../../services/query-params-helper.service';
import { CalcService } from '../../services/calc-service';
import { Params } from '@angular/router';
import { PositionFormService } from '../position-form.service';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';
import { MapMipService } from '../../api/map-mip.service';
import { MockComponent } from '../../../utils/mock-component';
import { FormsModule } from '@angular/forms';
import { config } from '../../../../config/config';

describe('MarkersComponent', () => {
  let component: MarkersComponent;
  let fixture: ComponentFixture<MarkersComponent>;
  let element: any;
  let queryParamsHelperService: QueryParamsHelperService;
  let positionFormService: PositionFormService;
  const AppColorPickerMockComponent = MockComponent({
    selector: 'app-color-picker',
    inputs: ['Active', 'selectedIndex'],
    outputs: ['selectedIndexChange', 'togglePickedEmitter']
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        ModalModule.forRoot(),
        BsDropdownModule.forRoot()
      ],
      declarations: [MarkersComponent, AppColorPickerMockComponent],
      providers: [QueryParamsHelperService, CalcService, PositionFormService, MapMipService]
    })
      .compileComponents();
  }));

  beforeEach(inject([QueryParamsHelperService, PositionFormService], (_queryParamsHelperService: QueryParamsHelperService, _positionFormService: PositionFormService) => {
    fixture = TestBed.createComponent(MarkersComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
    queryParamsHelperService = _queryParamsHelperService;
    positionFormService = _positionFormService;
    component.edited_markers_array = [
      { str: '1,2,3', disabled: true },
      { str: '4,5', disabled: false },
      { str: '6,7,8', disabled: false }
    ];

    component.markers_array = [
      { str: '1,2,3', disabled: true },
      { str: '4,5', disabled: true }
    ];

  }));
  describe('<= Testing Instance =>', () => {

    it('should component be defined', () => {
      expect(component).toBeDefined();
    });

    it('queryParams: should get markers from queryParamsHelperService, convert them to array of objects with str, put the result on markers_array and call cloneEditedMarkers', () => {
      spyOn(component, 'cloneEditedMarkers');
      let params: Params = {
        markers: '(1,2,3),(4,5,red),(6,7,8,green)'
      };
      component.queryParams(params);
      expect(component.markers_array).toEqual([{
        position: '1,2,3',
        colorIndex: positionFormService.getSelectedColorIndex(config.defaultMarker.icon)
      }, { position: '4,5', colorIndex: positionFormService.getSelectedColorIndex('red') }, {
        position: '6,7,8',
        colorIndex: positionFormService.getSelectedColorIndex('green')
      }]);
      expect(component.cloneEditedMarkers).toHaveBeenCalled();
    });

    it('cloneEditedMarkers: should copy markers_array values to edited_markers_array', () => {
      component.markers_array = [1, 2, 3];
      component.cloneEditedMarkers();
      expect(component.edited_markers_array).toEqual([1, 2, 3]);
    });

    it('rmvMarker: should get index and remove the object at that index from "edited_markers_array"', () => {
      component.edited_markers_array = [
        { position: '1,2,3', colorIndex: 0 },
        { position: '4,5,6' }
      ];
      expect(component.edited_markers_array.length).toEqual(2);
      component.rmvMarker(1);
      expect(component.edited_markers_array.length).toEqual(1);
      expect(component.edited_markers_array).toEqual([{ position: '1,2,3', colorIndex: 0 }]);
    });


    it('parseMarkers: should get "edited_markers_array",map only str, return the string result from queryParamsHelperService', () => {

      let edited_markers_array = [
        { position: '1,2', colorIndex: positionFormService.getSelectedColorIndex(config.defaultMarker.icon) },
        { position: '4,5,6', colorIndex: positionFormService.getSelectedColorIndex(config.defaultMarker.icon) },
        { position: '7,8', colorIndex: positionFormService.getSelectedColorIndex('green') },
        { position: '7,8,9', colorIndex: positionFormService.getSelectedColorIndex('green') }
      ];
      expect(component.parseMarkers(edited_markers_array)).toEqual('(1,2),(4,5,6),(7,8,green),(7,8,9,green)');
    });

    it('canApply: should compere between markers_array and edited_markers_array by looking for changes', () => {

      component.edited_markers_array = [
        { position: '1,2,3', colorIndex: 0 },
        { position: '4,5,6', colorIndex: 1 }
      ];

      component.markers_array = [
        { position: '1,2,3', colorIndex: 0 },
        { position: '4,5,6', colorIndex: 1 }
      ];

      expect(component.canApply()).toBeFalsy();

      component.edited_markers_array = [
        { position: '1,2,3', colorIndex: 1 },
        { position: '4,5,6', colorIndex: 0 }
      ];

      component.markers_array = [
        { position: '1,2,3', colorIndex: 0 },
        { position: '4,5,6', colorIndex: 1 }
      ];
      expect(component.canApply()).toBeTruthy();
    });


    it('submitMarkers: should call submitMarkersEmitter.emit if canApply else should call smModal.hide', () => {
      spyOn(component.submitMarkersEmitter, 'emit');

      // can apply
      component.edited_markers_array = [
        { position: '1,2,3', colorIndex: positionFormService.getSelectedColorIndex('red') },
        { position: '4,5,6', colorIndex: positionFormService.getSelectedColorIndex('green') },
        { position: '6,7,8', colorIndex: positionFormService.getSelectedColorIndex('black') }
      ];
      component.submitMarkers();
      expect(component.submitMarkersEmitter.emit).toHaveBeenCalled();

    });

    it('submitAddMarkers: should call this.addModal.hide and push the markerStr to "edited_marker_array" ', () => {
      component.edited_markers_array = [
        { str: '1,2,3', disabled: true },
        { str: '4,5,6', disabled: false },
        { str: '6,7,8', disabled: false }
      ];
      spyOn(component.addModal, 'hide');

      expect(component.edited_markers_array.length).toEqual(3);
      component.submitAddMarkers('11,12,13');
      expect(component.addModal.hide).toHaveBeenCalled();
      expect(component.edited_markers_array.length).toEqual(4);
      expect(component.edited_markers_array[3]).toEqual('11,12,13');
    });


    it('markerStrRegex: should check if include 3 numbers with comma between them', () => {
      let invalid_marker_str_not_a_number = '1,2,not_a_numberNaN';
      expect(component.markerStrRegex(invalid_marker_str_not_a_number)).toBeFalsy();

      let invalid_marker_str_4_numbers = '1,2,3,4';
      expect(component.markerStrRegex(invalid_marker_str_4_numbers)).toBeFalsy();

      let valid_markers = '1,2,3';
      expect(component.markerStrRegex(valid_markers)).toBeTruthy();
    });

  });


  describe('<= Testing template =>', () => {

    it('click cancel button should hide smModal', () => {
      spyOn(component.smModal, 'hide');
      let cancel_btn: any = null;
      element.querySelectorAll('.modal-md .modal-footer button').forEach((btn) => {
        if (btn.textContent === 'Cancel') {
          cancel_btn = btn;
        }
      });
      cancel_btn.click();
      fixture.detectChanges();
      expect(component.smModal.hide).toHaveBeenCalled();
    });

    it('click apply button should call submitMarkers', () => {
      component.edited_markers_array = [
        { str: '1,2,3', disabled: true }
      ];
      fixture.detectChanges();

      spyOn(component, 'submitMarkers');
      let apply_btn: any = null;
      element.querySelectorAll('.modal-md .modal-footer button').forEach((btn) => {
        if (btn.textContent === 'Apply') {
          apply_btn = btn;
        }
      });
      apply_btn.click();
      fixture.detectChanges();
      expect(component.submitMarkers).toHaveBeenCalled();

    });

    it('click ok button should call submitMarkers with "true"', () => {
      component.edited_markers_array = [
        { str: '1,2,3', disabled: true }
      ];
      fixture.detectChanges();

      spyOn(component, 'submitMarkers');
      let ok_btn: any = null;
      element.querySelectorAll('.modal-md .modal-footer button').forEach((btn) => {
        if (btn.textContent === 'Ok') {
          ok_btn = btn;
        }
      });
      ok_btn.click();
      fixture.detectChanges();
      expect(component.submitMarkers).toHaveBeenCalledWith(true);

    });
  });

  describe('markerCenter', () => {
    it('should create marker with the of the current center lng,lat ', () => {
      component.lng = 2;
      component.lat = 1;
      spyOn(queryParamsHelperService, 'addMarker');
      positionFormService.selectedColorIndex = positionFormService.getSelectedColorIndex('red');
      component.markerCenter();
      expect(queryParamsHelperService.addMarker).toHaveBeenCalledWith({ position: [2, 1], color: 'red' });
    });

    it('markerCenter btn should call markerCenter function by click', () => {
      spyOn(component, 'markerCenter');
      let center_button = element.querySelector('button.center-btn');
      center_button.click();
      fixture.detectChanges();
      expect(component.markerCenter).toHaveBeenCalled();
    });
  });

  it('togglePicked should toggle onPicked and send event with the new value', () => {
    spyOn(positionFormService.markerPickerEmitter, 'emit');
    positionFormService.onPicked = false;
    component.togglePicked(true);
    expect(positionFormService.onPicked).toBeTruthy();
    expect(positionFormService.markerPickerEmitter.emit).toHaveBeenCalledWith(true);
  });

  describe('Remove all markers ', () => {
    it('removeAllMarkers Should remove all markers', () => {
      component.removeAllMarkers();
      expect(component.edited_markers_array).toEqual([]);
    });

    it('click on removeAllMarkers button should call removeAllMarkers()', () => {
      let removeAll_button = element.querySelector('button.glyphicon.glyphicon-trash.btn.btn-danger.pull-right');
      spyOn(component, 'removeAllMarkers');
      removeAll_button.click();
      fixture.detectChanges();
      expect(component.removeAllMarkers).toHaveBeenCalled();


    });

  });

});
