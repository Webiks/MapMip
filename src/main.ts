import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {enableProdMode, NgModuleRef} from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
import {current} from "codelyzer/util/syntaxKind";
import {QueryParamsHelperService} from "./app/map-mip/services/query-params-helper.service";

if (environment.production) {
  enableProdMode();
}


class MapmipApi {
public mapMipService;
  public queryParamsHelperService:QueryParamsHelperService;
  constructor(element: HTMLElement | string | any) {
    this.initMapmip(element,{skipLocationChange:true})
  }

  initMapmip (element: HTMLElement | string | any, options:{skipLocationChange:boolean}={skipLocationChange:false}) {
    let app_root: HTMLElement = document.createElement("app-root");
    element = element instanceof HTMLElement ? element : document.querySelector(`#${element}`);
    element.appendChild(app_root);
    let m = platformBrowserDynamic().bootstrapModule(AppModule);
    m.then((appModuleRef: NgModuleRef<AppModule>)=>{
      console.log(appModuleRef.instance.mapmipService);
      this.mapMipService=appModuleRef.instance.mapmipService;
      appModuleRef.instance.mapmipService.skipLocationChange=options.skipLocationChange;
    })
  }
  goToComponent(state: '/leaflet' | '/cesium' | '/openlayers'): void {
    this.mapMipService.goTo(state)
  }
  urlOverride(){
    this.mapMipService.skipLocationChange=true;
  }
  changePosition(lat,lon) {
    this.mapMipService.changePosition(lat, lon);
  }

  // mapmip api
  addMarker(marker){
    this.queryParamsHelperService.addMarker(marker);
  }


  // leaflet - openLayers - Cesium API
  setZoom(zoom:number) {
    switch (window['current'].constructor.name) {
      case  "OpenlayersComponent" :
        return window['current']['map'].getView().setZoom(zoom);
      case  "LeafletComponent" :
        return window['current']['map'].setZoom(zoom);
      // case  "CesiumComponent" : TODO
      // return  window['current']['map'].setZoom(zoom);
    }
  }
    flyTo(latlng:[number,number],zoom:number){
      switch (window['current'].constructor.name){
        case  "OpenlayersComponent" :
          var location = window['current'].ol.proj.fromLonLat([latlng[1],latlng[0]]);
          return window['current']['map'].getView().animate({zoom:zoom},{center: location})
        case  "LeafletComponent" :
          return  window['current']['map'].flyTo(latlng,zoom);
        case  "CesiumComponent" :
          return window['current'].viewer.camera.flyTo({
            destination : Cesium.Cartesian3.fromDegrees(latlng[1], latlng[0], window['current'].viewer.camera.positionCartographic.height)
          });
    }
  }
  panTo(latlng:[number,number]){
    switch (window['current'].constructor.name){
      case  "OpenlayersComponent" :
        var location = window['current'].ol.proj.fromLonLat([latlng[1],latlng[0]]);
        return window['current']['map'].getView().animate({center: location})
      case  "LeafletComponent" :
        return  window['current']['map'].panTo(latlng);
      case  "CesiumComponent" :
        return window['current'].viewer.camera.setView({
          destination : Cesium.Cartesian3.fromDegrees(latlng[1], latlng[0], window['current'].viewer.camera.positionCartographic.height),
          orientation: {
            heading : 0.0,
            pitch : -Cesium.Math.PI_OVER_TWO,
            roll : 0.0
          }
        });
    }
  }

  fitBounds(latlng:[[number,number],[number,number],[number,number],[number,number]]){
    switch (window['current'].constructor.name){
      case  "OpenlayersComponent" :
        let olBounds = [
          [latlng[0][1],latlng[0][0]],
          [latlng[1][1],latlng[1][0]],
          [latlng[2][1],latlng[2][0]],
          [latlng[3][1],latlng[3][0]],
        ];
        let bounds=window['current'].ol.extent.applyTransform([olBounds[0][0],olBounds[0][1],olBounds[3][0],olBounds[3][1]],window['current'].ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
        return window['current']['map'].getView().fit(bounds);
      case  "LeafletComponent" :
        return  window['current']['map'].fitBounds(latlng);
      case  "CesiumComponent" :
        let rectangle = Cesium.Rectangle.fromDegrees(latlng[3][1],latlng[3][0],latlng[2][1],latlng[2][0])
        window['current'].viewer.camera.setView({
          destination: rectangle
        });
    }

  }

  }



window['Mapmip'] = MapmipApi;



// WEBPACK FOOTER //
// ./src/main.ts
