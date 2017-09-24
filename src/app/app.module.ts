import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { Ng2BootstrapModule } from 'ngx-bootstrap';
import { NavbarComponent } from './navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { MapMipModule } from './map-mip/map-mip.module';
import { MdInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    Ng2BootstrapModule,
    MapMipModule,
    MdInputModule,
    BrowserAnimationsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
