/**
 * Created by Harel on 16/03/2017.
 */
import { Params } from '@angular/router';
import { OpenlayersComponent } from '../openlayers.component';
import * as _ from 'lodash';

export class OpenlayersGeoJson {
  public feature;
  public queryParamsSubscriber;
  public geojsonLayers: string[];
  public myMultiStyle = {
    'Point': new this.openlayers.ol.style.Style({
      image: new this.openlayers.ol.style.Icon({
        src: '/assets/Markers/marker-icon-blue.png',
        anchor: [0.5, 1]
      })
    }),
    'MultiPoint': new this.openlayers.ol.style.Style({
      image: new this.openlayers.ol.style.Icon({
        src: '/assets/Markers/marker-icon-blue.png',
        anchor: [0.5, 1]
      })
    }),
    'LineString': new this.openlayers.ol.style.Style({
      stroke: new this.openlayers.ol.style.Stroke({
        color: this.getColor(this.feature)




        // sfeature.get("color")=="red"

        /*  stroke: new this.openlayers.ol.style.Stroke({
            color: '#3388ff',
            width: 3*/
      })
    }),
    'MultiLineString': new this.openlayers.ol.style.Style({
      stroke: new this.openlayers.ol.style.Stroke({
        color: '#3388ff',
        width: 3
      })
    }),
    'Polygon': new this.openlayers.ol.style.Style({
      fill: new this.openlayers.ol.style.Fill({
        color: 'rgba(51,136,255,0.2)'
      }),
      stroke: new this.openlayers.ol.style.Stroke({
        color: '#3388ff',
        width: 1
      })
    }),
    'MultiPolygon': new this.openlayers.ol.style.Style({
      fill: new this.openlayers.ol.style.Fill({
        color: 'rgba(51,136,255,0.2)'
      }),
      stroke: new this.openlayers.ol.style.Stroke({
        color: '#3388ff',
        width: 1
      })
    })

  };

  constructor(private openlayers: OpenlayersComponent) {
    this.queryParamsSubscriber = openlayers.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
  }

  getColor(feature) {
    if (feature) {
      switch (feature.get('color')) {
        case 'red':
          return '#ff0000';
        case 'blue':
          return '#0000ff';
        case 'green':
          return '#00ff00';
        case 'yellow':
          return '#feff43';
        case 'black':
          return '#000000';
      }
    }

  }

  queryParams(params: Params) {
    const that = this;
    if (this.openlayers.queryParamsHelperService.anyGeoJsonChange(this.openlayers.prevParams, this.openlayers.currentParams)) {
      let urls = this.openlayers.queryParamsHelperService.queryGeoJson(params);


      // remove all layers first by take from array
      _.forEach(this.geojsonLayers, (geojsonLayer) => {
        this.openlayers.map.removeLayer(<any> geojsonLayer);
      });
      this.geojsonLayers = [];

      // then add the new geojson layers from the url into the array

      _.forEach(urls, function (url, index) {
        that.geojsonLayers[index] = new that.openlayers.ol.layer.Vector({
          source: new that.openlayers.ol.source.Vector({
            format: new that.openlayers.ol.format.GeoJSON(),
            url: url
          }),
          style: that.myStyleFunction.bind(that)

        });
        // add each elem of the array
        that.openlayers.map.addLayer(<any> that.geojsonLayers[index]);
      });


    }

    /* this.openlayers.map.on('click', function(evt) {
       var ft = that.openlayers.map.forEachFeatureAtPixel(evt.pixel, function(f, l){return f;});
       if (ft) {

         for(var propertyName in ft.getProperties()) {

             console.log(ft.getProperties()[propertyName])
           var popup = new ol.Overlay({
             element: this.element,
             positioning: 'bottom-center',
             stopEvent: false,

           });
           this.openlayers.map.addOverlay(popup);

         };
       }
     });*/


  }

  myStyleFunction(feature, resolution) {
    let that = this;
    that.feature = feature;
    if (feature.getGeometry().getType() === 'GeometryCollection') {
      let geoColStyle = [];
      _.forEach(feature.getGeometry().getGeometries(), function (geometry: any) {
        geoColStyle.push(that.myMultiStyle[geometry.getType()]);

      });
      return geoColStyle;

    } else if (feature.getGeometry().getType() === 'LineString') {
      return new this.openlayers.ol.style.Style({
        stroke: new this.openlayers.ol.style.Stroke({
          color: this.getColor(this.feature),
          width: 3
        })
      });
    } else {
      return this.myMultiStyle[feature.getGeometry().getType()];
    }
  }
}
