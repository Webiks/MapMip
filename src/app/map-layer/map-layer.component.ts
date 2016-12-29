import {Component, OnInit, style, state, animate, transition, trigger} from '@angular/core';
import {Router, UrlTree} from "@angular/router";

@Component({
  selector: 'app-map-layer',
  templateUrl: './map-layer.component.html',
  styleUrls: ['./map-layer.component.scss']
})
export class MapLayerComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  markerCenter() {
    let urlTree:UrlTree = this.router.parseUrl(this.router.url);
    let center_marker:string = `(${urlTree.queryParams['lng']},${urlTree.queryParams['lat']})`;

    if(!urlTree.queryParams['markers']){
      urlTree.queryParams['markers'] = center_marker;
    } else {
      urlTree.queryParams['markers'] += `,${center_marker}`;
    }

    this.router.navigateByUrl(urlTree.toString())
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

