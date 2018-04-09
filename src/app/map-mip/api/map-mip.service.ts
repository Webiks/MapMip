import { EventEmitter, Injectable } from '@angular/core';
import { PositionFormService } from '../position-form/position-form.service';
import { NavigationCancel, NavigationExtras, Router, UrlTree } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/filter';
import { config } from '../../../config/config';

@Injectable()
export class MapMipService {
  static LEAFLET_PATH = '/leaflet';
  static OPENLAYERS_PATH = '/openlayers';
  static CESIUM_PATH = '/cesium';

  private _skipLocationChange = config.skipLocationChange;
  private default_state = config.initialRoute;
  public gotoEmitter = new EventEmitter();

  constructor(private positionFormService: PositionFormService, public router: Router, private location: Location) {

    this.router.events.filter(e => e['url'] === '/').subscribe((e) => {
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

  togglePositionForm(status?) {
    if (status) {
      this.positionFormService.hideComponent = status;
    } else {
      this.positionFormService.hideComponent = !this.positionFormService.hideComponent;
    }
  }

  positionFormHidden(): boolean {
    return this.positionFormService.hideComponent;
  }

  goTo(state: string): void {
    if (!this.isActive(state)) {
      this.gotoEmitter.emit(state);
    }
  }

  navigate(commands: any[], extras: NavigationExtras = {}): Promise<any> {
    extras.skipLocationChange = this.skipLocationChange;
    return this.router.navigate(commands, extras);
  }

  navigateByUrl(url: string | UrlTree, extras: NavigationExtras = {}): Promise<boolean> {
    extras.skipLocationChange = this.skipLocationChange;
    return this.router.navigateByUrl(url, extras);
  }

  isActive(state): boolean {
    return this.router.isActive(`/${state}`, false);
  }

}
