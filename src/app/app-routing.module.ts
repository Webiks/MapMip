import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {MapMipModule} from "./map-mip/map-mip.module";


const appRoutes:Routes = [
  {
    path: '',
    loadChildren: '../app/map-mip/map-mip.module#MapMipModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {useHash:false}) ,
    MapMipModule
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {}
