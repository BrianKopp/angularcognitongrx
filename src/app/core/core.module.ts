import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppComponent } from './containers/app.component';
import { NotFoundPageComponent } from './containers/not-found-page.component';
import { LayoutComponent } from './components/layout.component';

export const COMPONENTS = [
  AppComponent,
  NotFoundPageComponent,
  LayoutComponent
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [COMPONENTS, LayoutComponent]
})
export class CoreModule { }
