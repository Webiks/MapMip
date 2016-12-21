import {Component, OnInit, style, state, animate, transition, trigger, OnDestroy} from '@angular/core';
import * as ol from 'openlayers';
import {ActivatedRoute, Params, Router, NavigationExtras, NavigationEnd, UrlTree} from "@angular/router";
import {QueryParamsHelperService} from "../query-params-helper.service";
import 'rxjs/add/operator/take';
import {host, animations} from "../map-layer.component";
import * as _ from 'lodash';
import {MapLayerChild} from "../map-layer-child.interface";

@Component({
  host: host,
  selector: 'app-openlayers',
  templateUrl: './openlayers.component.html',
  styleUrls: ['./openlayers.component.scss'],
  animations: animations
})

export class OpenlayersComponent implements OnInit,OnDestroy, MapLayerChild {

  public map;
  public moveEndEvent;
  public currentParams:Params;

  constructor(private activatedRoute:ActivatedRoute, private queryParamsHelperService:QueryParamsHelperService, private router:Router) { }

  ngOnInit() {
    this.initializeMap();
    this.activatedRoute.queryParams.subscribe(this.queryParams);
    this.router.events.filter(event => event instanceof NavigationEnd && !this.router.isActive("/openlayers", false) && !this.router.isActive("/leaflet", false) ).take(1).subscribe(this.setQueryBoundsOnNavigationEnd);
  }

  setQueryBoundsOnNavigationEnd: (NavigationEnd) => void = (event:NavigationEnd):void => {
    let urlTree:UrlTree = this.router.parseUrl(event.url);
    urlTree.queryParams['bounds'] = this.getBounds().toString();
    this.router.navigateByUrl(urlTree.toString());
  };


  queryParams: (Params) => void = (params:Params):void => {
    this.currentParams = params;
    if(this.queryParamsHelperService.hasQueryBounds(params)) {
      let bounds:[number, number, number, number] = this.queryParamsHelperService.queryBounds(params);
      this.setMapBounds(bounds);
    } else if(this.anyParamChanges(params)) {
      this.setMapView(params);
    }
  };

  initializeMap():void {

    this.map = new ol.Map(<any>{
      target: 'ol',
      projection: 'EPSG:4326',
      layers: [
        new ol.layer.Tile(<olx.layer.TileOptions>{
          source: new ol.source.OSM()
        })
      ]
    });
    this.moveEndEvent = this.map.on('moveend', this.moveEnd);

  }

  setMapView(params:Params):void {
    this.map.setView(new ol.View(<olx.ViewOptions>{
      center: ol.proj.fromLonLat([this.queryParamsHelperService.queryLng(params),this.queryParamsHelperService.queryLat(params)]),
      zoom: this.queryParamsHelperService.queryZoom(params),
    }))
  }

  setMapBounds(bounds:[number, number, number, number] ):void {
    this.map.getView().fit(this.transformExtent(bounds), this.map.getSize());
  }

  anyParamChanges(params:Params):boolean {
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
    return !_.isEqual(arrayP, array);
  }

  moveEnd: (event) => Promise<boolean> = (event):Promise<boolean> => {
    let centerCord:ol.Coordinate = ol.proj.transform(event.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');

    let lng = centerCord[0];
    let lat = centerCord[1];
    let zoom:number = event.map.getView().getZoom();
    let navigationExtras:NavigationExtras = this.queryParamsHelperService.getQuery({lng, lat, zoom});
    return this.router.navigate([], navigationExtras);

  }

  transformExtent(extent:ol.Extent):ol.Extent {
    return ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857')
  }

  ngOnDestroy() {
  }

  getBounds():[number, number, number, number] {
    let bounds:ol.Extent = this.map.getView().calculateExtent(this.map.getSize());
    let t_bounds:ol.Extent = ol.proj.transformExtent(bounds, 'EPSG:3857', 'EPSG:4326');
    let saved_bounds:[number, number, number, number] = t_bounds;
    return saved_bounds;
  }

}
