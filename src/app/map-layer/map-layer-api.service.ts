import { Injectable } from '@angular/core';
import {QueryParamsHelperService} from "./query-params-helper.service";

@Injectable()
export class MapLayerApiService {

  constructor(private queryParamsHelperService:QueryParamsHelperService) {

  }
  addMarker(marker){
    this.queryParamsHelperService.addMarker(marker);
  }


}
