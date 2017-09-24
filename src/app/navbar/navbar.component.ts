import { Component, Renderer } from '@angular/core';
import { MapMipService } from '../map-mip/api/map-mip.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isCollapsed = true;

  constructor(private renderer: Renderer, public mapMipService: MapMipService) {
  }

  togglePositionForm() {
    this.mapMipService.togglePositionForm();
    this.isCollapsed = true;
  }

  setHeight(el, height) {
    this.renderer.setElementStyle(el, 'height', height + 'px');
  }

  get CESIUM_PATH(): string {
    return MapMipService.CESIUM_PATH;
  }

  get LEAFLET_PATH(): string {
    return MapMipService.LEAFLET_PATH;
  }

  get OPENLAYERS_PATH(): string {
    return MapMipService.OPENLAYERS_PATH;
  }

}
