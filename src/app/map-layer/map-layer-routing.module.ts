import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {MapLayerComponent} from "./map-layer.component";
import {CesiumComponent} from "./cesium/cesium.component";
import {OpenlayersComponent} from "./openlayers/openlayers.component";
import {LeafletComponent} from "./leaflet/leaflet.component";
import {CesiumCanDeactivate} from "./cesium/cesium.canDeactivate";

const mayLayerRoutes :Routes = [
  {
    path: '',
    component:MapLayerComponent,
    children: [
      { path: '', redirectTo: 'cesium', pathMatch: 'full' },
      {
        path: 'cesium',
        component: CesiumComponent,
        canDeactivate: [CesiumCanDeactivate]
      },
      {
        path: 'openlayers',
        component: OpenlayersComponent
      },
      {
        path: 'leaflet',
        component: LeafletComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(mayLayerRoutes)],
  exports: [RouterModule],
  providers: [CesiumCanDeactivate]
})

export class MapLayerRouting {
}
