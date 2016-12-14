import {Component, OnInit, ViewChild, ElementRef, style, state, animate, transition, trigger} from '@angular/core';
import * as L from 'leaflet';
import {Router, ActivatedRoute, NavigationExtras, Params} from "@angular/router";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import {QueryParamsHelperService} from "../query-params-helper.service";
import {CalcService} from "../calc.service";

@Component({
  host: {
    '[@routeAnimation2]': "true",
    '[style.display]': "'block'",
    '[style.position]': "'absolute'",
    '[style.width]': "'100%'"
  },
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss'],
  animations: [
    trigger('routeAnimation2', [
      state('*', style({transform: 'translateX(0)', opacity: 1})),
      transition('void => *', [
        style({opacity: 0}),
        animate(500)
      ]),
      transition('* => void', animate(500, style({opacity: 0})))
    ])
  ]
})
export class LeafletComponent implements OnInit {
  // @ViewChild() leaflet:ElementRef;
  public map;

  constructor(private router:Router, private activatedRoute:ActivatedRoute, private queryParamsHelperService:QueryParamsHelperService, private calcService:CalcService) {}

  ngOnInit() {
    this.activatedRoute.queryParams.take(1).subscribe( (params:Params) => {
      this.initializeMap(params);
    });
  }

  initializeMap(params:Params) {

    this.map = L.map('leafletContainer').setView([this.queryParamsHelperService.queryLat(params), this.queryParamsHelperService.queryLng(params)], this.queryParamsHelperService.queryZoom(params));

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      id: 'mapbox.streets'

    }).addTo(this.map);


    this.map.on('moveend', (event) => {
      let center: L.LatLng  = event.target.getCenter();
      let zoom:number = event.target.getZoom();

      this.queryParamsHelperService.setQuery(center.lng, center.lat, zoom, this.activatedRoute);
    });
  }
}
