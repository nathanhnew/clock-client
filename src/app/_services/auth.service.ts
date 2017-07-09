import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/rx'
import { SettingsService } from './settings.service';
import { ClockService } from './clock.service';
import { Subject } from 'rxjs/Subject'
import { Clock } from '../_models/clock.model';

@Injectable()
export class AuthService {
  baseUrl = 'http://localhost:8000';
  public token: string;
  username: string;
  email: string;
  public loggedIn = new Subject<boolean>();
  defaultClocks: Clock[];

  constructor(private http: Http, private router: Router,
    private settingsService: SettingsService, private clockService: ClockService) {
    }

    getLogin() {
      return (localStorage.getItem('currentToken')) ? true : false;
    }

    getToken() {
      return JSON.parse(localStorage.getItem('currentToken'));
    }

  login(username: string, password: string) {
    this.defaultClocks = this.clockService.getClocks();
    const url = this.baseUrl + '/auth/login';
    let params = new URLSearchParams;
    params.append('email', username);
    params.append('password', password);


    return this.apiData(url, "post", params=params)
  }

  register(email: string, username: string, password: string) {
    const url = this.baseUrl + '/auth/register';
    let params = new URLSearchParams;
    params.append('email', email);
    params.append('username', username);
    params.append('password', password);

    return this.apiData(url, "post", params=params)
  }

  getInfo(token: string) {
    let header = new Headers({'Authorization': 'token ' + token})
    let option = {headers: header}
    const url = this.baseUrl + '/auth/account'

    return this.apiData(url, "get", {} ,option).subscribe(
      res => {
        let settings = res.settings;
        let clocks = res.clock;
        for (let clock of clocks) {
        clock.city.lat = parseFloat(clock.city.lat)
        clock.city.lon = parseFloat(clock.city.lon)
        }
        this.username = res.username;
        this.email = res.email
        this.settingsService.changeSettings(settings);
        this.clockService.setClocks(clocks);
        this.loggedIn.next(true);
        this.router.navigate(['/']);
      },
      error => {
        console.log(error)
        let errs = JSON.parse(error._body).errors.error
        return errs
      }
    );

  }

  updateAPIData(data: string) {
    if (!this.getToken()){
      throw Error('User not logged in.')
    } else {
      const url = this.baseUrl + '/auth/account'
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'token ' + this.getToken(),
      });
      return this.apiData(url, 'put', data, {headers:headers})
    }
  }

  popClock(data: string) {
    if (!this.getToken()){
      throw Error('User not logged in.')
    } else {
      console.log(this.getToken())
      const url = this.baseUrl + '/auth/account'
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'token ' + this.getToken(),
      });
      return this.http.delete(url, new RequestOptions({headers: headers, body: data}))
    }
  }

  apiData(url: string, call: string, params={}, options={}): Observable<any> {
    if (call === 'post') {
      return this.http.post(url, params).map(
        (res: Response) => {
          let token = res.json().account.token
          if (token) {
            this.token = token;

            localStorage.setItem('currentUser',
                      JSON.stringify(res.json().account.email));
            localStorage.setItem('currentToken', JSON.stringify(token));
          }
          return res.json().account
        },
        error => error.json()
      )
    }
    else if (call === 'get') {
      return this.http.get(url, options).map(
        (res: Response) => {
          let token = res.json().account.token
          if (token) {
            this.token = token;

            localStorage.setItem('currentUser',
                      JSON.stringify(res.json().account.email));
            localStorage.setItem('currentToken', JSON.stringify(token));
          }
          return res.json().account
        },
        error => error.json()
      )
    }
    else if (call === 'put') {
      return this.http.put(url, params, options).map(
        (res: Response) => res.json(),
        error => error.json()
      )
    }
  }

  accountExists(email: string) {
    const url = this.baseUrl + '/auth/check'
    let options = new RequestOptions({headers: new Headers({'Content-Type': 'application/json'})});
    let params: URLSearchParams = new URLSearchParams();
    params.set('email',email)
    options.params = params
    return this.http.get(url, options).map(
      (res: Response) => {
        return res.json()
      },
      (error) => console.log(error)
    )
    }

  logout() {
    localStorage.removeItem('currentToken');
    this.token = ''
    this.loggedIn.next(false)
    // this.clockService.setClocks(this.defaultClocks)
    window.location.href='http://localhost:4200';
  }

}
