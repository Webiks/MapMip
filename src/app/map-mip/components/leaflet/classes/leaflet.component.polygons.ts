/**
 * Created by USSeR on 5/23/2017.
 */
import { Params } from '@angular/router';
import { LeafletComponent } from '../leaflet.component';
import * as _ from 'lodash';
import { QueryParamsHelperService } from '../../../services/query-params-helper.service';
import 'leaflet-draw/dist/leaflet.draw';
import * as L from 'leaflet';

export class LeafletPolygons {
  public queryParamsSubscriber;
  public polygonsCoords: Array<any> = [];

  constructor(private leaflet: LeafletComponent, private queryParamsHelperService: QueryParamsHelperService) {
    this.queryParamsSubscriber = leaflet.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    leaflet.positionFormService.polygonPickerEmitter.subscribe(this.togglePolygonPicker.bind(this));
    if (leaflet.positionFormService.onPolygonPicked) {
      this.togglePolygonPicker.bind(this)(true);
    }

    //   if (leaflet.activatedRoute.queryParams['polygons'].isDefined()){
    // //    this.queryParams(leaflet.queryParams['polygons']);
    //   }

    // if (this.leaflet.router['rawUrlTree'].queryParams.polygons) { //from ol3
    //   this.queryParams(this.leaflet.router['rawUrlTree'].queryParams.polygons)
    // }
  }

  destroy() {
    this.queryParamsSubscriber.unsubscribe();
  }

  queryParams(params: Params) {
    if (this.leaflet.queryParamsHelperService.anyPolygonsChange(this.leaflet.prevParams, this.leaflet.currentParams)) {
      this.setPolygonsChanges(params);
    }
  }

  setPolygonsChanges(params) {
    let params_polygons_array: Array<Object> = this.leaflet.queryParamsHelperService.queryPolygons(params);
    // let map_polygons_array:Array<Object> = this.getTileLayersArray();
    this.addPolygonsViaUrl(params_polygons_array);
    // this.removePolygonsViaUrl(map_tile_layers_array);
  }

  addPolygonsViaUrl(params_polygons_array: any[]) {

    let polygonsOnMap = _.filter(this.leaflet.map['_layers'], (l) => l['_latlngs'] && !l.hasOwnProperty('feature') && !l.hasOwnProperty('_icon'));

    polygonsOnMap.forEach(polygon_obj => {
      polygon_obj['remove']();
    });

    params_polygons_array.forEach(polygon_obj => {
      let coords = [];
      for (let i = 0; i < polygon_obj.coords.length; i += 2) {
        coords.push([polygon_obj.coords[i + 1], polygon_obj.coords[i]]);
      }
      if (!this.polygonsExistOnMap(coords)) {
        L.polygon(
          coords
        ).addTo(this.leaflet.map);
      }
    });
  }

  polygonsExistOnMap(coords: L.LatLng[]): boolean {
    const polygonsOnMap = _.filter(this.leaflet.map['_layers'], (l) => l['_latlngs'] && !l.hasOwnProperty('feature') && !l.hasOwnProperty('_icon'));
    const exist_polygon = polygonsOnMap.find((polygon: L.Polygon) => {
      const real_coord: L.LatLng[] = (polygon.getLatLngs()[0] as any).map(o => [o.lat, o.lng]);
      return _.isEqual(real_coord, coords);
    });
    return !_.isNil(exist_polygon);

    //    for(let i=0;i<polygonsOnMap.length;i++){
    //      for (let j =0; j<polygonsOnMap[i][0]['_latlngs'][0].length;j++){
    //        if(polygonsOnMap[0]['_latlngs'][0][j].lng !== coords[j] ||
    //          polygonsOnMap[0]['_latlngs'][0][j].lat !== coords[j+1]) {
    //          //one of the coordinates are not exist so exist the function and draw it
    //          return false;
    //        }
    //
    //      }
    //
    //    }
    //    // no mismatch so polygon is on map already
    //   return true;
    // no polygons at map return false and draw
  }

  togglePolygonPicker() {
    let that = this;
    const polygonDrawer = new this.leaflet.L.Draw['Polygon'](this.leaflet.map);
    polygonDrawer.enable();

    this.leaflet.map.on('draw:created', function (e) {
      let str = '';
      const poly_arr = [];
      const type = e['layerType'],
        layer = e['layer'];
      layer.addTo(that.leaflet.map);
      that.polygonsCoords.push(layer['_latlngs']);
      _.forEach(layer['_latlngs'], function (point) {
        _.forEach(point, function (p: any) {
          poly_arr.push(p.lng);
          poly_arr.push(p.lat);
        });
        str = str.substring(0, str.length - 1);
        that.queryParamsHelperService.addPolygon(poly_arr);

      });
      that.leaflet.map.off('draw:created');
      polygonDrawer.disable();
    });


  }


}
