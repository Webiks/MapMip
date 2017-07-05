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
          return window['current']['map'].getView().setZoom(zoom);
        case  "LeafletComponent" :
          return  window['current']['map'].flyTo(latlng,zoom);
        // case  "CesiumComponent" : TODO
        // return  window['current']['map'].setZoom(zoom);
      }

  }

}



window['Mapmip'] = MapmipApi;



// WEBPACK FOOTER //
// ./src/main.ts
