import { Component, OnInit } from '@angular/core';
import * as ol from 'openlayers';
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-openlayers',
  templateUrl: './openlayers.component.html',
  styleUrls: ['./openlayers.component.scss']
})
export class OpenlayersComponent implements OnInit {
  public map;

  constructor(private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe( (params:Params) => {
      console.log("params = ", params);
    });

    let base_layer = new ol.layer.Tile(<olx.layer.TileOptions>{
      source: new ol.source.OSM(),
      extent: this.transformExtent([-180.0, -90.0, 180.0, 90.0])
    });
    this.map = new ol.Map(<any>{
      target: 'map',
      layers: [
        base_layer
      ],
      view: new ol.View(<olx.ViewOptions>{
        center: ol.proj.fromLonLat([-15.2789907,-22.4716007]),
        zoom: 3,
      }),
    });
  }

  transformExtent(extent:ol.Extent):ol.Extent {
    return ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857')
  }

}
