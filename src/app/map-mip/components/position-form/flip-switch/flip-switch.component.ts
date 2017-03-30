import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MapMipService} from "../../../api/map-mip.service";

@Component({
  selector: 'app-flip-switch',
  templateUrl: './flip-switch.component.html',
  styleUrls: ['./flip-switch.component.scss']
})
export class FlipSwitchComponent implements OnInit {
  @Input("state") private state: boolean;

  constructor(public mapmipService:MapMipService) { }

  ngOnInit() {
  }

}
