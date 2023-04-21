import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductSaleComponent } from './product-sale/product-sale.component';

const routes: Routes = [
  {
    path: '',
    children: [{
        path: '',
        component: ProductSaleComponent
    }]
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MakeASaleRoutingModule { }
