import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import * as _ from 'lodash';
import { MapMipMarker, QueryParamsHelperService } from '../../services/query-params-helper.service';
import { ActivatedRoute, Params } from '@angular/router';
import { PositionFormService } from '../position-form.service';
import { config } from '../../../../config/config';

export interface MapMipEditedMarker {
  colorIndex: number;
  label: string;
  position: string
}

export interface MarkersEditObj {
  marker: MapMipEditedMarker;
  edit_index: number;

  onEdit(): void;

  init(): void;
}

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styleUrls: ['./markers.component.scss']
})

export class MarkersComponent implements OnInit {

  @ViewChild('smModal') public smModal: ModalDirective;
  @ViewChild('addModal') public addModal: ModalDirective;
  @Input() public lng: number;
  @Input() public lat: number;
  @Output() submitMarkersEmitter = new EventEmitter();

  public edit_obj: MarkersEditObj = {
    marker: {
      position: '',
      colorIndex: this.positionFormService.selectedColorIndex,
      label: this.positionFormService.markerLabel
    },
    edit_index: -1,
    onEdit() {
      return this.edit_index !== -1;
    },
    init() {
      this.marker = {
        position: '',
        colorIndex: this.positionFormService.selectedColorIndex,
        label: this.positionFormService.markerLabel
      };
      this.edit_index = -1;
    }
  };

  public markers_array: MapMipEditedMarker[] = [];
  public edited_markers_array: MapMipEditedMarker[] = [];

  constructor(private queryParamsHelperService: QueryParamsHelperService, private route: ActivatedRoute, public positionFormService: PositionFormService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(this.queryParams);
  }

  queryParams: (Params) => void = (params: Params): void => {
    this.markers_array = this.queryParamsHelperService
      .queryMarkers(params)
      .map(this.markerToEditedMarker.bind(this));

    this.cloneEditedMarkers();
  };

  markerToEditedMarker(marker: MapMipMarker): MapMipEditedMarker {
    const color = marker.icon || config.defaultMarker.icon;
    const colorIndex = this.positionFormService.getSelectedColorIndex(color);
    const position = marker.position.toString();
    const label = marker.label || '';
    return { position, colorIndex, label };
  }

  editedMarkerToMarker(marker: MapMipEditedMarker): MapMipMarker {
    const position = marker.position.split(',').map(Number);
    const icon = this.positionFormService.getSelectedColor(marker.colorIndex);
    const label = marker.label;
    return <MapMipMarker> { position, icon, label };
  }

  cloneEditedMarkers() {
    this.edited_markers_array = _.cloneDeep(this.markers_array);
  }

  rmvMarker(index: number, array = this.edited_markers_array): void {
    array.splice(index, 1);
  }

  parseMarkers(editedMarker: MapMipEditedMarker[]): string {
    let markers = editedMarker
      .map<MapMipMarker>(this.editedMarkerToMarker.bind(this));
    return this.queryParamsHelperService.markersArrayToStr(markers);
  }

  canApply(): boolean {
    return !_.isEqual(this.edited_markers_array, this.markers_array);
  }

  submitMarkers(hide = false) {
    !this.canApply() ? this.smModal.hide() : this.submitMarkersEmitter.emit({
      parsed_markers: this.parseMarkers(this.edited_markers_array),
      smModal: this.smModal,
      hide: hide
    });
  }

  submitAddMarkers(markerObj: MapMipEditedMarker) {
    if (this.edit_obj.onEdit()) {
      this.edited_markers_array[this.edit_obj.edit_index] = markerObj;
    } else {
      this.edited_markers_array.push(markerObj);
    }
    this.addModal.hide();
  }

  markerStrRegex(position): boolean {
    let a = position.split(',');
    if (a.length !== 3 && a.length !== 2) {
      return false;
    }
    return !a.some((o) => !o || Number.isNaN(+o));
  }

  markerCenter() {
    let position: [number, number] = [this.lng, this.lat];
    let center_marker: MapMipMarker = { position };
    if (this.positionFormService.getSelectedColor() !== config.defaultMarker.icon) {
      center_marker.icon = this.positionFormService.getSelectedColor();
    }
    this.queryParamsHelperService.addMarker(center_marker);
  }

  togglePicked(onPicked: boolean) {
    this.positionFormService.onPicked = onPicked;
    this.positionFormService.markerPickerEmitter.emit(this.positionFormService.onPicked);
  }

  removeAllMarkers(): void {
    this.edited_markers_array = [];
  }

  editMarker(index: number) {
    this.edit_obj.marker = _.cloneDeep(this.edited_markers_array[index]);
    this.edit_obj.edit_index = index;
    this.addModal.show();
  }


}
