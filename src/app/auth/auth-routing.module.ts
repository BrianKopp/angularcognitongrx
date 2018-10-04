import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPageComponent } from './containers/login-page/login-page.component';
import { RegisterPageComponent } from './containers/register-page/register-page.component';
import { LoggedInGuard } from './services/loggedin-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent, canActivate: [LoggedInGuard]},
  { path: 'signup', component: RegisterPageComponent, canActivate: [LoggedInGuard]}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}