import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class AjaxService {

  constructor() {
    if (firebase.apps.length === 0) {
      this.initFirebase();
    }
  }

  initFirebase() {
    let config = {
      apiKey: 'AIzaSyCWOLHmczhM7SBQIq6XZ3f4sPFyMObJRLs',
      authDomain: 'mapmip-6c74a.firebaseapp.com',
      databaseURL: 'https://mapmip-6c74a.firebaseio.com'
    };
    firebase.initializeApp(config);
  }

  // getTmsmapresource(url:string) : Observable<any>{
  //   return new Observable(obs => {
  //     this.http.get(`${url}/tilemapresource.xml`).subscribe(response => {
  //       xml2js.parseString(response['_body'], (err, res) => {
  //         obs.next(res);
  //       });
  //     });
  //   })
  // }

  getLayerExam(): Promise<any> {
    return <any>firebase.database().ref('array').once('value').then(snapshot => snapshot.val());
  }

  getTerrainsExam(): Promise<any> {
    return <any>firebase.database().ref('terrains').once('value').then(snapshot => snapshot.val());
  }

  getGeoJsonExam(): Promise<any> {
    return <any>firebase.database().ref('geojsons').once('value').then(snapshot => snapshot.val());
  }

}
