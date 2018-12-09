import { Routes, RouterModule } from '@angular/router';
import { NotFoundPageComponent } from './core/containers/not-found-page.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './auth/services/auth-guard.service';

export const routes: Routes = [
  { path: '', redirectTo: '/protected', pathMatch: 'full' },
  {
    path: 'protected',
    loadChildren: './protected-content/protected-content.module#ProtectedContentModule',
    canActivate: [AuthGuard]
  },
  { path: '**', component: NotFoundPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
