import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-staff-access',
  templateUrl: './staff-access.component.html',
  styleUrls: ['./staff-access.component.css']
})
export class StaffAccessComponent implements OnInit {

  ACCESS_LIST: any = [

    { id: 1 , page_name: 'HomePage', business_owner: true , manager: false , senior_staff: true  , staff: true},
    { id: 2 , page_name: 'Clients', business_owner: true , manager: false , senior_staff: true  , staff: false},
    { id: 3 , page_name: 'Staff', business_owner: false , manager: false , senior_staff: true  , staff: false},
    { id: 4 , page_name: 'Reports', business_owner: true , manager: false , senior_staff: true  , staff: false},
    { id: 5 , page_name: 'Pos', business_owner: false , manager: false , senior_staff: true  , staff: true},
    { id: 6 , page_name: 'Marketing', business_owner: true , manager: false , senior_staff: true  , staff: false},
    { id: 7 , page_name: 'Stock', business_owner: false , manager: false , senior_staff: true  , staff: false},
  ];


  constructor() { 
    console.log(JSON.stringify(this.ACCESS_LIST))
  }

  ngOnInit(): void {
  }

}
