import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import {Ng2BootstrapModule} from "ng2-bootstrap";
import { NavbarComponent } from './navbar/navbar.component';
import {CommonModule} from "@angular/common";
import {MapMipModule} from "./map-mip/map-mip.module";
import {MaterialRootModule} from "@angular/material";


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
    MapMipModule,
    MaterialRootModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
