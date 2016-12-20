import {Params} from "@angular/router";

export interface MapLayerChild {
  initializeMap():void;
  anyParamChanges(Params):boolean
  currentParams:Params;
  setMapView(params:Params):void
  setMapBounds(bounnds:[number,number,number,number]):void
}
