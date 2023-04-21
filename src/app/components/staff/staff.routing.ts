import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { EditStaffComponent } from './edit-staff/edit-staff.component';
import { FinanceComponent } from './finance/finance.component';
import { StaffAccessComponent } from './staff-access/staff-access.component';
import { StaffRotaComponent } from './staff-rota/staff-rota.component';

import { StaffComponent } from './staff.component';

export const StaffRoutes: Routes = [{
    path: '',
    children: [{
        path: '',
        component: StaffComponent
    }]
},{
    path: 'rota',
    component: StaffRotaComponent
},{
    path: 'add',
    component: AddStaffComponent
},{
    path: 'edit/:id',
    component: EditStaffComponent
}, {
    path: 'staff-access',
    component: StaffAccessComponent
},  {
    path: 'finance',
    component: FinanceComponent
}

];
