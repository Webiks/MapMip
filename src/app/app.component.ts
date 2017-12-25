import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router) {
    router.events.filter(e => e instanceof NavigationEnd).subscribe((e) => {
      parent.postMessage(window.location.href, '*');
    });
  }
}
