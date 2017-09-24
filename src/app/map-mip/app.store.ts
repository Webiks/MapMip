import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

export class AppState {

  polygons: Observable<Array<any>>;

  constructor(private router: Router) {
    this.polygons = this.router['currentUrlTree'].queryParams['polygons'];
  }


}
