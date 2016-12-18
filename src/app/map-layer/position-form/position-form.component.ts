import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-position-form',
  templateUrl: './position-form.component.html',
  styleUrls: ['./position-form.component.scss']
})
export class PositionFormComponent implements OnInit {
  public lat:number;
  public lng:number;
  public zoom:number;
  public heading:number;
  public pitch:number;
  public roll:number;

  constructor(private router:Router, private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params:Params)=> {
      this.lat = params['lat'];
      this.lng = params['lng'];
      this.zoom = params['zoom'];
      this.heading = params['heading'];
      this.pitch = params['pitch'];
      this.roll = params['roll'];
    })
  }
  submitForm() {

    let obj = {lat: this.lat ,lng: this.lng,zoom: this.zoom, heading:this.heading, pitch:this.pitch, roll:this.roll};

    this.router.navigate([], {queryParams: obj})
  }

}
