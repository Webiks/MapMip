import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ColorPickerComponent } from './color-picker.component';
import { MARKER_COLORS, PositionFormService } from '../position-form.service';
import { BsDropdownModule, ModalModule, TooltipModule } from 'ngx-bootstrap';

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;
  let positionFormService: PositionFormService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ModalModule.forRoot(), BsDropdownModule.forRoot(), TooltipModule.forRoot()],
      declarations: [ColorPickerComponent],
      providers: [PositionFormService]
    })
      .compileComponents();
  }));

  beforeEach(inject([PositionFormService], (_positionFormService: PositionFormService) => {
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    positionFormService = _positionFormService;
  }));

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('changeMarkerColor should change value of selectedIndex and call selectedIndexChange.emit(value)', () => {
    let selected_index_input = 9;
    spyOn(component.selectedIndexChange, 'emit');
    component.changeMarkerColor(selected_index_input);
    expect(component.selectedIndex).toEqual(9);
    expect(component.selectedIndexChange.emit).toHaveBeenCalledWith(9);
  });

  it('markerColors should return MARKER_COLORS', () => {
    expect(component.markerColors()).toEqual(MARKER_COLORS);
  });

  it('getMarkerUrlByColor should call positionFormService.getMarkerUrlByColor', () => {
    spyOn(positionFormService, 'getMarkerUrlByColor');
    component.getMarkerUrlByColor('red');
    expect(positionFormService.getMarkerUrlByColor).toHaveBeenCalledWith('red');
  });


});
