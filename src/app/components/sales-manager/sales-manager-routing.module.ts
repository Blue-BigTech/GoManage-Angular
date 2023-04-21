import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { StaffServicesComponent } from './staff-services/staff-services.component';

const routes: Routes = [
  {
    path: '',
    component: StaffServicesComponent
  },
  {
    path: 'product',
    component: ProductListComponent
  },
  {
    path: 'product/add',
    component: AddProductComponent
  },
  {
    path: 'product/edit/:id',
    component: EditProductComponent
  }
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesManagerRoutingModule { }
