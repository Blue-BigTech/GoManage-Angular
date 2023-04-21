import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClientsComponent } from './clients.component';
import { ClientsRoutes } from './clients.routing';
import { ClientsService } from 'app/config/config.service.clients'
import { NgxSpinnerModule } from 'ngx-spinner';
import {DataTablesModule} from 'angular-datatables';
import { AddClientsComponent } from './add-clients/add-clients.component';
import { EditClientComponent } from './edit-client/edit-client.component';
import { ClientListComponent } from './client-list/client-list.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ClientsRoutes),
        FormsModule,
        NgxSpinnerModule,
        DataTablesModule,
        ReactiveFormsModule
    ],
    declarations: [ClientsComponent, AddClientsComponent, EditClientComponent, ClientListComponent],
    providers: [ ClientsService]
})

export class ClientsModule {}
