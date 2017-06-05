/**
 * Created by Harel on 14/03/2017.
 */
import {Params} from "@angular/router";
import {CesiumComponent} from "../cesium.component";
import * as _ from 'lodash';


export class CesiumGeoJson {
  public queryParamsSubscriber;

  constructor(private cesium: CesiumComponent) {
    this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
  }

  queryParams(params: Params) {
    if (this.cesium.queryParamsHelperService.anyGeoJsonChange(this.cesium.prevParams, this.cesium.currentParams)) {
      let urls = this.cesium.queryParamsHelperService.queryGeoJson(params);
      let that = this;
      //remove all
      this.cesium.viewer.dataSources.removeAll()
      //then add the current
      _.forEach(urls, function (url) {

        let promise = Cesium.GeoJsonDataSource.load(url,{
     /*     stroke: Cesium.Color.DEEPSKYBLUE ,
          fill: Cesium.Color.DEEPSKYBLUE.withAlpha(0.1),
          strokeWidth: 3*/
        });
        promise.then(function (dataSource) {
            that.cesium.viewer.dataSources.add(dataSource);
            let entities = dataSource.entities.values;
            _.forEach(entities,function (ent) {
              ent.billboard ? ent.billboard.image = "http://mapmip.webiks.com/assets/Markers/marker-icon-blue.png" : '';
              if (ent.polyline && ent.properties.color) {
                 ent.polyline.material.color = Cesium.Color.fromCssColorString(that.getColor(ent.properties.color));
              }
            });

          }
        )


      });
    }
  }

  getColor(color){
    switch (color) {
      case 'red':
        return  "#ff0000";
      case 'blue':
        return "#0000ff";
      case 'green':
        return  "#00ff00";
      case 'yellow':
        return "#feff43";
      case 'black':
        return  "#000000";
    }
  }
}

