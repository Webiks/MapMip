import { LeafletComponent } from '../leaflet.component';
import { Params } from '@angular/router';
import * as _ from 'lodash';
import { SafeStyle } from '@angular/platform-browser';
import * as L from 'leaflet';

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
    let fix_point: L.Point = L.point(event.layerPoint.x + this.leaflet.positionFormService.getSelectedMarkerWidth() / 2, event.layerPoint.y + this.leaflet.positionFormService.getSelectedMarkerHeight());
    let fix_latlng: L.LatLng = this.leaflet.map.layerPointToLatLng(fix_point);
    let position: [number, number] = [fix_latlng.lng, fix_latlng.lat];
    let color: string = this.leaflet.positionFormService.getSelectedColor();
    this.leaflet.queryParamsHelperService.addMarker({ position, color });
  }

  anyMarkersMapChanges(params: Params): boolean {
    let queryMarkersPositions: Array<any> = this.leaflet.queryParamsHelperService.queryMarkersNoHeight(params);
    let mapMarkerPositions: Array<any> = this.getMarkersPosition();
    queryMarkersPositions.forEach(Pmarker => {
      Pmarker.color = Pmarker.color ? Pmarker.color : 'blue';
    });
    return !_.isEqual(mapMarkerPositions, queryMarkersPositions);
  }

  getMarkersPosition(): Array<any> {
    return <Array<any>> this.getMarkerLayersArray().map((layer: L.Marker) => {
      let latlng = layer.getLatLng();
      let position = [+latlng.lng.toFixed(7), +latlng.lat.toFixed(7)];
      let color = this.leaflet.positionFormService.getMarkerColorByUrl(layer['_icon'].src);
      return { position, color };
    });
  }

  setMarkersChanges(params: Params): void {
    let params_markers_position: Array<any> = this.leaflet.queryParamsHelperService.queryMarkersNoHeight(params);
    let map_markers_positions: Array<any> = this.getMarkersPosition();

    this.addMarkersViaUrl(params_markers_position, map_markers_positions);
    this.removeMarkersViaUrl(params_markers_position, map_markers_positions);
  }

  addMarkersViaUrl(params_markers_position, map_markers_positions) {
    params_markers_position.forEach(marker => {
      if (!this.markerExistOnMap(map_markers_positions, marker)) {
        this.getBaseMarker(marker).addTo(this.leaflet.map);
      }
    });
  }

  removeMarkersViaUrl(params_markers_position, map_markers_positions) {
    map_markers_positions.forEach(markerObj => {
      if (!this.markerExistOnParams(params_markers_position, markerObj)) {
        let marker_to_remove: L.Marker = this.getMarkerViaMarkerObj(markerObj);
        this.leaflet.map.removeLayer(marker_to_remove);
      }
    });
  }

  getBaseMarker(marker) {
    let icon = L.icon(<L.IconOptions>{
      iconUrl: this.leaflet.positionFormService.getMarkerUrlByColor(marker.color),
      //shadowUrl: '/assets/Markers/marker-shadow.png',
      iconAnchor: [this.leaflet.positionFormService.getSelectedMarkerWidth() / 2, this.leaflet.positionFormService.getSelectedMarkerHeight()]
    });
    return L.marker([marker.position[1], marker.position[0]], { icon: icon });
  }

  getMarkerViaMarkerObj(markerObj) {
    return this.getMarkerLayersArray().find(
      (layer: L.Marker) => {
        let position = [layer.getLatLng().lng, layer.getLatLng().lat];
        let color = this.leaflet.positionFormService.getMarkerColorByUrl(layer['_icon'].src);
        return _.isEqual(markerObj, { position, color });
      });
  }

  getMarkerLayersArray(): Array<L.Marker> {  // addition: exclude geojson
    return <Array<L.Marker>> _.filter(this.leaflet.map['_layers'], (l) => l['getLatLng'] && !l.hasOwnProperty('feature') && !l.hasOwnProperty('_closeButton'));

  }

  markerExistOnMap(markers_map_positions, paramMarker) {
    paramMarker.color = paramMarker.color ? paramMarker.color : 'blue';
    let exist_point = markers_map_positions.find(mapMarker => _.isEqual(mapMarker, paramMarker));
    return !_.isEmpty(exist_point);
  }

  markerExistOnParams(params_markers_position, mapMarker) {
    let exist_point = params_markers_position.find(paramMarker => {
      paramMarker.color = paramMarker.color ? paramMarker.color : 'blue';
      return _.isEqual(paramMarker, mapMarker);
    });
    return !_.isEmpty(exist_point);
  }

}
