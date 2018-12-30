import { Directive, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryParamsHelperService } from '../services/query-params-helper.service';
import { MapMipService } from '../api/map-mip.service';

@Directive({
  selector: '[appSwitchLayers]'
})
export class SwitchLayersDirective {
  prev_params = {};
  layersArray = [];
  active = true;

  constructor(private activatedRoute: ActivatedRoute, private queryParamsHelperService: QueryParamsHelperService, private mapMipService: MapMipService, private router: Router) {
    activatedRoute.queryParams
      .filter((params) => queryParamsHelperService.anyLayersChanges(this.prev_params, params))
      .subscribe((params) => {
        this.prev_params = params;
        this.layersArray = this.queryParamsHelperService.queryLayersStringToObjects(params);
      });
  }


  @HostListener('window:keypress', ['$event'])
  keypress($event) {
    if ($event.which === 32 && this.active) {
      this.switchLayers();
    }
  }


  switchLayers() {
    const newLayersArray: any[] = this.layersArray.map((val, index: number, array) => {
      const prev = (index - 1) < 0 ? array.length + (index - 1) : (index - 1);
      return array[prev];
    });
    const parsed_layer: string = this.queryParamsHelperService.queryLayersObjectToString(newLayersArray);
    const urlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams.layers = parsed_layer;
    return this.mapMipService.navigateByUrl(urlTree.toString());
  }

}
