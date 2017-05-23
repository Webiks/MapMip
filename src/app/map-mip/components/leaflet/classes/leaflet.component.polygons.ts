/**
 * Created by USSeR on 5/23/2017.
 */
import {Params} from "@angular/router";
import {LeafletComponent} from "../leaflet.component";
import * as _ from 'lodash';
import {QueryParamsHelperService} from "../../../services/query-params-helper.service";

export class LeafletPolygons {
  public queryParamsSubscriber;
  public assetLayerGroup;
  public geoJsonLayers: string[];

  constructor(private leaflet: LeafletComponent,private queryParamsHelperService: QueryParamsHelperService) {
    this.queryParamsSubscriber = leaflet.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    leaflet.positionFormService.polygonPickerEmitter.subscribe(this.togglePolygonPicker.bind(this));

  }
  destroy() {
    this.queryParamsSubscriber.unsubscribe();
  }
  queryParams(){}

  togglePolygonPicker(){
    console.log("do leaflet polygon");

    this.leaflet.map.on('click', function(e) {
      alert("Lat, Lon : " + e['latlng'].lat + ", " + e['latlng'].lng)
    });
  }

}
