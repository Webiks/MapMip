import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import * as L from 'leaflet';
import {Router, ActivatedRoute, NavigationExtras, Params} from "@angular/router";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss']
})
export class LeafletComponent implements OnInit {
  // @ViewChild() leaflet:ElementRef;
  constructor(private router:Router, private activatedRoute:ActivatedRoute) {

  }

  ngOnInit() {
    let qpSubscriber = this.activatedRoute.queryParams.subscribe((params) => {
      console.log("params =", params);
      qpSubscriber.unsubscribe();
    });


    var map = L.map('leafletContainer').setView([0,0], 0);

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      id: 'mapbox.streets'
    }).addTo(map);

    map.on('moveend', (event) => {
      console.log(event);
      let center: L.LatLng  = event.target.getCenter();
      let zoom:number = event.target.getZoom();
      let navigationExtras:NavigationExtras = {
        queryParams: {lat: center.lat,lng: center.lng,zoom:zoom}
      }
      this.router.navigate(['/leaflet'], navigationExtras);


    });
  }

}
