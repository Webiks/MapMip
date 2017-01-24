
import {ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate, Router, NavigationStart} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {CesiumComponent} from "./cesium/cesium.component";
import {OpenlayersComponent} from "./openlayers/openlayers.component";
import {LeafletComponent} from "./leaflet/leaflet.component";

@Injectable()
export class GeneralCanDeactivateService implements CanDeactivate<CesiumComponent | OpenlayersComponent | LeafletComponent> {

  private _onLeave:Observable<boolean>;

  canDeactivate(component: CesiumComponent | OpenlayersComponent | LeafletComponent, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.onLeave;
  }


  set onLeave(value: Observable<boolean>) {
    this._onLeave = value;
  }

  get onLeave(): Observable<boolean> {
    return this._onLeave;
  }

}
