/**
 * Created by USSeR on 6/26/2017.
 */
import {Params} from "@angular/router";
import {OpenlayersComponent} from "../openlayers.component";
import * as ol from 'openlayers';
import * as _ from 'lodash';

import LineString = ol.geom.LineString;

export class OpenlayersPolyline {
  public queryParamsSubscriber;
  public draw;
  private vectorSource: ol.source.Vector;
  private vectorLayer: ol.layer.Vector;

  constructor(private openlayers: OpenlayersComponent) {
    this.addPolylineLayer();
    this.queryParamsSubscriber = openlayers.activatedRoute.queryParams
      .filter((params:Params) => this.openlayers.queryParamsHelperService.anyPolylineChange(this.openlayers.prevParams, this.openlayers.currentParams))
      .subscribe(this.setPolylineChanges.bind(this));
    openlayers.positionFormService.polylinePickerEmitter.subscribe(this.togglePolylinePicker.bind(this));
   // if(openlayers.positionFormService.onPolylinePicked) this.togglePolylinePicker.bind(this)(true);
  }


  addPolylineLayer() {
    this.vectorSource = new ol.source.Vector(<any>{});
    this.vectorLayer = new ol.layer.Vector(<any>{
      source: this.vectorSource
    });
    this.vectorLayer.setZIndex(200);
    this.openlayers.map.addLayer(this.vectorLayer);
  }

  destroy() {
    this.queryParamsSubscriber.unsubscribe();
    this.openlayers.positionFormService.polylinePickerEmitter.unsubscribe()
  }

  getPolylinePositions(): {coords: number[]} [] {
    return this.vectorSource.getFeatures().map(this.getPolylineObj);
  }

  setPolylineChanges(params) {
    const params_polyline_array: Array<Object> = this.openlayers.queryParamsHelperService.queryPolyline(params);
    const map_polyline_array = this.getPolylinePositions();

    this.addPolylineViaUrl(params_polyline_array, map_polyline_array );
    this.removePolylineViaUrl(params_polyline_array, map_polyline_array );
  }

  addPolylineViaUrl(params_polyline_array: any[], map_polyline_array ) {
    params_polyline_array.forEach(polyline_obj => {
      if (!this.polylineExistOnMap(polyline_obj, map_polyline_array)) {
        let feature = this.getFeaturePolyline(polyline_obj);
        feature.setStyle(new this.openlayers.ol.style.Style({
          stroke: new this.openlayers.ol.style.Stroke({
            color: polyline_obj.color,
            width: 3
          })}));
        this.vectorSource.addFeature(feature);
      }
    });
  }

  removePolylineViaUrl(params_polyline_array, map_polyline_array) {
    map_polyline_array.forEach((map_polyline_obj) => {
      if(!this.polylineExistOnParams(map_polyline_obj, params_polyline_array)) {
        const featureGeomCoor = (<any>this.getFeaturePolyline(map_polyline_obj).getGeometry()).getCoordinates();
        const VectorSourceFeatureFeature = this.vectorSource.getFeatures().find(
          (vectorSourceFeature) => {
            const vectorSourceFeatureGeomCoor = (<any>vectorSourceFeature.getGeometry()).getCoordinates();
            const parsedFeatureGeomCoor= featureGeomCoor.map(elem=>[elem[0].toFixed(7),elem[1].toFixed(7)]);
            const parsedvectorSourceFeatureGeomCoor= vectorSourceFeatureGeomCoor.map(elem=>[elem[0].toFixed(7),elem[1].toFixed(7)]);
            return _.isEqual(parsedFeatureGeomCoor,parsedvectorSourceFeatureGeomCoor)
          });
        this.vectorSource.removeFeature(VectorSourceFeatureFeature);
      }
    })
  }

  getFeaturePolyline(polyline_obj: {coords: number[]}): ol.Feature {
    let transformedCoords = [];
    for (let i = 0; i < polyline_obj.coords.length; i += 2){
      transformedCoords.push([polyline_obj.coords[i],polyline_obj.coords[i+1]])
    }
    transformedCoords = transformedCoords.map((coords) => ol.proj.transform(coords, 'EPSG:4326', 'EPSG:3857'));
    const geometry = new ol.geom.LineString( transformedCoords );
    return new ol.Feature({geometry});
  }

  getPolylineObj(feature: ol.Feature) {
    let coords = [];
    const featureCoords = (<any>feature.getGeometry()).getCoordinates();
    featureCoords.forEach(f_coords => {
      const [number_a, number_b] = ol.proj.transform(f_coords, 'EPSG:3857', 'EPSG:4326');
      coords.push(number_a);
      coords.push(number_b);
    });
    return {coords};
  }

  polylineExistOnParams(polyline_obj, params_polyline_array) {
    let exist_polyline = params_polyline_array.find(paramPolyline => _.isEqual(paramPolyline, polyline_obj));
    return !_.isEmpty(exist_polyline);
  }

  polylineExistOnMap(map_polyline_obj, map_polyline_array){
    const exist_polyline  = map_polyline_array.find(polyline_obj=> _.isEqual(polyline_obj, map_polyline_obj)) ;
    return !_.isEmpty(exist_polyline);
  }

  togglePolylinePicker(){
    let that =this;

    let source = new this.openlayers.ol.source.Vector({wrapX: false});
    let color = this.openlayers.positionFormService.selectedPolylineColor;
      this.draw = new this.openlayers.ol.interaction.Draw({
      source: source,
      type:'LineString'
    });

    this.openlayers.map.addInteraction(this.draw);

    this.draw.on('drawend', function(evt){
      that.openlayers.map.removeInteraction(that.draw);
      evt.feature.setStyle(new that.openlayers.ol.style.Style({
        stroke: new that.openlayers.ol.style.Stroke({
          color: color,
          width: 3
        })}));
      that.vectorSource.addFeature(evt.feature);
      let coords=[];
      let initcoordinates = evt.feature.getGeometry().getCoordinates();
      initcoordinates = initcoordinates.map((coord)=>ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326'));
      initcoordinates.forEach(
      (coord)=>
        coords.push(coord[0],coord[1]));
      that.openlayers.queryParamsHelperService.addPolyline({coords, color});
    });
  }






}
