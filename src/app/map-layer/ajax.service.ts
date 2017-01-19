import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import * as xml2js from 'xml2js';
import {Observable} from 'rxjs';

@Injectable()
export class AjaxService {

  constructor(private http:Http) { }

  getTmsmapresource(url:string) : Observable<any>{
    return new Observable(obs => {
      this.http.get(`${url}/tilemapresource.xml`).subscribe(response => {
        xml2js.parseString(response['_body'], (err, res) => {
          obs.next(res);
        });
      });
    })
  }

}
