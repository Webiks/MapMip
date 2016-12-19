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
  public height:number;
  public dim:number;
  constructor(private router:Router, private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params:Params)=> {
      this.lat = params['lat'] || undefined;
      this.lng = params['lng'] || undefined;
      this.zoom = params['zoom'] || undefined;
      this.heading = params['heading'] || undefined;
      this.pitch = params['pitch'] || undefined;
      this.roll = params['roll'] || undefined;
      this.height = +params['height'] || undefined;
      this.dim = +params['dim'] || undefined;
    })
  }
  submitForm() {

    let obj = {lat: this.lat ,lng: this.lng, height: this.height, heading:this.heading, pitch:this.pitch, roll:this.roll, dim:this.dim, zoom:this.zoom};

    this.router.navigate([], {queryParams: obj})
  }

}
