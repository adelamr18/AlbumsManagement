import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeDashboardComponent } from './home-dashboard/home-dashboard.component';






export const appRoutes: Routes = [
    { path: '', redirectTo: '/Dashboard', pathMatch: 'full' },
    { path: 'Dashboard', component: HomeDashboardComponent},
 ]

    
  @NgModule({
    imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }