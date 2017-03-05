import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {MapMipModule, MapMipChildren} from "./map-mip/map-mip.module";


const appRoutes:Routes = [
  {
    path: '',
    children: MapMipChildren
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
