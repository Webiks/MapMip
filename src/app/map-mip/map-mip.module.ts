import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapLayerComponent } from './map-mip.component';
import { CesiumComponent } from './components/cesium/cesium.component';
import { LeafletComponent } from './components/leaflet/leaflet.component';
import { OpenlayersComponent } from './components/openlayers/openlayers.component';
import { QueryParamsHelperService } from './services/query-params-helper.service';
import { FormsModule } from '@angular/forms';
import { CalcService } from './services/calc-service';
import { PositionFormModule } from './position-form/position-form.module';
import { AjaxService } from './services/ajax.service';
import { HttpModule } from '@angular/http';
import { MapLayerApiService } from './services/map-layer-api.service';
import { RouterModule, Routes } from '@angular/router';
import { MapMipService } from './api/map-mip.service';
import { NewTabComponent } from './position-form/new-tab/new-tab.component';
import { SwitchLayersDirective } from './directives/switch-layers.directive';
import { ContextMenuModule } from './components/context-menu/context-menu.module';

export const MapMipChildren: Routes = [
  {
    path: 'cesium',
    component: CesiumComponent
  },
  {
    path: 'openlayers',
    component: OpenlayersComponent
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
      MapMipChildren, { useHash: false }
    ),
    PositionFormModule,
    HttpModule,
    ContextMenuModule
  ],
  declarations: [MapLayerComponent, CesiumComponent, LeafletComponent, OpenlayersComponent, NewTabComponent, SwitchLayersDirective],
  exports: [MapLayerComponent, SwitchLayersDirective],
  providers: [QueryParamsHelperService, CalcService, AjaxService, MapLayerApiService, MapMipService]
})
export class MapMipModule {
}



