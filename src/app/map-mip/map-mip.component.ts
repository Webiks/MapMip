import {Component, OnInit, style, state, animate, transition, trigger, ViewChild, HostBinding} from '@angular/core';
import {PositionFormService} from "./position-form/position-form.service";


@Component({
  selector: 'app-map-layer',
  templateUrl: 'map-mip.component.html',
  styleUrls: ['map-mip.component.scss']
})

export class MapLayerComponent implements OnInit {
  public showTools:boolean = true;
  @HostBinding("style.height") height = "100%";
  @HostBinding("style.width") width = "100%";
  @HostBinding("style.display") display = "block";
  @HostBinding("style.position") position = "relative";


  @ViewChild("mapsCont") mapsCont;
  constructor(private positionFormService:PositionFormService) {
  }

  ngOnInit() {
    this.positionFormService.mapsCont = this.mapsCont;
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
  '[style.display]': "'flex'",
  '[style.position]': "'absolute'",
  '[style.width]': "'100%'",
  '[style.height]': "'100%'",
  '[style.justify-content]':"'center'"
};

