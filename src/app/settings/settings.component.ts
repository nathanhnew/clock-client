import { Component, OnInit, OnDestroy, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { Router } from '@angular/router';
import { ClockService } from '../_services/clock.service';
import { AuthService } from '../_services/auth.service';
import { HttpService } from '../_services/http.service';
import { SettingsService } from '../_services/settings.service';
import { Clock } from '../_models/clock.model';
import { City } from '../_models/city.model';
import { Settings } from '../_models/settings.model';
import { Subscription } from 'rxjs/Subscription';

declare var google;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

  public lat: number;
  public lon: number;
  public zoom: number;
  settingsForm: FormGroup;
  public newCity;
  userClocks: Clock[];
  userSettings: Settings;
  isLoggedIn: boolean = false;
  tzSub: Subscription;
  clockInputs: number;
  updateSettingsSub: Subscription;
  updateClocksSub: Subscription;
  delSub: Subscription;


  @ViewChild("search") searchElementRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private clockService: ClockService, private authService: AuthService, private httpService: HttpService, private settingsService: SettingsService, private router: Router) { }

  ngOnInit() {
    this.userSettings = this.settingsService.getSettings();

    this.zoom = 4;
    this.lat = 40.7217;
    this.lon = -74.0059;
    this.userClocks = this.clockService.getClocks();
    let clockArrayFormControl = new FormArray([]);

    this.settingsForm = new FormGroup({
      'citySearch': new FormControl(null,),
      'theme': new FormControl(this.userSettings.theme),
      'alerts': new FormControl({ value: this.userSettings.alerts, disabled: true }),
      'fullDay': new FormControl(this.userSettings.fullDay),
      'metric': new FormControl(this.userSettings.metric),
    });

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["(cities)"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place = google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.newCity = place
          this.lat = place.geometry.location.lat();
          this.lon = place.geometry.location.lng();
          this.zoom = 8
        });
      });
    });

    this.isLoggedIn = this.authService.getLogin();
  }

  onAddCity() {
    if (this.userClocks.length >= 5) {
      this.settingsForm.get('citySearch').reset();
      this.newCity = null;
    } else {
      this.tzSub = this.httpService.getTz(this.lat, this.lon).subscribe(
        res => {
          const long_name = this.newCity.formatted_address.split(',')
          let addCity = new City(
            this.newCity.place_id,
            this.userClocks.length,
            this.newCity.name,
            long_name.pop(),
            this.lat,
            this.lon,
            res.timeZoneId,
          );
          this.userClocks.push(
            new Clock(addCity, this.settingsForm.get('fullDay').value, this.userClocks.length)
          );
          this.settingsForm.get('citySearch').reset();
          this.newCity = null;
        },
        error => console.log(error)
      );
    }
  }

  onUp(index: number) {
    this.moveElement(this.userClocks, index, 'up')
  }

  onDown(index: number) {
    this.moveElement(this.userClocks, index, 'down')
    console.log(this.userClocks)
  }

  onDeleteCity(index: number) {
    this.userClocks.splice(index,1)
    this.userClocks.forEach((clock, index) => {
      clock.arrIndex = index;
    });
    this.delSub = this.authService.popClock(JSON.stringify({'clock':{'clock_id':index}})).subscribe(

    )
    console.log(this.userClocks)
  }

  onSubmit() {
    let newSettings = new Settings(
      this.settingsForm.get('theme').value,
      this.settingsForm.get('alerts').value,
      this.settingsForm.get('fullDay').value,
      this.settingsForm.get('metric').value
    );
    this.settingsService.changeSettings(newSettings)
    this.clockService.setClocks(this.userClocks);
    if (this.authService.getToken()) {
      let clockPost = this.userClocks
      for (let clock of clockPost) {
        delete clock.cond;
        delete clock.temp;
      }
      let data = JSON.stringify({'settings':newSettings, 'clock': this.userClocks});
      console.log(data)
      this.updateSettingsSub = this.authService.updateAPIData(data).subscribe(
        res => {
          console.log(res)
          this.router.navigate(['/'])
        },
        error => console.log(error)
      );
    }
    else {
      this.router.navigate(['/'])
    }

  }

  onCancel() {
    this.settingsForm.reset();
  }

  moveElement(array: Array<any>, element: number, direction: string) {
    if (direction === 'up') {
      var newIndex = element - 1;
    } else if (direction === 'down') {
      var newIndex = element + 1;
    }

    if (newIndex < 0) {
      newIndex = 0;
    } else if (newIndex >= array.length) {
      newIndex = array.length;
    }

    array.splice(newIndex, 0, array.splice(element, 1)[0])

  }

  ngOnDestroy() {
    if (this.tzSub) {
      this.tzSub.unsubscribe();
    }
    if (this.updateSettingsSub){
      this.updateSettingsSub.unsubscribe();
    }
    if (this.updateClocksSub) {
      this.updateClocksSub.unsubscribe();
    }
    if (this.delSub) {
      this.delSub.unsubscribe();
    }
  }

}
