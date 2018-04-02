import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/toArray';

@Component({
  selector: 'app-nanny-info-window',
  templateUrl: './nanny-info-window.component.html',
  styleUrls: ['./nanny-info-window.component.css']
})
export class NannyInfoWindowComponent implements OnInit, OnDestroy {
  @Input()
  nanny;

  stars;

  constructor() { }

  ngOnInit() {
    this.stars = Observable.range(0, this.nanny.stars).toArray();
  }

  ngOnDestroy() {
    console.log('DESTROYED: ' + this.nanny.name);
  }

}
