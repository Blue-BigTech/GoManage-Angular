import { ConfigStaffService } from '../../config/config.staff.service';

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';


import { StaffComponent } from './staff.component';
import { StaffRoutes } from './staff.routing';
// import { NgCircleProgressModule } from 'ng-circle-progress';
import { StaffRotaComponent } from './staff-rota/staff-rota.component';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { EditStaffComponent } from './edit-staff/edit-staff.component';
import { StaffHeaderMenuComponent } from './staff-header-menu/staff-header-menu.component';
import { StaffAccessComponent } from './staff-access/staff-access.component';
import { FinanceComponent } from './finance/finance.component';
import { DateRangePickerModule, TimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
// https://www.syncfusion.com/kb/12430/how-to-get-started-easily-with-syncfusion-angular-11-daterange-picker ( DateRangePickerModule )

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(StaffRoutes),
        FormsModule,
        NgxSpinnerModule,
        DataTablesModule,
        // NgCircleProgressModule.forRoot({
        //     // set defaults here
        //     radius: 100,
        //     outerStrokeWidth: 16,
        //     innerStrokeWidth: 8,
        //     outerStrokeColor: "#78C000",
        //     innerStrokeColor: "#C7E596",
        //     animationDuration: 300,
        //   }),
          ReactiveFormsModule,
          DateRangePickerModule,
          TimePickerModule
    ],
    declarations: [StaffComponent , StaffRotaComponent, AddStaffComponent, EditStaffComponent, StaffHeaderMenuComponent, StaffAccessComponent, FinanceComponent],
    providers: [ConfigStaffService]
})

export class StaffModule { }
