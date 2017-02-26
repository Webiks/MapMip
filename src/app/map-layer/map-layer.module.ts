import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapLayerComponent } from './map-layer.component';
import {CesiumComponent} from "./cesium/cesium.component";
import {LeafletComponent} from "./leaflet/leaflet.component";
import {OpenlayersComponent} from "./openlayers/openlayers.component";
import {MapLayerRouting} from "./map-layer-routing.module";
import {QueryParamsHelperService} from "./query-params-helper.service";
import {FormsModule} from "@angular/forms";
import {CalcService} from "./calc-service";
import { JWBootstrapSwitchModule } f   .service";
import {HttpModule} from "@angular/http";
import {MaterialModule} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    MapLayerRouting,
    FormsModule,
    Ng2BootstrapModule.forRoot(),
    JWBootstrapSwitchModule,
    PositionFormModule,
    HttpModule,
    MaterialModule
  ],
  declarations: [MapLayerComponent, CesiumComponent, LeafletComponent, OpenlayersComponent],
  exports: [MapLayerComponent],
  providers:[QueryParamsHelperService, CalcService, AjaxService]
})
export class MapLayerModule { }
