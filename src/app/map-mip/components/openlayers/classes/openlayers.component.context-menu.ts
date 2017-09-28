import { OpenlayersComponent } from '../openlayers.component';
import * as ol from 'openlayers';

export class OpenlayersContextMenu {

  get map() {
    return this.openlayers.map;
  }

  constructor(private openlayers: OpenlayersComponent) {
    const elem: Element = openlayers.map.getViewport();
    elem.addEventListener('contextmenu', (event: MouseEvent) => {
      event.preventDefault();
      let coordinates: ol.Coordinate = this.map.getCoordinateFromPixel([event.offsetX, event.offsetY]);
      const projection = this.map.getView().getProjection();
      coordinates = ol.proj.toLonLat(coordinates, projection);
      /* LatLon */
      coordinates.reverse();
      openlayers.contextMenuService.openEmitter.emit({ coordinates, event });
    });
  }

}
