import {Component, OnInit, style, state, animate, transition, trigger, ViewChild, ElementRef} from '@angular/core';
import {Router, UrlTree} from "@angular/router";
import {PositionFormService} from "./position-form/position-form.service";

@Component({
  selector: 'app-map-layer',
  templateUrl: './map-layer.component.html',
  styleUrls: ['./map-layer.component.scss']
})
export class MapLayerComponent implements OnInit {
  constructor() {window['CESIUM_BASE_URL'] = 'assets/Cesium';}

  ngOnInit() {
  }

}

export const animations:Array<any> = [
  trigger('routeAnimation', [
    state('*', style({opacity: 1})),
    transition('void => *', [
      style({opacity: 0}),
      animate(500)
    ]),
    transition('* => void', animate(500, style({opacity: 0})))
  ])
];

export const host = {
  '[@routeAnimation]': "true",
  '[style.display]': "'block'",
  '[style.position]': "'absolute'",
  '[style.width]': "'100%'",
  '[style.height]': "'100%'"
};

