import {
  Component, ViewChild, AfterViewInit, Input, OnChanges,
  SimpleChanges, Output, EventEmitter, OnInit
} from '@angular/core';
import {QueryParamsHelperService} from "../../query-params-helper.service";
import * as _ from "lodash";
import {Router, UrlTree} from "@angular/router";
import {PositionFormService} from "../position-form.service";
@Component({
  selector: 'app-map-position',
  templateUrl: './map-position.component.html',
  styleUrls: ['./map-position.component.scss']
})

export class MapPositionComponent implements OnChanges{

  @ViewChild("popView") public popView;
  @ViewChild("drag") public drag;
  @Input() position:string;
  @Output() positionChange = new EventEmitter();
  @Output() submitPositionEmitter = new EventEmitter();
  @Input() size:string;

  public popViewStyle = {
    width: "100px",
    height: "100px"
  };

  public dragStyle = {
    left: '0px',
    top: '0px',
    height: '0%',
    width: '0%'
  };

  public positionArr:[number, number];
  public mouseDown:boolean = false;

  public drag_obj = {
    posX: null,
    posY: null,
  };


  constructor(private queryParamsHelperService:QueryParamsHelperService, private positionFormService:PositionFormService) {}

  ngOnChanges(changes: SimpleChanges): void {

    if(changes['size']) {
      this.onSizeChanges();
      this.onPositionChanges();
    }

    if(changes['position']) {
      this.onPositionChanges();
    }

  }

  onPositionChanges():void {
    let position = this.position;
    this.positionArr = this.queryParamsHelperService.queryPosition({position});

    let pixelLeft = this.maxBoundX() * this.positionArr[0] / 100;
    let pixelTop = this.maxBoundY() * this.positionArr[1] / 100;

    pixelLeft = Math.max(pixelLeft , 0);
    pixelTop = Math.max(pixelTop , 0);

    pixelLeft = Math.min(pixelLeft , this.maxBoundX());
    pixelTop = Math.min(pixelTop , this.maxBoundY());

    this.dragStyle.left = `${pixelLeft}px`;
    this.dragStyle.top = `${pixelTop}px`;
  }

  onSizeChanges():void {
    let size = this.size;
    let sizeArr = this.queryParamsHelperService.querySize({size});
    this.dragStyle.width = `${sizeArr[0]}%`;
    this.dragStyle.height = `${sizeArr[1]}%`;
  }

  onResize(event) {
    this.popViewStyle.width = `${(this.positionFormService.mapsCont.nativeElement.offsetWidth) / 8}px`;
    this.onPositionChanges()
  }

  onMouseDown(event) {
    this.drag_obj.posX = event.clientX - event.target.offsetLeft;
    this.drag_obj.posY  = event.clientY - event.target.offsetTop;
    this.mouseDown = true;
  }

  onMouseMove = (event) => {
    if(!this.mouseDown) return;

    this.dragStyle.left = `${Math.max(0, Math.min(event.clientX - this.drag_obj.posX, this.maxBoundX()))}px`;
    this.dragStyle.top = `${Math.max(0, Math.min(event.clientY - this.drag_obj.posY, this.maxBoundY()))}px`;
    let new_position = this.convertPixelsToPrecnt().toString();
    if(new_position != this.position){
      this.position = new_position;
      this.positionChange.emit(new_position);
      this.submitPositionEmitter.emit();
    }
  };

  setNewPosition():void {
    this.mouseDown = false;
    // let new_position = this.convertPixelsToPrecnt().toString();
    // if(new_position != this.position){
    //   this.position = new_position;
    //   this.positionChange.emit(new_position);
    //   this.submitPositionEmitter.emit();
    // }
  }

  convertPixelsToPrecnt():[number, number]{
    let precent_left = parseFloat(parseFloat(this.dragStyle.left) / this.maxBoundX() * 100+"");
    let precent_top = parseFloat(parseFloat(this.dragStyle.top)  /  this.maxBoundY() * 100+"");
    return [parseInt(precent_left.toString()),parseInt(precent_top.toString())]
  }

  maxBoundX():number {
    let pixelWidth = parseFloat(this.popViewStyle.width) * parseFloat(this.dragStyle.width) / 100;
    pixelWidth = Math.floor(+pixelWidth.toFixed(2));
    return parseFloat(this.popViewStyle.width) - pixelWidth;
  }

  maxBoundY():number {
    let pixelHeight = parseFloat(this.popViewStyle.height) * parseFloat(this.dragStyle.height) / 100;
    pixelHeight = Math.floor(+pixelHeight.toFixed(2));
    return parseFloat(this.popViewStyle.height) - pixelHeight;
  }

  ngOnInit() {
    let target = window;
    this.onResize({target});
  }

}

