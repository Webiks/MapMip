import { Component, ElementRef, HostBinding, HostListener, OnInit, Renderer2 } from '@angular/core';
import { ContextMenuEvent, ContextMenuService } from '../services/context-menu.service';
import { config } from '../../../../../config/config';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {
  coordinates;

  get baseLink() {
    return config.contextMenuHref;
  }

  @HostBinding('attr.tabindex')
  get tabindex() {
    return 0;
  }

  @HostListener('contextmenu', ['$event'])
  contextmenu($event: MouseEvent) {
    $event.preventDefault();
  }

  open({ coordinates, event }: ContextMenuEvent) {
    this.element.nativeElement.focus();
    this.renderer.setStyle(this.element.nativeElement, 'top', `${event.y}px`);
    this.renderer.setStyle(this.element.nativeElement, 'left', `${event.x}px`);
    this.coordinates = coordinates;
  }

  go(): void {
    window.open(`${this.baseLink + this.coordinates.toString()}`);
  }

  constructor(private element: ElementRef, private renderer: Renderer2, private contextMenuService: ContextMenuService) {
  }

  ngOnInit() {
    this.contextMenuService.openEmitter.subscribe(this.open.bind(this));
  }

}
