import {LeafletComponent} from "./leaflet.component";
import {Params} from "@angular/router";
import * as _ from 'lodash'
import {SafeStyle} from "@angular/platform-browser";

export class LeafletMarkers {

  constructor(private leaflet:LeafletComponent){}

  getCursorStyle(): void | SafeStyle {
    if(this.leaflet.positionFormService.onPicked) {
      return this.leaflet.positionFormService.getMarkerCursorStyle();
    }
  }

  toggleMarkerPicker(checked:boolean){
    if(checked){
      this.leaflet.map.on("click", this.leftClickInputAction.bind(this));
    } else {
      this.leaflet.map.off("click");
    }
  }

  leftClickInputAction(event:{latlng: L.LatLng}) {
    let position: [number,number] = [event.latlng.lng, event.latlng.lat];
    let color:string = this.leaflet.positionFormService.getSelectedColor();
    this.leaflet.queryParamsHelperService.addMarker({position, color});
  }

  anyMarkersMapChanges(params:Params): boolean{
    let queryMarkersPositions:Array<any> = this.leaflet.queryParamsHelperService.queryMarkersNoHeight(params);
    let mapMarkerPositions:Array<any> = this.getMarkersPosition();
    return !_.isEqual(mapMarkerPositions, queryMarkersPositions);
  }

  getMarkersPosition():Array<any> {
    return <Array<any>> this.getMarkerLayersArray().map((layer:L.Marker) => {
      let latlng = layer.getLatLng();
      let position = [+latlng.lng.toFixed(7), +latlng.lat.toFixed(7)];
      let color = this.leaflet.positionFormService.getMarkerColorByUrl(layer['_icon'].src);
      return {position, color};
    });
  }

  setMarkersChanges(params:Params):void {
    let params_markers_position:Array<any> = this.leaflet.queryParamsHelperService.queryMarkersNoHeight(params);
    let map_markers_positions:Array<any> = this.getMarkersPosition();

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

  removeMarkersViaUrl(map_markers_positions:Array<any>) {
    map_markers_positions.forEach(markerObj => {
      if(!this.markerExistOnParams(markerObj)) {
        let marker_to_remove:L.Marker = this.getMarkerViaMarkerObj(markerObj);
        this.leaflet.map.removeLayer(marker_to_remove)
      }
    })
  }

  getBaseMarker(marker){
    let icon = L.icon(<L.IconOptions>{
      iconUrl: this.leaflet.positionFormService.getMarkerUrlByColor(marker.color),
      shadowUrl: '/assets/Leaflet/images/marker-shadow.png',
    });
    return L.marker([marker.position[1],marker.position[0]], {icon:icon});

  }



  getMarkerViaMarkerObj(markerObj) {
    return this.getMarkerLayersArray().find(
      (layer:L.Marker) => {
        let position = [layer.getLatLng().lng, layer.getLatLng().lat];
        let color = this.leaflet.positionFormService.getMarkerColorByUrl(layer["_icon"].src);
        return _.isEqual(markerObj, {position,color});
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
    let markers_map_positions:Array<any> = this.getMarkersPosition();
    let exist_point = markers_map_positions.find(positionArray => _.isEqual(positionArray,markerPosition));
    return !_.isEmpty(exist_point);
  }

  markerExistOnParams(markerPosition) {
    let markers_params_positions = this.leaflet.queryParamsHelperService.queryMarkersNoHeight(this.leaflet.currentParams);
    let exist_point = markers_params_positions.find(positionArray => _.isEqual(positionArray,markerPosition));
    return !_.isEmpty(exist_point);
  }

}
