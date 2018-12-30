/**
 * Created by Harel on 15/03/2017.
 */
import { Params } from '@angular/router';
import { LeafletComponent } from '../leaflet.component';
import * as _ from 'lodash';
import * as L from 'leaflet';

export class LeafletGeoJson {
  public queryParamsSubscriber;
  public assetLayerGroup;
  public geoJsonLayers: string[];

  constructor(private leaflet: LeafletComponent) {
    this.queryParamsSubscriber = leaflet.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
  }

  popUp(f, l) {
    const out = [];
    if (f.properties) {
      Object.keys(f.properties).forEach((key) => {
        out.push(key + ': ' + f.properties[key]);
      });
      l.bindPopup(out.join('<br />'));
    }
  }

  setStyle(feature) {
    if (feature.properties) {
      switch (feature.properties.color) {
        case 'red':
          return { color: '#ff0000' };
        case 'blue':
          return { color: '#0000ff' };
        case 'green':
          return { color: '#00ff00' };
        case 'yellow':
          return { color: '#feff43' };
        case 'black':
          return { color: '#000000' };
      }

    }

  }


  queryParams(params: Params) {
    const that = this;
    if (this.leaflet.queryParamsHelperService.anyGeoJsonChange(this.leaflet.prevParams, this.leaflet.currentParams)) {
      this.geoJsonLayers = [];
      // for case when moving from other component
      if (!this.assetLayerGroup) {
        this.assetLayerGroup = new this.leaflet.L.LayerGroup();
      }
      this.assetLayerGroup.clearLayers();
      let urls = this.leaflet.queryParamsHelperService.queryGeoJson(params);

      _.forEach(urls, function (url, index) {
        that.geoJsonLayers[index] = that.leaflet.L.geoJSON['ajax'](url, { onEachFeature: that.popUp });
        that.geoJsonLayers[index]['setStyle'](that.setStyle);
        L.Util.setOptions(that.geoJsonLayers[index], { style: that.setStyle });
        that.assetLayerGroup.addLayer(that.geoJsonLayers[index]);
      });

      // add the whole group to map
      this.assetLayerGroup.addTo(this.leaflet.map);

    }
  }

}
