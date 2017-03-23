/**
 * Created by Harel on 15/03/2017.
 */
import {Params} from "@angular/router";
import {LeafletComponent} from "../leaflet.component";
import * as _ from 'lodash';

export class LeafletGeoJson{
  public queryParamsSubscriber;
  public assetLayerGroup;
  public geoJsonLayers :string[];
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
    var that = this;
    if(this.leaflet.queryParamsHelperService.anyGeoJsonChange(this.leaflet.prevParams, this.leaflet.currentParams)) {
      this.geoJsonLayers =[];
      //for case when moving from other component
      if (!this.assetLayerGroup) {
        this.assetLayerGroup = new this.leaflet.L.LayerGroup();
      }
      this.assetLayerGroup.clearLayers();
      let urls = this.leaflet.queryParamsHelperService.queryGeoJson(params);

      _.forEach(urls, function(url,index){
        that.geoJsonLayers[index] = that.leaflet.L.geoJSON['ajax'](url,{onEachFeature:that.popUp});
        that.assetLayerGroup.addLayer(that.geoJsonLayers[index])
      } );

      // add the whole group to map
      this.assetLayerGroup.addTo(this.leaflet.map);

    }
  }

}
