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
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerSubscription: Subscription;
  registerForm: FormGroup;
  private emailTimeout;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.loggedIn) {
      this.router.navigate["/"];
    }
    this.registerForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email], this.emailExists.bind(this)),
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'confirm': new FormControl(null, [Validators.required])
    }, this.passMatch);
    if (localStorage.getItem('currentToken')) {
      this.registerSubscription = this.authService.getInfo(localStorage.getItem('currentToken'));
    }
  }

  passMatch(form: FormGroup): {[s: string]: boolean} {
    return form.get('password').value === form.get('confirm').value ? null : {'mismatch':true}
  }

  emailExists(control: FormControl): Promise<any> {
    clearTimeout(this.emailTimeout)
    console.log(control)
    return new Promise((resolve, reject) => {
      this.emailTimeout = setTimeout(() => {
        this.authService.accountExists(control.value).subscribe(
          (response) => {
            if (response['exists']) {
              resolve({'exists': true});
            }else{
              resolve(null);
            }
          });
      }, 500);
    });
  }


  onSubmit() {
    this.registerSubscription = this.authService.register(this.registerForm.value['email'], this.registerForm.value['username'], this.registerForm.value['password']).subscribe(
      (data) => this.router.navigate(['/']),
      (error) => console.log(error)
    );
  }

  ngOnDestroy() {
    if (this.registerSubscription) {
      this.registerSubscription.unsubscribe();
    }
  }

}
