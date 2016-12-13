import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AppComponent} from "./app.component";
import {LeafletComponent} from "./leaflet/leaflet.component";
import {OpenlayersComponent} from "./openlayers/openlayers.component";

const appRoutes:Routes = [
  {
    path: '',
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
