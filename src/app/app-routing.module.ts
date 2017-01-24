import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
<<<<<<< HEAD
import {AppComponent} from "./app.component";
import {LeafletComponent} from "./leaflet/leaflet.component";
import {OpenlayersComponent} from "./openlayers/openlayers.component";
=======
import {MapLayerModule} from "./map-layer/map-layer.module";

>>>>>>> 6a261f02ba3cb165e014668f097ee4d404839aaa

const appRoutes:Routes = [
  {
    path: '',
<<<<<<< HEAD
    children:
      [
        {
          path:'leaflet',
          component:LeafletComponent
        },
        {
          path:'openlayers',
          component:OpenlayersComponent
        }
      ]
=======
    loadChildren: '../app/map-layer/map-layer.module#MapLayerModule'
>>>>>>> 6a261f02ba3cb165e014668f097ee4d404839aaa
  }
];

@NgModule({
<<<<<<< HEAD
  imports: [RouterModule.forRoot(appRoutes)],
=======
  imports: [
    RouterModule.forRoot(appRoutes, {useHash:true}) ,
    MapLayerModule
  ],
>>>>>>> 6a261f02ba3cb165e014668f097ee4d404839aaa
  exports: [RouterModule]
})

export class AppRoutingModule {}
