import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {MapLayerComponent} from "./map-mip.component";
import {CesiumComponent} from "./cesium/cesium.component";
import {OpenlayersComponent} from "./openlayers/openlayers.component";
import {LeafletComponent} from "./leaflet/leaflet.component";
import {GeneralCanDeactivateService} from "./general-can-deactivate.service";

const mayLayerRoutes :Routes = [
  {
    path: '',
    component:MapLayerComponent,
    children: [
      { path: '', redirectTo: 'cesium', pathMatch: 'full' },
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
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(mayLayerRoutes)],
  exports: [RouterModule],
  providers: [GeneralCanDeactivateService]
})

export class MapLayerRouting {
}
