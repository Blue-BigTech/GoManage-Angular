import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-staff-header-menu',
  templateUrl: './staff-header-menu.component.html',
  styleUrls: ['./staff-header-menu.component.css']
})
export class StaffHeaderMenuComponent implements OnInit {

  ROUTE_URLS = [ 
    { url:'/staff' , is_working: true, value: 'Staff list' },
    { url:'/staff/staff-access' , is_working: true, value: 'Staff access' },
    //{ url:'' , is_working: false, value: 'Staff Commission' },
    { url:'/staff/finance' , is_working: true, value: 'Finance' },
    { url: '/staff/rota' , is_working: true,value:'Rota'},
    { url:'' , is_working: false, value: 'Staff Performance' },
  ];
  
  CURRENT_ROUTE_LINK: string;

  constructor(private route: Router) {

    this.CURRENT_ROUTE_LINK = this.route.url;
    // console.log('checkking------' , this.route.url)
   }

  ngOnInit(): void {
  }

}
