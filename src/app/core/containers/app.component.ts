import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-core',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <h1>ZOINKS</h1>
  <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
