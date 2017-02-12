import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import * as xml2js from 'xml2js';
import {Observable} from 'rxjs';
import * as firebase from 'firebase';

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

  getLayerExam():Promise<any> {
    // return this.http.get("https://mapmip-6c74a.firebaseio.com/array.json").map( (res:Response) => res.json());
    let config = {
      apiKey: "AIzaSyCWOLHmczhM7SBQIq6XZ3f4sPFyMObJRLs",
      authDomain: "mapmip-6c74a.firebaseapp.com",
      databaseURL: "https://mapmip-6c74a.firebaseio.com"
    };
    firebase.initializeApp(config);

    return <any>firebase.database().ref("array").once("value").then(snapshot => snapshot.val());

  }


}
