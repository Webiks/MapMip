/**
 * Created by Harel on 16/03/2017.
 */
import {Params} from "@angular/router";
import {OpenlayersComponent} from "../openlayers.component";
import * as _ from 'lodash';

export class OpenlayersGeoJson{
  public queryParamsSubscriber;
  public geojsonLayers:string[];
  constructor(private openlayers:OpenlayersComponent){
    this.queryParamsSubscriber = openlayers.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
  }

  queryParams(params:Params) {
    var that = this;
    if(this.openlayers.queryParamsHelperService.anyGeoJsonChange(this.openlayers.prevParams, this.openlayers.currentParams)) {
      let urls = this.openlayers.queryParamsHelperService.queryGeoJson(params);


      // remove all layers first by take from array
      _.forEach(this.geojsonLayers,(geojsonLayer)=>{
           this.openlayers.map.removeLayer(geojsonLayer);
      })
      this.geojsonLayers =[];

      // then add the new geojson layers from the url into the array

      _.forEach(urls, function(url,index){
        that.geojsonLayers[index]  = new that.openlayers.ol.layer.Vector({
          source: new that.openlayers.ol.source.Vector({
            format: new that.openlayers.ol.format.GeoJSON(),
            url: url,
            style: new ol.style.Style({
              image: new ol.style.Circle({
                radius: 3,
                fill: new ol.style.Fill({color: 'white'})
              })
          })
          })
        });
        // add each elem of the array
        that.openlayers.map.addLayer(that.geojsonLayers[index])

      } );



    }
  }

}
