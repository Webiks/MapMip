import {Injectable, EventEmitter} from '@angular/core';
import {PositionFormService} from "../components/position-form/position-form.service";
import {NavigationCancel, NavigationExtras, Router, UrlTree} from "@angular/router";
import {Location} from '@angular/common';

@Injectable()
export class MapMipService {
  static LEAFLET_PATH: string = '/leaflet';
  static OPENLAYERS_PATH: string = '/openlayers';
  static CESIUM_PATH: string = '/cesium';

  private _skipLocationChange:boolean = false;
  private default_state:string = '/leaflet';
  public gotoEmitter  = new EventEmitter();
  constructor(private positionFormService: PositionFormService, public router: Router, private location: Location){

    this.router.events.filter(e => e.url === '/').subscribe((e) => {
      this.navigate([this.default_state]);
    });

    this.router.events.filter(e => e instanceof NavigationCancel).subscribe((e) => {
    });


  }

  get skipLocationChange(): boolean {
    return this._skipLocationChange;
  }

  set skipLocationChange(value: boolean) {
    if (value) {
      this.location.go('');
    }
    this._skipLocationChange = value;
  }

  togglePositionForm(status?){
    if(status) this.positionFormService.hideComponent = status;
    else this.positionFormService.hideComponent = !this.positionFormService.hideComponent;
  }

  positionFormHidden():boolean {
    return this.positionFormService.hideComponent;
  }
  goTo(state: '/leaflet' | '/cesium' | '/openlayers'): void {
    if(!this.isActive(state)) {
      this.gotoEmitter.emit(state);
    }
  }

  navigate(commands: any[], extras: NavigationExtras = {}): Promise<any> {
    extras.skipLocationChange = this.skipLocationChange;
    return this.router.navigate(commands, extras);
  }

  navigateByUrl(url: string | UrlTree, extras: NavigationExtras = {}): Promise<boolean>{
    extras.skipLocationChange = this.skipLocationChange;
    return this.router.navigateByUrl(url, extras);
  }

  isActive(state):boolean {
    return this.router.isActive(`/${state}`, false);
  }

}
