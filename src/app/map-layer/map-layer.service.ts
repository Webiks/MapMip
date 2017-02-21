import {Injectable} from "@angular/core";
import {QueryParamsHelperService} from "./query-params-helper.service";
import {CesiumComponent} from "./cesium/cesium.component";

/**
 * Created by Harel on 20/02/2017.
 */
@Injectable()
export class MapLayerService {
  public cesium;

  constructor(private queryParamsHelperService:QueryParamsHelperService) {
    this.cesium = CesiumComponent;
  }
  addMarker(marker){
    this.queryParamsHelperService.addMarker(marker);
  }

  addTerrain(url){
    if(url) {
      this.cesium.viewer.terrainProvider = new Cesium.CesiumTerrainProvider({url});
      this.cesium.viewer.scene.globe.depthTestAgainstTerrain = true;
    } else{
      this.cesium.viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
      this.cesium.viewer.scene.globe.depthTestAgainstTerrain = false;
    }
  }

}
