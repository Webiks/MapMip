import {Component, OnInit, style, state, animate, transition, trigger} from '@angular/core';

@Component({
  selector: 'app-map-layer',
  templateUrl: './map-layer.component.html',
  styleUrls: ['./map-layer.component.scss']
})
export class MapLayerComponent implements OnInit {

  constructor() { }

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
  // '[style.background]': "'#b5d0d0'"
  // '(@routeAnimation.start)': "moveEnd()"
};

