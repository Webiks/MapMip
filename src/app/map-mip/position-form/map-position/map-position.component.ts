import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { QueryParamsHelperService } from '../../services/query-params-helper.service';
import { PositionFormService } from '../position-form.service';

@Component({
  selector: 'app-map-position',
  templateUrl: './map-position.component.html',
  styleUrls: ['./map-position.component.scss']
})

export class MapPositionComponent implements OnChanges, OnInit {

  @ViewChild('popView') public popView;
  @ViewChild('drag') public drag;
  @Input() position: string;
  @Output() positionChange = new EventEmitter();
  @Output() submitPositionEmitter = new EventEmitter();
  @Input() size: string;

  public popViewStyle = {
    width: '100px',
    height: '100px'
  };

  public dragStyle = {
    left: '0px',
    top: '0px',
    height: '0%',
    width: '0%'
  };

  public positionArr: [number, number];
  public mouseDown = false;

  public drag_obj = {
    posX: null,
    posY: null
  };


  constructor(private queryParamsHelperService: QueryParamsHelperService, private positionFormService: PositionFormService) {
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['size']) {
      this.onSizeChanges();
      this.onPositionChanges();
    }

    if (changes['position']) {
      this.onPositionChanges();
    }

  }

  onPositionChanges(): void {
    let position = this.position;
    this.positionArr = this.queryParamsHelperService.queryPosition({ position });

    let pixelLeft = this.maxBoundX() * this.positionArr[0] / 100;
    let pixelTop = this.maxBoundY() * this.positionArr[1] / 100;

    pixelLeft = Math.max(pixelLeft, 0);
    pixelTop = Math.max(pixelTop, 0);

    pixelLeft = Math.min(pixelLeft, this.maxBoundX());
    pixelTop = Math.min(pixelTop, this.maxBoundY());

    this.dragStyle.left = `${pixelLeft}px`;
    this.dragStyle.top = `${pixelTop}px`;
  }

  onSizeChanges(): void {
    let size = this.size;
    let sizeArr = this.queryParamsHelperService.querySize({ size });
    this.dragStyle.width = `${sizeArr[0]}%`;
    this.dragStyle.height = `${sizeArr[1]}%`;
  }

  onResize() {
    this.popViewStyle.width = `${(this.positionFormService.mapsCont.nativeElement.offsetWidth) / 8}px`;
    this.onPositionChanges();
  }

  onMouseDown(event) {
    if (event.which !== 1) {
      return;
    }
    this.drag_obj.posX = event.clientX - event.target.offsetLeft;
    this.drag_obj.posY = event.clientY - event.target.offsetTop;
    this.mouseDown = true;
  }

  onMouseMove = (event) => {
    if (!this.mouseDown || event.which !== 1) {
      return;
    }
    this.dragStyle.left = `${Math.max(0, Math.min(event.clientX - this.drag_obj.posX, this.maxBoundX()))}px`;
    this.dragStyle.top = `${Math.max(0, Math.min(event.clientY - this.drag_obj.posY, this.maxBoundY()))}px`;
  };

  mouseUp(event): void {
    if (event.which !== 1) {
      return;
    }
    // click event
    if (!this.mouseDown && event.target === this.popView.nativeElement) {
      let left = `${parseFloat(event.offsetX) - (this.drag.nativeElement.clientWidth / 2)}px`;
      let top = `${parseFloat(event.offsetY) - (this.drag.nativeElement.clientHeight / 2)}px`;
      this.position = this.convertPixelsToPrecnt(left, top).toString();
      this.positionChange.emit(this.position);
      this.submitPositionEmitter.emit();
      return;
    }

    // drag event
    this.mouseDown = false;
    let new_position = this.convertPixelsToPrecnt().toString();
    if (new_position !== this.position) {
      this.position = new_position;
      this.positionChange.emit(new_position);
      this.submitPositionEmitter.emit();
    }
  }

  convertPixelsToPrecnt(left: string = this.dragStyle.left, top: string = this.dragStyle.top): [number, number] {
    let _maxBoundX = this.maxBoundX();
    if (_maxBoundX === 0) {
      _maxBoundX = 100;
    }

    let _maxBoundY = this.maxBoundY();
    if (_maxBoundY === 0) {
      _maxBoundY = 100;
    }

    let precent_left = parseFloat(parseFloat(left) / _maxBoundX * 100 + '');
    let precent_top = parseFloat(parseFloat(top) / _maxBoundY * 100 + '');
    precent_left = Math.max(0, Math.min(100, precent_left));
    precent_top = Math.max(0, Math.min(100, precent_top));
    return [parseInt(precent_left.toString(), 10), parseInt(precent_top.toString(), 10)];
  }

  maxBoundX(): number {
    let pixelWidth = parseFloat(this.popViewStyle.width) * parseFloat(this.dragStyle.width) / 100;
    pixelWidth = Math.floor(+pixelWidth.toFixed(2));
    return parseFloat(this.popViewStyle.width) - pixelWidth;
  }

  maxBoundY(): number {
    let pixelHeight = parseFloat(this.popViewStyle.height) * parseFloat(this.dragStyle.height) / 100;
    pixelHeight = Math.floor(+pixelHeight.toFixed(2));
    return parseFloat(this.popViewStyle.height) - pixelHeight;
  }

  ngOnInit() {
    this.onResize();
  }

  centerPosition() {
    this.position = '50,50';
    this.positionChange.emit(this.position);
    this.submitPositionEmitter.emit();
  }
}

