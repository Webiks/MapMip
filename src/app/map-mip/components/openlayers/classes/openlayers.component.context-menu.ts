import { OpenlayersComponent } from '../openlayers.component';

export class OpenlayersContextMenu {

  constructor(private openlayers: OpenlayersComponent) {
    const elem: Element = openlayers.map.getViewport();
    elem.addEventListener('contextmenu', (e: MouseEvent) => {
      e.preventDefault();
    });
  }

}
