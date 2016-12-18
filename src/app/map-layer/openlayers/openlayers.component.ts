import {Component, OnInit, style, state, animate, transition, trigger} from '@angular/core';
import * as ol from 'openlayers';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {QueryParamsHelperService} from "../query-params-helper.service";
import 'rxjs/add/operator/take';
import {host, animations} from "../map-layer.component";

@Component({
  host: host,
  selector: 'app-openlayers',
  templateUrl: './openlayers.component.html',
  styleUrls: ['./openlayers.component.scss'],
  animations: animations
})

export class OpenlayersComponent implements OnInit {
  public map;
  public moveend;
  constructor(private activatedRoute:ActivatedRoute, private queryParamsHelperService:QueryParamsHelperService, private router:Router) { }

  ngOnInit() {
    this.activatedRoute.queryParams.take(1).subscribe( (params:Params) => {
      this.initializeMap(params);
    });
  }

  initializeMap(params:Params) {

    this.map = new ol.Map(<any>{
      target: 'ol',
      layers: [
        new ol.layer.Tile(<olx.layer.TileOptions>{
          source: new ol.source.OSM()
          // extent: this.transformExtent([-180.0, -90.0, 180.0, 90.0])
        })
      ],
      view: new ol.View(<olx.ViewOptions>{
        center: ol.proj.fromLonLat([this.queryParamsHelperService.queryLng(params),this.queryParamsHelperService.queryLat(params)]),
        zoom: this.queryParamsHelperService.queryZoom(params),
      }),
    });
    this.initializeQueryChanges();
  }

  public initializeQueryChanges() {
    let onMoveEnd:Function = event => {
      let centerCord:ol.Coordinate = ol.proj.transform(event.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
      let zoom:number = event.map.getView().getZoom();
      let center:{lat:number, lng:number} = {lng: centerCord[0], lat: centerCord[1]};
      this.queryParamsHelperService.getQuery(center.lng, center.lat, zoom);
    };

    this.moveend = this.map.on('moveend', onMoveEnd);
  }


  transformExtent(extent:ol.Extent):ol.Extent {
    return ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857')
  }

}
