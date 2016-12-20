import {Component, OnInit, style, state, animate, transition, trigger} from '@angular/core';
import * as L from 'leaflet';
import {Router, ActivatedRoute, Params, NavigationExtras} from "@angular/router";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import {QueryParamsHelperService} from "../query-params-helper.service";
import {CalcService} from "../calc.service";
import {host, animations} from "../map-layer.component";
import {isEqual} from 'lodash';
import {MapLayerChild} from "../map-layer-child.interface";
@Component({
  host: host,
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss'],
  animations: animations
})
export class LeafletComponent implements OnInit, MapLayerChild {

  public map;
  public moveEnd:Function;
  public currentParams:Params;


  constructor(private router:Router, private activatedRoute:ActivatedRoute, private queryParamsHelperService:QueryParamsHelperService, private calcService:CalcService) {}

  ngOnInit() {
    this.initializeMap();
    this.activatedRoute.queryParams.subscribe(this.queryParams);
  }

  queryParams: (Params) => void = (params:Params):void => {
    this.currentParams = params;
    if(this.queryParamsHelperService.hasQueryBounds(params)) {
      let bounds:[number, number, number, number] = this.queryParamsHelperService.queryBounds(params);
      this.setMapBounds(bounds);
    } else{
      if(this.queryParamsHelperService.hasBounds()){
        let bounds:[number, number, number, number] = this.queryParamsHelperService.getBounds();
        this.setMapBounds(bounds);
      } else if(this.anyParamChanges(params)) {
        this.setMapView(params);
      }
    }
  };

  initializeMap() {

    this.map = L.map('leafletContainer');
    window['map'] = this.map;

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      id: 'mapbox.streets'
    }).addTo(this.map);

    this.initializeMoveend();

  }

  initializeMoveend() {

    this.moveEnd = (event) => {

      let lng: L.LatLng  = event.target.getCenter().lng;
      let lat: L.LatLng  = event.target.getCenter().lat;
      let zoom:number = event.target.getZoom();

      let navigationExtras:NavigationExtras = this.queryParamsHelperService.getQuery({lng, lat, zoom});

      return this.router.navigate([], navigationExtras);
    };

    this.map.on('moveend', this.moveEnd);
  }


  setMapView(params:Params):void {

    let longitude:number = this.queryParamsHelperService.queryLng(params);
    let latitude:number = this.queryParamsHelperService.queryLat(params);
    let zoom:number = this.queryParamsHelperService.queryZoom(params);

    this.map.setView([latitude, longitude], zoom);
  }

  setMapBounds(bounds:[number, number, number, number]):void {
      // let leafletLatLng: L.LatLng
      this.map.fitBounds([[bounds[1], bounds[0]], [ bounds[3], bounds[2]] ]);
      this.queryParamsHelperService.resetBounds();
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
      longitude = this.map.getCenter().lng;
      latitude  = this.map.getCenter().lat;
      zoom      = this.map.getZoom();
    } catch (e) {

      return true;
    }

    let array = [longitude, latitude, zoom];

    arrayP.forEach( (value, index) => {arrayP[index] = +arrayP[index].toFixed(7)});
    array.forEach( (value, index) => {array[index] = +array[index].toFixed(7)});
    return !isEqual(arrayP, array);
  }

  ngOnDestroy() {
    this.saveBounds();
  }

  saveBounds():void {
    let leaflet_bounds:L.LatLngBounds = this.map.getBounds();
    let saved_bounds:[number, number, number, number] = [leaflet_bounds.getSouthWest().lng, leaflet_bounds.getSouthWest().lat, leaflet_bounds.getNorthEast().lng, leaflet_bounds.getNorthEast().lat];
    console.log(saved_bounds)
    this.queryParamsHelperService.setBounds(saved_bounds);
  }

}
