import {OpenlayersComponent} from "../openlayers.component";
import {Params} from "@angular/router";
import * as _ from 'lodash';
import * as ol from "openlayers";
import {SafeStyle} from "@angular/platform-browser";

export class OpenlayersMarkers {

  public leftClickHandler;
  public queryParamsSubscriber;

  constructor(private openlayers:OpenlayersComponent){

    this.queryParamsSubscriber = openlayers.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    openlayers.positionFormService.markerPickerEmitter.subscribe(this.toggleMarkerPicker.bind(this));
    if(openlayers.positionFormService.onPicked) this.toggleMarkerPicker.bind(this)(true);

  }


  queryParams(params:Params):void {
    let params_changes:boolean = this.openlayers.queryParamsHelperService.anyMarkersParamsChanges(this.openlayers.prevParams, params);
    let map_changes:boolean = this.anyMarkersMapChanges(params);
    if(params_changes && map_changes) {
      this.setMarkersChanges(params);
    }
  }

  destroy() {
    this.queryParamsSubscriber.unsubscribe();
  }

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

  leftClickInputAction(event:{pixel:ol.Pixel}) {
    let fix_pixel: ol.Pixel;
    if(this.openlayers.positionFormService.getSelectedMarkerWidth()==60) {
      fix_pixel= [event.pixel[0] + 3.5 + this.openlayers.positionFormService.getSelectedMarkerWidth() / 2,
        event.pixel[1] + this.openlayers.positionFormService.getSelectedMarkerHeight()];
    }
    else{
      fix_pixel= [event.pixel[0]  + this.openlayers.positionFormService.getSelectedMarkerWidth() / 2,
        event.pixel[1] + this.openlayers.positionFormService.getSelectedMarkerHeight()];
    }
    let fix_coordinate:ol.Coordinate = this.openlayers.map.getCoordinateFromPixel(fix_pixel);
    let position:ol.Coordinate = ol.proj.toLonLat(fix_coordinate);
    let color:string = this.openlayers.positionFormService.getSelectedColor();
    this.openlayers.queryParamsHelperService.addMarker({position, color});
  }

  anyMarkersMapChanges(params:Params):boolean {
    let queryMarkersPositions:Array<any> = this.openlayers.queryParamsHelperService.queryMarkersNoHeight(params);
    let mapMarkerPositions:Array<any> = this.getMarkersPosition();
    queryMarkersPositions.forEach(Pmarker => {Pmarker.color = Pmarker.color ? Pmarker.color : "blue"});
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

    this.addMarkersViaUrl(params_markers_positions, map_markers_positions);
    this.removeMarkersViaUrl(params_markers_positions, map_markers_positions);
  }

  addMarkersViaUrl(params_markers_positions, map_markers_positions) {
    params_markers_positions.forEach( marker => {
      if(!this.markerExistOnMap(map_markers_positions, marker)) {
        this.addIcon(marker);
      }
    });
  }

  removeMarkersViaUrl(params_markers_positions, map_markers_positions) {
    map_markers_positions.forEach((mapMarker) => {
      if(!this.markerExistOnParams(params_markers_positions, mapMarker)) {
        this.removeIcon(mapMarker);
      }
    })
  }

  markerExistOnMap(markers_map_positions, paramMarker) {
    paramMarker.color = paramMarker.color ? paramMarker.color : "blue";
    let exist_point = markers_map_positions.find(positionArray => _.isEqual(positionArray, paramMarker));
    return !_.isEmpty(exist_point);
  }

  markerExistOnParams(params_markers_position, mapMarker) {
    let exist_point = params_markers_position.find(paramMarker => {
      paramMarker.color = paramMarker.color ? paramMarker.color : "blue";
      return _.isEqual(paramMarker, mapMarker)
    });
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
        anchor: [0.5, 1],
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

  removeIcon(mapMarker):void{
    let marker_to_remove = this.openlayers.LayersArray.find(
      layer => {
        let geom;
        if (layer.getSource().getFeatures) geom = layer.getSource().getFeatures()[0].getGeometry();
        if (!(geom instanceof ol.geom.Point)) return false;
        let position = layer.getSource().getFeatures()[0].getGeometry()['getCoordinates']();
        position = ol.proj.transform(position, 'EPSG:3857', 'EPSG:4326');
        position = this.openlayers.calcService.toFixes7Obj(position);
        let color:string = this.openlayers.positionFormService.getMarkerColorByUrl(layer.getStyle().getImage().getSrc());
        return _.isEqual(position, mapMarker.position) && _.isEqual(color, mapMarker.color);
      });
    this.openlayers.map.removeLayer(marker_to_remove)
  }

}
