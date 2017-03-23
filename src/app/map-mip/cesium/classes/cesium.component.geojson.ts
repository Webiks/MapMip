/**
 * Created by Harel on 14/03/2017.
 */
import {Params} from "@angular/router";
import {CesiumComponent} from "../cesium.component";
import * as _ from 'lodash';


export class CesiumGeoJson{
  public queryParamsSubscriber;

  constructor(private cesium:CesiumComponent){
    this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
  }

  queryParams(params:Params) {
    if(this.cesium.queryParamsHelperService.anyGeoJsonChange(this.cesium.prevParams, this.cesium.currentParams)) {
      let urls = this.cesium.queryParamsHelperService.queryGeoJson(params);
      let that = this;
      //remove all
      this.cesium.viewer.dataSources.removeAll()
      //then add the current
      _.forEach(urls,function(url){
        that.cesium.viewer.dataSources.add(Cesium.GeoJsonDataSource.load(url));
      });

    }
  }

}
