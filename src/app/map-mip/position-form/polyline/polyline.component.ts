import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PositionFormService } from '../position-form.service';

@Component({
  selector: 'app-polyline',
  templateUrl: './polyline.component.html',
  styleUrls: ['./polyline.component.css']
})
export class PolylineComponent implements OnInit {
  @Input() polyline: string;
  @Input('Active') Active;
  @Output('togglePolylinePickedEmitter') togglePolylinePickedEmitter = new EventEmitter();

  constructor(private route: ActivatedRoute, public positionFormService: PositionFormService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(this.queryParams);
  }

  queryParams: (Params) => void = (params: Params): void => {

  };

  togglePolylinePicked(onPolylinePicked: boolean) {
    // do toggle to button and start draw mode
    this.positionFormService.onPolylinePicked = onPolylinePicked;
    this.positionFormService.polylinePickerEmitter.emit(this.positionFormService.onPolylinePicked);

  }


}
