/**
 * Created by Harel on 16/03/2017.
 */
import {Params} from "@angular/router";
import {OpenlayersComponent} from "../openlayers.component";

export class OpenlayersGeoJson{
  public queryParamsSubscriber;

  constructor(private openlayers:OpenlayersComponent){
    this.queryParamsSubscriber = openlayers.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
  }

  queryParams(params:Params) {
    if(this.openlayers.queryParamsHelperService.anyGeoJsonChange(this.openlayers.prevParams, this.openlayers.currentParams)) {
      let url = this.openlayers.queryParamsHelperService.queryGeoJson(params);

      var vectorLayer = new this.openlayers.ol.layer.Vector({
        source: new this.openlayers.ol.source.Vector({
          format: new this.openlayers.ol.format.GeoJSON(),
          url: url
        })
      });
      this.openlayers.map.addLayer(vectorLayer)

    }
  }

}
