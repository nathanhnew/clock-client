import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { ClockService } from '../_services/clock.service';
import { SettingsService } from '../_services/settings.service';
import { Clock } from '../_models/clock.model';
import { Settings } from '../_models/settings.model';
import { Response } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginSubscription: Subscription
  loginForm: FormGroup;
  errorText: string;
  errs: string[];
  private emailTimeout;

  constructor(private authService: AuthService, private clockService: ClockService,
    private settingsService: SettingsService, private router: Router) { }

  ngOnInit() {
    if (this.authService.loggedIn) {
      this.router.navigate["/"];
    }
    this.loginForm = new FormGroup({
      'email': new FormControl(localStorage.getItem('loginUser'), [Validators.required, Validators.email], this.emailExists.bind(this)),
      'password': new FormControl(null, Validators.required),
      'remember': new FormControl(localStorage.getItem('loginUser') ? true : false)
    });
    if (localStorage.getItem('currentToken')) {
      this.loginSubscription = this.authService.getInfo(JSON.parse(localStorage.getItem('currentToken')));
    }
  }

  onSubmit() {
    // See if we need to store the email address in the localStorage
    if (this.loginForm.value['remember']) {
      localStorage.setItem('loginUser', this.loginForm.value['email']);
    } else {
      localStorage.removeItem('loginUser')
    }

    this.loginSubscription = this.authService.login(this.loginForm.value['email'],
      this.loginForm.value['password']).subscribe(
      res => {
        let settings = res.settings;
        let clocks = res.clock;
        for (let clock of clocks) {
          clock.cond = "sunny";
          clock.temp = "78"
          clock.city.lat = parseFloat(clock.city.lat)
          clock.city.lon = parseFloat(clock.city.lon)
        }
        this.settingsService.changeSettings(settings);
        this.clockService.setClocks(clocks);
        this.authService.username = res.username;
        this.authService.email = res.email;
        this.authService.loggedIn.next(true);
        this.router.navigate(['/']);
      },
      error => {
        let errs = JSON.parse(error._body).errors.error
        this.errs = errs
        for (let error of errs) {
          this.errorText = error
        }
      }
      );

  }

  emailExists(control: FormControl): Promise<any> {
    clearTimeout(this.emailTimeout)
    return new Promise((resolve, reject) => {
      this.emailTimeout = setTimeout(() => {
        this.authService.accountExists(control.value).subscribe(
          (response) => {
            if (response['exists']) {
              resolve(null);
            }else{
              resolve({'noExist': true});
            }
          });
      }, 500);
    });
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }


}
