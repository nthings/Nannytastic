import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-nanny-info-window',
  templateUrl: './nanny-info-window.component.html',
  styleUrls: ['./nanny-info-window.component.css']
})
export class NannyInfoWindowComponent implements OnInit, OnDestroy {
  @Input()
  nanny;

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log('DESTROYED: ' + this.nanny.name);
  }

}
