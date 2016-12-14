import {NgModule, Injectable} from "@angular/core";
import {RouterModule, Routes, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Params} from "@angular/router";
import {LeafletComponent} from "./leaflet/leaflet.component";
import {OpenlayersComponent} from "./openlayers/openlayers.component";
import {CesiumComponent} from "./cesium/cesium.component";
import {CesiumResolver} from "./cesium/cesium.resolver";


const appRoutes:Routes = [
  {
    path: '',
    children:
      [
        {
          path:'cesium',
          component:CesiumComponent,
          resolve: {
            res: CesiumResolver
          }
        },
        {
          path:'leaflet',
          component:LeafletComponent,
        },
        {
          path:'openlayers',
          component:OpenlayersComponent
        }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers:[CesiumResolver]
})

export class AppRoutingModule {}
