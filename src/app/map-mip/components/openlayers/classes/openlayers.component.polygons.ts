/**
 * Created by USSeR on 5/23/2017.
 */
import { Params } from '@angular/router';
import { OpenlayersComponent } from '../openlayers.component';
import * as ol from 'openlayers';
import * as _ from 'lodash';

export class OpenlayersPolygons {
  public queryParamsSubscriber;
  public draw;
  private vectorSource: ol.source.Vector;
  private vectorLayer: ol.layer.Vector;

  constructor(private openlayers: OpenlayersComponent) {
    this.addPolygonsLayer();
    this.queryParamsSubscriber = openlayers.activatedRoute.queryParams
      .filter((params: Params) => this.openlayers.queryParamsHelperService.anyPolygonsChange(this.openlayers.prevParams, this.openlayers.currentParams))
      .subscribe(this.setPolygonsChanges.bind(this));
    openlayers.positionFormService.polygonPickerEmitter.subscribe(this.togglePolygonPicker.bind(this));
    if (openlayers.positionFormService.onPolygonPicked) {
      this.togglePolygonPicker.bind(this)(true);
    }
  }


  addPolygonsLayer() {
    this.vectorSource = new ol.source.Vector(<any>{});
    this.vectorLayer = new ol.layer.Vector(<any>{
      source: this.vectorSource
    });
    this.vectorLayer.setZIndex(200);
    this.openlayers.map.addLayer(this.vectorLayer);
  }

  destroy() {
    this.queryParamsSubscriber.unsubscribe();
    this.openlayers.positionFormService.polygonPickerEmitter.unsubscribe();
  }

  getPolygonsPositions(): { coords: number[] } [] {
    return this.vectorSource.getFeatures().map(this.getPolygonObj);
  }

  setPolygonsChanges(params) {
    const params_polygons_array: Array<Object> = /*this.openlayers.calcService.toFixes7Obj(*/this.openlayers.queryParamsHelperService.queryPolygons(params);
    const map_polygons_array = /*this.openlayers.calcService.toFixes7Obj(*/this.getPolygonsPositions();

    this.addPolygonsViaUrl(params_polygons_array, map_polygons_array);
    this.removePolygonsViaUrl(params_polygons_array, map_polygons_array);
  }

  addPolygonsViaUrl(params_polygons_array: any[], map_polygons_array) {
    params_polygons_array.forEach(polygon_obj => {
      if (!this.polygonsExistOnMap(polygon_obj, map_polygons_array)) {
        const feature = this.getFeaturePolygon(polygon_obj);
        this.vectorSource.addFeature(feature);
      }
    });
  }

  removePolygonsViaUrl(params_polygons_array, map_polygons_array) {
    map_polygons_array.forEach((map_polygon_obj) => {
      if (!this.polygonExistOnParams(map_polygon_obj, params_polygons_array)) {
        const featureGeomCoor = (<any>this.getFeaturePolygon(map_polygon_obj).getGeometry()).getCoordinates()[0];
        const VectorSourceFeatureFeature = this.vectorSource.getFeatures().find(
          (vectorSourceFeature) => {
            const vectorSourceFeatureGeomCoor = (<any>vectorSourceFeature.getGeometry()).getCoordinates()[0];
            const parsedFeatureGeomCoor = featureGeomCoor.map(elem => [elem[0].toFixed(7), elem[1].toFixed(7)]);
            const parsedvectorSourceFeatureGeomCoor = vectorSourceFeatureGeomCoor.map(elem => [elem[0].toFixed(7), elem[1].toFixed(7)]);
            return _.isEqual(parsedFeatureGeomCoor, parsedvectorSourceFeatureGeomCoor);
          });
        this.vectorSource.removeFeature(VectorSourceFeatureFeature);
      }
    });
  }

  getFeaturePolygon(polygon_obj: { coords: number[] }): ol.Feature {
    let transformedCoords = [];
    for (let i = 0; i < polygon_obj.coords.length; i += 2) {
      transformedCoords.push([polygon_obj.coords[i], polygon_obj.coords[i + 1]]);
    }
    transformedCoords = transformedCoords.map((coords) => ol.proj.transform(coords, 'EPSG:4326', 'EPSG:3857'));
    transformedCoords = /*this.openlayers.calcService.toFixes7Obj(*/transformedCoords;
    const geometry = new ol.geom.Polygon([transformedCoords]);
    return new ol.Feature({ geometry });
  }

  getPolygonObj(feature: ol.Feature) {
    let coords = [];
    const featureCoords = (<any>feature.getGeometry()).getCoordinates()[0];
    featureCoords.forEach(f_coords => {
      const [number_a, number_b] = ol.proj.transform(f_coords, 'EPSG:3857', 'EPSG:4326');
      coords.push(number_a);
      coords.push(number_b);
    });
    return { coords };
  }

  polygonExistOnParams(polygon_obj, params_polygons_array) {
    let exist_polygon = params_polygons_array.find(paramPolygon => _.isEqual(paramPolygon, polygon_obj));
    return !_.isEmpty(exist_polygon);
  }

  polygonsExistOnMap(map_polygon_obj, map_polygons_array) {
    const exist_polygon = map_polygons_array.find(polygon_obj => _.isEqual(polygon_obj, map_polygon_obj));
    return !_.isEmpty(exist_polygon);
  }

  togglePolygonPicker() {
    let that = this;

    let source = new this.openlayers.ol.source.Vector({ wrapX: false });

    this.draw = new this.openlayers.ol.interaction.Draw({
      source: source,
      type: 'Polygon'
    });

    this.openlayers.map.addInteraction(this.draw);

    this.draw.on('drawend', function (evt) {
      // that.draw.finishDrawing();
      that.openlayers.map.removeInteraction(that.draw);
      that.vectorSource.addFeature(evt.feature);
      let initcoordinates = evt.feature.getGeometry().getCoordinates();
      let coordinates = [];
      initcoordinates [0].forEach(coord => {
        let coordToPush = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
        coordinates.push(coordToPush[0]);
        coordinates.push(coordToPush[1]);
      });
      that.openlayers.queryParamsHelperService.addPolygon(coordinates);
    });
  }


}
