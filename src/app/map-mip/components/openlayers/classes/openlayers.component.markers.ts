import { OpenlayersComponent } from '../openlayers.component';
import { Params } from '@angular/router';
import * as _ from 'lodash';
import * as ol from 'openlayers';
import { SafeStyle } from '@angular/platform-browser';
import { config } from '../../../../../config/config';

export class OpenlayersMarkers {

  public leftClickHandler;
  public queryParamsSubscriber;
  private vectorSource: ol.source.Vector;
  private vectorLayer: ol.layer.Vector;

  constructor(private openlayers: OpenlayersComponent) {
    this.addMarkerLayer();
    this.queryParamsSubscriber = openlayers.activatedRoute.queryParams
      .filter((params: Params) => this.openlayers.queryParamsHelperService.anyMarkersParamsChanges(this.openlayers.prevParams, params))
      .subscribe(this.setMarkersChanges.bind(this));

    openlayers.positionFormService.markerPickerEmitter.subscribe(this.toggleMarkerPicker.bind(this));
    if (openlayers.positionFormService.onPicked) {
      this.toggleMarkerPicker.bind(this)(true);
    }
  }

  addMarkerLayer() {
    this.vectorSource = new ol.source.Vector(<any>{});
    this.vectorLayer = new ol.layer.Vector(<any>{
      source: this.vectorSource
    });
    this.vectorLayer.setZIndex(200);
    this.openlayers.map.addLayer(this.vectorLayer);
  }

  destroy() {
    this.queryParamsSubscriber.unsubscribe();
  }

  getCursorStyle(): void | SafeStyle {
    if (this.openlayers.positionFormService.onPicked) {
      return this.openlayers.positionFormService.getMarkerCursorStyle();
    }
  }

  toggleMarkerPicker(checked: boolean) {
    if (checked) {
      this.leftClickHandler = this.openlayers.map.on('click', this.leftClickInputAction.bind(this));
    } else {
      ol.Observable.unByKey(this.leftClickHandler);
    }
  }

  leftClickInputAction(event: { pixel: ol.Pixel }) {
    let fix_pixel: ol.Pixel;
    if (this.openlayers.positionFormService.getSelectedMarkerWidth() === 60) {
      fix_pixel = [event.pixel[0] + 3.5 + this.openlayers.positionFormService.getSelectedMarkerWidth() / 2,
        event.pixel[1] + this.openlayers.positionFormService.getSelectedMarkerHeight()];
    } else {
      fix_pixel = [event.pixel[0] + this.openlayers.positionFormService.getSelectedMarkerWidth() / 2,
        event.pixel[1] + this.openlayers.positionFormService.getSelectedMarkerHeight()];
    }
    let fix_coordinate: ol.Coordinate = this.openlayers.map.getCoordinateFromPixel(fix_pixel);
    let position: ol.Coordinate = ol.proj.toLonLat(fix_coordinate);
    let color: string = this.openlayers.positionFormService.getSelectedColor();
    this.openlayers.queryParamsHelperService.addMarker({ position, color });
  }

  anyMarkersMapChanges(params: Params): boolean {
    let queryMarkersPositions: Array<any> = this.openlayers.queryParamsHelperService.queryMarkersNoHeight(params);
    let mapMarkerPositions: Array<any> = this.getMarkersPosition();
    queryMarkersPositions.forEach(Pmarker => {
      Pmarker.color = Pmarker.color || config.defaultMarker.color;
    });
    return !_.isEqual(mapMarkerPositions, queryMarkersPositions);
  }

  getMarkersPosition(): Array<any> {
    return this.vectorSource.getFeatures().map((feature: ol.Feature) => {
      let position = (feature.getGeometry() as any).getCoordinates();
      position = ol.proj.transform(position, 'EPSG:3857', 'EPSG:4326');
      position = this.openlayers.calcService.toFixes7Obj(position);
      const color: string = this.openlayers.positionFormService.getMarkerColorByUrl((feature.getStyle() as any).getImage().getSrc());
      return { position, color };
    });
  }

  setMarkersChanges(params: Params): void {
    let params_markers_positions: Array<any> = this.openlayers.queryParamsHelperService.queryMarkersNoHeight(params);
    let map_markers_positions: Array<any> = this.getMarkersPosition();

    this.addMarkersViaUrl(params_markers_positions, map_markers_positions);
    this.removeMarkersViaUrl(params_markers_positions, map_markers_positions);
  }

  addMarkersViaUrl(params_markers_positions, map_markers_positions) {
    params_markers_positions.forEach(marker => {
      if (!this.markerExistOnMap(map_markers_positions, marker)) {
        this.addIcon(marker);
      }
    });
  }

  removeMarkersViaUrl(params_markers_positions, map_markers_positions) {
    map_markers_positions.forEach((mapMarker) => {
      if (!this.markerExistOnParams(params_markers_positions, mapMarker)) {
        this.removeIcon(mapMarker);
      }
    });
  }

  markerExistOnMap(markers_map_positions, paramMarker) {
    paramMarker.color = paramMarker.color || config.defaultMarker.color;
    let exist_point = markers_map_positions.find(positionArray => _.isEqual(positionArray, paramMarker));
    return !_.isEmpty(exist_point);
  }

  markerExistOnParams(params_markers_position, mapMarker) {
    let exist_point = params_markers_position.find(paramMarker => {
      paramMarker.color = paramMarker.color || config.defaultMarker.color;
      return _.isEqual(paramMarker, mapMarker);
    });
    return !_.isEmpty(exist_point);
  }


  addIcon(marker) {

    const iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform(marker.position, 'EPSG:4326', 'EPSG:3857'))
    });

    iconFeature.setStyle(new ol.style.Style(<any>{
      image: new ol.style.Icon(<any>{
        anchor: [0.5, 1],
        src: this.openlayers.positionFormService.getMarkerUrlByColor(marker.color)
      })
    }));

    this.vectorSource.addFeature(iconFeature);
  }

  removeIcon(mapMarker): void {
    const marker_feature_to_remove = this.vectorSource.getFeatures().find((feature: ol.Feature) => {
      let position = (feature.getGeometry() as any).getCoordinates();
      position = ol.proj.transform(position, 'EPSG:3857', 'EPSG:4326');
      position = this.openlayers.calcService.toFixes7Obj(position);
      const color: string = this.openlayers.positionFormService.getMarkerColorByUrl((feature.getStyle() as any).getImage().getSrc());
      return _.isEqual(position, mapMarker.position) && _.isEqual(color, mapMarker.color);
    });
    this.vectorSource.removeFeature(marker_feature_to_remove);
  }

}
