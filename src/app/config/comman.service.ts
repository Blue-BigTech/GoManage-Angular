import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommanService {

  public MALE: string = 'Male';
  public FEMALE: string = 'Female';
  public SUCCESS_CODE: number = 200;
  public BUSENESS_CLOSING_TIME: string = '20:00';

  public GENDER_LIST: any = [
    { id: 1 , name: 'MALE' , value: this.MALE},
    { id: 2 , name: 'FEMALE' , value: this.FEMALE},
  ];

  constructor() { }
}
