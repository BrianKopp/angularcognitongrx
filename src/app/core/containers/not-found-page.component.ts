import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: 'app-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template:`
  <div>YOU SCREWED UP YOUR LINK</div>
  `
})
export class NotFoundPageComponent{}