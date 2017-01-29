import {Component, OnInit, style, state, animate, transition, trigger, ViewChild} from '@angular/core';

@Component({
  selector: 'app-map-layer',
  templateUrl: './map-layer.component.html',
  styleUrls: ['./map-layer.component.scss'],
  animations: [trigger('showTools', [
      transition(':enter', [
        style({ maxHeight:'0', opacity: 0}),
        animate('0.5s ease-in', style({ maxHeight: '200px', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ maxHeight:'200px', opacity: 1}),
        animate('0.5s ease-out', style({ maxHeight:'0', opacity: 0 }))
      ])
    ])

  ]
})

export class MapLayerComponent implements OnInit {
  public showTools:boolean = false;

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

