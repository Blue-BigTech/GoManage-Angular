import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MakeASaleRoutingModule } from './make-a-sale-routing.module';
import { ProductSaleComponent } from './product-sale/product-sale.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ProductSaleComponent],
  imports: [
    CommonModule,
    MakeASaleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class MakeASaleModule { }
