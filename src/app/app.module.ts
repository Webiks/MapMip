import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import {Ng2BootstrapModule} from "ng2-bootstrap";
import {AppRoutingModule} from "./app-routing.module";
<<<<<<< HEAD
import {RouterOutlet} from "@angular/router";
import { LeafletComponent } from './leaflet/leaflet.component';
import { NavbarComponent } from './navbar/navbar.component';
import { OpenlayersComponent } from './openlayers/openlayers.component';
=======
import { NavbarComponent } from './navbar/navbar.component';
import {CommonModule} from "@angular/common";
import {MapLayerModule} from "./map-layer/map-layer.module";
>>>>>>> 6a261f02ba3cb165e014668f097ee4d404839aaa

@NgModule({
  declarations: [
    AppComponent,
<<<<<<< HEAD
    LeafletComponent,
    NavbarComponent,
    OpenlayersComponent
=======
    NavbarComponent,
>>>>>>> 6a261f02ba3cb165e014668f097ee4d404839aaa
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    Ng2BootstrapModule,
<<<<<<< HEAD
    AppRoutingModule
=======
    AppRoutingModule,
    MapLayerModule
>>>>>>> 6a261f02ba3cb165e014668f097ee4d404839aaa
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
