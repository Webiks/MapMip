import {Component, OnInit, style, state, animate, transition, trigger, OnDestroy} from '@angular/core';
import * as ol from 'openlayers';
import {ActivatedRoute, Params, Router, NavigationExtras} from "@angular/router";
import {QueryParamsHelperService} from "../query-params-helper.service";
import 'rxjs/add/operator/take';
import {host, animations} from "../map-layer.component";
import {isEqual} from 'lodash';
@Component({
  host: host,
  selector: 'app-openlayers',
  templateUrl: './openlayers.component.html',
  styleUrls: ['./openlayers.component.scss'],
  animations: animations
})

export class OpenlayersComponent implements OnInit,OnDestroy {
  public map;
  public moveend;
  public currentParams:Params;
  constructor(private activatedRoute:ActivatedRoute, private queryParamsHelperService:QueryParamsHelperService, private router:Router) { }

  ngOnInit() {

    this.initializeMap();

    this.activatedRoute.queryParams.subscribe( (params:Params) => {
      this.currentParams = params;
      if(this.queryParamsHelperService.haveLeafletOpenlayersParams(params) && this.anyParamChanges(params)) {
        this.setMapView(params);
      } else if(this.queryParamsHelperService.hasBounds()) {
        this.setMapBounds();
      } else {
        this.setMapView(params);
      }

    });


  }

  initializeMap() {

    this.map = new ol.Map(<any>{
      target: 'ol',
      layers: [
        new ol.layer.Tile(<olx.layer.TileOptions>{
          source: new ol.source.OSM()
        })
      ]
    });
    this.initializeQueryChanges();
  }

  setMapView(params:Params) {
    this.map.setView(new ol.View(<olx.ViewOptions>{
      center: ol.proj.fromLonLat([this.queryParamsHelperService.queryLng(params),this.queryParamsHelperService.queryLat(params)]),
      zoom: this.queryParamsHelperService.queryZoom(params),
    }))
  }

  setMapBounds() {
    let bounds:[number, number, number, number] = this.queryParamsHelperService.getBounds();

    this.map.getView().fit(this.transformExtent(bounds), this.map.getSize());

    this.queryParamsHelperService.resetBounds();
  }

  anyParamChanges(params:Params) {
    let longitudeP:number = this.queryParamsHelperService.queryLng(params);
    let latitudeP:number  = this.queryParamsHelperService.queryLng(params);
    let zoomP:number      = this.queryParamsHelperService.queryZoom(params);

    let arrayP = [longitudeP, latitudeP, zoomP];

    let longitude:number;
    let latitude:number;
    let zoom:number;

    try{
      longitude = this.map.getView().getCenter()[0];
      latitude  = this.map.getView().getCenter()[1];
      zoom      = this.map.getView().getZoom();
    } catch (e) {

      return true;
    }

    let array = [longitude, latitude, zoom];

    arrayP.forEach( (value, index) => {arrayP[index] = +arrayP[index].toFixed(7)});
    array.forEach( (value, index) => {array[index] = +array[index].toFixed(7)});
    return !isEqual(arrayP, array);
  }
  public initializeQueryChanges() {
    let onMoveEnd:Function = event => {
      let centerCord:ol.Coordinate = ol.proj.transform(event.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');

      let lng = centerCord[0];
      let lat = centerCord[1];
      let zoom:number = event.map.getView().getZoom();
      let navigationExtras:NavigationExtras = this.queryParamsHelperService.getQuery({lng, lat, zoom});
      return this.router.navigate([], navigationExtras);
    };

    this.moveend = this.map.on('moveend', onMoveEnd);
  }


  transformExtent(extent:ol.Extent):ol.Extent {
    return ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857')
  }

  ngOnDestroy() {
    this.saveBounds();
  }

  saveBounds():void {
    let bounds:ol.Extent = this.map.getView().calculateExtent(this.map.getSize());
    let t_bounds:ol.Extent = ol.proj.transformExtent(bounds, 'EPSG:3857', 'EPSG:4326');

    let saved_bounds:[number, number, number, number] = t_bounds;
    this.queryParamsHelperService.setBounds(saved_bounds);
  }

}
