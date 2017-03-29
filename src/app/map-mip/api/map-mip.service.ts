import { Injectable } from '@angular/core';
import {PositionFormService} from "../components/position-form/position-form.service";
import {NavigationExtras, Router, UrlTree} from "@angular/router";

@Injectable()
export class MapMipService {

  private _skipLocationChange:boolean = true;
  private default_state:string = 'leaflet';

  constructor(private positionFormService:PositionFormService, private router:Router){

    this.router.events.filter(e => e.url == '/').subscribe((e) => {
      this.goTo(<"leaflet">this.default_state);
    });

  }

  get skipLocationChange(): boolean {
    return this._skipLocationChange;
  }

  set skipLocationChange(value: boolean) {
    this._skipLocationChange = value;
  }

  togglePositionForm(status?){
    if(status) this.positionFormService.hideComponent = status;
    else this.positionFormService.hideComponent = !this.positionFormService.hideComponent;
  }

  positionFormHidden():boolean {
    return this.positionFormService.hideComponent;
  }

  goTo(state: "leaflet" | "cesium" | "openlayers"):Promise<any> {
    return this.navigate([`/${state}`], {skipLocationChange: this.skipLocationChange, preserveQueryParams: true} );
  }

  navigate(commands: any[], extras?: NavigationExtras): Promise<any> {
    extras.skipLocationChange = this.skipLocationChange;
    return this.router.navigate(commands, extras);
  }

  navigateByUrl(url: string | UrlTree, extras: NavigationExtras={}): Promise<boolean>{
    extras.skipLocationChange = this.skipLocationChange;
    return this.router.navigateByUrl(url, extras);
  }

  isActive(state):boolean {
    return this.router.isActive(`/${state}`, false);
  }

}
