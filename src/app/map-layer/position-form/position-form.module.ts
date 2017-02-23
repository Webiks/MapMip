import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {Ng2BootstrapModule} from "ng2-bootstrap";
import {PositionFormComponent} from "./position-form.component";
import { MarkersComponent } from './markers/markers.component';
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import {LayersComponent} from "./layers/layers.component";
import {PositionFormService} from "./position-form.service";
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { MapSizeComponent } from './map-size/map-size.component';
import {ClickOutsideModule} from "ng2-click-outside";
import { MapPositionComponent } from './map-position/map-position.component';
import { TerrainComponent } from './terrain/terrain.component';
import { DragItemDirective } from './layers/drag-item.directive';
import { ReversePipe } from './reverse.pipe';
import { SwitchLayersComponent } from './layers/switch-layers/switch-layers.component';
import { MapLightingComponent } from './map-lighting/map-lighting.component';
import { ColorPickerPipe } from './color-picker/color-picker.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng2BootstrapModule.forRoot(),
    JWBootstrapSwitchModule,
    ClickOutsideModule
  ],
  declarations: [PositionFormComponent, MarkersComponent, LayersComponent, ColorPickerComponent, MapSizeComponent, MapPositionComponent, TerrainComponent, DragItemDirective, ReversePipe, SwitchLayersComponent, MapLightingComponent, ColorPickerPipe],
  exports: [PositionFormComponent],
  providers:[PositionFormService]
})
export class PositionFormModule { }
