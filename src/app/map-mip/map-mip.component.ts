import { animate, Component, OnInit, state, style, transition, trigger, ViewChild } from '@angular/core';
import { PositionFormService } from './components/position-form/position-form.service';
import { MapMipService } from './api/map-mip.service';


@Component({
  selector: 'map-mip',
  templateUrl: 'map-mip.component.html',
  styleUrls: ['map-mip.component.scss']
})

export class MapLayerComponent implements OnInit {
  @ViewChild('mapsCont') mapsCont;

  constructor(private positionFormService: PositionFormService, private mapMipService: MapMipService) {

  }

  get hideComponent(): boolean {
    return this.positionFormService.hideComponent;
  }

  ngOnInit() {
    this.positionFormService.mapsCont = this.mapsCont;
  }

}

export const animations: Array<any> = [
  trigger('routeAnimation', [
    state('*', style({ opacity: 1 })),
    transition('void => *', [
      style({ opacity: 0 }),
      animate(500)
    ]),
    transition('* => void', animate(500, style({ opacity: 0 })))
  ])
];
