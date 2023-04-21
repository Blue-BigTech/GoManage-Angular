import { Routes } from '@angular/router';
import { AddClientsComponent } from './add-clients/add-clients.component';
import { ClientListComponent } from './client-list/client-list.component';

import { ClientsComponent } from './clients.component';
import { EditClientComponent } from './edit-client/edit-client.component';

export const ClientsRoutes: Routes = [{
    path: '',
    children: [{
        path: '',
        //component: ClientsComponent
        component: ClientListComponent
    }]
}, {
    path: 'add',
    component: AddClientsComponent
},{
    path: 'edit/:email',
    component: EditClientComponent
}

];
