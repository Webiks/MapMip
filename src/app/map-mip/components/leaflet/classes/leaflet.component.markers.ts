import { LeafletComponent } from '../leaflet.component';
import { Params } from '@angular/router';
import * as _ from 'lodash';
import { SafeStyle } from '@angular/platform-browser';
import * as L from 'leaflet';
import { config } from '../../../../../config/config';
import { MapMipMarker } from '../../../services/query-params-helper.service';
import { MARKER_COLORS } from '../../../position-form/position-form.service';

export class LeafletMarkers {
  public queryParamsSubscriber;

  constructor(private leaflet: LeafletComponent) {
    this.queryParamsSubscriber = leaflet.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    leaflet.positionFormService.markerPickerEmitter.subscribe(this.toggleMarkerPicker.bind(this));
    if (leaflet.positionFormService.onPicked) {
      this.toggleMarkerPicker.bind(this)(true);
    }
  }

  queryParams(params: Params) {
    let params_changes: boolean = this.leaflet.queryParamsHelperService.anyMarkersParamsChanges(this.leaflet.prevParams, this.leaflet.currentParams);
    let map_changes: boolean = this.anyMarkersMapChanges(params);

    if (params_changes && map_changes) {
      this.setMarkersChanges(params);
    }
  }

  destroy() {
    this.queryParamsSubscriber.unsubscribe();
  }

  getCursorStyle(): void | SafeStyle {
    if (this.leaflet.positionFormService.onPicked) {
      return this.leaflet.positionFormService.getMarkerCursorStyle();
    }
  }

  toggleMarkerPicker(checked: boolean) {
    if (checked) {
      this.leaflet.map.on('click', this.leftClickInputAction.bind(this));
    } else {
      this.leaflet.map.off('click');
    }
  }

  leftClickInputAction(event: { layerPoint: L.Point }) {
    let fix_latlng: L.LatLng = this.leaflet.map.layerPointToLatLng(event.layerPoint);
    let position: [number, number] = [fix_latlng.lng, fix_latlng.lat];
    let icon: string = this.leaflet.positionFormService.getSelectedColor();
    let label: string = this.leaflet.positionFormService.markerLabel;
    this.leaflet.queryParamsHelperService.addMarker({ position, icon, label });
  }

  anyMarkersMapChanges(params: Params): boolean {
    let queryMarkersPositions: Array<any> = this.leaflet.queryParamsHelperService.queryMarkersNoHeight(params);
    let mapMarkerPositions: Array<any> = this.getMarkersPosition();
    queryMarkersPositions.forEach(Pmarker => {
      Pmarker.icon = Pmarker.icon || config.defaultMarker.icon;
      Pmarker.label = Pmarker.icon || config.defaultMarker.label;
    });
    return !_.isEqual(mapMarkerPositions, queryMarkersPositions);
  }

  getMarkersPosition(): Array<any> {
    return <Array<any>> this.getMarkerLayersArray().map(this.parseLayerToMarker.bind(this));
  }

  parseLayerToMarker(layer: L.Marker): MapMipMarker {
    const latlng = layer.getLatLng();
    const position = [+latlng.lng.toFixed(7), +latlng.lat.toFixed(7)];
    const icon = this.leaflet.positionFormService.getMarkerColorByUrl(layer['_icon'].src) || config.defaultMarker.icon;
    const labelSpan = layer.getElement().querySelector('.my-div-span');
    const label = (labelSpan && labelSpan.textContent) || config.defaultMarker.label;
    return { position, icon, label };

  }

  setMarkersChanges(params: Params): void {
    let paramsMarkers: Array<any> = this.leaflet.queryParamsHelperService.queryMarkersNoHeight(params);
    let mapMarkers: Array<any> = this.getMarkersPosition();

    this.addMarkersViaUrl(paramsMarkers, mapMarkers);
    this.removeMarkersViaUrl(paramsMarkers, mapMarkers);
  }

  addMarkersViaUrl(paramsMarkers, mapMarkers) {
    paramsMarkers
      .filter((marker) => !this.isMarkerExistOnArray(mapMarkers, marker))
      .map(this.getBaseMarker.bind(this))
      .forEach(marker => marker.addTo(this.leaflet.map));
  }

  removeMarkersViaUrl(paramsMarkers, mapMarkers: MapMipMarker[]) {
    mapMarkers
      .filter((marker) => !this.isMarkerExistOnArray(paramsMarkers, marker))
      .map<any>(this.getMarkerViaMarkerObj.bind(this))
      .forEach(this.leaflet.map.removeLayer.bind(this.leaflet.map));
  }

  getBaseMarker(marker: MapMipMarker): L.Marker {
    const baseMarker = MARKER_COLORS.find(({ icon }) => icon === marker.icon);
    const icon = new L.DivIcon({
      className: 'my-div-icon',
      html: this.getIconHtml(marker),
      iconSize: [baseMarker.width, baseMarker.height],
      iconAnchor: [0, 0]
    });
    return L.marker([marker.position[1], marker.position[0]], { icon });
  }

  getIconHtml(marker) {
    const img = `<img class="my-div-image" src="${this.leaflet.positionFormService.getMarkerUrlByColor(marker.icon)}"/>`;
    const label = marker.label ? `<span class="my-div-span">${marker.label}</span>` : '';
    return img + label;
  }

  getMarkerViaMarkerObj(markerObj: MapMipMarker) {
    return this.getMarkerLayersArray().find((layer: L.Marker) => {
      const marker = this.parseLayerToMarker(layer);
      return _.isEqual(markerObj, marker);
    });
  }

  getMarkerLayersArray(): Array<L.Marker> {  // addition: exclude geojson
    return <Array<L.Marker>> _.filter(this.leaflet.map['_layers'], (l) => l['getLatLng'] && !l.hasOwnProperty('feature') && !l.hasOwnProperty('_closeButton'));

  }

  isMarkerExistOnArray(markers, marker) {
    return markers.some(_marker => _.isEqual(_marker, marker));
  }

}
