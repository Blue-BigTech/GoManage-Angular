import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-manager-shared-header',
  templateUrl: './sales-manager-shared-header.component.html',
  styleUrls: ['./sales-manager-shared-header.component.css']
})
export class SalesManagerSharedHeaderComponent implements OnInit {

  ROUTE_URLS = [ 
    { url:'/sales-manager' , is_working: true, value: 'Staff Services' },
    { url:'/sales-manager/product' , is_working: true, value: 'Products' },
    //{ url:'' , is_working: false, value: 'Staff Commission' },
    { url:'/sales-manager/voucher' , is_working: false, value: 'Vouchers' },
  ];
  
  CURRENT_ROUTE_LINK: string;

  constructor(private route: Router) {

    this.CURRENT_ROUTE_LINK = this.route.url;
   }
   

  ngOnInit(): void {
  }

}
