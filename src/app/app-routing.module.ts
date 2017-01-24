import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
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
  exports: [RouterModule]
})

export class AppRoutingModule {}
