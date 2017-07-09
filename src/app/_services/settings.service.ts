import { Injectable } from '@angular/core';
import { Settings } from '../_models/settings.model';
import { Subject } from 'rxjs/Subject';
import { ClockService } from './clock.service';

@Injectable()
export class SettingsService {
  settingsChange = new Subject<Settings>();
  private settings: Settings = {
    'theme': 'default',
    'alerts': false,
    'fullDay': false,
    'metric': false
  }

  constructor(private clockService: ClockService) {}

  getSettings() {
    return this.settings;
  }

  changeSettings(newSettings) {
    this.settings = newSettings;
    for (let clock of this.clockService.getClocksMaster()) {
      clock.fullDay = this.settings.fullDay
    }
    this.settingsChange.next(this.settings);
  }
}
