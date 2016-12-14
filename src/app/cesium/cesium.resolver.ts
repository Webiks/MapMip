
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Promise} from 'Q';

@Injectable()
export class CesiumResolver implements Resolve<any> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    return "tatatatatatatatatatatatatata";
    // return Promise( (res, rej) => {
    //   setTimeout( () => {
    //     console.log("hhhh")
    //     res("tatatatatatatatatatatatatata");
    //   }, 5000);
    // });

  }

}
