import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MomentModule } from 'angular2-moment';
import { MomentTimezoneModule } from 'angular-moment-timezone';
import { AgmCoreModule } from "@agm/core";

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ClockListComponent } from './home/clock-list/clock-list.component';
import { ClockItemComponent } from './home/clock-item/clock-item.component';
import { ClockService } from './_services/clock.service';
import { HttpService } from './_services/http.service';
import { AuthService } from './_services/auth.service';
import { SettingsService } from './_services/settings.service';
import { AppRoutingModule } from './app.routes';
import { RegisterComponent } from './register/register.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ClockListComponent,
    ClockItemComponent,
    RegisterComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    MomentModule,
    MomentTimezoneModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDxLRlnc8Be3mrFOWHJ3zjTV7ObrNUYdmc",
      libraries: ["places"]
    })
  ],
  providers: [ClockService, HttpService, AuthService, SettingsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
