import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {QueryParamsHelperService} from "../../query-params-helper.service";
import {PopoverDirective} from "ng2-bootstrap";

@Component({
  selector: 'app-terrain',
  templateUrl: './terrain.component.html',
  styleUrls: ['./terrain.component.scss']
})
export class TerrainComponent implements OnChanges,OnInit {

  @Input() terrain:string;
  @Output() terrainChange = new EventEmitter();
  @Output() submitTerrainEmitter = new EventEmitter();
  public terrainUrl:string;
  constructor(private queryParamsHelperService:QueryParamsHelperService) { }

  ngOnInit() :void{
    this.setTerrain();
  }

  onShownPopover() {
    let element:HTMLElement = <HTMLElement>document.querySelector("app-terrain input");
    element.focus();
  }
  submitTerrain(popDirective:PopoverDirective) {
    this.terrainChange.emit(this.terrainUrl);
    this.submitTerrainEmitter.emit();
    popDirective.hide()
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes["terrain"]){
      this.setTerrain();
    }
  }
  setTerrain(){
    let terrain = this.terrain;
    this.terrainUrl = this.queryParamsHelperService.queryTerrain({terrain});
  }
}
