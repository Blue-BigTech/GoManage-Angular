import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';

export const AppRoutes: Routes = [
    {
        path: '', redirectTo: 'dashboard', pathMatch: 'full',
    },
    {
        path: '',
        component: AdminLayoutComponent,
        children: [{
            path: '',
            loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule),
            canActivate: [AuthGuard]
        }, {
            path: 'staff',
            loadChildren: () => import('./components/staff/staff.module').then(m => m.StaffModule),
            canActivate: [AuthGuard]
        }, {
            path: 'clients',
            loadChildren: () => import('./components/clients/clients.module').then(m => m.ClientsModule),
            canActivate: [AuthGuard]
        }, {
            path:'sales-manager',
            loadChildren: () => import('./components/sales-manager/sales-manager.module').then(m => m.SalesManagerModule),
            canActivate: [AuthGuard]
        },
        {
            path:'make-a-sale',
            loadChildren: () => import('./components/make-a-sale/make-a-sale.module').then(m => m.MakeASaleModule),
            canActivate: [AuthGuard]
        },{
            path:'setting',
            loadChildren: () => import('./components/setting/setting.module').then(m => m.SettingModule),
            canActivate: [AuthGuard]
        },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(AppRoutes)],
    exports: [RouterModule],
})

export class AppRoutingModule { }

