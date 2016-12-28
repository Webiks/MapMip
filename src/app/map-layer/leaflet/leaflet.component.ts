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


@Component({
  host: host,
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss'],
  animations: animations
})
export class LeafletComponent implements OnInit, MapLayerChild, OnDestroy {

  public map;
  public currentParams:Params = {};
  public prevParams:Params = {};


  constructor(private router:Router, private activatedRoute:ActivatedRoute, private queryParamsHelperService:QueryParamsHelperService) {window['current'] = this;}

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
    if(this.queryParamsHelperService.anyMarkersParamsChanges(this.prevParams, params)) {
      let markers = this.queryParamsHelperService.queryMarkers(params);
      if(this.anyMarkersMapChanges(markers)) this.setMarkersChanges(markers);
    }


  };

  initializeMap():void {





    this.map = L.map('leafletContainer');

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      id: 'mapbox.streets'
    }).addTo(this.map);

    // let icon = L.icon(<L.IconOptions>{
    //   iconUrl: '/assets/Leaflet/images/marker-icon.png',
    //   shadowUrl: '/assets/Leaflet/images/marker-shadow.png',
    // });
    //
    // let marker:Marker = L.marker([50.5, 30.5], {icon:icon});
    // marker.addTo(this.map);

    this.map.on('moveend', this.moveEnd);

  }

  moveEnd: (event) => Promise<boolean> = (event):Promise<boolean> => {

    let lng: L.LatLng  = event.target.getCenter().lng;
    let lat: L.LatLng  = event.target.getCenter().lat;
    let zoom:number = event.target.getZoom();
    let markers = this.currentParams['markers'];

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

  getLayersArray() {
    let layers = [];
    this.map.eachLayer((l) => layers.push(l));
    return layers;
  }

  anyMarkersMapChanges(queryMarkersCartographicDegreesPositions): boolean{
    let mapMarkerCartesienPositions = this.getMarkersPosition();

    mapMarkerCartesienPositions.forEach((markerCartesienPosition) => {
      _.forEach(markerCartesienPosition, (val, key) => {
        markerCartesienPosition[key] = +val.toFixed(7)
      });
    });

    queryMarkersCartographicDegreesPositions.forEach((markerCartesienPosition) => {
      _.forEach(markerCartesienPosition, (val, key) => {
        markerCartesienPosition[key] = +val.toFixed(7)
      });
    });

    return !_.isEqual(mapMarkerCartesienPositions, queryMarkersCartographicDegreesPositions ) ;
  }

  getMarkersPosition() {
    let pos = [];

    this.map.eachLayer( (layer:Marker) => {
      if(layer.setIcon){
        let latlng = layer.getLatLng();
        let m = [+latlng.lng.toFixed(7), +latlng.lat.toFixed(7), 0];

        pos.push(m);
      }
    });
    return pos;
  }


  setMarkersChanges(params_markers_position:Array<[number, number, number]>):void {
    params_markers_position.forEach( (marker) => {
      if(!this.markerExistOnMap(marker)) {
        let icon = L.icon(<L.IconOptions>{
          iconUrl: '/assets/Leaflet/images/marker-icon.png',
          shadowUrl: '/assets/Leaflet/images/marker-shadow.png',
        });
        let l_marker:Marker = L.marker([marker[1],marker[0]], {icon:icon});
        l_marker.addTo(this.map);
      }
    });

    let map_markers_positions = this.getMarkersPosition();

    map_markers_positions.forEach((markerPos) => {
      if(!this.markerExistOnParams(markerPos)) {
        let marker_to_remove = this.getLayersArray().find(
          (layer:Marker) => {
            if(layer.getLatLng) {
              let latlng = layer.getLatLng();
              let m = [latlng.lng, latlng.lat, 0];
              return _.isEqual(m,markerPos);
            }
            return false;
          });
        this.map.removeLayer(marker_to_remove )
      }
    })
  }

  markerExistOnMap(markerPosition) {
    let markers_map_positions = this.getMarkersPosition();
    let exist_point = markers_map_positions.find((positionArray) => _.isEqual(positionArray, markerPosition));
    return !_.isEmpty(exist_point);
  }

  markerExistOnParams(markerPosition) {
    let markerPositionFixed = this.toFixes7Obj(markerPosition);
    let markers_params_positions = this.queryParamsHelperService.queryMarkers(this.currentParams);
    let exist_point = markers_params_positions.find((positionArray) => {
      let positionArrayFixed = this.toFixes7Obj(positionArray);
      return _.isEqual(positionArrayFixed , markerPositionFixed)
    });
    return !_.isEmpty(exist_point);
  }

  toFixes7Obj(obj) {
    _.forEach(obj, (val, key) => {
      obj[key] = +val.toFixed(7)
    });
    return obj;
  }
}

class BingMap {
  // var BingLayer = L.TileLayer.extend({
  //   getTileUrl: function (tilePoint) {
  //     this._adjustTilePoint(tilePoint);
  //     return L.Util.template(this._url, {
  //       s: this._getSubdomain(tilePoint),
  //       q: this._quadKey(tilePoint.x, tilePoint.y, this._getZoomForUrl())
  //     });
  //   },
  //   _quadKey: function (x, y, z) {
  //     var quadKey = [];
  //     for (var i = z; i > 0; i--) {
  //       var digit = '0';
  //       var mask = 1 << (i - 1);
  //       if ((x & mask) != 0) {
  //         digit++;
  //       }
  //       if ((y & mask) != 0) {
  //         digit++;
  //         digit++;
  //       }
  //       quadKey.push(digit);
  //     }
  //     return quadKey.join('');
  //   }
  // });
  //
  // var layer = new BingLayer('http://t{s}.tiles.virtualearth.net/tiles/a{q}.jpeg?g=1398', {
  //   subdomains: ['0', '1', '2', '3', '4'],
  //   attribution: '&copy; <a href="http://bing.com/maps">Bing Maps</a>'
  // });

}
