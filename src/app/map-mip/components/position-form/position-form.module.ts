import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2BootstrapModule } from 'ngx-bootstrap';
import { PositionFormComponent } from './position-form.component';
import { MarkersComponent } from './markers/markers.component';
import { LayersComponent } from './layers/layers.component';
import { PositionFormService } from './position-form.service';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { MapSizeComponent } from './map-size/map-size.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { MapPositionComponent } from './map-position/map-position.component';
import { TerrainComponent } from './terrain/terrain.component';
import { DragItemDirective } from './layers/drag-item.directive';
import { ReversePipe } from './reverse.pipe';
import { SwitchLayersComponent } from './layers/switch-layers/switch-layers.component';
import { MapLightingComponent } from './map-lighting/map-lighting.component';
import { ColorPickerPipe } from './color-picker/color-picker.pipe';
import { GeojsonLayerComponent } from './geojson-layer/geojson-layer.component';
import { FlipSwitchComponent } from './flip-switch/flip-switch.component';
import { PolygonsComponent } from './polygons/polygons.component';
import { PolylineComponent } from './polyline/polyline.component';
import { MatInputModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng2BootstrapModule.forRoot(),
    ClickOutsideModule,
    MatInputModule
  ],
  declarations: [
    PositionFormComponent,
    MarkersComponent,
    LayersComponent,
    ColorPickerComponent,
    MapSizeComponent,
    MapPositionComponent,
    TerrainComponent,
    DragItemDirective,
    ReversePipe,
    SwitchLayersComponent,
    MapLightingComponent,
    ColorPickerPipe,
    GeojsonLayerComponent,
    FlipSwitchComponent,
    PolygonsComponent,
    PolylineComponent
  ],
  exports: [PositionFormComponent],
  providers: [PositionFormService]
})
export class PositionFormModule {
}
