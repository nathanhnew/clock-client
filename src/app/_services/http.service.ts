import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import * as moment from 'moment';

@Injectable()
export class HttpService {

  constructor(private http: Http, private authService: AuthService) {}

  getCurrents(lat: number, lon: number) {
    var url = 'https://crossorigin.me/https://api.darksky.net/forecast/d064e87ad89527652940e04e8c65288a/'
    url += lat.toString() + ',' + lon.toString()
    return this.http.get(url).map(
      (res: Response) => res.json()
    );
  }

  getTz(lat: number, lon: number) {
    let baseUrl = "https://maps.googleapis.com/maps/api/timezone/json"
    let params = new URLSearchParams();
    params.set('key', "AIzaSyDxLRlnc8Be3mrFOWHJ3zjTV7ObrNUYdmc" );
    params.set('location', lat.toString()+","+lon.toString());
    params.set('timestamp', moment().unix().toString());

    return this.http.get(baseUrl, {search: params}).map(
      (res: Response) => res.json(),
      (error) => error.json()
    );
  }

}
