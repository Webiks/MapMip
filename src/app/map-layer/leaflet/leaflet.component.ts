import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute, Params, NavigationExtras, NavigationEnd, UrlTree} from "@angular/router";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import {QueryParamsHelperService} from "../query-params-helper.service";
import {host, animations} from "../map-layer.component";
import {MapLayerChild} from "../map-layer-child.interface";
import * as _ from 'lodash'
import * as L from 'leaflet';
import Marker = L.Marker;
import "leaflet-bing-layer/leaflet-bing-layer";
import {CalcService} from "../calc-service";

@Component({
  host: host,
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss'],
  animations: animations
})

export class LeafletComponent implements OnInit, MapLayerChild {

  private _map;
  public currentParams:Params = {};
  public prevParams:Params = {};


  constructor(private router:Router, private activatedRoute:ActivatedRoute, private queryParamsHelperService:QueryParamsHelperService, private calcService:CalcService) {window['current'] = this;}

  ngOnInit() {
    this.initializeMap();
    this.activatedRoute.queryParams.subscribe(this.queryParams);
    this.router.events.filter(event => event instanceof NavigationEnd && !this.router.isActive("/leaflet", false) && !this.router.isActive("/openlayers", false) ).take(1).subscribe(this.setQueryBoundsOnNavigationEnd);
  }

  setQueryBoundsOnNavigationEnd: (NavigationEnd) => void = (event:NavigationEnd):void => {
    let urlTree:UrlTree = this.router.parseUrl(event.url);
    urlTree.queryParams['bounds'] = this.getBounds().toString();
    this.router.navigateByUrl(urlTree.toString());
  };

  queryParams: (Params) => void = (params:Params):void => {
    this.prevParams = this.currentParams;
    this.currentParams = params;

    //view
    if(this.queryParamsHelperService.hasQueryBounds(params)) {
      this.setMapBounds(params);
    } else{
      if(this.anyParamChanges(params)) {
        this.setMapView(params);
      }
    }

    //markers
    let params_changes:boolean = this.queryParamsHelperService.anyMarkersParamsChanges(this.prevParams, params);
    let map_changes:boolean = this.anyMarkersMapChanges(params);

    if(params_changes && map_changes) {
      this.setMarkersChanges(params);
    }


  };

  initializeMap():void {
    this.map = L.map('leafletContainer');
    L.tileLayer['bing']('Ag9RlBTbfJQMhFG3fxO9fLAbYMO8d5sevTe-qtDsAg6MjTYYFMFfFFrF2SrPIZNq').addTo(this.map);
    // L.tileLayer('https://api.mapbox.com/styles/v1/idanbarak/cixg4xdev00ms2qo9e4h5ywsb/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWRhbmJhcmFrIiwiYSI6ImNpdmptNWVrZzAwOTkydGw1NmIxcHM2ZnoifQ.FZxE5OXjfpd6I3fuimotRw', {
      // id: 'mapbox.streets'
    // }).addTo(this.map);
    this.map.on('moveend', this.moveEnd);
  }

  moveEnd: (event) => Promise<boolean> = (event):Promise<boolean> => {
    if(!this.anyParamChanges(this.currentParams)) return;
    let lng: number  = event.target.getCenter().lng;
    let lat: number  = event.target.getCenter().lat;
    let zoom:number  = event.target.getZoom();
    let markers      = this.currentParams['markers'];

    let navigationExtras:NavigationExtras = this.queryParamsHelperService.getQuery({lng, lat, zoom, markers});

    return this.router.navigate([], navigationExtras);
  };


  setMapView(params:Params):void {

    let longitude:number = this.queryParamsHelperService.queryLng(params);
    let latitude:number = this.queryParamsHelperService.queryLat(params);
    let zoom:number = this.queryParamsHelperService.queryZoom(params);

    this.map.setView([latitude, longitude], zoom);
  }

  setMapBounds(params:Params):void {
    let bounds:[number, number, number, number] = this.queryParamsHelperService.queryBounds(params);
    this.map.fitBounds(<L.LatLngBoundsExpression> [[bounds[1], bounds[0]], [ bounds[3], bounds[2]] ], null);
  }

