import {Injectable, EventEmitter} from '@angular/core';
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";

export const MARKER_COLORS:Array<string>=['blue','black','green','gray','orange','yellow','red','violet',
  'coffee','star','home','airport','tools',
  'train','tree','lock','hazard','hotel',
  'gov','dollar','conversation','rest',
  'man','fire','airport2','coffee2',
  'conversation2','dollar2','fire2',
  'gov2','hazard2','home2','hotel2',
  'lock2','man2','rest2','star2',
  'tools2','train2','tree2','fire_','fire1a',
  'fire1b','fire4a','fire4b','fire5','lock1a',
  'lock1b','lock4a','lock4b','lock5','lock5c'];

export const MARKER_COLORS_HEX:Array<string>=['#277fca','#3c3c3c','#23aa1f','#777777', '#cb832c', '#cbc32c', '#c92139', '#9b29ca'];

@Injectable()
export class PositionFormService {

  public onPicked:boolean;

  public selectedColorIndex:number = 0;
  public markerPickerEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  public mapsCont: any;
  public hideComponent:boolean = false;

  constructor(private domSanitizer :DomSanitizer ) { }

  getSelectedColor(index:number=this.selectedColorIndex):string {
    return MARKER_COLORS[index];
  }
  getSelectedColorIndex(color:string=this.getSelectedColor()):number{
    return MARKER_COLORS.indexOf(color);
  }

  getSelectedColorHEX(index:number=this.selectedColorIndex):string {
    return MARKER_COLORS_HEX[index];
  }

  getMarkerCursorStyle():SafeStyle {
    return this.domSanitizer.bypassSecurityTrustStyle(`url(http://mapmip.webiks.com/assets/Markers/marker-icon-${this.getSelectedColor()}.cur), default`);
  }
  getMarkerUrlByColor(color:string="blue" ,format:string="png"):string{
    return `http://mapmip.webiks.com/assets/Markers/marker-icon-${color}.${format}`
  }
  getMarkerColorByUrl(url:string):string{
    // return url.replace(location.origin, "").replace("/assets/Markers/marker-icon-", "").replace(".png","");
    return url.replace("http://mapmip.webiks.com", "").replace("/assets/Markers/marker-icon-", "").replace(".png","");
  }
}
