/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';
import { ColorPickerComponent } from './color-picker.component';
import {PositionFormService, MARKER_COLORS} from "../position-form.service";

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;
  let positionFormService:PositionFormService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPickerComponent ],
      providers:[PositionFormService]
    })
    .compileComponents();
  }));

  beforeEach(inject([PositionFormService], (_positionFormService:PositionFormService) => {
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    positionFormService = _positionFormService;
  }));

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it("changeMarkerColor should change value of selectedIndex and call selectedIndexChange.emit(value)", ()=>{
    let selected_index_input:number = 9;
    spyOn(component.selectedIndexChange, "emit");
    component.changeMarkerColor(selected_index_input);
    expect(component.selectedIndex).toEqual(9);
    expect(component.selectedIndexChange.emit).toHaveBeenCalledWith(9);
  });

  it("markerColors should return MARKER_COLORS", () => {
    expect(component.markerColors()).toEqual(MARKER_COLORS)
  });

  it("getMarkerUrlByColor should call positionFormService.getMarkerUrlByColor", ()=>{
    spyOn(positionFormService, 'getMarkerUrlByColor');
    component.getMarkerUrlByColor("red");
    expect(positionFormService.getMarkerColorByUrl).toHaveBeenCalledWith("red");
  })


});
