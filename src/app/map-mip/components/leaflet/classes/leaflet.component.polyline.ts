/**
 * Created by USSeR on 6/25/2017.
 */
/**
 * Created by USSeR on 5/23/2017.
 */
import {Params} from "@angular/router";
import {LeafletComponent} from "../leaflet.component";
import * as _ from 'lodash';
import {QueryParamsHelperService} from "../../../services/query-params-helper.service";
import '../../../../../../node_modules/leaflet-draw/dist/leaflet.draw'
export class LeafletPolyline {
  public queryParamsSubscriber;
  public polylineCoords:Array<any> =[];
  public polylinesId:Array<number>=[]
  constructor(private leaflet: LeafletComponent,private queryParamsHelperService: QueryParamsHelperService) {

    this.queryParamsSubscriber = leaflet.activatedRoute.queryParams
      .filter((params:Params) => this.leaflet.queryParamsHelperService.anyPolylineChange(this.leaflet.prevParams, this.leaflet.currentParams))
      .subscribe(this.setPolylineChanges.bind(this));

    leaflet.positionFormService.polylinePickerEmitter.subscribe(this.togglePolylinePicker.bind(this));
  //  if(leaflet.positionFormService.onPolylinePicked) this.togglePolylinePicker.bind(this)(true);
  }
  destroy() {
    this.queryParamsSubscriber.unsubscribe();
    this.leaflet.positionFormService.polylinePickerEmitter.unsubscribe();
  }


  setPolylineChanges(params) {
    let params_polyline_array: Array<Object> = this.leaflet.queryParamsHelperService.queryPolyline(params);
    this.addPolylineViaUrl(params_polyline_array);
  }

  addPolylineViaUrl(params_polyline_array: any[]) {

    let polylinesOnMap = _.filter(this.leaflet.map['_layers'], (l) => l['_latlngs'] && !l.hasOwnProperty("feature")&& !l.hasOwnProperty("_icon")
    && (l as any).toGeoJSON().geometry.type=='LineString');


    polylinesOnMap.forEach(polyline_obj => {
      polyline_obj['remove']();
    })

    params_polyline_array.forEach(polyline_obj => {
      let coords = [];
      for (let i = 0; i < polyline_obj.coords.length; i += 2) {
        coords.push([polyline_obj.coords[i + 1], polyline_obj.coords[i]])
      }
      if (!this.polygonsExistOnMap(coords)) {
        L.polyline(
          coords,{
          color: polyline_obj.color
        }).addTo(this.leaflet.map);
      }
    });
  }

  polygonsExistOnMap(coords: L.LatLng[]): boolean {
    const polylinesOnMap = _.filter(this.leaflet.map['_layers'], (l) => l['_latlngs'] && !l.hasOwnProperty("feature")&& !l.hasOwnProperty("_icon")
    && (l as any).toGeoJSON().geometry.type=='LineString');
    let real_coord= [];
    const exist_polyline = polylinesOnMap.find((polyline: L.Polyline) => {
        polyline.getLatLngs().forEach(obj=> {real_coord.push([obj.lng,obj.lat])});
    //  const real_coord: L.LatLng[] = (polyline.getLatLngs()[0] as any).map(o => [o.lat, o.lng]);
      return _.isEqual(real_coord, coords);
    });
    return !_.isNil(exist_polyline);
  }

  togglePolylinePicker(){
    let that = this;
    var polylineDrawer = new this.leaflet.L.Draw["Polyline"](this.leaflet.map);
    polylineDrawer.enable();

    this.leaflet.map.on('draw:created', function (e) {
      let coords = [];
      var type = e['layerType'],
        layer = e['layer'];
      let color = that.leaflet.positionFormService.selectedPolylineColor;
      layer.options.color= color;
      // layer.addTo(that.leaflet.map);
      that.polylinesId.push(e.target._leaflet_id);
      that.polylineCoords.push(layer['_latlngs'])
      _.forEach(layer['_latlngs'],function(point){
        coords.push(point.lng)
        coords.push(point.lat)
        });
      that.queryParamsHelperService.addPolyline({coords,color});
      that.leaflet.map.off('draw:created');
      polylineDrawer.disable();
    });


  }





}
