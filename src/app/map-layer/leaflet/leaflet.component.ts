import {Component, OnInit, style, state, animate, transition, trigger} from '@angular/core';
import * as L from 'leaflet';
import {Router, ActivatedRoute, Params, NavigationExtras} from "@angular/router";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import {QueryParamsHelperService} from "../query-params-helper.service";
import {CalcService} from "../calc.service";
import {host, animations} from "../map-layer.component";

@Component({
  host: host,
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss'],
  animations: animations
})
export class LeafletComponent implements OnInit {
  // @ViewChild() leaflet:ElementRef;
  public map;
  public moveEnd;
  public moveEnded:boolean;


  constructor(private router:Router, private activatedRoute:ActivatedRoute, private queryParamsHelperService:QueryParamsHelperService, private calcService:CalcService) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe( (params:Params) => {
      if(!this.map) this.initializeMap(params);
      if(!this.moveEnded) this.setMapView(params);
      this.moveEnded = false;
    });

    // let cesiumSubs = this.cesiumResolver.leaveCesium.subscribe(() => {
    //   this.cesiumResolver.finishLeaveCesium.emit();
    //   cesiumSubs.unsubscribe();
    // });

  }

  initializeMap(params:Params) {

    this.map = L.map('leafletContainer');

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      id: 'mapbox.streets'
    }).addTo(this.map);

    this.moveEnd = (event) => {
      this.moveEnded = true;
      let center: L.LatLng  = event.target.getCenter();
      let zoom:number = event.target.getZoom();
      let navigationExtras:NavigationExtras = this.queryParamsHelperService.getQuery(center.lng, center.lat, zoom);
      this.router.navigate([], navigationExtras);
    };

    this.map.on('moveend', this.moveEnd);
  }

  setMapView(params:Params):void {
    let longitude:number = this.queryParamsHelperService.queryLng(params);
    let latitude:number = this.queryParamsHelperService.queryLat(params);
    let zoom:number = this.queryParamsHelperService.queryZoom(params);

    this.map.setView([latitude, longitude], zoom);
  }
  ngOnDestroy() {
  }


}
