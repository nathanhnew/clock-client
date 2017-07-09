import { City } from './city.model';

export class Clock{

  constructor(public city: City, public fullDay: boolean, public arrIndex: number,
    public clock_id?: number, public temp?: string, public cond?: string){
  }
}
