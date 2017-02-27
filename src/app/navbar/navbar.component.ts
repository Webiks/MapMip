import {Component, OnInit, Renderer} from '@angular/core';
import {PositionFormService} from "../map-mip/position-form/position-form.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isCollapsed = true;

  constructor(private renderer: Renderer, private positionFormService:PositionFormService) { }

  togglePositionForm(){
    this.positionFormService.hideComponent = !this.positionFormService.hideComponent;
    this.isCollapsed = true;
  }

  setHeight(el, height){
    this.renderer.setElementStyle(el, 'height', height + 'px');
  }
}
