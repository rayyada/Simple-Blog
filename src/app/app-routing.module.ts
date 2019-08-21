import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationCallbackComponent } from './authentication-callback/authentication-callback.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthenticationGuard } from './authentication.guard';


const routes: Routes = [
  {
    path: 'authentication-callback',
    component: AuthenticationCallbackComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthenticationGuard],
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
