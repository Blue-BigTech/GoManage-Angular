import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessDetailsComponent } from './business-details/business-details.component';
import { AppDetailsComponent } from './app-details/app-details.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessDetailsComponent
  },
  {
    path: 'app-details',
    component: AppDetailsComponent
  }
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
