import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-tab',
  templateUrl: './new-tab.component.html',
  styleUrls: ['./new-tab.component.scss']
})
export class NewTabComponent implements OnInit {

  constructor(public router: Router) {
  }

  ngOnInit() {
  }

  open() {
    location.href = 'http://mapmip.webiks.com' + this.router.url;
  }


}
