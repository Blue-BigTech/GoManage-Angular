import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesManagerRoutingModule } from './sales-manager-routing.module';
import { StaffServicesComponent } from './staff-services/staff-services.component';
import { ProductListComponent } from './product-list/product-list.component';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { SalesManagerSharedHeaderComponent } from './sales-manager-shared-header/sales-manager-shared-header.component';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    StaffServicesComponent,
    ProductListComponent,
    AddProductComponent,
    EditProductComponent,
    SalesManagerSharedHeaderComponent, 
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SalesManagerRoutingModule,
    NgxSpinnerModule
  ]
})
export class SalesManagerModule { }
