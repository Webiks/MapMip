import {Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {QueryParamsHelperService} from "../../query-params-helper.service";

@Component({
  selector: 'app-map-size',
  templateUrl: './map-size.component.html',
  styleUrls: ['./map-size.component.scss']
})
export class MapSizeComponent implements OnChanges, OnInit{

  @Input() size:string;
  @Output() sizeChange = new EventEmitter();
  @Output() submitSizeEmitter = new EventEmitter();
  public sizeArr:[number,number];

  constructor(private queryParamsHelperService:QueryParamsHelperService) {}

  ngOnInit(): void {
    this.setSizeArr();
  }

  onSizeChange(){
    this.sizeChange.emit(this.sizeArr.toString());
    this.submitSizeEmitter.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["size"]){
      this.setSizeArr();
    }
  }

  setSizeArr(){
    let size = this.size;
    this.sizeArr = this.queryParamsHelperService.querySize({size});
  }


}
