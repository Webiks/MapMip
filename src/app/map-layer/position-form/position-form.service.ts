import {Injectable, EventEmitter} from '@angular/core';
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";

@Injectable()
export class PositionFormService {

  public onPicked:boolean;
  public MARKER_COLORS:Array<string>=['blue','black','green','gray','orange','yellow','red','violet'];
  public MARKER_COLORS_HEX:Array<string>=['#277fca','#3c3c3c','#23aa1f','#777777', '#cb832c', '#cbc32c', '#c92139', '#9b29ca'];
  public selectedColorIndex:number = 0;
  public markerPickerEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private domSanitizer :DomSanitizer ) { }

  getSelectedColor(index:number=this.selectedColorIndex):string {
    return this.MARKER_COLORS[index];
  }
  getSelectedColorIndex(color:string=this.getSelectedColor()):number{
    return this.MARKER_COLORS.indexOf(color);
  }
  getSelectedColorHEX(index:number=this.selectedColorIndex):string {
    return this.MARKER_COLORS_HEX[index];
  }
  getMarkerCursorStyle():SafeStyle {
    return this.domSanitizer.bypassSecurityTrustStyle(`url(/assets/Markers/marker-icon-${this.getSelectedColor()}.cur), default`);
  }
  getMarkerUrlByColor(color:string="blue"):string{
    return `/assets/Markers/marker-icon-${color}.png`
  }
  getMarkerColorByUrl(url:string):string{
    return url.replace("/assets/Markers/marker-icon-", "").replace(".png","");
  }
}
