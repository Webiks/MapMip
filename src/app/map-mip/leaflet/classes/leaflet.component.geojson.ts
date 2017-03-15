/**
 * Created by Harel on 15/03/2017.
 */
import {Params} from "@angular/router";
import {LeafletComponent} from "../leaflet.component";

export class LeafletGeoJson{
  public queryParamsSubscriber;

  constructor(private leaflet:LeafletComponent){
    this.queryParamsSubscriber = leaflet.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
  }
  popUp(f,l){
  var out = [];
  if (f.properties){
    for(let key in f.properties){
      out.push(key+": "+f.properties[key]);
    }
    l.bindPopup(out.join("<br />"));
  }
}

  queryParams(params:Params) {
    if(this.leaflet.queryParamsHelperService.anyGeoJsonChange(this.leaflet.prevParams, this.leaflet.currentParams)) {
      let url = this.leaflet.queryParamsHelperService.queryGeoJson(params);

      var geoLayer = this.leaflet.L.geoJSON['ajax'](url,{onEachFeature:this.popUp}
        ).addTo(this.leaflet.map)
    }
  }

}
