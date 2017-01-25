import {LeafletComponent} from "./leaflet.component";
import {Params} from "@angular/router";
import * as _ from 'lodash'

export class LeafletMarkers {

  constructor(private leaflet:LeafletComponent){}


  toggleMarkerPicker(checked:boolean){
    if(checked){
      this.leaflet.map.on("click", this.leftClickInputAction.bind(this));
    } else {
      this.leaflet.map.off("click");
    }
  }

  leftClickInputAction(event:{latlng: L.LatLng}) {
    let marker_position: [number, number] = [event.latlng.lng, event.latlng.lat];
    this.leaflet.queryParamsHelperService.addMarker(marker_position);
  }

  anyMarkersMapChanges(params:Params): boolean{
    let queryMarkersPositions:Array<[number, number]> = this.leaflet.queryParamsHelperService.queryMarkersNoHeight(params);
    let mapMarkerPositions:Array<[number, number]> = this.getMarkersPosition();
    return !_.isEqual(mapMarkerPositions, queryMarkersPositions);
  }

  getMarkersPosition():Array<[number, number]> {
    return <Array<[number, number]>> this.getMarkerLayersArray().map((layer:L.Marker) => {
      let latlng = layer.getLatLng();
      return [+latlng.lng.toFixed(7), +latlng.lat.toFixed(7)];
    });
  }

  setMarkersChanges(params:Params):void {
    let params_markers_position:Array<[number, number]> = this.leaflet.queryParamsHelperService.queryMarkersNoHeight(params);
    let map_markers_positions:Array<[number, number]> = this.getMarkersPosition();

    this.addMarkersViaUrl(params_markers_position);
    this.removeMarkersViaUrl(map_markers_positions);
  }

  addMarkersViaUrl(params_markers_position:Array<[number, number]>) {
    params_markers_position.forEach( marker => {
      if(!this.markerExistOnMap(marker)) {
        this.getBaseMarker(marker).addTo(this.leaflet.map);
      }
    });
  }

  removeMarkersViaUrl(map_markers_positions:Array<[number, number]>) {
    map_markers_positions.forEach((markerPos) => {
      if(!this.markerExistOnParams(markerPos)) {
        let marker_to_remove:L.Marker = this.getMarkerViaPosition(markerPos);
        this.leaflet.map.removeLayer(marker_to_remove)
      }
    })
  }

  getBaseMarker(marker:[number, number]){
    let icon = L.icon(<L.IconOptions>{
      iconUrl: '/assets/Leaflet/images/marker-icon.png',
      shadowUrl: '/assets/Leaflet/images/marker-shadow.png',
    });
    return L.marker([marker[1],marker[0]], {icon:icon});

  }



  getMarkerViaPosition(markerPos) {
    return this.getMarkerLayersArray().find(
      (layer:L.Marker) => {
        let currentM = [layer.getLatLng().lng, layer.getLatLng().lat];
        return _.isEqual(currentM, markerPos);
      });
  }

  getMarkerLayersArray():Array<L.Marker>{
    let m_layers = [];
    this.leaflet.map.eachLayer((l:L.Marker) => {
      if(l.getLatLng) m_layers.push(l);
    });
    return m_layers;
  }

  markerExistOnMap(markerPosition) {
    let markers_map_positions:Array<[number, number]> = this.getMarkersPosition();
    let exist_point = markers_map_positions.find(positionArray => _.isEqual(positionArray,markerPosition));
    return !_.isEmpty(exist_point);
  }

  markerExistOnParams(markerPosition) {
    let markers_params_positions = this.leaflet.queryParamsHelperService.queryMarkersNoHeight(this.leaflet.currentParams);
    let exist_point = markers_params_positions.find(positionArray => _.isEqual(positionArray,markerPosition));
    return !_.isEmpty(exist_point);
  }

}
