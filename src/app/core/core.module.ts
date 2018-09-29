import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppComponent } from './containers/app.component';
import { NotFoundPageComponent } from './containers/not-found-page.component';

export const COMPONENTS = [
  AppComponent,
  NotFoundPageComponent
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [COMPONENTS]
})
export class CoreModule { }
