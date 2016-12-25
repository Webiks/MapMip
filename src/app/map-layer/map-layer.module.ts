import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapLayerComponent } from './map-layer.component';
import {CesiumComponent} from "./cesium/cesium.component";
import {LeafletComponent} from "./leaflet/leaflet.component";
import {OpenlayersComponent} from "./openlayers/openlayers.component";
import {MapLayerRouting} from "./map-layer-routing.module";
import {QueryParamsHelperService} from "./query-params-helper.service";
import { PositionFormComponent } from './position-form/position-form.component';
import {FormsModule} from "@angular/forms";
import {CalcService} from "./calc-service";

@NgModule({
  imports: [
    CommonModule,
    MapLayerRouting,
    FormsModule
  ],
  declarations: [MapLayerComponent, CesiumComponent, LeafletComponent, OpenlayersComponent, PositionFormComponent],
  exports: [MapLayerComponent],
  providers:[QueryParamsHelperService, CalcService]
})
export class MapLayerModule { }
