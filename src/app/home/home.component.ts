import { Component, OnInit, OnDestroy } from '@angular/core';
import { Clock } from '../_models/clock.model';
import { ClockService } from '../_services/clock.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  clocks: Clock[]
  clockSub: Subscription;

  constructor(private clockService: ClockService) { }

  ngOnInit() {
    this.clocks = this.clockService.getClocks();
    this.clockSub = this.clockService.clockChange.subscribe(
      (data: Clock[]) => this.clocks = data
    );
  }

  ngOnDestroy() {
    this.clockSub.unsubscribe();
  }

}
