import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {Ng2BootstrapModule} from "ng2-bootstrap";
import {AppRoutingModule} from "./app-routing.module";
import {RouterOutlet} from "@angular/router";
import { LeafletComponent } from './leaflet/leaflet.component';
import { NavbarComponent } from './navbar/navbar.component';
import { OpenlayersComponent } from './openlayers/openlayers.component';
import {QueryParamsHelperService} from "./query-params-helper.service";
import {CalcService} from "./calc.service";
import { CesiumComponent } from './cesium/cesium.component';
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    LeafletComponent,
    NavbarComponent,
    OpenlayersComponent,
    CesiumComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    Ng2BootstrapModule,
    AppRoutingModule
  ],
  providers: [QueryParamsHelperService, CalcService],
  bootstrap: [AppComponent]
})
export class AppModule { }
