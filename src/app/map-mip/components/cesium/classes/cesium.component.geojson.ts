/**
 * Created by Harel on 14/03/2017.
 */
import { Params } from '@angular/router';
import { CesiumComponent } from '../cesium.component';
import * as _ from 'lodash';


export class CesiumGeoJson {
  public queryParamsSubscriber;
  public LineString = { color: '', cooridnates: [] };
  public _mainDataSource: Array<any> = [];

  constructor(private cesium: CesiumComponent) {
    this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
  }

  queryParams(params: Params) {
    if (this.cesium.queryParamsHelperService.anyGeoJsonChange(this.cesium.prevParams, this.cesium.currentParams)) {
      let urls = this.cesium.queryParamsHelperService.queryGeoJson(params);
      let that = this;
      // remove all
      this.cesium.viewer.dataSources.removeAll();

      // then add the current
      _.forEach(urls, function (url) {
        let promise = Cesium.GeoJsonDataSource.load(url, {});
        promise.then(function (dataSource) {
            that.cesium.viewer.dataSources.add(dataSource);
            let d = dataSource;
            let entities = dataSource.entities.values;
            let cartesianArr = dataSource.entities.values[0].polyline.positions.getValue();
            _.forEach(entities, function (ent) {
              that.cesium.viewer.dataSources.remove(d);
              let positionArr = [];

              _.forEach(cartesianArr, function (cartesian) {
                const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                const latDeg = Cesium.Math.toDegrees(cartographic.latitude).toFixed(7);
                const lngDeg = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7);
                positionArr.push(lngDeg, latDeg);
              });
              positionArr = positionArr.map(Number);

              const corridorGeometry = new Cesium.CorridorGeometry({
                positions: Cesium.Cartesian3.fromDegreesArray(positionArr),
                width: 20,
                vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
              });
              const color = Cesium.Color.fromCssColorString(that.getColor((<any>ent).properties.color || 'azure'));

              const coloredCorridorInstance = new Cesium.GeometryInstance({
                geometry: corridorGeometry,
                appearance: new Cesium.PerInstanceColorAppearance({
                  closed: true
                }),
                attributes: {
                  color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(color.red, color.green, color.blue, color.alpha))
                }
              });

              that.cesium.viewer.scene.primitives.add(new Cesium.GroundPrimitive({
                geometryInstances: [coloredCorridorInstance]
              }));
              (<any>ent).billboard.image = '/assets/Markers/marker-icon-blue.png';
            });

          }
        );
      });
    }
  }

  getColor(color) {
    switch (color) {
      case 'red':
        return '#ff0000';
      case 'blue':
        return '#0000ff';
      case 'azure':
        return '#3285f8';
      case 'green':
        return '#00ff00';
      case 'yellow':
        return '#feff43';
      case 'black':
        return '#000000';
    }
  }
}

