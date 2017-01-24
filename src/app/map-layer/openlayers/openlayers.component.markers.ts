import {OpenlayersComponent} from "./openlayers.component";
import {Params} from "@angular/router";
import * as _ from 'lodash';
import * as ol from "openlayers";

export class OpenlayersMarkers {

  public leftClickHandler;

  constructor(private openlayers:OpenlayersComponent){
    openlayers.positionFormService.markerPickerEmitter.subscribe(this.toggleMarkerPicker.bind(this));
    if(openlayers.positionFormService.onPicked) this.toggleMarkerPicker(true);
  }

  toggleMarkerPicker(checked:boolean){
    if(checked){
      this.leftClickHandler = this.openlayers.map.on("click", this.leftClickInputAction.bind(this));
    } else {
      this.openlayers.map.unByKey(this.leftClickHandler );
    }
  }

  leftClickInputAction(event:{coordinate:[number, number]}) {
    console.log("click openlayers");
    let trans_cord:ol.Coordinate = ol.proj.toLonLat(event.coordinate);
    this.openlayers.queryParamsHelperService.addMarker(trans_cord);
  }

  anyMarkersMapChanges(params:Params):boolean {
    let queryMarkersPositions:Array<[number, number]> = this.openlayers.queryParamsHelperService.queryMarkersNoHeight(params);
    let mapMarkerPositions:Array<[number, number]> = this.getMarkersPosition();
    return !_.isEqual(mapMarkerPositions, queryMarkersPositions);
  }

  getMarkersPosition(): Array<[number,number]>{
    return this.openlayers.LayersArray.filter( (layer) => {
      let geom;
      if(layer.getSource && layer.getSource().getFeatures) geom = layer.getSource().getFeatures()[0].getGeometry();
      return geom instanceof ol.geom.Point;
    }) . map(layer => {
      let cord = layer.getSource().getFeatures()[0].getGeometry()['getCoordinates']();
      cord = ol.proj.transform(cord, 'EPSG:3857', 'EPSG:4326');
      return this.openlayers.calcService.toFixes7Obj(cord);
    });
  }

  setMarkersChanges(params:Params):void {
    let params_markers_positions:Array<[number, number]> = this.openlayers.queryParamsHelperService.queryMarkersNoHeight(params);
    let map_markers_positions:Array<[number, number]> = this.getMarkersPosition();

    this.addMarkersViaUrl(params_markers_positions);
    this.removeMarkersViaUrl(map_markers_positions);
  }

  addMarkersViaUrl(params_markers_position:Array<[number, number]>) {
    params_markers_position.forEach( (marker:[number, number]) => {
      if(!this.markerExistOnMap(marker)) {
        this.addIcon(marker);
      }
    });
  }

  removeMarkersViaUrl(map_markers_positions:Array<[number, number]>) {
    map_markers_positions.forEach((markerPos) => {
      if(!this.markerExistOnParams(markerPos)) {
        let marker_to_remove = this.openlayers.LayersArray.find(
          layer => {
            let geom;
            if (layer.getSource().getFeatures) geom = layer.getSource().getFeatures()[0].getGeometry();
            if (!(geom instanceof ol.geom.Point)) return false;
            let cord = layer.getSource().getFeatures()[0].getGeometry()['getCoordinates']();
            cord = ol.proj.transform(cord, 'EPSG:3857', 'EPSG:4326');
            cord = this.openlayers.calcService.toFixes7Obj(cord);
            return _.isEqual(cord, markerPos);
          });
        this.openlayers.map.removeLayer(marker_to_remove)
      }
    })
  }

  markerExistOnMap(markerPosition:[number, number]):boolean {
    let markers_map_positions = this.getMarkersPosition();
    let exist_point = markers_map_positions.find((positionArray) => _.isEqual(positionArray, markerPosition));
    return !_.isEmpty(exist_point);
  }

  markerExistOnParams(markerPosition) {
    let markers_params_positions = this.openlayers.queryParamsHelperService.queryMarkersNoHeight(this.openlayers.currentParams);
    let exist_point = markers_params_positions.find(positionArray => _.isEqual(positionArray , markerPosition));
    return !_.isEmpty(exist_point);
  }

  addIcon(lnglat:[number, number]){
    let iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform(lnglat, 'EPSG:4326', 'EPSG:3857')),
      name: 'Null Island',
      population: 4000,
      rainfall: 500
    });
    let vectorSource = new ol.source.Vector(<any>{
      features: [iconFeature]
    });
    let iconStyle = new ol.style.Style(<any>{
      image: new ol.style.Icon(<any>{
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 0.75,
        src: '/assets/Leaflet/images/marker-icon.png'
      }),
    });
    let vectorLayer = new ol.layer.Vector(<any>{
      source: vectorSource,
      style: iconStyle
    });
    vectorLayer.setZIndex(200)
    this.openlayers.map.addLayer(vectorLayer);
  }

}
