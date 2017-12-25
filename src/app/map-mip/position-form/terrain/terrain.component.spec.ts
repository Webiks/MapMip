import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { TerrainComponent } from './terrain.component';
import { CalcService } from '../../services/calc-service';
import { QueryParamsHelperService } from '../../services/query-params-helper.service';
import { PopoverDirective, PopoverModule } from 'ngx-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { AjaxService } from '../../services/ajax.service';
import { fake_Ajax_Service } from '../position-form.component.spec';
import { FormsModule } from '@angular/forms';
import { MapMipService } from '../../api/map-mip.service';
import { PositionFormService } from '../position-form.service';

describe('TerrainComponent', () => {
  let component: TerrainComponent;
  let fixture: ComponentFixture<TerrainComponent>;
  let queryParamsHelperService: QueryParamsHelperService;
  let element: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        PopoverModule.forRoot()
      ],
      declarations: [TerrainComponent],
      providers: [QueryParamsHelperService, CalcService, {
        provide: AjaxService,
        useValue: fake_Ajax_Service
      }, PositionFormService, MapMipService]
    })
      .compileComponents();
  }));

  beforeEach(inject([QueryParamsHelperService], (_queryParamsHelperService: QueryParamsHelperService) => {
    fixture = TestBed.createComponent(TerrainComponent);
    component = fixture.componentInstance;
    queryParamsHelperService = _queryParamsHelperService;
    element = fixture.nativeElement;
    fixture.detectChanges();
  }));

  it('should create TerrainComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should test onShownPopover', () => {
    let fake_input = {
      focus() {
      }
    };
    // let btn = element.querySelector("button");
    // btn.click();
    // let input = element.querySelector("input");
    spyOn(document, 'querySelector').and.returnValue(fake_input);
    spyOn(fake_input, 'focus');
    component.onShownPopover();
    expect(fake_input.focus).toHaveBeenCalled();
  });

  it('should test submitTerrain', () => {
    component.terrainUrl = 'fake';
    let popDirective: PopoverDirective = <any>{
      hide() {
      }
    };
    spyOn(component.terrainChange, 'emit');
    spyOn(component.submitTerrainEmitter, 'emit');
    spyOn(popDirective, 'hide');
    component.submitTerrain(popDirective);
    expect(component.terrainChange.emit).toHaveBeenCalledWith('fake');
    expect(component.submitTerrainEmitter.emit).toHaveBeenCalled();
    expect(popDirective.hide).toHaveBeenCalled();

  });
  it('should test setTerrain', () => {
    spyOn(queryParamsHelperService, 'queryTerrain');
    component.setTerrain();
    expect(queryParamsHelperService.queryTerrain).toHaveBeenCalled();
  });


});
