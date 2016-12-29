
import {ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate, Router, NavigationStart} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {CesiumComponent} from "./cesium/cesium.component";
import {OpenlayersComponent} from "./openlayers/openlayers.component";
import {LeafletComponent} from "./leaflet/leaflet.component";

@Injectable()
export class GeneralCanDeactivateService implements CanDeactivate<CesiumComponent | OpenlayersComponent | LeafletComponent> {

  private _leaveCesium:Observable<boolean>;

  canDeactivate(component: CesiumComponent | OpenlayersComponent | LeafletComponent, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this._leaveCesium;
  }


  set leaveCesium(value: Observable<boolean>) {
    this._leaveCesium = value;
  }

  get leaveCesium(): Observable<boolean> {
    return this._leaveCesium;
  }

}
