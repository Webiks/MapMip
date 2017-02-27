import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import {Ng2BootstrapModule} from "ng2-bootstrap";
import {AppRoutingModule} from "./app-routing.module";
import { NavbarComponent } from './navbar/navbar.component';
import {CommonModule} from "@angular/common";
import {MapMipModule} from "./map-mip/map-mip.module";
import {MaterialModule, MaterialRootModule} from "@angular/material";


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    Ng2BootstrapModule,
    AppRoutingModule,
    MapMipModule,
    MaterialRootModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
