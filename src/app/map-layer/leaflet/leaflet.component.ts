import {Component, OnInit, OnDestroy} from '@angular/core';
import * as L from 'leaflet';
import {Router, ActivatedRoute, Params, NavigationExtras, NavigationEnd, UrlTree} from "@angular/router";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import {QueryParamsHelperService} from "../query-params-helper.service";
import {host, animations} from "../map-layer.component";
import {MapLayerChild} from "../map-layer-child.interface";
import * as _ from 'lodash'


@Component({
  host: host,
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss'],
  animations: animations
})
export class LeafletComponent implements OnInit, MapLayerChild, OnDestroy {

  public map;
  public currentParams:Params;


  constructor(private router:Router, private activatedRoute:ActivatedRoute, private queryParamsHelperService:QueryParamsHelperService) {}

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
    this.currentParams = params;
    if(this.queryParamsHelperService.hasQueryBounds(params)) {

      this.setMapBounds(params);
    } else{
      if(this.anyParamChanges(params)) {
        this.setMapView(params);
      }
    }
  };

  initializeMap():void {

    this.map = L.map('leafletContainer');

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      id: 'mapbox.streets'
    }).addTo(this.map);

    this.map.on('moveend', this.moveEnd);

  }

  moveEnd: (event) => Promise<boolean> = (event):Promise<boolean> => {

    let lng: L.LatLng  = event.target.getCenter().lng;
    let lat: L.LatLng  = event.target.getCenter().lat;
    let zoom:number = event.target.getZoom();

    let navigationExtras:NavigationExtras = this.queryParamsHelperService.getQuery({lng, lat, zoom});

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
    this.map.fitBounds([[bounds[1], bounds[0]], [ bounds[3], bounds[2]] ]);
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
    return !_.isEqual(arrayP, array);
  }

  ngOnDestroy() {
  }

  getBounds():[number, number, number, number] {
    let leaflet_bounds:L.LatLngBounds = this.map.getBounds();
    let saved_bounds:[number, number, number, number] = [leaflet_bounds.getSouthWest().lng, leaflet_bounds.getSouthWest().lat, leaflet_bounds.getNorthEast().lng, leaflet_bounds.getNorthEast().lat];
    return saved_bounds;
  }


}
