import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProtectedContentRoutingModule } from './protected-content-routing.module';
import { MainComponent } from './components/main/main.component';

@NgModule({
  imports: [
    CommonModule,
    ProtectedContentRoutingModule
  ],
  declarations: [MainComponent]
})
export class ProtectedContentModule { }
