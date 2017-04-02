import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapLayerComponent } from './map-mip.component';
import {CesiumComponent} from "./components/cesium/cesium.component";
import {LeafletComponent} from "./components/leaflet/leaflet.component";
import {OpenlayersComponent} from "./components/openlayers/openlayers.component";
import {QueryParamsHelperService} from "./services/query-params-helper.service";
import {FormsModule} from "@angular/forms";
import {CalcService} from "./services/calc-service";
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import {Ng2BootstrapModule} from "ng2-bootstrap";
import {PositionFormModule} from "./components/position-form/position-form.module";
import {AjaxService} from "./services/ajax.service";
import {HttpModule} from "@angular/http";
import {MaterialModule} from "@angular/material";
import {MapLayerApiService} from "./services/map-layer-api.service";
import {Routes, RouterModule} from "@angular/router";
import {GeneralCanDeactivateService} from "./services/general-can-deactivate.service";
import {MapMipService} from "./api/map-mip.service";
import { NewTabComponent } from './components/position-form/new-tab/new-tab.component';

export const MapMipChildren :Routes = [
  {
    path: 'cesium',
    component: CesiumComponent,
    canDeactivate: [GeneralCanDeactivateService]
  },
  {
    path: 'openlayers',
    component: OpenlayersComponent,
    canDeactivate: [GeneralCanDeactivateService]
  },
  {
    path: 'leaflet',
    component: LeafletComponent
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forRoot(
      MapMipChildren, {useHash: false}
    ),
    Ng2BootstrapModule.forRoot(),
    JWBootstrapSwitchModule,
    PositionFormModule,
    HttpModule,
    MaterialModule
  ],
  declarations: [MapLayerComponent, CesiumComponent, LeafletComponent, OpenlayersComponent,NewTabComponent],
  exports: [MapLayerComponent],
  providers:[QueryParamsHelperService, CalcService, AjaxService,MapLayerApiService, GeneralCanDeactivateService, MapMipService]
})
export class MapMipModule { }



