import {Component, OnInit, style, state, animate, transition, trigger, ViewChild} from '@angular/core';

@Component({
  selector: 'app-map-layer',
  templateUrl: './map-layer.component.html',
  styleUrls: ['./map-layer.component.scss']
})

export class MapLayerComponent implements OnInit {
  public showTools:boolean = true;
  slides = [1,2,3]
  someRange = 0
  constructor() {}

  ngOnInit() {
  }
  start(){}

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
  '[style.display]': "'flex'",
  '[style.position]': "'absolute'",
  '[style.width]': "'100%'",
  '[style.height]': "'100%'",
  '[style.justify-content]':"'center'"
};

