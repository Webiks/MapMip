import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {enableProdMode, NgModuleRef} from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
import {current} from "codelyzer/util/syntaxKind";

if (environment.production) {
  enableProdMode();
}


class MapmipApi {
public mapMipService;
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
        var location = window['current'].ol.proj.fromLonLat([latlng[0],latlng[1]]);
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



}



window['Mapmip'] = MapmipApi;



// WEBPACK FOOTER //
// ./src/main.ts
