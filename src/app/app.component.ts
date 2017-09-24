import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MapMipService } from './map-mip/api/map-mip.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router, private mapmip: MapMipService) {
    router.events.filter(e => e instanceof NavigationEnd).subscribe((e) => {
      parent.postMessage(window.location.href, '*');
    });
  }
}
