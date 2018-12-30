import { OpenlayersComponent } from '../openlayers.component';
import { Params } from '@angular/router';
import * as _ from 'lodash';
import * as ol from 'openlayers';
import { SafeStyle } from '@angular/platform-browser';
import { config } from '../../../../../config/config';
import { MapMipMarker } from '../../../services/query-params-helper.service';

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
    const fix_coordinate: ol.Coordinate = this.openlayers.map.getCoordinateFromPixel(event.pixel);
    const position: ol.Coordinate = ol.proj.toLonLat(fix_coordinate);
    const icon: string = this.openlayers.positionFormService.getSelectedColor();
    const label: string = this.openlayers.positionFormService.markerLabel || config.defaultMarker.label;

    this.openlayers.queryParamsHelperService.addMarker({ position, icon, label });
  }

  anyMarkersMapChanges(params: Params): boolean {
    let queryMarkersPositions: Array<any> = this.openlayers.queryParamsHelperService.queryMarkersNoHeight(params);
    let mapMarkerPositions: Array<any> = this.getMarkersPosition();
    queryMarkersPositions.forEach(Pmarker => {
      Pmarker.icon = Pmarker.icon || config.defaultMarker.icon;
      Pmarker.label = Pmarker.label || config.defaultMarker.label;
    });
    return !_.isEqual(mapMarkerPositions, queryMarkersPositions);
  }

  getMarkersPosition(): Array<any> {
    return this.vectorSource.getFeatures().map(this.parseFeatureToMarker.bind(this));
  }

  setMarkersChanges(params: Params): void {
    let paramsMarkers: Array<any> = this.openlayers.queryParamsHelperService.queryMarkersNoHeight(params);
    const mapMarkers: Array<any> = this.getMarkersPosition();

    this.addMarkersViaUrl(paramsMarkers, mapMarkers);
    this.removeMarkersViaUrl(paramsMarkers, mapMarkers);
  }

  addMarkersViaUrl(paramsMarkers, mapMarkers) {
    paramsMarkers
      .filter((marker) => !this.isMarkerExistOnArray(mapMarkers, marker))
      .forEach(this.addIcon.bind(this));
  }

  removeMarkersViaUrl(paramsMarkers, mapMarkers: MapMipMarker[]) {
    mapMarkers
      .filter((marker) => !this.isMarkerExistOnArray(paramsMarkers, marker))
      .forEach(this.removeMarker.bind((this)));
  }

  isMarkerExistOnArray(markers, marker) {
    return markers.some(_marker => _.isEqual(_marker, marker));
  }


  addIcon(marker: MapMipMarker) {

    const iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform(<[number, number]>marker.position, 'EPSG:4326', 'EPSG:3857'))
    });

    iconFeature.setStyle(new ol.style.Style(<any>{
      image: new ol.style.Icon(<any>{
        anchor: [0, 0],
        src: this.openlayers.positionFormService.getMarkerUrlByColor(marker.icon)
      }),

      text: new ol.style.Text({
        text: marker.label,
        font: '30px sans-serif',
        textAlign: 'left',
        textBaseline: 'bottom',
        backgroundFill: new ol.style.Fill({
          color: 'rgba(47, 47, 47, 0.78)'
        }),
        fill: new ol.style.Fill({
          color: 'white'
        }),
        stroke: new ol.style.Stroke({
          color: 'black',
          width: 3
        })
      })
    }));

    this.vectorSource.addFeature(iconFeature);
  }

  parseFeatureToMarker(feature: ol.Feature): MapMipMarker {
    const featureStyle: any = feature.getStyle();
    const src = featureStyle.getImage().getSrc();
    const label = featureStyle.getText().getText();
    let position = (feature.getGeometry() as any).getCoordinates();
    position = ol.proj.transform(position, 'EPSG:3857', 'EPSG:4326');
    position = this.openlayers.calcService.toFixes7Obj(position);
    const icon: string = this.openlayers.positionFormService.getMarkerColorByUrl(src);
    return { position, icon, label };
  }

  removeMarker(mapMarker: MapMipMarker): void {
    const marker_feature_to_remove = this.vectorSource.getFeatures()
      .find((feature: ol.Feature) => {
        const marker = this.parseFeatureToMarker(feature);
        return _.isEqual(mapMarker, marker);
      });
    this.vectorSource.removeFeature(marker_feature_to_remove);
  }

}
