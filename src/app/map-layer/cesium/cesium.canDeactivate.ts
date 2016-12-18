
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate} from "@angular/router";
import {Injectable, Output, EventEmitter} from "@angular/core";
import {Observable, Observer} from "rxjs";
import {CesiumComponent} from "./cesium.component";

@Injectable()
export class CesiumCanDeactivate implements CanDeactivate<CesiumComponent> {


  public leaveCesium:Observable<boolean>;

  canDeactivate(component: CesiumComponent, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.leaveCesium;
  }


}
