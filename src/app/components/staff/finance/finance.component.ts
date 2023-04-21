import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.css']
})
export class FinanceComponent implements OnInit {

  START: Date = new Date ("10/07/2022"); 
 
  END: Date = new Date ("11/25/2022");
  
  LIST : any  = [
    { id: 1 , name: 'Services' , test_1: 1536.2 , test_2 : 1132.22 , test_3 : 872.34 , test_4 : 872.34},
    { id: 1 , name: 'Products' , test_1: 1536.2 , test_2 : 1132.22 , test_3 : 872.34 , test_4 : 872.34},
    { id: 1 , name: 'Vouchers' , test_1: 1536.2 , test_2 : 1132.22 , test_3 : 872.34 , test_4 : 872.34},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
