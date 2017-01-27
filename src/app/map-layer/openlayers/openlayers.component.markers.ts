import {OpenlayersComponent} from "./openlayers.component";
import {Params} from "@angular/router";
import * as _ from 'lodash';
import * as ol from "openlayers";
import {SafeStyle} from "@angular/platform-browser";

export class OpenlayersMarkers {

  public leftClickHandler;

  constructor(private openlayers:OpenlayersComponent){}

  getCursorStyle(): void | SafeStyle {
    if(this.openlayers.positionFormService.onPicked) {
      return this.openlayers.positionFormService.getMarkerCursorStyle();
    }
  }

  toggleMarkerPicker(checked:boolean){
    if(checked){
      this.leftClickHandler = this.openlayers.map.on("click", this.leftClickInputAction.bind(this));
    } else {
      this.openlayers.map.unByKey(this.leftClickHandler );
    }
  }

  leftClickInputAction(event:{coordinate:[number, number]}) {
    let position:ol.Coordinate = ol.proj.toLonLat(event.coordinate);
    let color:string = this.openlayers.positionFormService.getSelectedColor();
    this.openlayers.queryParamsHelperService.addMarker({position, color});
  }

  anyMarkersMapChanges(params:Params):boolean {
    let queryMarkersPositions:Array<any> = this.openlayers.queryParamsHelperService.queryMarkersNoHeight(params);
      let mapMarkerPositions:Array<any> = this.getMarkersPosition();
    return !_.isEqual(mapMarkerPositions, queryMarkersPositions);
  }

  getMarkersPosition(): Array<any>{
    return this.openlayers.LayersArray.filter( (layer) => {
      let geom;
      if(layer.getSource && layer.getSource().getFeatures) geom = layer.getSource().getFeatures()[0].getGeometry();
      return geom instanceof ol.geom.Point;
    }) . map(layer => {
      let position = layer.getSource().getFeatures()[0].getGeometry()['getCoordinates']();
      position = ol.proj.transform(position, 'EPSG:3857', 'EPSG:4326');
      position = this.openlayers.calcService.toFixes7Obj(position);
      let color:string = this.openlayers.positionFormService.getMarkerColorByUrl(layer.getStyle().getImage().getSrc());
      return {position, color};
    });
  }

  setMarkersChanges(params:Params):void {
    let params_markers_positions:Array<any> = this.openlayers.queryParamsHelperService.queryMarkersNoHeight(params);
    let map_markers_positions:Array<any> = this.getMarkersPosition();

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

  markerExistOnMap(markerPosition):boolean {
    let markers_map_positions = this.getMarkersPosition();
    let exist_point = markers_map_positions.find((positionArray) => _.isEqual(positionArray, markerPosition));
    return !_.isEmpty(exist_point);
  }

  markerExistOnParams(markerPosition) {
    let markers_params_positions = this.openlayers.queryParamsHelperService.queryMarkersNoHeight(this.openlayers.currentParams);
    let exist_point = markers_params_positions.find(positionArray => _.isEqual(positionArray , markerPosition));
    return !_.isEmpty(exist_point);
  }

  addIcon(marker){
    let iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform(marker.position, 'EPSG:4326', 'EPSG:3857'))
    });
    let vectorSource = new ol.source.Vector(<any>{
      features: [iconFeature]
    });
    let iconStyle = new ol.style.Style(<any>{
      image: new ol.style.Icon(<any>{
        anchor: [0, 0],
        src: this.openlayers.positionFormService.getMarkerUrlByColor(marker.color)
      }),
    });
    let vectorLayer = new ol.layer.Vector(<any>{
      source: vectorSource,
      style: iconStyle
    });
    vectorLayer.setZIndex(200);
    this.openlayers.map.addLayer(vectorLayer);
  }

}
