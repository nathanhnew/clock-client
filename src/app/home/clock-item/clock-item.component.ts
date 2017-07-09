import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs/rx';
import { Clock } from '../../_models/clock.model';
import { ClockService } from '../../_services/clock.service';
import { HttpService } from '../../_services/http.service';

@Component({
  selector: 'app-clock-item',
  templateUrl: './clock-item.component.html',
  styleUrls: ['./clock-item.component.css']
})
export class ClockItemComponent implements OnInit, OnDestroy {
  @Input() loc: Clock;
  @Input() index: number;
  currTime: Observable<Date>;
  currSub: Subscription;
  condReady: boolean;
  fontColor: string;
  get dateFormat(): string {return (this.loc.fullDay ? 'HH:mm:ss' :  'h:mm:ss A')};


  constructor(private clockService: ClockService, private httpService: HttpService) { }

  ngOnInit() {
    this.currTime = this.clockService.getTime()
    this.currSub = this.httpService
    .getCurrents(this.loc.city.lat,this.loc.city.lon)
    .subscribe(
      (result) => {
        this.loc.cond = result['currently']['summary'];
        this.loc.temp = Math.round(result['currently']['temperature']).toString();
        this.condReady = true;
      }
    );
  }

  toggleTime() {
    this.loc.fullDay = !this.loc.fullDay;
  }

  ngOnDestroy() {
    this.currSub.unsubscribe();
  }

}
