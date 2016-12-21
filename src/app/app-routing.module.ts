import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {CesiumCanDeactivate} from "./map-layer/cesium/cesium.canDeactivate";
import {MapLayerModule} from "./map-layer/map-layer.module";


const appRoutes:Routes = [
  {
    path: '',
    loadChildren: '../app/map-layer/map-layer.module#MapLayerModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {useHash:true}) ,
    MapLayerModule
  ],
  exports: [RouterModule],
  providers:[CesiumCanDeactivate]
})

export class AppRoutingModule {}
