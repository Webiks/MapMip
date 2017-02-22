import {Component, OnInit, Renderer} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isCollapsed = true;

  constructor(private renderer: Renderer) { }

  ngOnInit() {
  }

  setHeight(el, height){
    this.renderer.setElementStyle(el, 'height', height + 'px');
  }
}
