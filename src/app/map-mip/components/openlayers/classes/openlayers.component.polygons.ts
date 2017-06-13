/**
 * Created by USSeR on 5/23/2017.
 */
import {Params} from "@angular/router";
import {OpenlayersComponent} from "../openlayers.component";
import * as _ from 'lodash';
import * as ol from 'openlayers';

import {QueryParamsHelperService} from "../../../services/query-params-helper.service";
import Polygon = ol.geom.Polygon;
export class OpenlayersPolygons {
  public queryParamsSubscriber;
  public draw;
  public vectorSource = new ol.source.Vector({});

  constructor(private openlayers: OpenlayersComponent,private queryParamsHelperService: QueryParamsHelperService) {
    this.queryParamsSubscriber = openlayers.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    openlayers.positionFormService.polygonPickerEmitter.subscribe(this.togglePolygonPicker.bind(this));
    if(openlayers.positionFormService.onPolygonPicked) this.togglePolygonPicker.bind(this)(true);
    this.openlayers.map.addLayer(new ol.layer.Vector({
      source: this.vectorSource
    }));
  }
  destroy() {
    this.queryParamsSubscriber.unsubscribe();
  }
  queryParams(params:Params){
    if(this.openlayers.queryParamsHelperService.anyPolygonsChange(this.openlayers.prevParams, this.openlayers.currentParams)) {
      this.setPolygonsChanges(params);
    }

    // let polygons_splitted = params.split(" ").join("").split(")(").map(
    //   (str, index, array) => {
    //     if(index == 0){
    //       str = str.replace("(", "")
    //     }
    //     if(index == array.length - 1) {
    //       str = str.replace(")", "")
    //     }
    //     return str
    //   });
    //
    // let poly_str_arr=[];
    // _.forEach(polygons_splitted,function (poly) {
    //   poly_str_arr.push(poly.split(','));
    // });
    //
    // _.forEach(poly_str_arr,function(polygon){
    //   let coords=[];
    //   for (let i=0;i<polygon.length;i+=2) {
    //     coords.push([polygon[i],polygon[i+1]])
    //   }
    //   L.polygon(
    //     coords
    //   ).addTo(this.leaflet.map);
    //
    //
    // });
  }

  setPolygonsChanges(params) {
    let params_polygons_array: Array<Object> = this.openlayers.queryParamsHelperService.queryPolygons(params);
    // let map_polygons_array:Array<Object> = this.getTileLayersArray();
    this.addPolygonsViaUrl(params_polygons_array);
    // this.removePolygonsViaUrl(map_tile_layers_array);
  }

  addPolygonsViaUrl(params_polygons_array: any[]) {

    /* let polygonsOnMap = _.filter(this.leaflet.map['_layers'], (l) => l['_latlngs'] && !l.hasOwnProperty("feature")&& !l.hasOwnProperty("_icon"))

     polygonsOnMap.forEach(polygon_obj => {
     polygon_obj['remove']();
     })

     params_polygons_array.forEach(polygon_obj => {
     let coords = [];
     for (let i = 0; i < polygon_obj.coords.length; i += 2) {
     coords.push([polygon_obj.coords[i + 1], polygon_obj.coords[i]])
     }
     if (!this.polygonsExistOnMap(coords)) {
     L.polygon(
     coords
     ).addTo(this.leaflet.map);
     }
     });*/
  }

  /* polygonsExistOnMap(coords: L.LatLng[]): boolean {
   const polygonsOnMap = _.filter(this.leaflet.map['_layers'], (l) => l['_latlngs'] && !l.hasOwnProperty("feature")&& !l.hasOwnProperty("_icon"));
   const exist_polygon = polygonsOnMap.find((polygon: L.Polygon) => {
   const real_coord: L.LatLng[] = (polygon.getLatLngs()[0] as any).map(o => [o.lat, o.lng]);
   return _.isEqual(real_coord, coords);
   });
   return !_.isNil(exist_polygon);
   }*/

  togglePolygonPicker(){
    let that =this;

    let source = new this.openlayers.ol.source.Vector({wrapX: false});

    this.draw = new this.openlayers.ol.interaction.Draw({
      source: source,
      type:'Polygon'
    });

    this.openlayers.map.addInteraction(this.draw);

    this.draw.on('drawend', function(evt){
      //that.draw.finishDrawing();
      that.openlayers.map.removeInteraction(that.draw);
      that.vectorSource.addFeature(evt.feature);
      let initcoordinates = evt.feature.getGeometry().getCoordinates();
      let coordinates=[];
      initcoordinates [0].forEach(coord=>{
        let coordToPush = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326')
        coordinates.push(coordToPush[0]);
        coordinates.push(coordToPush[1]);
      });
      that.queryParamsHelperService.addPolygon(coordinates);
    });
  }





}
