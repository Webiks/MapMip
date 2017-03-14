import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-geojson-layer',
  templateUrl: './geojson-layer.component.html',
  styleUrls: ['./geojson-layer.component.scss']
})
export class GeojsonLayerComponent implements OnInit {
  @Input() geojson:string;
  constructor() { }

  ngOnInit() {
  }

}
