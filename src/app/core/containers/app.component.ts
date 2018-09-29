import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-core',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div>ZOINKS</div>
  `
})
export class AppComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
