import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting-header',
  templateUrl: './setting-header.component.html',
  styleUrls: ['./setting-header.component.css']
})
export class SettingHeaderComponent implements OnInit {

  ROUTE_URLS = [ 
    { url:'/setting' , is_working: true, value: 'Business Details' },
    { url:'/setting/app-details' , is_working: true, value: 'App Details' },
  ];
  
  CURRENT_ROUTE_LINK: string;

  constructor(private route: Router) {

    this.CURRENT_ROUTE_LINK = this.route.url;
   }
   

  ngOnInit(): void {
  }

}
