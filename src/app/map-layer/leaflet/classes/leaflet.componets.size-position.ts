import {LeafletComponent} from "../leaflet.component";
import {Params} from "@angular/router";
import {Subscription} from "rxjs";

export class LeafletSizePosition {
  public queryParamsSubscriber:Subscription;

  constructor(private leaflet:LeafletComponent){
    this.queryParamsSubscriber = leaflet.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
  }

  queryParams(params:Params){

  }
}
