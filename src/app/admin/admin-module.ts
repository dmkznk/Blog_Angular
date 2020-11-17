import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { AdminLayuotComponent } from './shared/components/admin-layuot/admin-layuot.component';
import { LoginPageComponent } from './login-page/login-page.component';

@NgModule({
  declarations: [AdminLayuotComponent, LoginPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: AdminLayuotComponent, children: [
          {path: '', redirectTo: '/admin/login', pathMatch: 'full'},
          {path: 'login', component: LoginPageComponent}

        ]}
    ])
  ],
  exports: [],

})
export class AdminModule {

}
