/**
 * Created by USSeR on 5/23/2017.
 */
import {Params} from "@angular/router";
import {OpenlayersComponent} from "../openlayers.component";
import * as ol from 'openlayers';
import * as _ from 'lodash';

import Polygon = ol.geom.Polygon;

export class OpenlayersPolygons {
  public queryParamsSubscriber;
  public draw;
  private vectorSource: ol.source.Vector;
  private vectorLayer: ol.layer.Vector;

  constructor(private openlayers: OpenlayersComponent) {
    this.addPolygonsLayer();

    this.openlayers.map.addLayer(new ol.layer.Vector({
      source: this.vectorSource
    }));

    this.queryParamsSubscriber = openlayers.activatedRoute.queryParams
      .filter((params:Params) => this.openlayers.queryParamsHelperService.anyPolygonsChange(this.openlayers.prevParams, this.openlayers.currentParams))
      .subscribe(this.setPolygonsChanges.bind(this));
    openlayers.positionFormService.polygonPickerEmitter.subscribe(this.togglePolygonPicker.bind(this));
    if(openlayers.positionFormService.onPolygonPicked) this.togglePolygonPicker.bind(this)(true);
  }


  addPolygonsLayer() {
    this.vectorSource = new ol.source.Vector(<any>{});
    this.vectorLayer = new ol.layer.Vector(<any>{
      source: this.vectorSource
    });
    this.vectorLayer.setZIndex(200);
    this.openlayers.map.addLayer(this.vectorLayer);
  }

  destroy() {
    this.queryParamsSubscriber.unsubscribe();
    this.openlayers.positionFormService.polygonPickerEmitter.unsubscribe()
  }

  getPolygonsPositions(): {coords: number[]} [] {
    return this.vectorSource.getFeatures().map((feature: ol.Feature) => {
      const geometry: any = feature.getGeometry();
      const coordinates: any = geometry.getCoordinates()[0];
      const coords = [];
      coordinates.forEach(
        coord => {
          const [number_a, number_b] = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326')
          coords.push(number_a);
          coords.push(number_b);
      });
      return {coords}
    })
  }

  setPolygonsChanges(params) {
    const params_polygons_array: Array<Object> = this.openlayers.queryParamsHelperService.queryPolygons(params);

    this.addPolygonsViaUrl(params_polygons_array);
    // this.removePolygonsViaUrl(map_tile_layers_array);
  }

  addPolygonsViaUrl(params_polygons_array: any[] ) {

    //const polygonsOnMap = params_polygons_array.filter((polygon: {cords: number[]}) => {   });


    // _.filter(layers,function(layer){
    //   return layer['getSource']().getFeatures()[0].getGeometry().getType()=="Polygon"
    // });

    /* let polygonsOnMap = _.filter(this.leaflet.map['_layers'], (l) => l['_latlngs'] && !l.hasOwnProperty("feature")&& !l.hasOwnProperty("_icon"))

     polygonsOnMap.forEach(polygon_obj => {
     polygon_obj['remove']();
     })
    */

    params_polygons_array.forEach(polygon_obj => {
     if (!this.polygonsExistOnMap(polygon_obj.coords)) {
       let transformedCoords=[]
       for (let i=0;i<polygon_obj.coords.length;i += 2){
         transformedCoords.push([polygon_obj.coords[i],polygon_obj.coords[i+1]])
       }


       let tempArr=[];
       transformedCoords.forEach(elem=>{
         tempArr.push( ol.proj.transform(elem, 'EPSG:4326', 'EPSG:3857'));
       });

       let transformedGeomery = new ol.geom.Polygon( [tempArr]);
       var featurething = new ol.Feature({
         geometry: transformedGeomery
       });
       this.vectorSource.addFeature(featurething)
     }
     });
  }
  polygonsExistOnMap(coords){
    const map_polygons_array = this.getPolygonsPositions(); // array of polygons objects with coords property
    map_polygons_array.forEach((polygon)=>{
      if (_.isEqual(polygon.coords,coords) ) return true;
    });
    return false;
    // now check if the coords
    /*find((polygon) => {
      const real_coord: L.LatLng[] = (polygon.getLatLngs()[0] as any).map(o => [o.lat, o.lng]);
      return _.isEqual(real_coord, coords);
    });
*/
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
      that.openlayers.queryParamsHelperService.addPolygon(coordinates);
    });
  }





}
