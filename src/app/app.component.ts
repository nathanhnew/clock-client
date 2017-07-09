import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from './_services/auth.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, DoCheck {
  cogText: string;
  showCog: boolean;
  loggedIn: boolean = false;
  loginSub: Subscription;
  username: string;

  constructor(private router: Router, private location: Location,
      private authService: AuthService) {}

  ngOnInit() {
    this.router.events.subscribe(
      (val) => {
        if(this.location.path() == '') {
          this.showCog = true;
        }else{
          this.showCog = false;
        }
      }
    );
    this.loggedIn = this.authService.getLogin();
    if (this.loggedIn) {
      this.loginSub = this.authService.getInfo(this.authService.getToken());
      this.username = this.authService.username
    }
  }

  ngDoCheck() {
    this.loggedIn = this.authService.getLogin();
  }

  onHover() {
    this.cogText = " Settings";
    console.log(this.loggedIn)
  }
  onExitHover() {
    this.cogText = "";
  }
  onLogout() {
    this.authService.logout()
  }

  ngOnDestroy() {
    this.loginSub.unsubscribe();
  }
}
