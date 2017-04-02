import {Component, OnInit, Renderer} from '@angular/core';
import {PositionFormService} from "../map-mip/components/position-form/position-form.service";
import {MapMipService} from "../map-mip/api/map-mip.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isCollapsed = true;

  constructor(private renderer: Renderer, private mapMipService:MapMipService) { }

  togglePositionForm(){
    this.mapMipService.togglePositionForm();
    this.isCollapsed = true;
  }

  setHeight(el, height){
    this.renderer.setElementStyle(el, 'height', height + 'px');
  }
}
