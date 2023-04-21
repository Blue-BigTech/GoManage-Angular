import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingRoutingModule } from './setting-routing.module';
import { BusinessDetailsComponent } from './business-details/business-details.component';
import { AppDetailsComponent } from './app-details/app-details.component'
import { SettingHeaderComponent } from './setting-header/setting-header.component';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    BusinessDetailsComponent,
    AppDetailsComponent,
    SettingHeaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SettingRoutingModule,
    NgxSpinnerModule
  ]
})
export class SettingModule { }