  anyParamChanges(params:Params):boolean {
    let longitudeP:number = this.queryParamsHelperService.queryLng(params);
    let latitudeP:number  = this.queryParamsHelperService.queryLat(params);
    let zoomP:number      = this.queryParamsHelperService.queryZoom(params);

    let arrayP = [longitudeP, latitudeP, zoomP];

    let longitude:number;
    let latitude:number;
    let zoom:number;

    try{
      longitude = this.map.getCenter().lng;
      latitude  = this.map.getCenter().lat;
      zoom      = this.map.getZoom();
    } catch (e) {

      return true;
    }

    let array = [longitude, latitude, zoom];

    arrayP = this.calcService.toFixes7Obj(arrayP);
    array = this.calcService.toFixes7Obj(array);
    return !_.isEqual(arrayP, array);
  }

  getBounds():[number, number, number, number] {
    let leaflet_bounds:L.LatLngBounds = this.map.getBounds();
    let saved_bounds:[number, number, number, number] = [leaflet_bounds.getSouthWest().lng, leaflet_bounds.getSouthWest().lat, leaflet_bounds.getNorthEast().lng, leaflet_bounds.getNorthEast().lat];
    return saved_bounds;
  }

  getLayersArray() {
    let layers = [];
    this.map.eachLayer((l) => layers.push(l));
    return layers;
  }

  anyMarkersMapChanges(params:Params): boolean{
    let queryMarkersPositions:Array<[number, number]> = this.queryParamsHelperService.queryMarkersNoHeight(params);
    let mapMarkerPositions:Array<[number, number]> = this.getMarkersPosition();
    return !_.isEqual(mapMarkerPositions, queryMarkersPositions);
  }

  getMarkersPosition():Array<[number, number]> {
    let markers_position:Array<[number, number]> = [];

    this.map.eachLayer( (layer:Marker) => {
      if(layer.setIcon){
        let latlng = layer.getLatLng();
        let marker_position:[number, number] = [+latlng.lng.toFixed(7), +latlng.lat.toFixed(7)];
        markers_position.push(marker_position);
      }
    });
    return markers_position;
  }


  setMarkersChanges(params:Params):void {
    let params_markers_position:Array<[number, number]> = this.queryParamsHelperService.queryMarkersNoHeight(params);
    let map_markers_positions:Array<[number, number]> = this.getMarkersPosition();

    this.addMarkersViaUrl(params_markers_position);
    this.removeMarkersViaUrl(map_markers_positions);
  }

  addMarkersViaUrl(params_markers_position:Array<[number, number]>) {

    params_markers_position.forEach( marker => {
      if(!this.markerExistOnMap(marker)) {
        let icon = L.icon(<L.IconOptions>{
          iconUrl: '/assets/Leaflet/images/marker-icon.png',
          shadowUrl: '/assets/Leaflet/images/marker-shadow.png',
        });
        let l_marker:Marker = L.marker([marker[1],marker[0]], {icon:icon});
        l_marker.addTo(this.map);
      }
    });

  }

  removeMarkersViaUrl(map_markers_positions:Array<[number, number]>) {
    map_markers_positions.forEach((markerPos) => {

      if(!this.markerExistOnParams(markerPos)) {

        let marker_to_remove = this.getLayersArray().find(
          (layer:Marker) => {
            if(layer.getLatLng) {
              let currentM = [layer.getLatLng().lng, layer.getLatLng().lat];
              return _.isEqual(currentM, markerPos);
            }
            return false;
          });
        this.map.removeLayer(marker_to_remove)
      }
    })
  }

  markerExistOnMap(markerPosition) {
    let markers_map_positions:Array<[number, number]> = this.getMarkersPosition();
    let exist_point = markers_map_positions.find(positionArray => _.isEqual(positionArray,markerPosition));
    return !_.isEmpty(exist_point);
  }

  markerExistOnParams(markerPosition) {
    let markers_params_positions = this.queryParamsHelperService.queryMarkersNoHeight(this.currentParams);
    let exist_point = markers_params_positions.find(positionArray => _.isEqual(positionArray,markerPosition));
    return !_.isEmpty(exist_point);
  }

  get map():L.Map {
    return this._map;
  }

  set map(value:L.Map) {
    this._map = value;
  }
}
