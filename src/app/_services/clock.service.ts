import { Injectable } from '@angular/core';
import { Clock } from '../_models/clock.model';
import { City } from '../_models/city.model';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/rx';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ClockService {
  clockChange = new Subject<Clock[]>();
  time: Observable<Date>;
  private clocks: Clock[] = [
    new Clock(
      new City('ChIJOwg_06VPwokRYv534QaPC8g',0,'New York', 'USA', 40.7127, -74.0059, 'America/New_York'),
      false,
      0,
    ),
    new Clock(
      new City('ChIJdd4hrwug2EcRmSrV3Vo6llI',1,'London', 'UK', 51.507222, -0.1275, 'Europe/London'),
      true,
      1
    ),
    new Clock(
      new City('ChIJE9on3F3HwoAR9AhGJW_fL-I',2,'Los Angeles', 'USA', 34.05, -118.25, 'America/Los_Angeles'),
      false,
      2,
    ),
    new Clock(
      new City('ChIJc9U7KdW6MioR4E7fNbXwBAU',3,'Perth', 'Australia', -31.952222, 115.858889, 'Australia/Perth'),
      true,
      3,
    ),
    new Clock(
      new City('ChIJ51cu8IcbXWARiRtXIothAS4',4,'Tokyo', 'Japan', 35.683333, 139.683333, 'Asia/Tokyo'),
      true,
      4,
    )
  ]

  constructor(private http: Http) {
  }

  getTime(): Observable<Date> {
    return Observable.interval(1000).map(
      () => new Date()
    )
  }

  getClocksMaster(): Clock[] {
    return this.clocks
  }

  getClocks(): Clock[] {
    return this.clocks.slice();
  }

  setClocks(newClocks: Clock[]) {
    this.clocks = newClocks;
    this.clockChange.next(this.clocks.slice());
  }

}
